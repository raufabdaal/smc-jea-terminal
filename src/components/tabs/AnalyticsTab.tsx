"use client"
import { cn } from "@/lib/utils"

const DAILY = [280, -90, 440, 195, 320, -140, 580, 410, 190, -60, 780, 520, 340, 640]
const PAIRS = [
  { name: "XAU/USD", val: 2840, pct: 88, pos: true },
  { name: "GBP/USD", val: 1280, pct: 72, pos: true },
  { name: "EUR/USD", val: 820, pct: 55, pos: true },
  { name: "BTC/USD", val: 448, pct: 38, pos: true },
  { name: "GBP/JPY", val: -180, pct: 20, pos: false },
  { name: "USO/IL", val: -190, pct: 22, pos: false },
]
const max = Math.max(...DAILY.map(Math.abs))

export function AnalyticsTab() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-5 bg-surface flex flex-col gap-4">
      <div className="text-[9px] font-extrabold tracking-[2px] text-text-muted uppercase">Performance Analytics</div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-2.5">
        {[
          { label: "Total PnL (30d)", val: "+$4,218", sub: "+17.1% gain", accent: "green" },
          { label: "Win Rate", val: "74%", sub: "38W / 13L", accent: "" },
          { label: "Avg R:R", val: "1:4.8", sub: "Expected value: +3.1", accent: "gold" },
          { label: "Max Drawdown", val: "6.2%", sub: "-$1,540 peak", accent: "red" },
        ].map((k) => (
          <div key={k.label} className={cn(
            "bg-card border border-border-subtle rounded-xl p-4 relative overflow-hidden",
            "before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:opacity-50",
            k.accent === "green" ? "before:bg-gradient-to-r before:from-transparent before:via-accent-green before:to-transparent" :
            k.accent === "gold" ? "before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent" :
            k.accent === "red" ? "before:bg-gradient-to-r before:from-transparent before:via-accent-red before:to-transparent" :
            "before:bg-gradient-to-r before:from-transparent before:via-accent-blue before:to-transparent"
          )}>
            <div className="text-[8px] font-bold tracking-[2px] text-text-muted uppercase mb-2">{k.label}</div>
            <div className={cn(
              "font-mono text-[22px] font-black leading-none",
              k.accent === "green" ? "text-accent-green" : k.accent === "gold" ? "text-gold" : k.accent === "red" ? "text-accent-red" : "text-text-primary"
            )}>{k.val}</div>
            <div className={cn("text-[9px] mt-1", k.accent === "green" ? "text-accent-green" : k.accent === "red" ? "text-accent-red" : "text-text-secondary")}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Daily PnL bar chart */}
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-[9px] font-extrabold tracking-[2px] text-text-muted uppercase mb-3">Daily PnL — Last 14 Days</div>
          <div className="flex items-end gap-1.5 h-[110px] px-1">
            {DAILY.map((v, i) => (
              <div
                key={i}
                title={`${v >= 0 ? "+" : ""}$${Math.abs(v)}`}
                className={cn("flex-1 rounded-t-sm min-h-[3px]", v >= 0 ? "bg-gradient-to-t from-accent-green/60 to-accent-green/20" : "bg-gradient-to-t from-accent-red/60 to-accent-red/20")}
                style={{ height: `${Math.abs(v) / max * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* PnL by pair */}
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-[9px] font-extrabold tracking-[2px] text-text-muted uppercase mb-3">PnL by Pair</div>
          <div className="flex flex-col gap-2 mt-2">
            {PAIRS.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="text-[10px] font-bold w-[60px] flex-shrink-0">{p.name}</span>
                <div className="flex-1 h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", p.pos ? "bg-gradient-to-r from-accent-green to-[#00ffc8]" : "bg-gradient-to-r from-accent-red to-[#ff8066]")}
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
                <span className={cn("font-mono text-[10px] font-bold w-[55px] text-right flex-shrink-0", p.pos ? "text-accent-green" : "text-accent-red")}>
                  {p.pos ? "+" : "-"}${Math.abs(p.val).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence distribution */}
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-[9px] font-extrabold tracking-[2px] text-text-muted uppercase mb-3">Signal Confidence Distribution</div>
          <div className="h-[80px] relative overflow-hidden">
            <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4090f8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4090f8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,70 C30,65 50,30 80,20 C110,10 130,5 160,8 C190,11 210,25 240,30 C270,35 285,40 300,38 L300,80 L0,80 Z" fill="url(#cg)" />
              <path d="M0,70 C30,65 50,30 80,20 C110,10 130,5 160,8 C190,11 210,25 240,30 C270,35 285,40 300,38" fill="none" stroke="#4090f8" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex justify-between text-[8px] text-text-muted mt-1"><span>50%</span><span>75%</span><span>100%</span></div>
        </div>

        {/* Session performance */}
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-[9px] font-extrabold tracking-[2px] text-text-muted uppercase mb-3">Session Performance</div>
          <div className="flex flex-col gap-2 mt-2">
            {[
              { name: "London", val: 2840, pct: 88, color: "text-accent-green" },
              { name: "New York", val: 1380, pct: 72, color: "text-accent-blue" },
              { name: "Asia", val: -240, pct: 20, color: "text-text-muted", neg: true },
              { name: "Overlap", val: 3100, pct: 95, color: "text-gold" },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className={cn("text-[10px] font-bold w-[60px] flex-shrink-0", s.color)}>{s.name}</span>
                <div className="flex-1 h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", s.neg ? "bg-gradient-to-r from-accent-red to-[#ff8066]" : "bg-gradient-to-r from-accent-green to-[#00ffc8]")}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
                <span className={cn("font-mono text-[10px] font-bold w-[55px] text-right flex-shrink-0", s.neg ? "text-accent-red" : "text-accent-green")}>
                  {s.neg ? "-" : "+"}${Math.abs(s.val).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
