"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Save, Sparkles, Check, Bell, BellOff, Lock, Crown } from "lucide-react"
import {
  Activity,
  Category,
  Priority,
  RepeatType,
  CATEGORY_META,
  loadActivities,
  saveActivities,
  getTodayDate,
  generateId,
} from "@/lib/store"
import { PremiumState, isPremium, FREE_LIMITS } from "@/lib/premium"

interface Props {
  onBack: () => void
  onSave: () => void
  onAISuggest: (activity: Partial<Activity>) => void
  editActivity?: Activity | null
  premiumState?: PremiumState
  onOpenPremium?: () => void
}

const PRIORITIES: { id: Priority; label: string; color: string }[] = [
  { id: "high", label: "Alta", color: "#FF5252" },
  { id: "medium", label: "Média", color: "#FFB347" },
  { id: "low", label: "Baixa", color: "#43D787" },
]

const REPEATS: { id: RepeatType; label: string }[] = [
  { id: "none", label: "Não repetir" },
  { id: "daily", label: "Diariamente" },
  { id: "weekdays", label: "Dias da semana" },
  { id: "weekends", label: "Fins de semana" },
  { id: "custom", label: "Personalizado" },
]

const COLORS = ["#6C63FF", "#FF6584", "#43D787", "#FFB347", "#4FC3F7", "#CE93D8", "#80DEEA", "#A5D6A7"]

const DAYS_PT = ["D", "S", "T", "Q", "Q", "S", "S"]

const EMOJIS: Record<Category, string> = {
  work: "💻", health: "🏃", food: "🍽️", social: "👨‍👩‍👧",
  leisure: "🎯", wellness: "🧘", learning: "📚", finance: "💰", tasks: "🔧",
}

