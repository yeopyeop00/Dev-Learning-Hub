import { useEffect, useState } from "react";
import { Code2, Settings } from "lucide-react";
import { getProgrammersActivity, type ActivityLogEntry } from "../../../api";

function getLevelColor(level: string) {
  switch (level) {
    case "Lv.0": return "bg-gray-400/10 text-gray-600";
    case "Lv.1": return "bg-green-400/10 text-green-600";
    case "Lv.2": return "bg-blue-400/10 text-blue-600";
    case "Lv.3": return "bg-purple-500/10 text-purple-600";
    case "Lv.4": return "bg-orange-500/10 text-orange-600";
    case "Lv.5": return "bg-red-500/10 text-red-600";
    default: return "bg-gray-400/10 text-gray-600";
  }
}

function parseProblem(message: string): { name: string; level: string } {
  const levelMatch = message.match(/\[level (\d+)\]/i);
  const nameMatch = message.match(/Title:\s*([^,]+)/);
  return {
    name: nameMatch ? nameMatch[1].trim() : message,
    level: levelMatch ? `Lv.${levelMatch[1]}` : "Lv.?",
  };
}

export function ProgrammersWidget({ hasGithubConfig }: { hasGithubConfig: boolean }) {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasGithubConfig) return;
    setIsLoading(true);
    getProgrammersActivity()
      .then(setEntries)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [hasGithubConfig]);

  if (!hasGithubConfig) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
        <Code2 className="w-8 h-8 text-muted-foreground/40" />
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">프로그래머스 풀이 현황</p>
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
        <Code2 className="w-5 h-5 text-primary" />
        <h3>프로그래머스 풀이 현황</h3>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">풀이 기록이 없습니다. 동기화를 실행해주세요.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const { name, level } = parseProblem(entry.message ?? "");
            return (
              <div key={index} className="flex items-center justify-between gap-3 p-3 bg-accent rounded-lg">
                <p className="text-sm font-medium flex-1 truncate">{name}</p>
                <div className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${getLevelColor(level)}`}>
                  {level}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
