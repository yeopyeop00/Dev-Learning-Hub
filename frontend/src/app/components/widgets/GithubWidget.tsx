import { Github, Settings } from "lucide-react";

export function GithubWidget({ hasGithubConfig }: { hasGithubConfig: boolean }) {
  if (!hasGithubConfig) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
        <Github className="w-8 h-8 text-muted-foreground/40" />
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">GitHub 활동</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            <span className="inline-flex items-center gap-1"><Settings className="w-3 h-3" />깃허브 설정</span> 후 확인할 수 있습니다
          </p>
        </div>
      </div>
    );
  }

  const commits = [
    { date: "2026-03-22", count: 3, message: "알고리즘 문제 풀이 추가" },
    { date: "2026-03-21", count: 5, message: "React 프로젝트 업데이트" },
    { date: "2026-03-20", count: 2, message: "버그 수정" },
    { date: "2026-03-19", count: 4, message: "새로운 기능 구현" },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Github className="w-5 h-5 text-primary" />
        <h3>GitHub 활동</h3>
      </div>
      <div className="space-y-3">
        {commits.map((commit, index) => (
          <div key={index} className="flex items-center gap-4 p-3 bg-accent rounded-lg">
            <div className="flex-1">
              <div className="font-medium">{commit.message}</div>
              <div className="text-sm text-muted-foreground">{commit.date}</div>
            </div>
            <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm">
              {commit.count} commits
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
