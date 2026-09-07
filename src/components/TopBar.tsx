"use client"
import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import { pad, formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

export function TopBar() {
  const [time, setTime] = useState("")
  const mt5 = useStore((s) => s.mt5Config)

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setTime(`${pad(n.getUTCHours())}:${pad(n.getUTCMinutes())}:${pad(n.getUTCSeconds())} UTC`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="flex-shrink-0 h-[52px] flex items-center gap-4 px-5 bg-deep/98 border-b border-border-subtle backdrop-blur-xl z-50">
      {/* Brand */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#162e6a] to-[#0a4a3a] border border-border-gold flex items-center justify-center text-gold font-black text-sm shadow-glow-gold">
          Ʃ
        </div>
        <div className="leading-tight">
          <div className="text-[11px] font-extrabold tracking-[2.5px] text-text-primary uppercase">SMC · JEA · FX</div>
          <div className="text-[8px] text-text-muted tracking-[2px] uppercase">Institutional Terminal</div>
        </div>
      </div>

      {/* Connection pill */}
      <div className="flex-1 flex items-center justify-center">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-bold tracking-wide uppercase",
          mt5.connected
            ? "bg-accent-green/10 border-accent-green/25 text-accent-green"
            : "bg-accent-red/10 border-accent-red/25 text-accent-red"
        )}>
          <span className={cn(
            "w-[5px] h-[5px] rounded-full",
            mt5.connected ? "bg-accent-green shadow-[0_0_6px_#00e0a0] animate-blink" : "bg-accent-red"
          )} />
          {mt5.connected ? `${mt5.server} — Connected` : "Disconnected"}
          {mt5.connected && <span className="text-text-muted ml-1">· {mt5.latency}ms</span>}
        </div>
      </div>

      {/* HUD metrics */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-[8px] text-text-muted tracking-[1.5px] uppercase">Balance</div>
          <div className="font-mono text-xs font-bold text-gold">{formatCurrency(mt5.balance)}</div>
        </div>
        <div className="w-px h-6 bg-border-subtle" />
        <div className="text-right">
          <div className="text-[8px] text-text-muted tracking-[1.5px] uppercase">Equity</div>
          <div className="font-mono text-xs font-bold text-accent-green">{formatCurrency(mt5.equity)}</div>
        </div>
        <div className="w-px h-6 bg-border-subtle" />
        <div className="text-right">
          <div className="text-[8px] text-text-muted tracking-[1.5px] uppercase">Float PnL</div>
          <div className={cn("font-mono text-xs font-bold", mt5.floatPnl >= 0 ? "text-accent-green" : "text-accent-red")}>
            {mt5.floatPnl >= 0 ? "+" : ""}{formatCurrency(mt5.floatPnl)}
          </div>
        </div>
        <div className="w-px h-6 bg-border-subtle" />
      </div>

      <div className="flex-shrink-0 flex items-center gap-3">
        <span className="px-3 py-1 rounded-full text-[8px] font-extrabold tracking-[2px] text-gold uppercase bg-gold/10 border border-border-gold">
          $50k Tier
        </span>
        <span className="font-mono text-[11px] text-gold tracking-wide">{time}</span>
      </div>
    </header>
  )
}
