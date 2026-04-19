"use client"

import { useState } from "react"
import {
  User, Clock, Bell, Palette, Database, ChevronRight,
  Moon, Sun, Monitor, Timer, Check, Trash2, Download, LogOut,
  Crown, Lock, Sparkles, Star,
} from "lucide-react"
import { UserProfile, saveProfile } from "@/lib/store"
import { PremiumState, isPremium, getPlanLabel, getExpiryLabel } from "@/lib/premium"
import PaywallGate from "@/components/PaywallGate"

interface Props {
  profile: UserProfile
  premiumState: PremiumState
  onProfileUpdate: (profile: UserProfile) => void
  onLogout: () => void
  onOpenPremium: () => void
}

const COLORS = ["#6C63FF", "#FF6584", "#43D787", "#FFB347", "#4FC3F7", "#CE93D8"]

type Section = null | "profile" | "routine" | "notifications" | "appearance" | "data"

const Toggle = ({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) => (
  <button
    onClick={() => onChange(!value)}
    className={`w-12 h-6 rounded-full transition-all flex-shrink-0 ${value ? "bg-primary" : "bg-muted"}`}
  >
    <div
      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all mx-0.5 ${value ? "translate-x-6" : "translate-x-0"}`}
    />
  </button>
)

export default function SettingsScreen({ profile, premiumState, onProfileUpdate, onLogout, onOpenPremium }: Props) {
  const [local, setLocal] = useState<UserProfile>({ ...profile })
  const [openSection, setOpenSection] = useState<Section>("profile")
  const [saved, setSaved] = useState(false)
  const userIsPremium = isPremium(premiumState)

  const update = (changes: Partial<UserProfile>) => {
    setLocal((p) => ({ ...p, ...changes }))
  }

  const handleSave = () => {
    saveProfile(local)
    onProfileUpdate(local)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const SectionHeader = ({
    id,
    icon: Icon,
    title,
    color,
  }: {
    id: Section
    icon: typeof User
    title: string
    color: string
  }) => (
    <button
      onClick={() => setOpenSection(openSection === id ? null : id)}
      className="flex items-center gap-3 w-full"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + "20" }}>
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>
      <span className="text-sm font-semibold text-foreground flex-1 text-left">{title}</span>
      <ChevronRight
        className={`w-4 h-4 text-muted-foreground transition-transform ${openSection === id ? "rotate-90" : ""}`}
      />
    </button>
  )

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Configurações</h1>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-90 ${
              saved ? "bg-[#43D787]/20 text-[#43D787]" : "gradient-primary text-white shadow-sm"
            }`}
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            {saved ? "Salvo!" : "Salvar"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* Premium Banner */}
        {userIsPremium ? (
          <button
            onClick={onOpenPremium}
            className="w-full rounded-2xl p-4 text-left relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #9C8DFF 60%, #FF6584 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Premium Ativo</p>
                <p className="text-[11px] text-white/80 mt-0.5">{getPlanLabel(premiumState.plan)}</p>
                <p className="text-[10px] text-white/60 mt-0.5">{getExpiryLabel(premiumState)}</p>
              </div>
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
                <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                <span className="text-[10px] font-bold text-white">PRO</span>
              </div>
            </div>
            <div
              className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full bg-white/10"
              aria-hidden
            />
          </button>
        ) : (
          <button
            onClick={onOpenPremium}
            className="w-full rounded-2xl p-4 text-left relative overflow-hidden border-2 border-dashed border-[#6C63FF]/40"
            style={{ background: "linear-gradient(135deg, #6C63FF10 0%, #FF658410 100%)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#6C63FF]/15 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-[#6C63FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">Assine o Premium</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Desbloqueie IA avancada, relatorios e muito mais
                </p>
              </div>
              <div className="bg-gradient-to-r from-[#6C63FF] to-[#9C8DFF] rounded-xl px-3 py-1.5">
                <span className="text-[11px] font-bold text-white">Ver planos</span>
              </div>
            </div>
          </button>
        )}

        {/* Profile */}
        <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
          <div className="p-4">
            <SectionHeader id="profile" icon={User} title="Perfil" color="#6C63FF" />
          </div>
          {openSection === "profile" && (
            <div className="px-4 pb-4 space-y-3 border-t border-border pt-3 animate-slide-in">
              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-white">
                  {local.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{local.name || "Usuário"}</p>
                  <p className="text-xs text-muted-foreground">Membro desde hoje</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1 block">Nome</label>
                <input
                  type="text"
                  value={local.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-muted text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Routine */}
        <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
          <div className="p-4">
            <SectionHeader id="routine" icon={Clock} title="Rotina" color="#43D787" />
          </div>
          {openSection === "routine" && (
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-3 animate-slide-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Acorda</label>
                  <input
                    type="time"
                    value={local.wakeTime}
                    onChange={(e) => update({ wakeTime: e.target.value })}
                    className="w-full bg-muted rounded-xl px-3 py-2 text-foreground text-sm font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Dorme</label>
                  <input
                    type="time"
                    value={local.sleepTime}
                    onChange={(e) => update({ sleepTime: e.target.value })}
                    className="w-full bg-muted rounded-xl px-3 py-2 text-foreground text-sm font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Pausas automáticas</p>
                  <p className="text-xs text-muted-foreground">Inserir pausas na rotina</p>
                </div>
                <Toggle value={local.pausesEnabled} onChange={(v) => update({ pausesEnabled: v })} />
              </div>

              {userIsPremium ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Tecnica Pomodoro</p>
                    <p className="text-xs text-muted-foreground">25min foco + 5min pausa</p>
                  </div>
                  <Toggle value={local.pomodoroEnabled} onChange={(v) => update({ pomodoroEnabled: v })} />
                </div>
              ) : (
                <div className="flex items-center justify-between opacity-60">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-foreground">Tecnica Pomodoro</p>
                      <Lock className="w-3 h-3 text-[#6C63FF]" />
                    </div>
                    <p className="text-xs text-muted-foreground">Disponivel no Premium</p>
                  </div>
                  <button
                    onClick={onOpenPremium}
                    className="text-[10px] font-bold text-[#6C63FF] bg-[#6C63FF]/10 px-2.5 py-1 rounded-lg"
                  >
                    Premium
                  </button>
                </div>
              )}

              {local.pomodoroEnabled && userIsPremium && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Duração do foco: {local.pomodoroDuration}min
                  </label>
                  <input
                    type="range" min={15} max={60} step={5}
                    value={local.pomodoroDuration}
                    onChange={(e) => update({ pomodoroDuration: Number(e.target.value) })}
                    className="w-full"
                    style={{ accentColor: "#6C63FF" }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15min</span><span>60min</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
          <div className="p-4">
            <SectionHeader id="notifications" icon={Bell} title="Notificações" color="#FFB347" />
          </div>
          {openSection === "notifications" && (
            <div className="px-4 pb-4 space-y-3 border-t border-border pt-3 animate-slide-in">
              {[
                { key: "reminderStart" as const, label: "Início de atividade", desc: "Avisa quando começar" },
                { key: "morningReport" as const, label: "Resumo matinal", desc: "Resumo do dia pela manhã" },
                { key: "nightReport" as const, label: "Relatório noturno", desc: "Resumo do dia à noite" },
                { key: "dailyMotivation" as const, label: "Motivação diária", desc: "Mensagem inspiracional" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Toggle
                    value={local[item.key] as boolean}
                    onChange={(v) => update({ [item.key]: v })}
                  />
                </div>
              ))}

              {local.morningReport && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Horário resumo matinal</label>
                  <input
                    type="time"
                    value={local.morningReportTime}
                    onChange={(e) => update({ morningReportTime: e.target.value })}
                    className="w-full bg-muted rounded-xl px-3 py-2 text-foreground text-sm font-semibold focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Appearance */}
        <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
          <div className="p-4">
            <SectionHeader id="appearance" icon={Palette} title="Aparência" color="#FF6584" />
          </div>
          {openSection === "appearance" && (
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-3 animate-slide-in">
              {/* Theme */}
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-2 block">Tema</label>
                <div className="flex gap-2">
                  {[
                    { id: "light", icon: Sun, label: "Claro" },
                    { id: "dark", icon: Moon, label: "Escuro" },
                    { id: "auto", icon: Monitor, label: "Auto" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => update({ theme: t.id as "light" | "dark" | "auto" })}
                      className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all active:scale-90 ${
                        local.theme === t.id ? "border-primary bg-primary/10" : "border-border bg-muted"
                      }`}
                    >
                      <t.icon className={`w-4 h-4 ${local.theme === t.id ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs font-medium ${local.theme === t.id ? "text-primary" : "text-muted-foreground"}`}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-2 block">Cor principal</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => update({ primaryColor: c })}
                      className="w-9 h-9 rounded-xl active:scale-90 flex items-center justify-center shadow-sm"
                      style={{ background: c }}
                    >
                      {local.primaryColor === c && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font size */}
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-2 block">Tamanho da fonte</label>
                <div className="flex gap-2">
                  {[
                    { id: "sm", label: "A", size: "text-xs" },
                    { id: "md", label: "A", size: "text-sm" },
                    { id: "lg", label: "A", size: "text-base" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => update({ fontSize: f.id as "sm" | "md" | "lg" })}
                      className={`flex-1 py-2.5 rounded-xl border transition-all active:scale-90 font-bold ${f.size} ${
                        local.fontSize === f.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Data */}
        <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
          <div className="p-4">
            <SectionHeader id="data" icon={Database} title="Dados" color="#80DEEA" />
          </div>
          {openSection === "data" && (
            <div className="px-4 pb-4 space-y-2 border-t border-border pt-3 animate-slide-in">
              {userIsPremium ? (
                <>
                  {[
                    { icon: Download, label: "Exportar rotina (PDF)", color: "#6C63FF", action: () => {} },
                    { icon: Timer, label: "Backup na nuvem", color: "#43D787", action: () => {} },
                    { icon: Trash2, label: "Limpar historico", color: "#FF5252", action: () => {
                      if (confirm("Tem certeza? Isso apagara todo o historico.")) {
                        Object.keys(localStorage).filter(k => k.startsWith("rotineai_activities_")).forEach(k => localStorage.removeItem(k))
                      }
                    }},
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={item.action}
                      className="flex items-center gap-3 w-full p-3 rounded-xl bg-muted active:scale-95 transition-all"
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <PaywallGate
                    featureName="Exportar rotina (PDF / Excel)"
                    description="Baixe sua rotina completa em PDF ou planilha. Disponivel no plano Premium."
                    onUpgrade={onOpenPremium}
                  />
                  <PaywallGate
                    featureName="Backup automatico na nuvem"
                    description="Seus dados sincronizados e seguros em qualquer dispositivo. Disponivel no plano Premium."
                    onUpgrade={onOpenPremium}
                  />
                  <button
                    onClick={() => {
                      if (confirm("Tem certeza? Isso apagara todo o historico.")) {
                        Object.keys(localStorage).filter(k => k.startsWith("rotineai_activities_")).forEach(k => localStorage.removeItem(k))
                      }
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-xl bg-muted active:scale-95 transition-all"
                  >
                    <Trash2 className="w-4 h-4 flex-shrink-0 text-[#FF5252]" />
                    <span className="text-sm font-medium text-foreground">Limpar historico</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 bg-[#FF5252]/10 rounded-2xl p-4 border border-[#FF5252]/20 active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4 text-[#FF5252]" />
          <span className="text-sm font-semibold text-[#FF5252]">Sair da conta</span>
        </button>

        {/* Version */}
        <div className="flex items-center justify-center gap-2 py-2">
          <p className="text-xs text-muted-foreground">RotineAI v1.0.0</p>
          {userIsPremium && (
            <span className="text-[10px] font-bold text-white bg-gradient-to-r from-[#6C63FF] to-[#9C8DFF] px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-2.5 h-2.5" />
              PREMIUM
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
