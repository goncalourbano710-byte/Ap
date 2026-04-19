"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Check, Clock } from "lucide-react"
import {
  loadActivities,
  CATEGORY_META,
  formatDuration,
  addMinutesToTime,
  Activity,
} from "@/lib/store"

const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

function getWeekDates(weekOffset = 0): Date[] {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) + weekOffset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0]
}

export default function WeekScreen() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [activities, setActivities] = useState<Activity[]>([])

  const weekDates = getWeekDates(weekOffset)
  const today = new Date()
  const todayStr = toDateStr(today)

  useEffect(() => {
    const acts = loadActivities(toDateStr(selectedDay))
    setActivities(acts)
  }, [selectedDay])

  const getCompletionForDay = (d: Date) => {
    const acts = loadActivities(toDateStr(d))
    const total = acts.length
    const done = acts.filter((a) => a.completed).length
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center active:scale-90"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <div className="text-center">
            <h1 className="text-base font-bold text-foreground">
              {weekOffset === 0
                ? "Esta semana"
                : weekOffset === -1
                ? "Semana passada"
                : weekOffset === 1
                ? "Próxima semana"
                : `Semana ${weekOffset > 0 ? "+" : ""}${weekOffset}`}
            </h1>
            <p className="text-xs text-muted-foreground">
              {DAYS_PT[weekDates[0].getDay()]} {weekDates[0].getDate()}{" "}
              {MONTHS_PT[weekDates[0].getMonth()]} —{" "}
              {DAYS_PT[weekDates[6].getDay()]} {weekDates[6].getDate()}{" "}
              {MONTHS_PT[weekDates[6].getMonth()]}
            </p>
          </div>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center active:scale-90"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Day selector */}
        <div className="flex gap-1.5">
          {weekDates.map((d) => {
            const isToday = toDateStr(d) === todayStr
            const isSelected = toDateStr(d) === toDateStr(selectedDay)
            const { pct, done, total } = getCompletionForDay(d)
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelectedDay(d)}
                className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all active:scale-90 ${
                  isSelected ? "gradient-primary shadow-sm" : isToday ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <span className={`text-[10px] font-medium ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                  {DAYS_PT[d.getDay()]}
                </span>
                <span className={`text-sm font-bold mt-0.5 ${isSelected ? "text-white" : isToday ? "text-primary" : "text-foreground"}`}>
                  {d.getDate()}
                </span>
                {/* Mini progress dots */}
                {total > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: Math.min(3, total) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{
                          background: i < Math.ceil((pct / 100) * 3)
                            ? (isSelected ? "white" : "#43D787")
                            : (isSelected ? "rgba(255,255,255,0.3)" : "var(--border)"),
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats for selected day */}
      {activities.length > 0 && (
        <div className="px-4 py-3">
          <div className="bg-card rounded-2xl p-3 border border-border card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {DAYS_PT[selectedDay.getDay()]},{" "}
                  {selectedDay.getDate()}{" "}
                  {MONTHS_PT[selectedDay.getMonth()]}
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {activities.filter((a) => a.completed).length}/{activities.length} tarefas concluídas
                </p>
              </div>
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke="#6C63FF" strokeWidth="3"
                    strokeDasharray={`${(activities.filter((a) => a.completed).length / activities.length) * 94.2} 94.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary">
                  {Math.round((activities.filter((a) => a.completed).length / activities.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity list for selected day */}
      <div className="px-4 flex-1 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="text-5xl">📅</div>
            <p className="text-base font-semibold text-foreground">Nenhuma atividade</p>
            <p className="text-sm text-muted-foreground text-center">
              Nenhuma atividade para este dia.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => {
              const meta = CATEGORY_META[activity.category]
              const endTime = addMinutesToTime(activity.startTime, activity.duration)
              return (
                <div
                  key={activity.id}
                  className={`bg-card rounded-2xl p-3 border card-shadow flex items-center gap-3 ${
                    activity.completed ? "opacity-60 border-border" : "border-border"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: (activity.color || meta.color) + "20" }}
                  >
                    {activity.completed ? <Check className="w-5 h-5 text-[#43D787]" strokeWidth={3} /> : activity.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${activity.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.startTime} – {endTime}
                      </span>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                        style={{ background: (activity.color || meta.color) + "20", color: activity.color || meta.color }}
                      >
                        {formatDuration(activity.duration)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
