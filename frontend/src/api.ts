const BASE_URL = "http://localhost:8080";

function getUserId(): string {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "/";
    throw new Error("Not authenticated");
  }
  return userId;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth

export async function signup(email: string, password: string, passwordConfirm: string) {
  const data = await request<{ success: boolean; message: string; token: string | null; userId: number }>(
    "/api/auth/signup",
    { method: "POST", body: JSON.stringify({ email, pwd: password, pwdConfirm: passwordConfirm }) }
  );
  localStorage.setItem("userId", String(data.userId));
  return data;
}

export async function login(email: string, password: string) {
  const data = await request<{ success: boolean; message: string; token: string; userId: number; nickname: string | null }>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify({ email, pwd: password }) }
  );
  localStorage.setItem("userId", String(data.userId));
  if (data.nickname) {
    localStorage.setItem("nickname", data.nickname);
  }
  return data;
}

export function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("nickname");
}

// Todo

export async function getTodos() {
  const userId = getUserId();
  return request<TodoResponse[]>(`/api/todos?userId=${userId}`);
}

export async function getTodoSummary() {
  const userId = getUserId();
  return request<TodoSummaryResponse>(`/api/todos/summary?userId=${userId}`);
}

export async function addTodo(content: string, category: string) {
  const userId = getUserId();
  return request<TodoResponse>("/api/todos", {
    method: "POST",
    body: JSON.stringify({ userId: Number(userId), content, category }),
  });
}

export async function toggleTodo(id: number) {
  return request<TodoResponse>(`/api/todos/${id}/status`, { method: "PATCH" });
}

export async function deleteTodo(id: number) {
  const userId = getUserId();
  return request<void>(`/api/todos/${id}?userId=${userId}`, { method: "DELETE" });
}

// Calendar

export async function getEvents() {
  const userId = getUserId();
  return request<CalendarResponse[]>(`/api/calendar?userId=${userId}`);
}

export async function addEvent(title: string, date: string, time: string, type: string) {
  const userId = getUserId();
  return request<CalendarResponse>("/api/calendar", {
    method: "POST",
    body: JSON.stringify({ userId: Number(userId), title, date, time: time || null, type: type.toUpperCase() }),
  });
}

export async function deleteEvent(id: number) {
  return request<void>(`/api/calendar/${id}`, { method: "DELETE" });
}

// Timetable

export async function getTimetable() {
  const userId = getUserId();
  return request<TimetableResponse[]>(`/api/timetable?userId=${userId}`);
}

export async function getTodaySchedule() {
  const userId = getUserId();
  return request<TimetableResponse[]>(`/api/timetable/today?userId=${userId}`);
}

export async function addEntry(
  subject: string,
  room: string,
  dayOfWeek: string,
  startTime: string,
  duration: number,
  color: string
) {
  const userId = getUserId();
  return request<TimetableResponse>("/api/timetable", {
    method: "POST",
    body: JSON.stringify({ userId: Number(userId), subject, room, dayOfWeek, startTime, duration, color }),
  });
}

export async function deleteEntry(id: number) {
  return request<void>(`/api/timetable/${id}`, { method: "DELETE" });
}

// Profile

export async function getProfile() {
  const userId = getUserId();
  return request<ProfileResponse>(`/api/profile?userId=${userId}`);
}

export async function updateNickname(nickname: string) {
  const userId = getUserId();
  return request<ProfileResponse>("/api/profile/nickname", {
    method: "PATCH",
    body: JSON.stringify({ userId: Number(userId), nickname }),
  });
}

// GitHub

export async function setupGithub(githubUsername: string, programmersRepo: string) {
  const userId = getUserId();
  return request<{ success: boolean; message: string }>("/api/github/setup", {
    method: "POST",
    body: JSON.stringify({ userId: Number(userId), githubUsername, programmersRepo }),
  });
}

export async function getGithubStat() {
  const userId = getUserId();
  return request<GithubStatResponse>(`/api/github/stat?userId=${userId}`);
}

export async function getProgrammersStat() {
  const userId = getUserId();
  return request<ProgrammersStatResponse>(`/api/github/programmers?userId=${userId}`);
}

export async function syncAll() {
  const userId = getUserId();
  return request<{ success: boolean; message: string }>(`/api/github/sync?userId=${userId}`, {
    method: "POST",
  });
}

// Response types

export interface TodoSummaryResponse {
  total: number;
  completed: number;
}

export interface TodoResponse {
  id: number;
  content: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  category: string;
  createdAt: string;
}

export interface CalendarResponse {
  id: number;
  title: string;
  date: string;
  time: string | null;
  type: "CLASS" | "ASSIGNMENT" | "EXAM" | "PERSONAL" | "STUDY";
  color: string;
}

export interface TimetableResponse {
  id: number;
  subject: string;
  room: string;
  dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";
  startTime: string;
  duration: number;
  color: string;
}

export interface ProfileResponse {
  id: number;
  email: string;
  nickname: string | null;
  profileImagePath: string | null;
}

export interface GithubStatResponse {
  id: number;
  userId: number;
  weeklyCommits: number;
  activeRepos: number;
  streak: number;
  weeklyData: string | null;
  recentActivities: string | null;
  monthlyData: string | null;
  yearlyStat: string | null;
  updatedAt: string;
}

export interface ProgrammersStatResponse {
  id: number;
  userId: number;
  totalSolved: number;
  mainLevel: number;
  monthlySolved: number;
  yearlyData: string | null;
  levelDistribution: string | null;
  updatedAt: string;
}
