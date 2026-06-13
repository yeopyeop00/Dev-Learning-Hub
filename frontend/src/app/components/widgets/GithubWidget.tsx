import { useEffect, useState } from "react";
import { Github, Settings } from "lucide-react";
import { getGithubStat, type GithubStatResponse } from "../../../api";

interface ActivityEntry { repo: string; commits: number; branch: string; lastCommit: string; time: string; }

export function GithubWidget({ hasGithubConfig }: { hasGithubConfig: boolean }) {
  const [stat, setStat] = useState<GithubStatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasGithubConfig) return;
    setIsLoading(true);
    getGithubStat()
      .then(setStat)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [hasGithubConfig]);

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

  const recentActivity: ActivityEntry[] = stat?.recentActivities
    ? (() => { try { return JSON.parse(stat.recentActivities); } catch { return []; } })()
    : [];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Github className="w-5 h-5 text-primary" />
        <h3>GitHub 활동</h3>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      ) : recentActivity.length === 0 ? (
        <p className="text-sm text-muted-foreground">최근 활동이 없습니다. 동기화를 실행해주세요.</p>
      ) : (
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-accent rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{activity.repo}</div>
                <div className="text-sm text-muted-foreground">{activity.lastCommit}</div>
              </div>
              <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm">
                {activity.commits} commits
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
