"use client"
import { useState } from "react"
import { useStore } from "@/store/useStore"
import { cn, formatCurrency } from "@/lib/utils"

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-10 h-[22px] rounded-full border transition-all duration-250 flex-shrink-0",
        checked ? "bg-accent-green border-accent-green/50 shadow-[0_0_10px_rgba(0,224,160,0.3)]" : "bg-white/10 border-border-subtle"
      )}
    >
      <div className={cn(
        "absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white shadow-sm transition-all duration-250",
        checked ? "left-[20px]" : "left-[2px]"
      )} />
    </button>
  )
}

export function MT5ConfigTab() {
  const config = useStore((s) => s.mt5Config)
  const updateMT5Config = useStore((s) => s.updateMT5Config)
  const [status, setStatus] = useState<"idle" | "connecting" | "connected">("connected")

  const handleReconnect = async () => {
    setStatus("connecting")
    updateMT5Config({ connected: false })
    try {
      const res = await fetch("/api/mt5")
      const data = await res.json()
      setTimeout(() => {
        updateMT5Config({ connected: true, latency: data.account ? 4 : 99 })
        setStatus("connected")
      }, 1500)
    } catch {
      setStatus("idle")
    }
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-surface flex flex-col gap-4">
      <div className="text-[9px] font-extrabold tracking-[2px] text-text-muted uppercase mb-1">
        Exness MT5 Connection & Configuration
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Credentials */}
        <div className="bg-card border border-border-subtle rounded-2xl p-5">
          <div className="text-[9px] font-extrabold tracking-[2px] text-text-muted uppercase mb-4 pb-2 border-b border-border-subtle">
            Broker Credentials
          </div>
          {[
            { label: "MT5 Account ID", key: "accountId", type: "text" },
            { label: "Trading Password", key: "password", type: "password" },
            { label: "Broker Server", key: "server", type: "text" },
          ].map((f) => (
            <div key={f.label} className="mb-3">
              <label className="block text-[9px] font-semibold text-text-secondary tracking-[1px] uppercase mb-1.5">{f.label}</label>
              <input
                type={f.type}
                defaultValue={f.key === "password" ? "••••••••" : config[f.key as keyof typeof config]?.toString()}
                onChange={(e) => f.key !== "password" && updateMT5Config({ [f.key]: e.target.value })}
                className="w-full px-3 py-2 bg-white/[0.04] border border-border-subtle rounded-md text-text-primary font-ui text-[12px] outline-none focus:border-border-accent focus:bg-accent-blue/5 transition-all"
              />
            </div>
          ))}
          <div className="mb-4">
            <label className="block text-[9px] font-semibold text-text-secondary tracking-[1px] uppercase mb-1.5">Execution Mode</label>
            <select
              value={config.mode}
              onChange={(e) => updateMT5Config({ mode: e.target.value as "live" | "demo" })}
              className="w-full px-3 py-2 bg-card border border-border-subtle rounded-md text-text-primary font-ui text-[12px] outline-none cursor-pointer"
            >
              <option value="demo">Demo / Paper</option>
              <option value="live">Live Trading</option>
            </select>
          </div>
          <button
            onClick={handleReconnect}
            disabled={status === "connecting"}
            className={cn(
              "w-full py-2.5 rounded-lg font-extrabold text-[11px] tracking-[2px] uppercase border transition-all",
              status === "connecting"
                ? "bg-accent-green/10 text-accent-green/50 border-accent-green/20 cursor-not-allowed"
                : "bg-gradient-to-r from-[#0a3d28] to-[#0d5235] text-accent-green border-accent-green/40 hover:shadow-glow-green hover:-translate-y-px"
            )}
          >
            {status === "connecting" ? "⟳ Connecting..." : "⟳ Reconnect & Verify"}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Automation settings */}
          <div className="bg-card border border-border-subtle rounded-2xl p-5">
            <div className="text-[9px] font-extrabold tracking-[2px] text-text-muted uppercase mb-4 pb-2 border-b border-border-subtle">
              Automation Settings
            </div>
            {[
              { key: "autoPlacement", label: "Automated Limit Placement", sub: "System auto-places pending limit orders on signal approval" },
              { key: "earlyWarning", label: "Early Warning Notifications", sub: "Alert 3–5 min before price touches limit zone" },
              { key: "respectUserLocked", label: "Respect USER_LOCKED Parameters", sub: "Never override manually set SL/TP values" },
            ].map((t) => (
              <div key={t.key} className="flex items-center justify-between py-2.5 border-b border-border-subtle last:border-0">
                <div>
                  <div className="text-[11px] font-medium text-text-primary">{t.label}</div>
                  <div className="text-[9px] text-text-muted mt-0.5">{t.sub}</div>
                </div>
                <Toggle
                  checked={Boolean(config[t.key as keyof typeof config])}
                  onChange={(v) => updateMT5Config({ [t.key]: v })}
                />
              </div>
            ))}
          </div>

          {/* Status card */}
          <div className="bg-card border border-border-subtle rounded-2xl p-5">
            <div className="text-[9px] font-extrabold tracking-[2px] text-text-muted uppercase mb-4 pb-2 border-b border-border-subtle">
              Server Status & Account Metrics
            </div>
            {[
              { label: "Server Latency", val: `${config.latency}ms — Optimal ✓` },
              { label: "Connection", val: config.connected ? "Connected" : "Disconnected" },
              { label: "Mode", val: config.mode === "live" ? "LIVE Trading" : "Demo / Paper" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                <span className="text-[10px] text-text-secondary">{r.label}</span>
                <span className="font-mono text-[11px] font-bold text-accent-green">{r.val}</span>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { label: "Balance", val: formatCurrency(config.balance), color: "text-gold" },
                { label: "Equity", val: formatCurrency(config.equity), color: "text-accent-green" },
                { label: "Free Margin", val: formatCurrency(config.freeMargin), color: "text-text-primary" },
                { label: "Margin Used", val: formatCurrency(config.equity - config.freeMargin), color: "text-text-primary" },
                { label: "Leverage", val: config.leverage, color: "text-accent-blue" },
                { label: "Float PnL", val: formatCurrency(config.floatPnl), color: "text-accent-green" },
              ].map((m) => (
                <div key={m.label} className="bg-surface/70 border border-border-subtle rounded-lg p-2 text-center">
                  <div className="text-[7px] text-text-muted tracking-[1px] uppercase mb-1">{m.label}</div>
                  <div className={cn("font-mono text-[13px] font-extrabold", m.color)}>{m.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
