"use client"
import { useStore } from "@/store/useStore"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

const PAIRS = [
  { name: "XAU/USD", price: "2,648.34", chg: "+0.42%", up: true, bias: "bull", pill: "sp", pillLabel: "Pending Approval", sig: true },
  { name: "EUR/USD", price: "1.08712", chg: "+0.18%", up: true, bias: "bull", pill: "sl", pillLabel: "Limit Placed" },
  { name: "GBP/USD", price: "1.26438", chg: "-0.11%", up: false, bias: "bear", pill: "st", pillLabel: "In Trade" },
  { name: "GBP/JPY", price: "191.24", chg: "+0.33%", up: true, bias: "bull", pill: "", pillLabel: "Monitoring" },
  { name: "USO/IL", price: "83.41", chg: "-0.29%", up: false, bias: "bear", pill: "", pillLabel: "HTF Range" },
  { name: "BTC/USD", price: "96,840", chg: "+1.24%", up: true, bias: "bull", pill: "st", pillLabel: "In Trade" },
]

const CONTEXT = [
  { label: "DXY", val: "104.38", sub: "Consolidating", color: "text-text-secondary" },
  { label: "US 10Y", val: "4.42%", sub: "Falling", color: "text-accent-red" },
  { label: "EUR/USD", val: "+0.18%", sub: "USD weak", color: "text-accent-green" },
  { label: "VIX", val: "14.8", sub: "Low Vol", color: "text-text-secondary" },
  { label: "BTC", val: "+1.24%", sub: "Risk-On", color: "text-accent-green" },
  { label: "Session", val: "London", sub: "NY opening", color: "text-accent-green" },
]

export function OverviewTab() {
  const mt5 = useStore((s) => s.mt5Config)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const positions = useStore((s) => s.positions)
  const signals = useStore((s) => s.signals)

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-5 flex flex-col gap-4">
      {/* KPI Row */}
      <div>
        <div className="text-[9px] font-bold tracking-[2px] text-text-muted uppercase mb-2">Account HUD</div>
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { label: "Balance", val: formatCurrency(mt5.balance), sub: "Realized equity", color: "text-gold", accent: "gold" },
            { label: "Floating PnL", val: `+${formatCurrency(mt5.floatPnl)}`, sub: "+1.86% today", color: "text-accent-green", accent: "green" },
            { label: "Open Positions", val: String(positions.length), sub: `${positions.filter(p=>p.type==='limit').length} limit · ${positions.filter(p=>p.type==='market').length} market`, color: "text-text-primary", accent: "" },
            { label: "Win Rate (30d)", val: "74%", sub: "38/51 closed", color: "text-text-primary", accent: "" },
          ].map((k) => (
            <div key={k.label} className={cn(
              "bg-card border border-border-subtle rounded-xl p-4 relative overflow-hidden",
              "before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px]",
              k.accent === "gold" ? "before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent" :
              k.accent === "green" ? "before:bg-gradient-to-r before:from-transparent before:via-accent-green before:to-transparent" :
              "before:bg-gradient-to-r before:from-transparent before:via-accent-blue before:to-transparent",
              "before:opacity-50"
            )}>
              <div className="text-[8px] font-bold tracking-[2px] text-text-muted uppercase mb-2">{k.label}</div>
              <div className={cn("font-mono text-[22px] font-black leading-none", k.color)}>{k.val}</div>
              <div className={cn("text-[9px] mt-1", k.accent === "green" ? "text-accent-green" : "text-text-secondary")}>{k.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pairs Grid */}
      <div>
        <div className="text-[9px] font-bold tracking-[2px] text-text-muted uppercase mb-2">Monitored Pairs</div>
        <div className="grid grid-cols-3 gap-2.5">
          {PAIRS.map((p) => (
            <div
              key={p.name}
              onClick={() => setActiveTab("chart")}
              className={cn(
                "bg-card border rounded-xl p-3 cursor-pointer transition-all duration-200 hover:border-border-accent hover:bg-surface",
                p.sig ? "border-accent-green/30" : "border-border-subtle"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-extrabold tracking-wide">{p.name}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-[0.5px]",
                  p.bias === "bull" ? "bg-accent-green/10 text-accent-green border border-accent-green/25" : "bg-accent-red/10 text-accent-red border border-accent-red/25"
                )}>{p.bias === "bull" ? "Bullish" : "Bearish"}</span>
              </div>
              <div className={cn("font-mono text-sm font-bold", p.up ? "text-accent-green" : "text-accent-red")}>{p.price}</div>
              <div className="flex items-center justify-between mt-1">
                <span className={cn("font-mono text-[10px] font-semibold", p.up ? "text-accent-green" : "text-accent-red")}>{p.chg}</span>
                {p.pill ? (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-[0.5px]",
                    p.pill === "sp" ? "bg-gold/10 text-gold border border-border-gold" :
                    p.pill === "sl" ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/30" :
                    "bg-accent-green/10 text-accent-green border border-accent-green/30"
                  )}>
                    {p.sig && <span className="inline-block w-[4px] h-[4px] rounded-full bg-accent-green mr-1 animate-blink" />}
                    {p.pillLabel}
                  </span>
                ) : <span className="text-[9px] text-text-muted">{p.pillLabel}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inter-market context */}
      <div>
        <div className="text-[9px] font-bold tracking-[2px] text-text-muted uppercase mb-2">Inter-Market Context</div>
        <div className="grid grid-cols-6 gap-2.5">
          {CONTEXT.map((c) => (
            <div key={c.label} className="bg-card border border-border-subtle rounded-xl px-3 py-2.5">
              <div className="text-[8px] font-bold tracking-[2px] text-text-muted uppercase mb-1.5">{c.label}</div>
              <div className={cn("font-mono text-sm font-black", c.color)}>{c.val}</div>
              <div className="text-[8px] text-text-muted mt-0.5">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
