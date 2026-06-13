import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from "lucide-react";
import { getEvents, addEvent, deleteEvent, type CalendarResponse } from "../../api";

type EventTypeKey = "CLASS" | "ASSIGNMENT" | "EXAM" | "STUDY" | "PERSONAL";

interface Event {
  id: number;
  date: string;
  title: string;
  type: EventTypeKey;
  time?: string;
}

interface OutletContext {
  isLoggedIn: boolean;
}

function fromResponse(r: CalendarResponse): Event {
  return {
    id: r.id,
    date: r.date,
    title: r.title,
    type: r.type,
    time: r.time ? r.time.substring(0, 5) : undefined,
  };
}

export function CalendarView() {
  const { isLoggedIn } = useOutletContext<OutletContext>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: "", title: "", type: "CLASS" as EventTypeKey, time: "" });

  useEffect(() => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    getEvents()
      .then((items) => setEvents(items.map(fromResponse)))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isLoggedIn]);

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

  const previousMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((event) => event.date === dateStr);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "CLASS": return "bg-blue-500";
      case "ASSIGNMENT": return "bg-orange-500";
      case "EXAM": return "bg-red-500";
      case "STUDY": return "bg-green-500";
      case "PERSONAL": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "CLASS": return "수업";
      case "ASSIGNMENT": return "과제";
      case "EXAM": return "시험";
      case "STUDY": return "학습";
      case "PERSONAL": return "개인";
      default: return "";
    }
  };

  const monthName = currentDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });
  const today = new Date();
  const isCurrentMonth =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth();

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    try {
      const item = await addEvent(newEvent.title, newEvent.date, newEvent.time, newEvent.type);
      setEvents((prev) => [...prev, fromResponse(item)]);
      setNewEvent({ date: "", title: "", type: "CLASS", time: "" });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
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
            <button onClick={previousMonth} className="p-2 hover:bg-accent rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-accent rounded-lg">
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
            const isToday = isCurrentMonth && day === today.getDate();

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
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded text-white ${getEventColor(event.type)}`}
                      title={`${event.title} ${event.time ? `- ${event.time}` : ""}`}
                    >
                      {event.title.length > 10 ? event.title.substring(0, 10) + "..." : event.title}
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
        {isLoading ? (
          <p className="text-muted-foreground text-center py-4">불러오는 중...</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 bg-accent rounded-lg">
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
                  onClick={() => handleDeleteEvent(event.id)}
                  className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                  title="일정 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="mb-4">범례</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500"></div>
            <span className="text-sm">개인</span>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3>새 일정 추가</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-accent rounded">
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
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as EventTypeKey })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                >
                  <option value="CLASS">수업</option>
                  <option value="ASSIGNMENT">과제</option>
                  <option value="EXAM">시험</option>
                  <option value="STUDY">학습</option>
                  <option value="PERSONAL">개인</option>
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
