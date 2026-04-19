"use client"

export type Category =
  | "work"
  | "health"
  | "food"
  | "social"
  | "leisure"
  | "wellness"
  | "learning"
  | "finance"
  | "tasks"

export type Priority = "high" | "medium" | "low"

export type RepeatType =
  | "none"
  | "daily"
  | "weekdays"
  | "weekends"
  | "custom"

export interface Activity {
  id: string
  title: string
  category: Category
  startTime: string // "HH:MM"
  duration: number // minutes
  priority: Priority
  repeat: RepeatType
  repeatDays?: number[] // 0=Sun, 1=Mon, ..., 6=Sat
  reminder: boolean
  reminderTime?: string
  notes?: string
  color?: string
  emoji: string
  completed: boolean
  date: string // "YYYY-MM-DD"
  isRunning?: boolean
}

export interface UserProfile {
  name: string
  wakeTime: string
  sleepTime: string
  workStart: string
  workEnd: string
  goals: string[]
  energyLevel: number
  theme: "light" | "dark" | "auto"
  primaryColor: string
  fontSize: "sm" | "md" | "lg"
  pomodoroEnabled: boolean
  pomodoroDuration: number
  pausesEnabled: boolean
  reminderStart: boolean
  morningReport: boolean
  morningReportTime: string
  nightReport: boolean
  nightReportTime: string
  dailyMotivation: boolean
  configured: boolean
}

export interface DayStats {
  date: string
  completed: number
  total: number
  focusMinutes: number
  mood: string
}

export const CATEGORY_META: Record<
  Category,
  { label: string; emoji: string; color: string }
> = {
  work: { label: "Trabalho/Estudo", emoji: "💻", color: "#6C63FF" },
  health: { label: "Saúde/Exercício", emoji: "🏃", color: "#43D787" },
  food: { label: "Alimentação", emoji: "🍽️", color: "#FFB347" },
  social: { label: "Família/Social", emoji: "👨‍👩‍👧", color: "#FF6584" },
  leisure: { label: "Lazer/Hobby", emoji: "🎯", color: "#4FC3F7" },
  wellness: { label: "Bem-estar", emoji: "🧘", color: "#CE93D8" },
  learning: { label: "Aprendizado", emoji: "📚", color: "#80DEEA" },
  finance: { label: "Finanças", emoji: "💰", color: "#A5D6A7" },
  tasks: { label: "Tarefas domésticas", emoji: "🔧", color: "#FFB347" },
}

export const DEFAULT_PROFILE: UserProfile = {
  name: "",
  wakeTime: "06:00",
  sleepTime: "22:45",
  workStart: "08:00",
  workEnd: "17:00",
  goals: ["productivity", "health"],
  energyLevel: 4,
  theme: "light",
  primaryColor: "#6C63FF",
  fontSize: "md",
  pomodoroEnabled: false,
  pomodoroDuration: 25,
  pausesEnabled: true,
  reminderStart: true,
  morningReport: true,
  morningReportTime: "07:00",
  nightReport: true,
  nightReportTime: "22:00",
  dailyMotivation: true,
  configured: false,
}

