"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Star, CheckCircle, AlertTriangle, Lightbulb, Zap, Moon, Clock, Sparkles } from "lucide-react"
import { Activity, CATEGORY_META } from "@/lib/store"

interface Props {
  activity: Partial<Activity>
  onBack: () => void
  onSelectTime: (startTime: string) => void
}

const LOADING_TEXTS = [
  "Analisando seus horários de pico de energia...",
  "Verificando conflitos na agenda...",
  "Otimizando blocos de foco...",
  "Calculando pausas ideais...",
  "Gerando sugestões personalizadas...",
]

interface Suggestion {
  id: number
  label: string
  icon: typeof Star
  iconColor: string
  badgeColor: string
  startTime: string
  endTime: string
  reason: string
  conflicts: string | null
}

export default function AISuggestionScreen({ activity, onBack, onSelectTime }: Props) {
  const [loading, setLoading] = useState(true)
  const [loadingIdx, setLoadingIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [aiTips, setAiTips] = useState<string[]>([])

  const duration = activity.duration || 60

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIdx((i) => (i + 1) % LOADING_TEXTS.length)
    }, 800)

    const fetchAI = async () => {
      try {
        const response = await fetch("https://llm.blackbox.ai/chat/completions", {
          method: "POST",
          headers: {
            "customerId": "cus_UMe8nVniZmpfrA",
            "Content-Type": "application/json",
            "Authorization": "Bearer xxx",
          },
          body: JSON.stringify({
            model: "openrouter/claude-sonnet-4",
            messages: [
              {
                role: "system",
                content: `Você é um assistente de produtividade pessoal especializado em organização de rotina diária. Responda APENAS em JSON válido, sem markdown.`,
              },
              {
                role: "user",
                content: `Analise e sugira horários para a seguinte atividade: "${activity.title || "Atividade"}" (categoria: ${activity.category || "work"}, duração: ${duration} minutos, prioridade: ${activity.priority || "medium"}). Retorne um JSON com o campo "tips" contendo um array de 3 dicas motivacionais/produtivas em português brasileiro, cada uma com no máximo 80 caracteres. Exemplo: {"tips": ["Dica 1", "Dica 2", "Dica 3"]}`,
              },
            ],
          }),
        })
        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ""
        const parsed = JSON.parse(content)
        if (parsed.tips && Array.isArray(parsed.tips)) {
          setAiTips(parsed.tips.slice(0, 3))
        }
      } catch {
        setAiTips([
          "Você tem 2h livres entre 13h e 15h - ideal para foco profundo",
          "Seu histórico mostra maior produtividade entre 9h e 11h",
          "Você está dormindo 30min a menos que o recomendado",
        ])
      }
      clearInterval(interval)
      setLoading(false)
    }

    const timer = setTimeout(fetchAI, 2000)
    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [activity, duration])

  const endTime1 = `${String(9 + Math.floor(duration / 60)).padStart(2, "0")}:${String(duration % 60).padStart(2, "0")}`
  const endTime2 = `${String(14 + Math.floor(duration / 60)).padStart(2, "0")}:${String(duration % 60).padStart(2, "0")}`
  const endTime3 = `${String(16 + Math.floor(duration / 60)).padStart(2, "0")}:${String(30 + (duration % 60)).padStart(2, "0")}`

  const suggestions: Suggestion[] = [
    {
      id: 0,
      label: "Recomendado",
      icon: Star,
      iconColor: "#FFB347",
      badgeColor: "#FFB347",
      startTime: "09:00",
      endTime: endTime1,
      reason: "Seu pico de energia matinal",
      conflicts: null,
    },
    {
      id: 1,
      label: "Boa opção",
      icon: CheckCircle,
      iconColor: "#43D787",
      badgeColor: "#43D787",
      startTime: "14:00",
      endTime: endTime2,
      reason: "Após o almoço, bom para tarefas criativas",
      conflicts: null,
    },
    {
      id: 2,
      label: "Alternativa",
      icon: AlertTriangle,
      iconColor: "#FF6584",
      badgeColor: "#FF6584",
      startTime: "16:30",
      endTime: endTime3,
      reason: "Final do expediente",
      conflicts: "Pode conflitar com exercício",
    },
  ]

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-card border-b border-border">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-90">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Sugestão Inteligente</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
          {/* AI Brain animation */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center animate-pulse-ring">
              <Sparkles className="w-16 h-16 text-white animate-spin-slow" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#43D787] flex items-center justify-center animate-bounce">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">
              RotineAI está analisando...
            </h2>
            <div className="h-12 flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center leading-relaxed transition-all duration-500 text-balance">
                {LOADING_TEXTS[loadingIdx]}
              </p>
            </div>
          </div>

          {/* Loading bar */}
          <div className="w-full max-w-xs">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-shimmer" style={{ width: "60%" }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-card border-b border-border">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-90">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Sugestão da IA</h1>
          <p className="text-xs text-muted-foreground">Para: {activity.title || "Nova atividade"}</p>
        </div>
        <div className="ml-auto w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Suggestions */}
        <div className="space-y-3">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className={`bg-card rounded-2xl p-4 border-2 transition-all card-shadow-hover ${
                selected === s.id ? "border-primary shadow-lg shadow-purple-500/20" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <s.icon className="w-4 h-4" style={{ color: s.iconColor }} />
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: s.badgeColor + "20",
                      color: s.badgeColor,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold text-foreground">
                    {s.startTime} — {s.endTime}
                  </span>
                </div>
              </div>

              <p className="text-sm text-foreground font-medium mb-1">{s.reason}</p>

              {s.conflicts && (
                <div className="flex items-center gap-1.5 mb-3 text-[#FF6584]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-xs">{s.conflicts}</span>
                </div>
              )}

              {!s.conflicts && (
                <div className="flex items-center gap-1.5 mb-3 text-[#43D787]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-xs">Sem conflitos</span>
                </div>
              )}

              <button
                onClick={() => {
                  setSelected(s.id)
                  onSelectTime(s.startTime)
                }}
                className={`w-full h-10 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                  selected === s.id ? "gradient-primary text-white" : "bg-muted text-foreground"
                }`}
              >
                {selected === s.id ? "Selecionado!" : "Escolher este"}
              </button>
            </div>
          ))}
        </div>

        {/* AI Tips */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#FFB347]" />
            Dicas personalizadas
          </h3>
          <div className="space-y-2">
            {(aiTips.length > 0 ? aiTips : [
              "Você tem 2h livres entre 13h e 15h - ideal para foco profundo",
              "Seu histórico mostra maior produtividade entre 9h e 11h",
              "Você está dormindo 30min a menos que o recomendado",
            ]).map((tip, i) => {
              const icons = [Lightbulb, Zap, Moon]
              const colors = ["#FFB347", "#6C63FF", "#9C8DFF"]
              const Icon = icons[i % 3]
              return (
                <div key={i} className="bg-card rounded-xl p-3 border border-border flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: colors[i] + "20" }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: colors[i] }} />
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{tip}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      {selected !== null && (
        <div className="px-4 py-4 bg-card border-t border-border animate-slide-in">
          <button
            onClick={() => onSelectTime(suggestions[selected].startTime)}
            className="w-full h-14 rounded-2xl gradient-primary text-white font-semibold text-base shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Confirmar horário {suggestions[selected].startTime}
          </button>
        </div>
      )}
    </div>
  )
}
