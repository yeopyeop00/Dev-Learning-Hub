import { useState } from "react";
import { useOutletContext } from "react-router";
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from "lucide-react";

interface Event {
  date: string;
  title: string;
  type: "class" | "assignment" | "exam" | "study";
  time?: string;
}

interface OutletContext {
  isLoggedIn: boolean;
}

export function CalendarView() {
  const { isLoggedIn } = useOutletContext<OutletContext>();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 22));
  const [events, setEvents] = useState<Event[]>([
    { date: "2026-03-22", title: "자료구조 수업", type: "class", time: "09:00" },
    { date: "2026-03-22", title: "알고리즘 과제 마감", type: "assignment", time: "23:59" },
    { date: "2026-03-24", title: "운영체제 중간고사", type: "exam", time: "10:00" },
    { date: "2026-03-25", title: "코딩 테스트 준비", type: "study", time: "14:00" },
    { date: "2026-03-27", title: "데이터베이스 수업", type: "class", time: "13:00" },
    { date: "2026-03-28", title: "프로젝트 발표", type: "assignment", time: "15:00" },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    date: "",
    title: "",
    type: "class",
    time: "",
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(event => event.date === dateStr);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-500";
      case "assignment":
        return "bg-orange-500";
      case "exam":
        return "bg-red-500";
      case "study":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "class":
        return "수업";
      case "assignment":
        return "과제";
      case "exam":
        return "시험";
      case "study":
        return "학습";
      default:
        return "";
    }
  };

  const monthName = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, newEvent]);
      setNewEvent({
        date: "",
        title: "",
        type: "class",
        time: "",
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  if (!isLoggedIn) {
    return (
      <div className="space-y-6">
        <div>
          <h2>캘린더</h2>
          <p className="text-muted-foreground">로그인 후 이용 가능합니다</p>
        </div>
        <div className="flex items-center justify-center h-[400px] border border-border rounded-lg bg-card/50">
          <p className="text-muted-foreground">로그인하여 일정을 관리하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>캘린더</h2>
          <p className="text-muted-foreground">일정 및 과제를 관리하세요</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          일정 추가
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3>{monthName}</h3>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day} className="text-center font-medium p-2 text-muted-foreground">
              {day}
            </div>
          ))}

          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="p-2"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayEvents = getEventsForDate(day);
            const isToday = day === 22;

            return (
              <div
                key={day}
                className={`min-h-[100px] p-2 border border-border rounded-lg ${
                  isToday ? "bg-primary/5 border-primary" : "bg-card"
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-1 rounded text-white ${getEventColor(event.type)}`}
                      title={`${event.title} ${event.time ? `- ${event.time}` : ""}`}
                    >
                      {event.title.length > 10
                        ? event.title.substring(0, 10) + "..."
                        : event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="mb-4">다가오는 일정</h3>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-accent rounded-lg">
              <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`}></div>
              <div className="flex-1">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-muted-foreground">
                  {event.date} {event.time && `• ${event.time}`}
                </div>
              </div>
              <div className={`text-xs px-3 py-1 rounded-full ${getEventColor(event.type)} text-white`}>
                {getEventTypeLabel(event.type)}
              </div>
              <button
                onClick={() => handleDeleteEvent(index)}
                className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                title="일정 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="mb-4">범례</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-sm">수업</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span className="text-sm">과제</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-sm">시험</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-sm">학습</span>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3>새 일정 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-accent rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">제목</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  placeholder="일정 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">날짜</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">시간 (선택)</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">유형</label>
                <select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value as Event["type"] })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                >
                  <option value="class">수업</option>
                  <option value="assignment">과제</option>
                  <option value="exam">시험</option>
                  <option value="study">학습</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent"
                >
                  취소
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
