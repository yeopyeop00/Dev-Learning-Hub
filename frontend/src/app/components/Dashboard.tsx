import { useOutletContext } from "react-router";
import { TodaySchedule } from "./widgets/TodaySchedule";
import { GithubWidget } from "./widgets/GithubWidget";
import { ProgrammersWidget } from "./widgets/ProgrammersWidget";
import { TodayTodo } from "./widgets/TodayTodo";
import { QuickStats } from "./widgets/QuickStats";
import type { GithubConfig } from "./Layout";

interface OutletContext {
  isLoggedIn: boolean;
  githubConfig: GithubConfig | null;
}

export function Dashboard() {
  const { isLoggedIn, githubConfig } = useOutletContext<OutletContext>();

  if (!isLoggedIn) {
    return (
      <div className="space-y-6">
        <div>
          <h2>대시보드</h2>
          <p className="text-muted-foreground">로그인 후 이용 가능합니다</p>
        </div>
        <div className="flex items-center justify-center h-[400px] border border-border rounded-lg bg-card/50">
          <p className="text-muted-foreground">로그인하여 학습 현황을 확인하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>대시보드</h2>
        <p className="text-muted-foreground">오늘의 학습 현황을 한눈에 확인하세요</p>
      </div>

      {/* Quick Stats */}
      <QuickStats hasGithubConfig={!!githubConfig} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaySchedule />
        <TodayTodo />
        <GithubWidget hasGithubConfig={!!githubConfig} />
        <ProgrammersWidget hasGithubConfig={!!githubConfig} />
      </div>
    </div>
  );
}
