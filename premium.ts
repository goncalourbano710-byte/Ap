"use client"

export type PlanId = "free" | "monthly" | "annual" | "lifetime"

export interface PremiumState {
  plan: PlanId
  activatedAt: string | null
  expiresAt: string | null
  trialUsed: boolean
}

export interface Plan {
  id: PlanId
  name: string
  price: string
  priceNote: string
  period: string
  originalPrice?: string
  badge?: string
  badgeColor?: string
  description: string
  highlight: boolean
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Premium Mensal",
    price: "R$ 14,90",
    priceNote: "por mês",
    period: "monthly",
    description: "Acesso completo por 1 mês",
    highlight: false,
    features: [
      "Rotinas ilimitadas",
      "IA de sugestão avançada",
      "Relatórios detalhados",
      "Exportar PDF e Excel",
      "Temas exclusivos",
      "Suporte prioritário",
    ],
  },
  {
    id: "annual",
    name: "Premium Anual",
    price: "R$ 7,90",
    priceNote: "por mês",
    period: "annual",
    originalPrice: "R$ 178,80",
    badge: "Mais popular · 47% OFF",
    badgeColor: "#43D787",
    description: "Cobrado anualmente: R$ 94,90/ano",
    highlight: true,
    features: [
      "Tudo do Mensal",
      "Backup automático na nuvem",
      "Metas e desafios semanais",
      "Estatísticas de produtividade",
      "Integração com calendário",
      "Acesso antecipado a novidades",
    ],
  },
  {
    id: "lifetime",
    name: "Vitalício",
    price: "R$ 197,00",
    priceNote: "pagamento único",
    period: "lifetime",
    badge: "Melhor custo-benefício",
    badgeColor: "#6C63FF",
    description: "Acesso para sempre, sem mensalidades",
    highlight: false,
    features: [
      "Tudo do Anual",
      "Acesso vitalício",
      "Futuras atualizações incluídas",
      "Badge exclusivo de fundador",
      "Suporte VIP",
    ],
  },
]

export const FREE_LIMITS = {
  maxActivities: 5,
  aiSuggestions: 3,
  exportEnabled: false,
  advancedStats: false,
  cloudBackup: false,
  customThemes: false,
  weeklyGoals: false,
}

export const PREMIUM_FEATURES: { icon: string; title: string; desc: string }[] = [
  { icon: "✨", title: "Rotinas ilimitadas", desc: "Crie quantas atividades quiser sem restrições" },
  { icon: "🤖", title: "IA avançada", desc: "Sugestões inteligentes baseadas no seu histórico real" },
  { icon: "📊", title: "Relatórios completos", desc: "Análises detalhadas de produtividade e bem-estar" },
  { icon: "☁️", title: "Backup na nuvem", desc: "Seus dados seguros e sincronizados em qualquer dispositivo" },
  { icon: "🎯", title: "Metas semanais", desc: "Defina e acompanhe objetivos com desafios personalizados" },
  { icon: "📤", title: "Exportar dados", desc: "Baixe sua rotina em PDF ou planilha Excel" },
]

const PREMIUM_KEY = "rotineai_premium"

export function loadPremium(): PremiumState {
  if (typeof window === "undefined") {
    return { plan: "free", activatedAt: null, expiresAt: null, trialUsed: false }
  }
  try {
    const stored = localStorage.getItem(PREMIUM_KEY)
    if (!stored) return { plan: "free", activatedAt: null, expiresAt: null, trialUsed: false }
    return JSON.parse(stored)
  } catch {
    return { plan: "free", activatedAt: null, expiresAt: null, trialUsed: false }
  }
}

export function savePremium(state: PremiumState): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PREMIUM_KEY, JSON.stringify(state))
}

export function isPremium(state: PremiumState): boolean {
  if (state.plan === "free") return false
  if (state.plan === "lifetime") return true
  if (!state.expiresAt) return false
  return new Date(state.expiresAt) > new Date()
}

export function activatePlan(planId: PlanId): PremiumState {
  const now = new Date()
  let expiresAt: string | null = null

  if (planId === "monthly") {
    const exp = new Date(now)
    exp.setMonth(exp.getMonth() + 1)
    expiresAt = exp.toISOString()
  } else if (planId === "annual") {
    const exp = new Date(now)
    exp.setFullYear(exp.getFullYear() + 1)
    expiresAt = exp.toISOString()
  }

  const state: PremiumState = {
    plan: planId,
    activatedAt: now.toISOString(),
    expiresAt,
    trialUsed: true,
  }
  savePremium(state)
  return state
}

export function getPlanLabel(plan: PlanId): string {
  const map: Record<PlanId, string> = {
    free: "Gratuito",
    monthly: "Premium Mensal",
    annual: "Premium Anual",
    lifetime: "Vitalício",
  }
  return map[plan]
}

export function getExpiryLabel(state: PremiumState): string {
  if (state.plan === "free") return ""
  if (state.plan === "lifetime") return "Acesso vitalício"
  if (!state.expiresAt) return ""
  const exp = new Date(state.expiresAt)
  return `Válido até ${exp.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`
}
