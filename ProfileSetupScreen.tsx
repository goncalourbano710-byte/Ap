"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, User, Clock, Target, Zap, Check } from "lucide-react"
import { UserProfile, DEFAULT_PROFILE } from "@/lib/store"

interface Props {
  onComplete: (profile: UserProfile) => void
  onBack: () => void
}

const GOALS = [
  { id: "productivity", label: "Produtividade", emoji: "🚀" },
  { id: "health", label: "Saúde e exercícios", emoji: "💪" },
  { id: "learning", label: "Aprendizado", emoji: "📚" },
  { id: "leisure", label: "Lazer e descanso", emoji: "🎮" },
  { id: "family", label: "Família e social", emoji: "👨‍👩‍👧" },
  { id: "finance", label: "Finanças pessoais", emoji: "💰" },
]

const STEPS = [
  { id: "name", title: "Olá! Como posso te chamar?", icon: User },
  { id: "schedule", title: "Qual é o seu horário?", icon: Clock },
  { id: "goals", title: "Quais são seus objetivos?", icon: Target },
  { id: "energy", title: "Seu nível de energia matinal", icon: Zap },
]

export default function ProfileSetupScreen({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<UserProfile>({ ...DEFAULT_PROFILE })

  const toggleGoal = (id: string) => {
    setProfile((p) => ({
      ...p,
      goals: p.goals.includes(id) ? p.goals.filter((g) => g !== id) : [...p.goals, id],
    }))
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      onComplete({ ...profile, configured: true })
    }
  }

  const handleBack = () => {
    if (step === 0) onBack()
    else setStep((s) => s - 1)
  }

  const canContinue = () => {
    if (step === 0) return profile.name.trim().length >= 2
    if (step === 2) return profile.goals.length > 0
    return true
  }

  const StepIcon = STEPS[step].icon
  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex gap-1.5 mb-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{ background: i <= step ? "#6C63FF" : "var(--border)" }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Passo {step + 1} de {STEPS.length}
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {/* Step header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
            <StepIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground text-balance">
            {STEPS[step].title}
          </h2>
        </div>

        {/* Step 0 - Name */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in-up">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="Digite seu nome..."
              className="w-full h-14 px-4 rounded-2xl border-2 border-border bg-card text-foreground text-base font-medium focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
              autoFocus
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vamos personalizar sua experiência com base nas suas preferências.
            </p>
          </div>
        )}

        {/* Step 1 - Schedule */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-2xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Acorda</p>
                <input
                  type="time"
                  value={profile.wakeTime}
                  onChange={(e) => setProfile((p) => ({ ...p, wakeTime: e.target.value }))}
                  className="w-full bg-transparent text-foreground text-lg font-bold focus:outline-none"
                />
              </div>
              <div className="bg-card rounded-2xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Dorme</p>
                <input
                  type="time"
                  value={profile.sleepTime}
                  onChange={(e) => setProfile((p) => ({ ...p, sleepTime: e.target.value }))}
                  className="w-full bg-transparent text-foreground text-lg font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 border border-border">
              <p className="text-sm font-semibold text-foreground mb-3">Horário de trabalho/estudo</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Início</p>
                  <input
                    type="time"
                    value={profile.workStart}
                    onChange={(e) => setProfile((p) => ({ ...p, workStart: e.target.value }))}
                    className="w-full bg-transparent text-foreground text-base font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fim</p>
                  <input
                    type="time"
                    value={profile.workEnd}
                    onChange={(e) => setProfile((p) => ({ ...p, workEnd: e.target.value }))}
                    className="w-full bg-transparent text-foreground text-base font-semibold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 - Goals */}
        {step === 2 && (
          <div className="space-y-3 animate-fade-in-up">
            <p className="text-sm text-muted-foreground">Selecione todos que se aplicam</p>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((goal) => {
                const selected = profile.goals.includes(goal.id)
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-2xl">{goal.emoji}</span>
                    <span className={`text-xs font-medium text-center leading-tight ${selected ? "text-primary" : "text-foreground"}`}>
                      {goal.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3 - Energy */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex justify-between mb-4">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setProfile((p) => ({ ...p, energyLevel: level }))}
                    className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
                      profile.energyLevel >= level ? "opacity-100 scale-110" : "opacity-40"
                    }`}
                  >
                    <span className="text-3xl">
                      {level === 1 ? "😴" : level === 2 ? "😐" : level === 3 ? "😊" : level === 4 ? "😄" : "🚀"}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">{level}</span>
                  </button>
                ))}
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={profile.energyLevel}
                onChange={(e) => setProfile((p) => ({ ...p, energyLevel: Number(e.target.value) }))}
                className="w-full"
                style={{ accentColor: "#6C63FF" }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Baixa energia</span>
                <span>Alta energia</span>
              </div>
            </div>

            <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
              <p className="text-sm font-semibold text-primary mb-1">
                Nível selecionado: {profile.energyLevel}/5
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {profile.energyLevel <= 2
                  ? "Vamos programar tarefas leves de manhã e foco máximo ao longo do dia."
                  : profile.energyLevel <= 3
                  ? "Ótimo! Distribuiremos suas tarefas importantes na parte da manhã."
                  : "Perfeito! Suas tarefas mais desafiadoras serão agendadas logo cedo."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={handleNext}
          disabled={!canContinue()}
          className="w-full h-14 rounded-2xl gradient-primary text-white font-semibold text-base shadow-lg shadow-purple-500/20 disabled:opacity-40 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {step === STEPS.length - 1 ? (
            <>
              <Zap className="w-5 h-5" />
              Gerar minha rotina automaticamente
            </>
          ) : (
            <>
              Continuar
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
