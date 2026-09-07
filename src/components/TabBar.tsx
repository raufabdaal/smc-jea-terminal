"use client"
import { useStore } from "@/store/useStore"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "chart", label: "⬡ SMC Chart Terminal" },
  { id: "approvals", label: "Trade Approvals", badge: "approvals" },
  { id: "positions", label: "Active Positions", badge: "positions" },
  { id: "mt5", label: "Exness MT5 Config" },
  { id: "analytics", label: "Analytics" },
]

export function TabBar() {
  const activeTab = useStore((s) => s.activeTab)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const signals = useStore((s) => s.signals)
  const positions = useStore((s) => s.positions)

  const pendingCount = signals.filter((s) => s.status === "pending").length
  const posCount = positions.length

  return (
    <nav className="flex-shrink-0 h-10 flex items-stretch bg-deep/95 border-b border-border-subtle px-5 gap-0.5 z-40">
      {TABS.map((tab) => {
        const count = tab.badge === "approvals" ? pendingCount : tab.badge === "positions" ? posCount : 0
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 text-[10px] font-semibold tracking-[0.5px] border-b-2 transition-all duration-150 whitespace-nowrap select-none",
              activeTab === tab.id
                ? "text-accent-blue border-accent-blue"
                : "text-text-muted border-transparent hover:text-text-secondary"
            )}
          >
            {tab.label}
            {count > 0 && (
              <span className={cn(
                "px-1 py-0.5 rounded text-[8px] font-extrabold",
                tab.badge === "approvals"
                  ? "bg-accent-red/10 text-accent-red border border-accent-red/30"
                  : "bg-accent-green/10 text-accent-green border border-accent-green/30"
              )}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
