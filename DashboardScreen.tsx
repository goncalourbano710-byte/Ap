"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Edit2, Check, X, Clock, Flame, SmilePlus, ListChecks, Timer, ChevronRight, AlertCircle, RotateCcw, Crown, Zap } from "lucide-react"
import {
  Activity,
  UserProfile,
  CATEGORY_META,
  loadActivities,
  saveActivities,
  getTodayDate,
  formatDuration,
  getGreeting,
  getGreetingEmoji,
  formatDatePT,
  isActivityCurrent,
  isActivityPast,
  addMinutesToTime,
  loadStreak,
} from "@/lib/store"
import { PremiumState, isPremium } from "@/lib/premium"

const MOODS = ["😊", "😄", "😐", "😔", "😴", "🤩"]

interface Props {
  profile: UserProfile
  premiumState?: PremiumState
  onAddTask: () => void
  onEditTask: (activity: Activity) => void
  onOpenPremium?: () => void
}

export default function DashboardScreen({ profile, premiumState, onAddTask, onEditTask, onOpenPremium }: Props) {
  const userIsPremium = premiumState ? isPremium(premiumState) : false
  const [activities, setActivities] = useState<Activity[]>([])
  const [mood, setMood] = useState("😊")
  const [showMoodPicker, setShowMoodPicker] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [focusMinutes, setFocusMinutes] = useState(0)
  const [streak, setStreak] = useState(7)
  const today = getTodayDate()
  const todayDisplay = formatDatePT(new Date())
  const greeting = getGreeting()
  const greetingEmoji = getGreetingEmoji()
  const completedRef = useRef(false)

  useEffect(() => {
    const acts = loadActivities(today)
    setActivities(acts)
    const { count } = loadStreak()
    setStreak(count)
    const fm = acts.filter((a) => a.completed && (a.category === "work" || a.category === "learning")).reduce((s, a) => s + a.duration, 0)
    setFocusMinutes(fm)
  }, [today])

  const toggle = (id: string) => {
    setActivities((prev) => {
      const updated = prev.map((a) => a.id === id ? { ...a, completed: !a.completed } : a)
      saveActivities(today, updated)

      const completed = updated.filter((a) => a.completed).length
      const total = updated.length
      if (completed === total && total > 0 && !completedRef.current) {
        completedRef.current = true
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }

      const fm = updated.filter((a) => a.completed && (a.category === "work" || a.category === "learning")).reduce((s, a) => s + a.duration, 0)
      setFocusMinutes(fm)
      return updated
    })
  }

  const deleteActivity = (id: string) => {
    setActivities((prev) => {
      const updated = prev.filter((a) => a.id !== id)
      saveActivities(today, updated)
      return updated
    })
  }

  const reschedule = (id: string) => {
    setActivities((prev) => {
      const updated = prev.map((a) => a.id === id ? { ...a, completed: false } : a)
      saveActivities(today, updated)
      return updated
    })
  }

  const completed = activities.filter((a) => a.completed).length
  const total = activities.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0
  const focusHours = Math.floor(focusMinutes / 60)
  const focusMins = focusMinutes % 60

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                background: ["#6C63FF", "#FF6584", "#43D787", "#FFB347", "#4FC3F7"][i % 5],
                animation: `confetti-fall ${1.5 + Math.random() * 2}s linear ${Math.random() * 1}s forwards`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card rounded-3xl p-6 shadow-2xl text-center animate-bounce-in card-shadow mx-6">
              <div className="text-5xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-foreground">Incrível!</h3>
              <p className="text-muted-foreground text-sm mt-1">Você completou toda sua rotina hoje!</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {greeting}, {profile.name || "Usuário"}! {greetingEmoji}
            </h1>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">{todayDisplay}</p>
          </div>
          <div className="flex items-center gap-2">
            {userIsPremium ? (
              <div className="flex items-center gap-1 bg-gradient-to-r from-[#6C63FF] to-[#9C8DFF] rounded-xl px-2.5 py-1.5">
                <Crown className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-bold text-white">PRO</span>
              </div>
            ) : (
              <button
                onClick={onOpenPremium}
                className="flex items-center gap-1 bg-[#6C63FF]/10 border border-[#6C63FF]/30 rounded-xl px-2.5 py-1.5 active:scale-95 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-[#6C63FF]" />
                <span className="text-[10px] font-bold text-[#6C63FF]">Premium</span>
              </button>
            )}
            <button
              onClick={() => setShowMoodPicker(!showMoodPicker)}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg"
            >
              {mood}
            </button>
            <button className="relative w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary" />
            </button>
          </div>
        </div>

        {/* Mood picker */}
        {showMoodPicker && (
          <div className="flex gap-2 mt-2 animate-slide-in bg-muted rounded-xl p-2">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => { setMood(m); setShowMoodPicker(false) }}
                className={`text-xl p-1 rounded-lg transition-all active:scale-90 ${mood === m ? "bg-card shadow-sm scale-110" : ""}`}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-hide">
        {[
          {
            icon: ListChecks,
            label: "Tarefas hoje",
            value: `${completed}/${total}`,
            color: "#6C63FF",
            bg: "#6C63FF15",
          },
          {
            icon: Timer,
            label: "Foco acumulado",
            value: focusMinutes > 0 ? `${focusHours > 0 ? `${focusHours}h ` : ""}${focusMins}min` : "0min",
            color: "#43D787",
            bg: "#43D78715",
          },
          {
            icon: Flame,
            label: "Sequência",
            value: `🔥 ${streak} dias`,
            color: "#FFB347",
            bg: "#FFB34715",
          },
          {
            icon: SmilePlus,
            label: "Humor do dia",
            value: mood,
            color: "#FF6584",
            bg: "#FF658415",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-36 rounded-2xl p-3 card-shadow"
            style={{ background: card.bg, border: `1px solid ${card.color}25` }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: card.color + "25" }}>
              <card.icon className="w-4 h-4" style={{ color: card.color }} />
            </div>
            <p className="text-base font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="px-4 mb-4">
        <div className="bg-card rounded-2xl p-4 card-shadow">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground">Progresso do dia</span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: progress >= 100 ? "#43D787" : "linear-gradient(90deg, #6C63FF, #9C8DFF)",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {progress >= 100
              ? "Você completou toda sua rotina hoje!"
              : `Você completou ${progress}% da sua rotina hoje!`}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Linha do Tempo</h2>
          <button
            onClick={onAddTask}
            className="text-xs text-primary font-semibold flex items-center gap-1"
          >
            Adicionar <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="text-6xl">📋</div>
            <h3 className="text-lg font-bold text-foreground">Sua rotina está em branco!</h3>
            <div className="flex gap-3">
              <button
                onClick={onAddTask}
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold"
              >
                Adicionar manualmente
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="timeline-line opacity-30" />
            <div className="space-y-2 relative">
              {activities.map((activity, idx) => {
                const meta = CATEGORY_META[activity.category]
                const isCurrent = isActivityCurrent(activity)
                const isPast = isActivityPast(activity) && !activity.completed
                const endTime = addMinutesToTime(activity.startTime, activity.duration)

                return (
                  <div
                    key={activity.id}
                    className={`relative flex gap-3 items-start animate-slide-in`}
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* Time dot */}
                    <div className="flex flex-col items-center w-14 flex-shrink-0 pt-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 transition-all ${
                          activity.completed
                            ? "bg-[#43D787] shadow-lg shadow-green-500/30"
                            : isCurrent
                            ? "animate-pulse-ring"
                            : "bg-muted"
                        }`}
                        style={
                          activity.completed
                            ? {}
                            : isCurrent
                            ? { background: activity.color || meta.color, boxShadow: `0 0 0 0 ${activity.color || meta.color}40` }
                            : {}
                        }
                      >
                        {activity.completed ? (
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        ) : (
                          <span className="text-xs">{activity.emoji}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 font-medium">
                        {activity.startTime}
                      </span>
                    </div>

                    {/* Card */}
                    <div
                      className={`flex-1 rounded-2xl p-3 mb-1 transition-all card-shadow-hover ${
                        activity.completed
                          ? "bg-card opacity-60"
                          : isCurrent
                          ? "bg-card border-2"
                          : isPast
                          ? "bg-card border border-[#FF5252]/30"
                          : "bg-card border border-border"
                      }`}
                      style={
                        isCurrent && !activity.completed
                          ? { borderColor: activity.color || meta.color }
                          : {}
                      }
                    >
                      {/* Current indicator */}
                      {isCurrent && !activity.completed && (
                        <div
                          className="flex items-center gap-1 mb-1.5 text-xs font-semibold"
                          style={{ color: activity.color || meta.color }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          Em andamento
                        </div>
                      )}

                      {/* Past/overdue */}
                      {isPast && (
                        <div className="flex items-center gap-1 mb-1.5 text-xs font-semibold text-[#FF5252]">
                          <AlertCircle className="w-3 h-3" />
                          Atrasado
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold leading-tight ${
                              activity.completed ? "line-through text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {activity.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                              style={{
                                background: (activity.color || meta.color) + "20",
                                color: activity.color || meta.color,
                              }}
                            >
                              {meta.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {formatDuration(activity.duration)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              até {endTime}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {isPast && (
                            <button
                              onClick={() => reschedule(activity.id)}
                              className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center active:scale-90"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          )}
                          <button
                            onClick={() => onEditTask(activity)}
                            className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center active:scale-90"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => toggle(activity.id)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-all ${
                              activity.completed ? "bg-[#43D787]/20" : "bg-muted"
                            }`}
                          >
                            <Check
                              className={`w-3.5 h-3.5 transition-colors ${
                                activity.completed ? "text-[#43D787]" : "text-muted-foreground"
                              }`}
                              strokeWidth={activity.completed ? 3 : 1.5}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
