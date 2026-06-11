import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { Trophy, Target, TrendingUp, Code2, Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { GithubConfig } from "./Layout";
import { getProgrammersStat, type ProgrammersStatResponse } from "../../api";

interface OutletContext {
  isLoggedIn: boolean;
  githubConfig: GithubConfig | null;
}

interface MonthlyEntry { month: string; solved: number; }
interface LevelEntry { level: string; count: number; color: string; }

export function ProgrammersStats() {
  const { isLoggedIn, githubConfig } = useOutletContext<OutletContext>();
  const [stat, setStat] = useState<ProgrammersStatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !githubConfig) return;
    setIsLoading(true);
    getProgrammersStat()
      .then(setStat)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isLoggedIn, githubConfig]);

  if (!isLoggedIn) {
    return (
      <div className="space-y-6">
        <div>
          <h2>프로그래머스 통계</h2>
          <p className="text-muted-foreground">로그인 후 이용 가능합니다</p>
        </div>
        <div className="flex items-center justify-center h-[400px] border border-border rounded-lg bg-card/50">
          <p className="text-muted-foreground">로그인하여 프로그래머스 통계를 확인하세요</p>
        </div>
      </div>
    );
  }

  if (!githubConfig) {
    return (
      <div className="space-y-6">
        <div>
          <h2>프로그래머스 통계</h2>
          <p className="text-muted-foreground">깃허브 설정 후 이용 가능합니다</p>
        </div>
        <div className="flex flex-col items-center justify-center h-[400px] border border-border rounded-lg bg-card/50 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <Code2 className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium">깃허브 설정이 필요합니다</p>
            <p className="text-sm text-muted-foreground mt-1">
              우측 상단의{" "}
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                <Settings className="w-3 h-3" />깃허브 설정
              </span>{" "}
              버튼을 눌러 레포지토리를 연결하세요
            </p>
          </div>
        </div>
      </div>
    );
  }

  const monthlyData: MonthlyEntry[] = stat?.yearlyData
    ? (() => {
        try { return JSON.parse(stat.yearlyData); }
        catch { return []; }
      })()
    : [];

  const levelDistribution: LevelEntry[] = stat?.levelDistribution
    ? (() => {
        try { return JSON.parse(stat.levelDistribution); }
        catch { return []; }
      })()
    : [
        { level: "Lv.0", count: 0, color: "bg-gray-400" },
        { level: "Lv.1", count: 0, color: "bg-green-400" },
        { level: "Lv.2", count: 0, color: "bg-blue-400" },
        { level: "Lv.3", count: 0, color: "bg-purple-500" },
        { level: "Lv.4", count: 0, color: "bg-orange-500" },
        { level: "Lv.5", count: 0, color: "bg-red-500" },
      ];

  const grassGrid = stat?.yearlyData
    ? null
    : Array.from({ length: 52 }, (_, week) =>
        Array.from({ length: 7 }, (_, day) => ({ week, day, count: 0 }))
      );

  const getGrassColor = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count < 2) return "bg-blue-200";
    if (count < 4) return "bg-blue-400";
    return "bg-blue-600";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Lv.0": return "bg-gray-400/10 text-gray-600";
      case "Lv.1": return "bg-green-400/10 text-green-600";
      case "Lv.2": return "bg-blue-400/10 text-blue-600";
      case "Lv.3": return "bg-purple-500/10 text-purple-600";
      case "Lv.4": return "bg-orange-500/10 text-orange-600";
      case "Lv.5": return "bg-red-500/10 text-red-600";
      default: return "bg-gray-400/10 text-gray-600";
    }
  };

  const totalSolved = stat?.totalSolved ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2>프로그래머스 통계</h2>
        <p className="text-muted-foreground">
          {githubConfig.programmersRepo} · 문제 풀이 기록 및 레벨 분포
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
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">총 해결 문제</p>
                  <p className="text-2xl font-bold">{totalSolved}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">주요 레벨</p>
                  <p className="text-2xl font-bold">Lv.{stat?.mainLevel ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">이번 달</p>
                  <p className="text-2xl font-bold">{stat?.monthlySolved ?? 0}문제</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Chart */}
          {monthlyData.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="mb-4">월별 풀이 현황</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="solved" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Grass (Contribution Grid) */}
          {grassGrid && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="mb-4">연간 잔디 (풀이 기록)</h3>
              <div className="overflow-x-auto">
                <div className="inline-flex gap-1">
                  {grassGrid.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day) => (
                        <div
                          key={`${day.week}-${day.day}`}
                          className={`w-3 h-3 rounded-sm ${getGrassColor(day.count)}`}
                          title={`${day.count} problems solved`}
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
                  <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                </div>
                <span className="text-sm text-muted-foreground">More</span>
              </div>
            </div>
          )}

          {/* Level Distribution */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="mb-4">레벨별 분포</h3>
            <div className="space-y-3">
              {levelDistribution.map((level) => (
                <div key={level.level}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{level.level}</span>
                    <span className="text-sm text-muted-foreground">{level.count}문제</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className={`${level.color} h-3 rounded-full transition-all`}
                      style={{ width: totalSolved > 0 ? `${(level.count / totalSolved) * 100}%` : "0%" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Solved - shown only if data is available from API */}
          {stat === null && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="mb-4">최근 풀이</h3>
              <p className="text-muted-foreground text-sm">동기화 후 데이터가 표시됩니다.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
