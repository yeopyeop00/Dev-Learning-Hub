import { useEffect, useState } from "react";
import { Code2, GitCommit, CheckCircle, Trophy } from "lucide-react";
import {
  getGithubStat,
  getProgrammersStat,
  getTodoSummary,
  type GithubStatResponse,
  type ProgrammersStatResponse,
  type TodoSummaryResponse,
} from "../../../api";

function getTodayCommits(stat: GithubStatResponse | null): number {
  if (!stat?.weeklyData) return 0;
  try {
    const weekly = JSON.parse(stat.weeklyData) as { day: string; commits: number }[];
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const today = days[new Date().getDay()];
    return weekly.find((w) => w.day === today)?.commits ?? 0;
  } catch {
    return 0;
  }
}

export function QuickStats({ hasGithubConfig }: { hasGithubConfig: boolean }) {
  const [githubStat, setGithubStat] = useState<GithubStatResponse | null>(null);
  const [programmersStat, setProgrammersStat] = useState<ProgrammersStatResponse | null>(null);
  const [todoSummary, setTodoSummary] = useState<TodoSummaryResponse>({ total: 0, completed: 0 });

  useEffect(() => {
    getTodoSummary()
      .then(setTodoSummary)
      .catch(console.error);

    if (hasGithubConfig) {
      getGithubStat()
        .then(setGithubStat)
        .catch(console.error);
      getProgrammersStat()
        .then(setProgrammersStat)
        .catch(console.error);
    }
  }, [hasGithubConfig]);

  const todoLabel =
    todoSummary.total > 0
      ? `${todoSummary.completed}/${todoSummary.total}`
      : "0";

  const stats = [
    {
      label: "오늘 커밋",
      value: hasGithubConfig ? String(getTodayCommits(githubStat)) : "—",
      icon: GitCommit,
      color: hasGithubConfig ? "text-blue-500" : "text-muted-foreground/40",
    },
    {
      label: "해결한 문제",
      value: hasGithubConfig ? String(programmersStat?.monthlySolved ?? 0) : "—",
      icon: Code2,
      color: hasGithubConfig ? "text-green-500" : "text-muted-foreground/40",
    },
    {
      label: "완료한 Todo",
      value: todoLabel,
      icon: CheckCircle,
      color: "text-purple-500",
    },
    {
      label: "연속 학습일",
      value: hasGithubConfig ? `${githubStat?.streak ?? 0}일` : "—",
      icon: Trophy,
      color: hasGithubConfig ? "text-orange-500" : "text-muted-foreground/40",
    },
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
