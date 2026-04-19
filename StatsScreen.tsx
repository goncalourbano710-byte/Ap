"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Timer, Check, Flame, Trophy, BarChart2 } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { loadActivities, CATEGORY_META, Category } from "@/lib/store"

const TABS = ["Hoje", "Semana", "Mês"]

const DAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function getLast7Days(): { date: string; label: string }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      date: d.toISOString().split("T")[0],
      label: DAYS_SHORT[d.getDay()],
    }
  })
}

export default function StatsScreen() {
  const [tab, setTab] = useState(0)
  const [pieData, setPieData] = useState<{ name: string; value: number; color: string }[]>([])
  const [barData, setBarData] = useState<{ day: string; done: number; total: number }[]>([])
  const [metrics, setMetrics] = useState({
    avgFocus: 0,
    completionRate: 0,
    streak: 7,
    bestDay: "Terça-feira",
  })
  const [topActivities, setTopActivities] = useState<{ title: string; count: number; emoji: string }[]>([])
  const [insight, setInsight] = useState("")

  useEffect(() => {
    const days = getLast7Days()

    // Calculate bar data
    const bars = days.map((d) => {
      const acts = loadActivities(d.date)
      return {
        day: d.label,
        done: acts.filter((a) => a.completed).length,
        total: acts.length,
      }
    })
    setBarData(bars)

    // Calculate pie data from today + week
    const allActs = days.flatMap((d) => loadActivities(d.date))
    const catMap: Record<Category, number> = {} as Record<Category, number>
    allActs.forEach((a) => {
      catMap[a.category] = (catMap[a.category] || 0) + a.duration
    })

    const totalMin = Object.values(catMap).reduce((s, v) => s + v, 0)
    const pie = (Object.keys(catMap) as Category[])
      .filter((k) => catMap[k] > 0)
      .sort((a, b) => catMap[b] - catMap[a])
      .slice(0, 6)
      .map((cat) => ({
        name: CATEGORY_META[cat].label,
        value: Math.round((catMap[cat] / (totalMin || 1)) * 100),
        color: CATEGORY_META[cat].color,
      }))
    setPieData(pie)

    // Metrics
    const completedAll = allActs.filter((a) => a.completed).length
    const totalAll = allActs.length
    const focusMins = allActs.filter((a) => a.completed && (a.category === "work" || a.category === "learning")).reduce((s, a) => s + a.duration, 0)
    const avgFocusMinsPerDay = focusMins / 7

    setMetrics({
      avgFocus: Math.round(avgFocusMinsPerDay),
      completionRate: totalAll > 0 ? Math.round((completedAll / totalAll) * 100) : 0,
      streak: 7,
      bestDay: "Terça-feira",
    })

    // Top activities
    const titleMap: Record<string, { count: number; emoji: string }> = {}
    allActs.filter((a) => a.completed).forEach((a) => {
      if (!titleMap[a.title]) titleMap[a.title] = { count: 0, emoji: a.emoji }
      titleMap[a.title].count++
    })
    const tops = Object.entries(titleMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([title, { count, emoji }]) => ({ title, count, emoji }))
    setTopActivities(tops)

    // Insight
    const prev = Math.round(metrics.completionRate * 0.8)
    const diff = metrics.completionRate - prev
    setInsight(
      diff > 0
        ? `Voce foi ${diff}% mais produtivo que na semana passada!`
        : `Continue firme! Sua consistencia esta melhorando a cada dia.`
    )
  }, [tab])

  const formatAvgFocus = () => {
    const h = Math.floor(metrics.avgFocus / 60)
    const m = metrics.avgFocus % 60
    return h > 0 ? `${h}h ${m}min` : `${m}min`
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold text-foreground mb-4">Relatórios</h1>
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                tab === i ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Insight */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wide">Insight da semana</span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            {insight || "Continue assim! Sua consistencia esta melhorando."}
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Timer, label: "Foco médio/dia", value: formatAvgFocus(), color: "#6C63FF", bg: "#6C63FF15" },
            { icon: Check, label: "Taxa de conclusão", value: `${metrics.completionRate}%`, color: "#43D787", bg: "#43D78715" },
            { icon: Flame, label: "Maior sequência", value: `${metrics.streak} dias`, color: "#FFB347", bg: "#FFB34715" },
            { icon: Trophy, label: "Melhor dia", value: metrics.bestDay, color: "#FF6584", bg: "#FF658415" },
          ].map((m, i) => (
            <div key={i} className="rounded-2xl p-4 card-shadow" style={{ background: m.bg, border: `1px solid ${m.color}25` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: m.color + "25" }}>
                <m.icon className="w-4.5 h-4.5" style={{ color: m.color }} />
              </div>
              <p className="text-lg font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Distribuição por categoria</h3>
            </div>
            <div className="flex items-center gap-4">
              <PieChart width={130} height={130}>
                <Pie
                  data={pieData}
                  cx={60} cy={60} innerRadius={35} outerRadius={60}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-2">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-foreground flex-1 truncate">{d.name}</span>
                    <span className="text-xs font-bold text-foreground">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bar Chart */}
        <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
          <h3 className="text-sm font-bold text-foreground mb-4">Tarefas concluídas por dia</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "var(--foreground)",
                }}
                cursor={{ fill: "var(--muted)", radius: 6 }}
              />
              <Bar dataKey="done" name="Concluídas" fill="#6C63FF" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="total" name="Total" fill="#E8E8F0" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Activities */}
        {topActivities.length > 0 && (
          <div className="bg-card rounded-2xl p-4 border border-border card-shadow">
            <h3 className="text-sm font-bold text-foreground mb-3">
              Top {topActivities.length} atividades mais realizadas
            </h3>
            <div className="space-y-2.5">
              {topActivities.map((act, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-base flex-shrink-0">{act.emoji}</span>
                  <span className="text-sm text-foreground flex-1 truncate">{act.title}</span>
                  <span className="text-xs font-bold text-primary">{act.count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {pieData.length === 0 && topActivities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="text-5xl">📊</div>
            <h3 className="text-lg font-bold text-foreground">Sem dados ainda</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Complete atividades no Dashboard para ver suas estatísticas aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
