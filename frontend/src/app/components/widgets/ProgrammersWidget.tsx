import { Code2, Settings } from "lucide-react";

export function ProgrammersWidget({ hasGithubConfig }: { hasGithubConfig: boolean }) {
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

  const solvedProblems = [
    { date: "2026-05-05", count: 2, level: "Lv.2" },
    { date: "2026-05-04", count: 1, level: "Lv.2" },
    { date: "2026-05-03", count: 1, level: "Lv.2" },
    { date: "2026-05-02", count: 3, level: "Lv.1" },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Lv.0":
        return "bg-gray-400/10 text-gray-600";
      case "Lv.1":
        return "bg-green-400/10 text-green-600";
      case "Lv.2":
        return "bg-blue-400/10 text-blue-600";
      case "Lv.3":
        return "bg-purple-500/10 text-purple-600";
      case "Lv.4":
        return "bg-orange-500/10 text-orange-600";
      case "Lv.5":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-gray-400/10 text-gray-600";
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="w-5 h-5 text-primary" />
        <h3>프로그래머스 풀이 현황</h3>
      </div>
      <div className="space-y-3">
        {solvedProblems.map((problem, index) => (
          <div key={index} className="flex items-center gap-4 p-3 bg-accent rounded-lg">
            <div className="flex-1">
              <div className="font-medium">{problem.count}문제 해결</div>
              <div className="text-sm text-muted-foreground">{problem.date}</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${getLevelColor(problem.level)}`}>
              {problem.level}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
