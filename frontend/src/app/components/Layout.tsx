import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Calendar, CheckSquare, Code2, Github, Clock, LayoutDashboard, RefreshCw, LogOut, Settings, X, User, Camera } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { logout as apiLogout, setupGithub, syncAll, getProfile, updateNickname } from "../../api";

export interface GithubConfig {
  username: string;
  programmersRepo: string;
}

export interface UserProfile {
  nickname: string;
  avatarUrl: string | null;
}

export function Layout() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("userId"));
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showGithubSettings, setShowGithubSettings] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [githubConfig, setGithubConfig] = useState<GithubConfig | null>(null);
  const [settingsForm, setSettingsForm] = useState({ username: "", programmersRepo: "" });
  const [isSyncing, setIsSyncing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => ({
    nickname: localStorage.getItem("nickname") ?? "사용자",
    avatarUrl: localStorage.getItem("profileImage"),
  }));
  const [profileForm, setProfileForm] = useState({ nickname: "", avatarUrl: null as string | null });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { path: "/", label: "대시보드", icon: LayoutDashboard },
    { path: "/timetable", label: "시간표", icon: Clock },
    { path: "/github", label: "GitHub", icon: Github },
    { path: "/programmers", label: "프로그래머스", icon: Code2 },
    { path: "/todo", label: "Todo", icon: CheckSquare },
    { path: "/calendar", label: "캘린더", icon: Calendar },
  ];

  useEffect(() => {
    if (!isLoggedIn) return;
    getProfile()
      .then((p) => {
        setProfile({
          nickname: p.nickname ?? "사용자",
          avatarUrl: p.profileImagePath ?? localStorage.getItem("profileImage"),
        });
        if (p.githubUsername && p.programmersRepo) {
          setGithubConfig({ username: p.githubUsername, programmersRepo: p.programmersRepo });
          setSettingsForm({ username: p.githubUsername, programmersRepo: p.programmersRepo });
        }
      })
      .catch(console.error);
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginForm(false);
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    setShowSignupForm(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncAll();
      alert("동기화가 완료되었습니다!");
    } catch (err) {
      console.error(err);
      alert("동기화에 실패했습니다.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    apiLogout();
    setIsLoggedIn(false);
    setGithubConfig(null);
    setSettingsForm({ username: "", programmersRepo: "" });
    setProfile({ nickname: "사용자", avatarUrl: null });
  };

  const handleOpenProfileEdit = () => {
    setProfileForm({ nickname: profile.nickname, avatarUrl: profile.avatarUrl });
    setShowProfileEdit(true);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileForm((f) => ({ ...f, avatarUrl: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!profileForm.nickname.trim()) return;
    try {
      const data = await updateNickname(profileForm.nickname.trim());
      const savedNickname = data.nickname ?? profileForm.nickname.trim();
      localStorage.setItem("nickname", savedNickname);
      if (profileForm.avatarUrl) {
        localStorage.setItem("profileImage", profileForm.avatarUrl);
      } else {
        localStorage.removeItem("profileImage");
      }
      setProfile({ nickname: savedNickname, avatarUrl: profileForm.avatarUrl });
      setShowProfileEdit(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenGithubSettings = () => {
    if (githubConfig) {
      setSettingsForm({ username: githubConfig.username, programmersRepo: githubConfig.programmersRepo });
    }
    setShowGithubSettings(true);
  };

  const handleSaveGithubSettings = async () => {
    if (!settingsForm.username.trim() || !settingsForm.programmersRepo.trim()) return;
    try {
      await setupGithub(settingsForm.username.trim(), settingsForm.programmersRepo.trim());
      setGithubConfig({ username: settingsForm.username.trim(), programmersRepo: settingsForm.programmersRepo.trim() });
      setShowGithubSettings(false);
      alert("GitHub 계정이 설정되었습니다.");
    } catch (err) {
      console.error(err);
      alert("설정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dev Learning Hub</h1>
            <p className="text-sm text-muted-foreground">개발자를 위한 학습 대시보드</p>
          </div>

          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setShowSignupForm(true)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  회원가입
                </button>
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  로그인
                </button>
              </>
            ) : (
              <>
                {githubConfig ? (
                  <>
                    <button
                      onClick={handleOpenGithubSettings}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2 text-sm text-muted-foreground"
                      title={`@${githubConfig.username}`}
                    >
                      <Github className="w-4 h-4" />
                      <span className="max-w-[120px] truncate">{githubConfig.username}</span>
                    </button>
                    <button
                      onClick={handleSync}
                      disabled={isSyncing}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                      {isSyncing ? "동기화 중..." : "동기화"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleOpenGithubSettings}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    깃허브 설정
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-89px)] border-r border-border bg-card flex flex-col">
          {/* Profile Section */}
          <div className="px-4 py-5 border-b border-border">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenProfileEdit}
                  className="relative w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0 hover:ring-2 hover:ring-primary transition-all group"
                  title="프로필 수정"
                >
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="프로필" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-9 h-9 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{profile.nickname}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {githubConfig ? `@${githubConfig.username}` : "깃허브 미연결"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                  <User className="w-9 h-9 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">로그인이 필요합니다</p>
              </div>
            )}
          </div>

          <nav className="p-4 space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-foreground"
                  } ${!isLoggedIn ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet context={{ isLoggedIn, githubConfig }} />
        </main>
      </div>

      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onLogin={handleLogin}
        />
      )}

      {showSignupForm && (
        <SignupForm
          onClose={() => setShowSignupForm(false)}
          onSignup={handleSignup}
        />
      )}

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">프로필 편집</h2>
                <p className="text-xs text-muted-foreground">닉네임과 프로필 사진을 변경합니다</p>
              </div>
              <button
                onClick={() => setShowProfileEdit(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar Picker */}
            <div className="flex flex-col items-center mb-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full overflow-hidden bg-muted hover:ring-4 hover:ring-primary/30 transition-all group"
              >
                {profileForm.avatarUrl ? (
                  <img src={profileForm.avatarUrl} alt="미리보기" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>
              <p className="text-xs text-muted-foreground mt-2">클릭하여 사진 변경</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </div>

            {/* Nickname Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">닉네임</label>
              <input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={profileForm.nickname}
                onChange={(e) => setProfileForm((f) => ({ ...f, nickname: e.target.value }))}
                maxLength={20}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              <p className="text-xs text-muted-foreground text-right">{profileForm.nickname.length}/20</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowProfileEdit(false)}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
              >
                취소
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={!profileForm.nickname.trim()}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Settings Modal */}
      {showGithubSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Github className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">깃허브 설정</h2>
                  <p className="text-xs text-muted-foreground">GitHub API 및 프로그래머스 데이터 연동</p>
                </div>
              </div>
              <button
                onClick={() => setShowGithubSettings(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub 사용자명</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                  <input
                    type="text"
                    placeholder="your-github-username"
                    value={settingsForm.username}
                    onChange={(e) => setSettingsForm((f) => ({ ...f, username: e.target.value }))}
                    className="w-full pl-7 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  />
                </div>
                <p className="text-xs text-muted-foreground">GitHub 커밋 통계를 불러올 계정입니다</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">프로그래머스 레포지토리</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/</span>
                  <input
                    type="text"
                    placeholder="repo-name"
                    value={settingsForm.programmersRepo}
                    onChange={(e) => setSettingsForm((f) => ({ ...f, programmersRepo: e.target.value }))}
                    className="w-full pl-5 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  백준허브로 프로그래머스 풀이가 업로드되는 레포지토리 이름입니다
                </p>
              </div>

              {settingsForm.username && settingsForm.programmersRepo && (
                <div className="bg-muted/50 rounded-lg px-4 py-3 text-xs text-muted-foreground font-mono">
                  github.com/<span className="text-foreground">{settingsForm.username}</span>/
                  <span className="text-foreground">{settingsForm.programmersRepo}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowGithubSettings(false)}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
              >
                취소
              </button>
              <button
                onClick={handleSaveGithubSettings}
                disabled={!settingsForm.username.trim() || !settingsForm.programmersRepo.trim()}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