export default function AddTaskScreen({ onBack, onSave, onAISuggest, editActivity, premiumState, onOpenPremium }: Props) {
  const today = getTodayDate()
  const userIsPremium = premiumState ? isPremium(premiumState) : false
  const existingCount = loadActivities(today).filter(a => !a.id.startsWith("default_")).length
  const atLimit = !userIsPremium && !editActivity && existingCount >= FREE_LIMITS.maxActivities

  const [title, setTitle] = useState(editActivity?.title || "")
  const [category, setCategory] = useState<Category>(editActivity?.category || "work")
  const [startTime, setStartTime] = useState(editActivity?.startTime || "09:00")
  const [duration, setDuration] = useState(editActivity?.duration || 60)
  const [priority, setPriority] = useState<Priority>(editActivity?.priority || "medium")
  const [repeat, setRepeat] = useState<RepeatType>(editActivity?.repeat || "none")
  const [repeatDays, setRepeatDays] = useState<number[]>(editActivity?.repeatDays || [1, 2, 3, 4, 5])
  const [reminder, setReminder] = useState(editActivity?.reminder || false)
  const [reminderTime, setReminderTime] = useState(editActivity?.reminderTime || "08:55")
  const [notes, setNotes] = useState(editActivity?.notes || "")
  const [color, setColor] = useState(editActivity?.color || CATEGORY_META[editActivity?.category || "work"].color)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!editActivity) setColor(CATEGORY_META[category].color)
  }, [category, editActivity])

  const formatDurationLabel = (m: number) => {
    if (m < 60) return `${m} min`
    const h = Math.floor(m / 60)
    const rem = m % 60
    return rem > 0 ? `${h}h ${rem}min` : `${h}h`
  }

  const toggleRepeatDay = (day: number) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    const activities = loadActivities(today)
    const emoji = EMOJIS[category]

    if (editActivity) {
      const updated = activities.map((a) =>
        a.id === editActivity.id
          ? { ...a, title, category, startTime, duration, priority, repeat, repeatDays, reminder, reminderTime, notes, color, emoji }
          : a
      )
      saveActivities(today, updated)
    } else {
      const newActivity: Activity = {
        id: generateId(),
        title,
        category,
        startTime,
        duration,
        priority,
        repeat,
        repeatDays,
        reminder,
        reminderTime,
        notes,
        color,
        emoji,
        completed: false,
        date: today,
      }
      const sorted = [...activities, newActivity].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      )
      saveActivities(today, sorted)
    }

    setTimeout(() => {
      setSaving(false)
      onSave()
    }, 400)
  }

  const handleAISuggest = () => {
    onAISuggest({ title, category, duration, priority })
  }

  const canSave = title.trim().length >= 2

  return (
    <div className="flex flex-col min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-card border-b border-border">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-90"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground flex-1">
          {editActivity ? "Editar atividade" : "Nova atividade"}
        </h1>
        <button
          onClick={handleAISuggest}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/15 text-primary text-xs font-semibold active:scale-90"
        >
          <Sparkles className="w-3.5 h-3.5" />
          IA
        </button>
      </div>

      {/* Free limit banner */}
      {atLimit && (
        <div className="mx-4 mt-4 rounded-2xl overflow-hidden border border-[#6C63FF]/30"
          style={{ background: "linear-gradient(135deg, #6C63FF15 0%, #FF658415 100%)" }}
        >
          <div className="p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-5 h-5 text-[#6C63FF]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Limite gratuito atingido</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Voce adicionou {existingCount} atividades personalizadas. O plano gratuito permite ate {FREE_LIMITS.maxActivities}.
                Assine o Premium para rotinas ilimitadas.
              </p>
              <button
                onClick={onOpenPremium}
                className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#6C63FF] to-[#9C8DFF] px-3 py-1.5 rounded-xl active:scale-95 transition-all"
              >
                <Crown className="w-3.5 h-3.5" />
                Assinar Premium
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Title */}
        <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
            Nome da atividade
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Exercício matinal, Reunião de trabalho..."
            className="w-full bg-transparent text-foreground text-base font-medium focus:outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Category */}
        <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
            Categoria
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
              const meta = CATEGORY_META[cat]
              const selected = category === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all active:scale-90 ${
                    selected ? "border-primary bg-primary/10" : "border-border bg-muted"
                  }`}
                >
                  <span className="text-xl">{meta.emoji}</span>
                  <span className={`text-[10px] font-medium text-center leading-tight ${selected ? "text-primary" : "text-muted-foreground"}`}>
                    {meta.label}
                  </span>
                  {selected && (
                    <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-2 h-2 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time & Duration */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
              Início
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-transparent text-foreground text-lg font-bold focus:outline-none"
            />
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
              Duração
            </label>
            <p className="text-lg font-bold text-foreground">{formatDurationLabel(duration)}</p>
            <input
              type="range" min={5} max={240} step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full mt-2"
              style={{ accentColor: "#6C63FF" }}
            />
          </div>
        </div>

        {/* Priority */}
        <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
            Prioridade
          </label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPriority(p.id)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-90 ${
                  priority === p.id ? "text-white shadow-lg" : "bg-muted text-muted-foreground"
                }`}
                style={priority === p.id ? { background: p.color } : {}}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Repeat */}
        <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
            Repetição
          </label>
          <div className="space-y-2">
            {REPEATS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRepeat(r.id)}
                className="flex items-center gap-3 w-full active:scale-98"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    repeat === r.id ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {repeat === r.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className={`text-sm font-medium ${repeat === r.id ? "text-primary" : "text-foreground"}`}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>

          {repeat === "custom" && (
            <div className="flex gap-1.5 mt-3 justify-center">
              {DAYS_PT.map((day, i) => (
                <button
                  key={i}
                  onClick={() => toggleRepeatDay(i)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all active:scale-90 ${
                    repeatDays.includes(i)
                      ? "gradient-primary text-white shadow-sm"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reminder */}
        <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {reminder ? <Bell className="w-4 h-4 text-primary" /> : <BellOff className="w-4 h-4 text-muted-foreground" />}
              <label className="text-sm font-semibold text-foreground">Lembrete</label>
            </div>
            <button
              onClick={() => setReminder((r) => !r)}
              className={`w-12 h-6 rounded-full transition-all ${reminder ? "bg-primary" : "bg-muted"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all mx-0.5 ${reminder ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
          {reminder && (
            <div className="mt-3">
              <label className="text-xs text-muted-foreground mb-1 block">Horário do lembrete</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-muted rounded-xl px-3 py-2 text-foreground text-base font-semibold focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Color */}
        <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
            Cor do bloco
          </label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-9 h-9 rounded-xl active:scale-90 flex items-center justify-center shadow-sm"
                style={{ background: c }}
              >
                {color === c && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
            Observações
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas adicionais..."
            rows={3}
            className="w-full bg-transparent text-foreground text-sm focus:outline-none resize-none placeholder:text-muted-foreground leading-relaxed"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="px-4 py-4 bg-card border-t border-border">
        {atLimit ? (
          <button
            onClick={onOpenPremium}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#9C8DFF] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Crown className="w-5 h-5" />
            Desbloquear com Premium
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="w-full h-14 rounded-2xl gradient-primary text-white font-semibold text-base shadow-lg shadow-purple-500/20 disabled:opacity-40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar atividade
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
