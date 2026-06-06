import { Clock } from "lucide-react";

export function TodaySchedule() {
  const schedule = [
    { time: "09:00 - 10:30", subject: "자료구조", location: "공학관 301" },
    { time: "10:30 - 12:00", subject: "알고리즘", location: "공학관 401" },
    { time: "13:00 - 14:30", subject: "운영체제", location: "IT관 201" },
    { time: "15:00 - 16:30", subject: "데이터베이스", location: "IT관 302" },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3>오늘의 시간표</h3>
      </div>
      <div className="space-y-3">
        {schedule.map((item, index) => (
          <div key={index} className="flex gap-4 p-3 bg-accent rounded-lg">
            <div className="text-sm text-muted-foreground min-w-[100px]">{item.time}</div>
            <div className="flex-1">
              <div className="font-medium">{item.subject}</div>
              <div className="text-sm text-muted-foreground">{item.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
