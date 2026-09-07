"use client"
import { useState } from "react"
import { useStore, Signal } from "@/store/useStore"
import { cn, calcRiskReward, formatCurrency } from "@/lib/utils"

function ConfidenceRing({ value, size = 80 }: { value: number; size?: number }) {
  const r = 32
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  const color = value >= 80 ? "#00e0a0" : "#d4af37"
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash.toFixed(1)} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono text-lg font-black leading-none" style={{ color }}>{value}%</div>
        <div className="text-[7px] text-text-muted tracking-[1px] uppercase mt-0.5">Conf.</div>
      </div>
    </div>
  )
}

function SignalDetail({ sig }: { sig: Signal }) {
  const approveSignal = useStore((s) => s.approveSignal)
  const rejectSignal = useStore((s) => s.rejectSignal)
  const updateSignal = useStore((s) => s.updateSignal)

  const [lot, setLot] = useState(sig.lot)
  const [layers, setLayers] = useState(sig.lyr ?? sig.layers ?? 1)
  const [sl, setSl] = useState(sig.sl)
  const [tp, setTp] = useState(sig.tp)

  const isGold = sig.pair.includes("XAU")
  const { risk, reward, rr } = calcRiskReward(sig.entry, sl, tp, lot, isGold)

  const handleApprove = async () => {
    // Call mock API
    await fetch("/api/mt5", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "place_limit", symbol: sig.symbol, direction: sig.direction, entry: sig.entry, sl, tp, lot }),
    })
    approveSignal(sig.id, lot, sl, tp)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[22px] font-black tracking-tight">{sig.pair}</div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={cn(
              "text-[11px] font-extrabold px-3 py-1 rounded",
              sig.direction === "buy" ? "bg-accent-green/10 text-accent-green border border-accent-green/30" : "bg-accent-red/10 text-accent-red border border-accent-red/30"
            )}>
              {sig.direction === "buy" ? "BUY LIMIT" : "SELL LIMIT"}
            </span>
            <span className={cn(
              "px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-[0.5px]",
              sig.direction === "buy" ? "bg-accent-green/10 text-accent-green border border-accent-green/25" : "bg-accent-red/10 text-accent-red border border-accent-red/25"
            )}>
              {sig.direction === "buy" ? "Bullish" : "Bearish"}
            </span>
          </div>
        </div>
        <ConfidenceRing value={sig.confidence} />
      </div>

      {/* Structural breakdown */}
      <div className="bg-card border border-border-subtle rounded-xl p-3.5">
        <div className="text-[8px] font-extrabold tracking-[2px] text-text-muted uppercase mb-2.5 pb-1.5 border-b border-border-subtle">
          Structural Breakdown
        </div>
        {[
          ["BOS Level", sig.bos, "text-accent-blue"],
          ["FVG Range", sig.fvg, "text-text-primary"],
          ["POI Entry", sig.poi, "text-gold"],
          ["TF Alignment", sig.tfAlignment, "text-accent-green"],
          ["Entry Limit", String(sig.entry), "text-gold"],
          ["Structural TP", String(sig.tp), "text-accent-green"],
        ].map(([k, v, c]) => (
          <div key={k} className="flex justify-between items-center py-1.5 border-b border-white/[0.03] last:border-0">
            <span className="text-[9px] text-text-secondary">{k}</span>
            <span className={cn("font-mono text-[10px] font-bold", c)}>{v}</span>
          </div>
        ))}
      </div>

      {/* Position sizing */}
      <div className="bg-card border border-border-subtle rounded-xl p-3.5">
        <div className="text-[8px] font-extrabold tracking-[2px] text-text-muted uppercase mb-2.5 pb-1.5 border-b border-border-subtle">
          Position Sizing
        </div>
        <div className="text-[9px] text-text-secondary mb-1.5">Lot Size</div>
        <input
          type="number"
          value={lot}
          step={0.01}
          min={0.01}
          onChange={(e) => setLot(parseFloat(e.target.value) || 0.01)}
          className="w-full px-2.5 py-2 bg-white/[0.04] border border-border-subtle rounded-md font-mono text-[12px] font-bold text-text-primary outline-none focus:border-border-accent focus:bg-accent-blue/5"
        />
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {[0.01, 0.1, 0.5, 1.0].map((v) => (
            <button
              key={v}
              onClick={() => setLot(v)}
              className={cn(
                "px-3 py-1 rounded-md font-mono text-[11px] font-bold border transition-all",
                lot === v ? "bg-accent-blue text-white border-accent-blue shadow-glow-blue" : "bg-accent-blue/10 text-accent-blue border-border-accent hover:bg-accent-blue hover:text-white"
              )}
            >
              {v.toFixed(2)}
            </button>
          ))}
        </div>
        <div className="mt-3 text-[9px] text-text-secondary mb-1.5">Layers</div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLayers(Math.max(1, layers - 1))} className="w-7 h-7 rounded-md bg-accent-blue/10 border border-border-accent text-accent-blue font-black text-sm hover:bg-accent-blue hover:text-white transition-all">−</button>
          <span className="font-mono text-xl font-black text-text-primary w-8 text-center">{layers}</span>
          <button onClick={() => setLayers(Math.min(3, layers + 1))} className="w-7 h-7 rounded-md bg-accent-blue/10 border border-border-accent text-accent-blue font-black text-sm hover:bg-accent-blue hover:text-white transition-all">+</button>
          <span className="text-[9px] text-text-muted">max 3</span>
        </div>
      </div>

      {/* Risk parameters */}
      <div className="bg-card border border-border-subtle rounded-xl p-3.5">
        <div className="text-[8px] font-extrabold tracking-[2px] text-text-muted uppercase mb-2.5 pb-1.5 border-b border-border-subtle">
          Risk Parameters
        </div>

        {/* SL */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] text-text-secondary">Stop Loss</span>
          <button
            onClick={() => updateSignal(sig.id, { slLocked: !sig.slLocked })}
            className={cn(
              "px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-[1px] uppercase transition-all",
              sig.slLocked ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-white/5 text-text-muted border border-border-subtle hover:border-amber-500/30 hover:text-amber-400"
            )}
          >
            {sig.slLocked ? "🔒 USER_LOCKED" : "🔓 Unlocked"}
          </button>
        </div>
        <input
          type="number"
          value={sl}
          step={0.01}
          disabled={sig.slLocked}
          onChange={(e) => setSl(parseFloat(e.target.value) || sl)}
          className={cn(
            "w-full px-2.5 py-2 border rounded-md font-mono text-[12px] font-bold text-text-primary outline-none transition-all",
            sig.slLocked ? "bg-amber-500/5 border-amber-500/50 shadow-[0_0_8px_rgba(255,149,0,0.15)] cursor-not-allowed" : "bg-white/[0.04] border-border-subtle focus:border-border-accent focus:bg-accent-blue/5"
          )}
        />

        {/* TP */}
        <div className="flex items-center justify-between mt-2.5 mb-1.5">
          <span className="text-[9px] text-text-secondary">Take Profit</span>
          <button
            onClick={() => updateSignal(sig.id, { tpLocked: !sig.tpLocked })}
            className={cn(
              "px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-[1px] uppercase transition-all",
              sig.tpLocked ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-white/5 text-text-muted border border-border-subtle hover:border-amber-500/30 hover:text-amber-400"
            )}
          >
            {sig.tpLocked ? "🔒 USER_LOCKED" : "🔓 Unlocked"}
          </button>
        </div>
        <input
          type="number"
          value={tp}
          step={0.01}
          disabled={sig.tpLocked}
          onChange={(e) => setTp(parseFloat(e.target.value) || tp)}
          className={cn(
            "w-full px-2.5 py-2 border rounded-md font-mono text-[12px] font-bold text-text-primary outline-none transition-all",
            sig.tpLocked ? "bg-amber-500/5 border-amber-500/50 shadow-[0_0_8px_rgba(255,149,0,0.15)] cursor-not-allowed" : "bg-white/[0.04] border-border-subtle focus:border-border-accent focus:bg-accent-blue/5"
          )}
        />

        {/* Calculated metrics */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[
            { label: "Risk $", val: formatCurrency(risk), color: "text-accent-red" },
            { label: "Reward $", val: formatCurrency(reward), color: "text-accent-green" },
            { label: "R:R", val: `1:${rr.toFixed(1)}`, color: "text-accent-blue" },
            { label: "Conf.", val: `${sig.confidence}%`, color: "text-gold" },
          ].map((m) => (
            <div key={m.label} className="bg-surface/70 border border-border-subtle rounded-lg p-2 text-center">
              <div className="text-[7px] text-text-muted tracking-[1px] uppercase mb-1">{m.label}</div>
              <div className={cn("font-mono text-[13px] font-black", m.color)}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2.5">
        <button
          onClick={handleApprove}
          className="flex-[2] py-3 rounded-lg bg-gradient-to-r from-[#0a3d28] via-[#0d5235] to-[#0a3d28] text-accent-green border border-accent-green/40 text-[11px] font-extrabold tracking-[1.5px] uppercase transition-all hover:shadow-glow-green hover:-translate-y-px active:translate-y-0"
        >
          ✦ Approve & Place Limit Order
        </button>
        <button
          onClick={() => rejectSignal(sig.id)}
          className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#2e0d0d] via-[#3d1010] to-[#2e0d0d] text-accent-red border border-accent-red/30 text-[11px] font-extrabold tracking-[1.5px] uppercase hover:shadow-glow-red transition-all"
        >
          ✕ Reject
        </button>
      </div>
    </div>
  )
}

export function ApprovalsTab() {
  const signals = useStore((s) => s.signals)
  const [selectedId, setSelectedId] = useState<string | null>(signals.find(s => s.status === "pending")?.id ?? null)

  const pending = signals.filter((s) => s.status === "pending")
  const selected = signals.find((s) => s.id === selectedId)

  return (
    <div className="flex-1 flex overflow-hidden bg-surface">
      {/* Signal list */}
      <div className="w-[300px] flex-shrink-0 border-r border-border-subtle overflow-y-auto scrollbar-thin p-3">
        <div className="text-[8px] font-extrabold tracking-[2px] text-text-muted uppercase pb-2 border-b border-border-subtle mb-2">
          Pending Signals ({pending.length})
        </div>
        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-text-muted">
            <span className="text-3xl opacity-30">⬡</span>
            <span className="text-[11px] tracking-wide">No pending signals</span>
          </div>
        ) : pending.map((sig) => (
          <div
            key={sig.id}
            onClick={() => setSelectedId(sig.id)}
            className={cn(
              "bg-card border rounded-xl p-3 cursor-pointer transition-all mb-2 relative overflow-hidden",
              selectedId === sig.id ? "border-border-accent bg-accent-blue/10" : "border-border-subtle hover:border-border-accent/50"
            )}
          >
            {selectedId === sig.id && (
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-blue rounded-r" />
            )}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] font-extrabold">{sig.pair}</span>
              <span className={cn(
                "text-[9px] font-extrabold px-2 py-0.5 rounded",
                sig.direction === "buy" ? "bg-accent-green/10 text-accent-green border border-accent-green/30" : "bg-accent-red/10 text-accent-red border border-accent-red/30"
              )}>
                {sig.direction === "buy" ? "BUY LIMIT" : "SELL LIMIT"}
              </span>
            </div>
            <div className="font-mono text-[12px] font-bold text-gold">{sig.entry}</div>
            <div className="text-[9px] text-text-secondary mt-1">Confidence: {sig.confidence}% · R:R {sig.rr}</div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        {selected && selected.status === "pending" ? (
          <SignalDetail key={selected.id} sig={selected} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-text-muted">
            <span className="text-4xl opacity-30">{pending.length === 0 ? "✓" : "⬡"}</span>
            <span className="text-[12px] tracking-wide">{pending.length === 0 ? "All signals processed" : "Select a signal to review"}</span>
          </div>
        )}
      </div>
    </div>
  )
}
