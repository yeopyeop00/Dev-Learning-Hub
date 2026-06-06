import { Code2, GitCommit, CheckCircle, Trophy } from "lucide-react";

export function QuickStats({ hasGithubConfig }: { hasGithubConfig: boolean }) {
  const stats = [
    { label: "오늘 커밋", value: hasGithubConfig ? "3" : "—", icon: GitCommit, color: hasGithubConfig ? "text-blue-500" : "text-muted-foreground/40" },
    { label: "해결한 문제", value: hasGithubConfig ? "5" : "—", icon: Code2, color: hasGithubConfig ? "text-green-500" : "text-muted-foreground/40" },
    { label: "완료한 Todo", value: "8/12", icon: CheckCircle, color: "text-purple-500" },
    { label: "연속 학습일", value: hasGithubConfig ? "7일" : "—", icon: Trophy, color: hasGithubConfig ? "text-orange-500" : "text-muted-foreground/40" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
