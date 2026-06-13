import { useEffect, useState } from "react";
import { Github, Settings } from "lucide-react";
import { getGithubActivity, type ActivityLogEntry } from "../../../api";

export function GithubWidget({ hasGithubConfig }: { hasGithubConfig: boolean }) {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasGithubConfig) return;
    setIsLoading(true);
    getGithubActivity()
      .then(setEntries)
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

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Github className="w-5 h-5 text-primary" />
        <h3>GitHub 활동</h3>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">최근 활동이 없습니다. 동기화를 실행해주세요.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div key={index} className="flex items-start justify-between gap-3 p-3 bg-accent rounded-lg">
              <p className="text-sm font-medium flex-1 truncate">{entry.message}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {entry.date?.replace(/-/g, ".")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
