"use client"

import { useState, useEffect } from "react"
import { Sparkles, Calendar, TrendingUp, Bell } from "lucide-react"

interface Props {
  onStart: () => void
  onLogin: () => void
}

const features = [
  { icon: Calendar, text: "Rotina personalizada por IA" },
  { icon: TrendingUp, text: "Acompanhe seu progresso" },
  { icon: Bell, text: "Lembretes inteligentes" },
  { icon: Sparkles, text: "Sugestões automáticas" },
]

export default function OnboardingScreen({ onStart, onLogin }: Props) {
  const [visible, setVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100)
    const t2 = setTimeout(() => setFeaturesVisible(true), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="min-h-screen gradient-onboarding flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-8 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-4 w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-32 left-12 w-3 h-3 rounded-full bg-purple-400/40 animate-pulse" />
      <div className="absolute top-48 right-16 w-2 h-2 rounded-full bg-pink-400/40 animate-pulse" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-60 right-8 w-4 h-4 rounded-full bg-indigo-400/30 animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Top spacer */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full max-w-sm">
        {/* Logo */}
        <div
          className={`flex flex-col items-center gap-4 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* App icon */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-2xl animate-pulse-ring">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#43D787] flex items-center justify-center">
              <span className="text-xs text-white font-bold">AI</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Rotine<span className="text-[#9C8DFF]">AI</span>
            </h1>
            <p className="text-white/70 text-base mt-2 font-medium leading-relaxed text-balance">
              Sua rotina, organizada com inteligência
            </p>
          </div>
        </div>

        {/* Features list */}
        <div
          className={`w-full space-y-3 mt-4 transition-all duration-700 ${
            featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 glass rounded-2xl px-4 py-3"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-9 h-9 rounded-xl bg-[#6C63FF]/30 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-4 h-4 text-[#9C8DFF]" />
              </div>
              <span className="text-white/85 text-sm font-medium">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div
        className={`w-full max-w-sm space-y-3 transition-all duration-700 delay-700 ${
          featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <button
          onClick={onStart}
          className="w-full h-14 rounded-2xl gradient-primary text-white font-semibold text-base shadow-lg shadow-purple-500/30 active:scale-95 transition-transform"
        >
          Começar agora
        </button>
        <button
          onClick={onLogin}
          className="w-full h-14 rounded-2xl glass text-white/80 font-medium text-base border border-white/20 active:scale-95 transition-transform"
        >
          Já tenho conta — Entrar
        </button>
        <p className="text-center text-white/40 text-xs mt-2">
          Grátis para sempre. Sem cartão de crédito.
        </p>
      </div>
    </div>
  )
}
