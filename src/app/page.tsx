"use client"
import { TopBar } from "@/components/TopBar"
import { TabBar } from "@/components/TabBar"
import { OverviewTab } from "@/components/tabs/OverviewTab"
import { ChartTab } from "@/components/tabs/ChartTab"
import { ApprovalsTab } from "@/components/tabs/ApprovalsTab"
import { PositionsTab } from "@/components/tabs/PositionsTab"
import { MT5ConfigTab } from "@/components/tabs/MT5ConfigTab"
import { AnalyticsTab } from "@/components/tabs/AnalyticsTab"
import { useStore } from "@/store/useStore"

export default function Home() {
  const activeTab = useStore((s) => s.activeTab)

  return (
    <div className="flex flex-col h-full bg-void overflow-hidden"
      style={{backgroundImage:"radial-gradient(ellipse 70% 50% at 15% 0%,rgba(20,50,120,0.15) 0%,transparent 55%),radial-gradient(ellipse 50% 35% at 85% 100%,rgba(0,100,70,0.07) 0%,transparent 55%)"}}>
      <TopBar />
      <TabBar />
      <main className="flex-1 flex overflow-hidden min-h-0">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "chart" && <ChartTab />}
        {activeTab === "approvals" && <ApprovalsTab />}
        {activeTab === "positions" && <PositionsTab />}
        {activeTab === "mt5" && <MT5ConfigTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </main>
    </div>
  )
}
