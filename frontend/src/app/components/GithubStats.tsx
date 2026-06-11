import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { GitCommit, GitBranch, Star, Github, Settings } from "lucide-react";
import type { GithubConfig } from "./Layout";
import { getGithubStat, type GithubStatResponse } from "../../api";

interface OutletContext {
  isLoggedIn: boolean;
  githubConfig: GithubConfig | null;
}

interface WeeklyEntry { day: string; commits: number; }
interface ActivityEntry { repo: string; commits: number; branch: string; lastCommit: string; time: string; }

export function GithubStats() {
  const { isLoggedIn, githubConfig } = useOutletContext<OutletContext>();
  const [stat, setStat] = useState<GithubStatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !githubConfig) return;
    setIsLoading(true);
    getGithubStat()
      .then(setStat)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isLoggedIn, githubConfig]);

  if (!isLoggedIn) {
    return (
      <div className="space-y-6">
        <div>
          <h2>GitHub 통계</h2>
          <p className="text-muted-foreground">로그인 후 이용 가능합니다</p>
        </div>
        <div className="flex items-center justify-center h-[400px] border border-border rounded-lg bg-card/50">
          <p className="text-muted-foreground">로그인하여 GitHub 통계를 확인하세요</p>
        </div>
      </div>
    );
  }

  if (!githubConfig) {
    return (
      <div className="space-y-6">
        <div>
          <h2>GitHub 통계</h2>
          <p className="text-muted-foreground">깃허브 설정 후 이용 가능합니다</p>
        </div>
        <div className="flex flex-col items-center justify-center h-[400px] border border-border rounded-lg bg-card/50 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <Github className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium">깃허브 설정이 필요합니다</p>
            <p className="text-sm text-muted-foreground mt-1">
              우측 상단의{" "}
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                <Settings className="w-3 h-3" />깃허브 설정
              </span>{" "}
              버튼을 눌러 계정을 연결하세요
            </p>
          </div>
        </div>
      </div>
    );
  }

  const weeklyData: WeeklyEntry[] = stat?.weeklyData
    ? (() => {
        try { return JSON.parse(stat.weeklyData); }
        catch { return []; }
      })()
    : [
        { day: "월", commits: 0 },
        { day: "화", commits: 0 },
        { day: "수", commits: 0 },
        { day: "목", commits: 0 },
        { day: "금", commits: 0 },
        { day: "토", commits: 0 },
        { day: "일", commits: 0 },
      ];

  const recentActivity: ActivityEntry[] = stat?.recentActivities
    ? (() => {
        try { return JSON.parse(stat.recentActivities); }
        catch { return []; }
      })()
    : [];

  const contributionGrid = stat?.yearlyStat
    ? (() => {
        try { return JSON.parse(stat.yearlyStat) as { week: number; day: number; count: number }[][]; }
        catch { return null; }
      })()
    : null;

  const fallbackGrid = Array.from({ length: 52 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => ({ week, day, count: 0 }))
  );

  const grid = contributionGrid ?? fallbackGrid;

  const getContributionColor = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count < 3) return "bg-green-200";
    if (count < 6) return "bg-green-400";
    return "bg-green-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>GitHub 통계</h2>
        <p className="text-muted-foreground">
          @{githubConfig.username} · 커밋 기록 및 활동 현황
        </p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-center py-8">불러오는 중...</p>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3">
                <GitCommit className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">이번 주 커밋</p>
                  <p className="text-2xl font-bold">{stat?.weeklyCommits ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3">
                <GitBranch className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">활성 레포지토리</p>
                  <p className="text-2xl font-bold">{stat?.activeRepos ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">연속 커밋일</p>
                  <p className="text-2xl font-bold">{stat?.streak ?? 0}일</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="mb-4">주간 커밋 현황</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="commits" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Contribution Grid */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="mb-4">연간 기여도</h3>
            <div className="overflow-x-auto">
              <div className="inline-flex gap-1">
                {grid.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day) => (
                      <div
                        key={`${day.week}-${day.day}`}
                        className={`w-3 h-3 rounded-sm ${getContributionColor(day.count)}`}
                        title={`${day.count} contributions`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted"></div>
                <div className="w-3 h-3 rounded-sm bg-green-200"></div>
                <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                <div className="w-3 h-3 rounded-sm bg-green-600"></div>
              </div>
              <span className="text-sm text-muted-foreground">More</span>
            </div>
          </div>

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="mb-4">최근 활동</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 bg-accent rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{activity.repo}</div>
                        <div className="text-sm text-muted-foreground mt-1">{activity.lastCommit}</div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{activity.commits} commits</span>
                          <span>• {activity.branch}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
