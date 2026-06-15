import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getTodaySchedule, type TimetableResponse } from "../../../api";

function formatTimeRange(startTime: string, duration: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const startMinutes = h * 60 + m;
  const endMinutes = startMinutes + duration * 60;
  const endH = Math.floor(endMinutes / 60) % 24;
  const endM = endMinutes % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${startTime} - ${pad(endH)}:${pad(endM)}`;
}

export function TodaySchedule() {
  const [schedule, setSchedule] = useState<TimetableResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTodaySchedule()
      .then(setSchedule)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3>오늘의 시간표</h3>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      ) : schedule.length === 0 ? (
        <p className="text-sm text-muted-foreground">오늘 수업이 없습니다</p>
      ) : (
        <div className="space-y-3">
          {schedule.map((item) => (
            <div key={item.id} className="flex gap-4 p-3 bg-accent rounded-lg">
              <div className="text-sm text-muted-foreground min-w-[130px]">
                {formatTimeRange(item.startTime, item.duration)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.subject}</div>
                <div className="text-sm text-muted-foreground">{item.room}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
