import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { Plus, X, Trash2 } from "lucide-react";
import { getTimetable, addEntry, deleteEntry, type TimetableResponse } from "../../api";

interface OutletContext {
  isLoggedIn: boolean;
}

interface ClassItem {
  id: number;
  day: number;
  startTime: number;
  duration: number;
  subject: string;
  location: string;
  color: string;
}

const DAY_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const;
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function dayIndex(dow: TimetableResponse["dayOfWeek"]): number {
  return DAY_OF_WEEK.indexOf(dow);
}

function timeIndex(t: string): number {
  const hh = t.substring(0, 2);
  return TIME_SLOTS.findIndex((s) => s.startsWith(hh));
}

function fromResponse(r: TimetableResponse): ClassItem {
  return {
    id: r.id,
    day: dayIndex(r.dayOfWeek),
    startTime: timeIndex(r.startTime),
    duration: r.duration,
    subject: r.subject,
    location: r.room,
    color: r.color,
  };
}

export function Timetable() {
  const { isLoggedIn } = useOutletContext<OutletContext>();
  const days = ["월요일", "화요일", "수요일", "목요일", "금요일"];
  const times = TIME_SLOTS;

  const colorOptions = [
    { value: "bg-blue-500", label: "파랑" },
    { value: "bg-green-500", label: "초록" },
    { value: "bg-purple-500", label: "보라" },
    { value: "bg-orange-500", label: "주황" },
    { value: "bg-pink-500", label: "분홍" },
    { value: "bg-cyan-500", label: "청록" },
    { value: "bg-red-500", label: "빨강" },
    { value: "bg-yellow-500", label: "노랑" },
    { value: "bg-indigo-500", label: "남색" },
  ];

  const [schedule, setSchedule] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClass, setNewClass] = useState({
    day: 0,
    startTime: 0,
    duration: 1,
    subject: "",
    location: "",
    color: "bg-blue-500",
  });

  useEffect(() => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    getTimetable()
      .then((items) => setSchedule(items.map(fromResponse)))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isLoggedIn]);

  const handleAddClass = async () => {
    if (!newClass.subject || !newClass.location) return;
    try {
      const item = await addEntry(
        newClass.subject,
        newClass.location,
        DAY_OF_WEEK[newClass.day],
        times[newClass.startTime],
        newClass.duration,
        newClass.color
      );
      setSchedule((prev) => [...prev, fromResponse(item)]);
      setNewClass({ day: 0, startTime: 0, duration: 1, subject: "", location: "", color: "bg-blue-500" });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClass = async (id: number) => {
    try {
      await deleteEntry(id);
      setSchedule((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="space-y-6">
        <div>
          <h2>시간표</h2>
          <p className="text-muted-foreground">로그인 후 이용 가능합니다</p>
        </div>
        <div className="flex items-center justify-center h-[400px] border border-border rounded-lg bg-card/50">
          <p className="text-muted-foreground">로그인하여 시간표를 확인하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>시간표</h2>
          <p className="text-muted-foreground">주간 강의 시간표</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          수업 추가
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 overflow-x-auto">
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">불러오는 중...</p>
        ) : (
          <div className="min-w-[800px]">
            <div className="grid grid-cols-6 gap-2">
              <div className="font-medium p-2"></div>
              {days.map((day) => (
                <div key={day} className="font-medium p-2 text-center bg-accent rounded-lg">
                  {day}
                </div>
              ))}
            </div>

            <div className="relative mt-4">
              {times.map((time, tIdx) => (
                <div key={time} className="grid grid-cols-6 gap-2 mb-2">
                  <div className="text-sm text-muted-foreground p-2">{time}</div>
                  {days.map((_, dIdx) => {
                    const classItem = schedule.find(
                      (item) => item.day === dIdx && item.startTime === tIdx
                    );

                    if (classItem) {
                      return (
                        <div
                          key={dIdx}
                          className={`${classItem.color} text-white p-3 rounded-lg`}
                          style={{ gridRow: `span ${classItem.duration}` }}
                        >
                          <div className="font-medium text-sm">{classItem.subject}</div>
                          <div className="text-xs opacity-90 mt-1">{classItem.location}</div>
                        </div>
                      );
                    }

                    const isOccupied = schedule.some(
                      (item) =>
                        item.day === dIdx &&
                        item.startTime < tIdx &&
                        item.startTime + item.duration > tIdx
                    );

                    if (isOccupied) return null;

                    return <div key={dIdx} className="border border-border rounded-lg h-16"></div>;
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="mb-4">수업 정보</h3>
        <div className="space-y-3">
          {schedule.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-accent rounded-lg">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <div className="flex-1">
                <div className="font-medium">{item.subject}</div>
                <div className="text-sm text-muted-foreground">{item.location}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                {days[item.day]} {times[item.startTime]}
              </div>
              <button
                onClick={() => handleDeleteClass(item.id)}
                className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                title="수업 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3>새 수업 추가</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-accent rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">과목명</label>
                <input
                  type="text"
                  value={newClass.subject}
                  onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  placeholder="과목명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">강의실</label>
                <input
                  type="text"
                  value={newClass.location}
                  onChange={(e) => setNewClass({ ...newClass, location: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  placeholder="강의실을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">요일</label>
                <select
                  value={newClass.day}
                  onChange={(e) => setNewClass({ ...newClass, day: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                >
                  {days.map((day, index) => (
                    <option key={index} value={index}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">시작 시간</label>
                <select
                  value={newClass.startTime}
                  onChange={(e) => setNewClass({ ...newClass, startTime: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                >
                  {times.map((time, index) => (
                    <option key={index} value={index}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">지속 시간</label>
                <select
                  value={newClass.duration}
                  onChange={(e) => setNewClass({ ...newClass, duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                >
                  <option value={1}>1시간</option>
                  <option value={2}>2시간</option>
                  <option value={3}>3시간</option>
                  <option value={4}>4시간</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">색상</label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      onClick={() => setNewClass({ ...newClass, color: colorOption.value })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 ${
                        newClass.color === colorOption.value
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded ${colorOption.value}`}></div>
                      <span className="text-sm">{colorOption.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent"
                >
                  취소
                </button>
                <button
                  onClick={handleAddClass}
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