export const DEFAULT_ACTIVITIES: Omit<Activity, "id" | "date" | "completed">[] = [
  { title: "Acordar e alongamento", category: "wellness", startTime: "06:00", duration: 15, priority: "high", repeat: "daily", reminder: true, emoji: "🧘", color: "#CE93D8" },
  { title: "Higiene matinal", category: "wellness", startTime: "06:15", duration: 20, priority: "high", repeat: "daily", reminder: false, emoji: "🚿", color: "#CE93D8" },
  { title: "Café da manhã", category: "food", startTime: "06:35", duration: 25, priority: "high", repeat: "daily", reminder: false, emoji: "☕", color: "#FFB347" },
  { title: "Exercício físico", category: "health", startTime: "07:00", duration: 45, priority: "high", repeat: "weekdays", reminder: true, emoji: "🏃", color: "#43D787" },
  { title: "Preparação para trabalho", category: "work", startTime: "07:45", duration: 30, priority: "medium", repeat: "weekdays", reminder: false, emoji: "💼", color: "#6C63FF" },
  { title: "Bloco de trabalho / Foco", category: "work", startTime: "08:15", duration: 90, priority: "high", repeat: "weekdays", reminder: true, emoji: "💻", color: "#6C63FF" },
  { title: "Pausa curta", category: "wellness", startTime: "09:45", duration: 15, priority: "low", repeat: "weekdays", reminder: false, emoji: "☕", color: "#CE93D8" },
  { title: "Bloco de trabalho / Foco", category: "work", startTime: "10:00", duration: 90, priority: "high", repeat: "weekdays", reminder: false, emoji: "💻", color: "#6C63FF" },
  { title: "Reuniões / Comunicação", category: "work", startTime: "11:30", duration: 60, priority: "medium", repeat: "weekdays", reminder: true, emoji: "📞", color: "#6C63FF" },
  { title: "Almoço e descanso", category: "food", startTime: "12:30", duration: 60, priority: "high", repeat: "daily", reminder: false, emoji: "🍽️", color: "#FFB347" },
  { title: "Bloco de trabalho", category: "work", startTime: "13:30", duration: 90, priority: "high", repeat: "weekdays", reminder: false, emoji: "💻", color: "#6C63FF" },
  { title: "Pausa e lanche", category: "food", startTime: "15:00", duration: 20, priority: "low", repeat: "weekdays", reminder: false, emoji: "🍎", color: "#FFB347" },
  { title: "Bloco de trabalho", category: "work", startTime: "15:20", duration: 100, priority: "high", repeat: "weekdays", reminder: false, emoji: "💻", color: "#6C63FF" },
  { title: "Fim do trabalho / Transição", category: "work", startTime: "17:00", duration: 30, priority: "medium", repeat: "weekdays", reminder: true, emoji: "🔄", color: "#6C63FF" },
  { title: "Atividade pessoal / Hobby", category: "leisure", startTime: "17:30", duration: 60, priority: "medium", repeat: "daily", reminder: false, emoji: "🎯", color: "#4FC3F7" },
  { title: "Exercício ou caminhada", category: "health", startTime: "18:30", duration: 45, priority: "high", repeat: "daily", reminder: true, emoji: "🚶", color: "#43D787" },
  { title: "Jantar", category: "food", startTime: "19:15", duration: 45, priority: "high", repeat: "daily", reminder: false, emoji: "🍽️", color: "#FFB347" },
  { title: "Tempo em família / Social", category: "social", startTime: "20:00", duration: 90, priority: "medium", repeat: "daily", reminder: false, emoji: "👨‍👩‍👧", color: "#FF6584" },
  { title: "Leitura ou aprendizado", category: "learning", startTime: "21:30", duration: 45, priority: "medium", repeat: "daily", reminder: false, emoji: "📚", color: "#80DEEA" },
  { title: "Preparação para dormir", category: "wellness", startTime: "22:15", duration: 30, priority: "high", repeat: "daily", reminder: true, emoji: "🌙", color: "#CE93D8" },
  { title: "Dormir", category: "wellness", startTime: "22:45", duration: 480, priority: "high", repeat: "daily", reminder: false, emoji: "😴", color: "#CE93D8" },
]

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE
  try {
    const stored = localStorage.getItem("rotineai_profile")
    return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE
  } catch { return DEFAULT_PROFILE }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return
  localStorage.setItem("rotineai_profile", JSON.stringify(profile))
}

export function loadActivities(date: string): Activity[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(`rotineai_activities_${date}`)
    if (stored) return JSON.parse(stored)
    // Generate default activities for this date
    return DEFAULT_ACTIVITIES.map((a, i) => ({
      ...a,
      id: `default_${i}_${date}`,
      date,
      completed: false,
    }))
  } catch { return [] }
}

export function saveActivities(date: string, activities: Activity[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`rotineai_activities_${date}`, JSON.stringify(activities))
}

export function loadAllActivities(): Record<string, Activity[]> {
  if (typeof window === "undefined") return {}
  const result: Record<string, Activity[]> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith("rotineai_activities_")) {
      const date = key.replace("rotineai_activities_", "")
      try {
        result[date] = JSON.parse(localStorage.getItem(key) || "[]")
      } catch {}
    }
  }
  return result
}

export function loadStats(): DayStats[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("rotineai_stats")
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

export function saveStats(stats: DayStats[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("rotineai_stats", JSON.stringify(stats))
}

export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}

export function formatTime(time: string): string {
  return time
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number)
  const total = h * 60 + m + minutes
  const newH = Math.floor(total / 60) % 24
  const newM = total % 60
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`
}

export function getCurrentTime(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
}

export function isActivityCurrent(activity: Activity): boolean {
  const now = getCurrentTime()
  const end = addMinutesToTime(activity.startTime, activity.duration)
  return now >= activity.startTime && now < end
}

export function isActivityPast(activity: Activity): boolean {
  const now = getCurrentTime()
  const end = addMinutesToTime(activity.startTime, activity.duration)
  return now >= end
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return "Bom dia"
  if (h >= 12 && h < 18) return "Boa tarde"
  return "Boa noite"
}

export function getGreetingEmoji(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return "☀️"
  if (h >= 12 && h < 18) return "🌤️"
  return "🌙"
}

export function formatDatePT(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

export const STREAK_KEY = "rotineai_streak"

export function loadStreak(): { count: number; lastDate: string } {
  if (typeof window === "undefined") return { count: 0, lastDate: "" }
  try {
    const stored = localStorage.getItem(STREAK_KEY)
    return stored ? JSON.parse(stored) : { count: 7, lastDate: getTodayDate() }
  } catch { return { count: 7, lastDate: getTodayDate() } }
}

export function saveStreak(data: { count: number; lastDate: string }): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STREAK_KEY, JSON.stringify(data))
}
