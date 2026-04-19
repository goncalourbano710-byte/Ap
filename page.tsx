"use client"

import { useState, useEffect } from "react"
import {
  Activity,
  UserProfile,
  loadProfile,
  saveProfile,
} from "@/lib/store"
import { PremiumState, loadPremium, isPremium } from "@/lib/premium"
import BottomNav, { Screen } from "@/components/BottomNav"
import OnboardingScreen from "@/components/screens/OnboardingScreen"
import ProfileSetupScreen from "@/components/screens/ProfileSetupScreen"
import DashboardScreen from "@/components/screens/DashboardScreen"
import WeekScreen from "@/components/screens/WeekScreen"
import AddTaskScreen from "@/components/screens/AddTaskScreen"
import AISuggestionScreen from "@/components/screens/AISuggestionScreen"
import StatsScreen from "@/components/screens/StatsScreen"
import SettingsScreen from "@/components/screens/SettingsScreen"
import PremiumModal from "@/components/PremiumModal"

type AppScreen =
  | "onboarding"
  | "profile-setup"
  | "dashboard"
  | "week"
  | "add-task"
  | "ai-suggest"
  | "stats"
  | "settings"

export default function App() {
  const [appScreen, setAppScreen] = useState<AppScreen>("onboarding")
  const [activeTab, setActiveTab] = useState<Screen>("dashboard")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editActivity, setEditActivity] = useState<Activity | null>(null)
  const [pendingActivity, setPendingActivity] = useState<Partial<Activity>>({})
  const [mounted, setMounted] = useState(false)
  const [premiumState, setPremiumState] = useState<PremiumState>({
    plan: "free",
    activatedAt: null,
    expiresAt: null,
    trialUsed: false,
  })
  const [showPremium, setShowPremium] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = loadProfile()
    setProfile(stored)
    if (stored.configured && stored.name) {
      setAppScreen("dashboard")
    }
    setPremiumState(loadPremium())
  }, [])

  // Apply theme
  useEffect(() => {
    if (!profile) return
    const theme = profile.theme
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else if (theme === "light") root.classList.remove("dark")
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) root.classList.add("dark")
      else root.classList.remove("dark")
    }
  }, [profile?.theme])

  const handleTabChange = (tab: Screen) => {
    setActiveTab(tab)
    if (tab === "add") {
      setEditActivity(null)
      setAppScreen("add-task")
    } else if (tab === "dashboard") {
      setAppScreen("dashboard")
    } else if (tab === "week") {
      setAppScreen("week")
    } else if (tab === "stats") {
      setAppScreen("stats")
    } else if (tab === "settings") {
      setAppScreen("settings")
    }
  }

  const showNavScreens: AppScreen[] = ["dashboard", "week", "stats", "settings"]
  const showNav = showNavScreens.includes(appScreen)

  const navActive: Screen =
    appScreen === "dashboard" ? "dashboard"
    : appScreen === "week" ? "week"
    : appScreen === "stats" ? "stats"
    : appScreen === "settings" ? "settings"
    : "add"

  if (!mounted) {
    return (
      <div className="min-h-screen gradient-onboarding flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center animate-pulse">
          <span className="text-2xl font-bold text-white">R</span>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen max-w-md mx-auto relative overflow-hidden bg-background">
      {/* Screens */}
      {appScreen === "onboarding" && (
        <OnboardingScreen
          onStart={() => setAppScreen("profile-setup")}
          onLogin={() => {
            const stored = loadProfile()
            if (stored.configured) {
              setProfile(stored)
              setAppScreen("dashboard")
            } else {
              setAppScreen("profile-setup")
            }
          }}
        />
      )}

      {appScreen === "profile-setup" && (
        <ProfileSetupScreen
          onComplete={(p) => {
            saveProfile(p)
            setProfile(p)
            setAppScreen("dashboard")
          }}
          onBack={() => setAppScreen("onboarding")}
        />
      )}

      {appScreen === "dashboard" && profile && (
        <DashboardScreen
          profile={profile}
          premiumState={premiumState}
          onAddTask={() => {
            setEditActivity(null)
            setAppScreen("add-task")
          }}
          onEditTask={(activity) => {
            setEditActivity(activity)
            setAppScreen("add-task")
          }}
          onOpenPremium={() => setShowPremium(true)}
        />
      )}

      {appScreen === "week" && <WeekScreen />}

      {appScreen === "add-task" && (
        <AddTaskScreen
          onBack={() => {
            setEditActivity(null)
            setAppScreen("dashboard")
            setActiveTab("dashboard")
          }}
          onSave={() => {
            setEditActivity(null)
            setAppScreen("dashboard")
            setActiveTab("dashboard")
          }}
          onAISuggest={(act) => {
            setPendingActivity(act)
            setAppScreen("ai-suggest")
          }}
          editActivity={editActivity}
          premiumState={premiumState}
          onOpenPremium={() => setShowPremium(true)}
        />
      )}

      {appScreen === "ai-suggest" && (
        <AISuggestionScreen
          activity={pendingActivity}
          onBack={() => setAppScreen("add-task")}
          onSelectTime={(startTime) => {
            setPendingActivity((p) => ({ ...p, startTime }))
            setAppScreen("add-task")
          }}
        />
      )}

      {appScreen === "stats" && <StatsScreen />}

      {appScreen === "settings" && profile && (
        <SettingsScreen
          profile={profile}
          premiumState={premiumState}
          onProfileUpdate={(p) => {
            setProfile(p)
            saveProfile(p)
          }}
          onLogout={() => {
            setProfile(null)
            setAppScreen("onboarding")
          }}
          onOpenPremium={() => setShowPremium(true)}
        />
      )}

      {/* Bottom Nav */}
      {showNav && (
        <BottomNav
          active={navActive}
          onChange={handleTabChange}
          premiumState={premiumState}
          onOpenPremium={() => setShowPremium(true)}
        />
      )}

      {/* Premium Modal */}
      {showPremium && (
        <PremiumModal
          initialPremium={premiumState}
          onClose={() => setShowPremium(false)}
          onActivate={(state) => {
            setPremiumState(state)
            setShowPremium(false)
          }}
        />
      )}
    </main>
  )
}
