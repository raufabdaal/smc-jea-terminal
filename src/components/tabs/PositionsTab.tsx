"use client"
import { useStore, Position } from "@/store/useStore"
import { cn, formatCurrency } from "@/lib/utils"
import { useState } from "react"

function PositionCard({ pos }: { pos: Position }) {
  const closePosition = useStore((s) => s.closePosition)
  const cancelLimit = useStore((s) => s.cancelLimit)
  const editPositionSL = useStore((s) => s.editPositionSL)
  const editPositionTP = useStore((s) => s.editPositionTP)
  const [editSL, setEditSL] = useState(false)
  const [editTP, setEditTP] = useState(false)
  const [newSL, setNewSL] = useState(pos.sl)
  const [newTP, setNewTP] = useState(pos.tp)

  const handleSLSave = () => {
    if (!pos.slLocked) { editPositionSL(pos.id, newSL); setEditSL(false) }
  }
  const handleTPSave = () => {
    if (!pos.tpLocked) { editPositionTP(pos.id, newTP); setEditTP(false) }
  }

  return (
    <div className={cn(
      "bg-card border rounded-xl p-3.5 mb-2.5 relative overflow-hidden",
      "border-l-[3px]",
      pos.direction === "buy" ? "border-l-accent-green border-border-subtle" : "border-l-accent-red border-border-subtle"
    )}>
      {/* Top row */}
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <div className="text-[16px] font-black">{pos.pair}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={cn(
              "text-[9px] font-extrabold px-2 py-0.5 rounded",
              pos.direction === "buy" ? "bg-accent-green/10 text-accent-green border border-accent-green/30" : "bg-accent-red/10 text-accent-red border border-accent-red/30"
            )}>
              {pos.direction.toUpperCase()}
            </span>
            <span className={cn(
              "text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-[0.5px]",
              pos.type === "market" ? "bg-accent-green/10 text-accent-green border border-accent-green/30" : "bg-accent-blue/10 text-accent-blue border border-accent-blue/30"
            )}>
              {pos.type === "market" ? "In Trade" : "Limit Placed"}
            </span>
            {(pos.slLocked || pos.tpLocked) && (
              <span className="text-[8px] text-amber-400">🔒 USER_LOCKED</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={cn("font-mono text-[16px] font-extrabold", pos.pnl >= 0 ? "text-accent-green" : "text-accent-red")}>
            {pos.pnl >= 0 ? "+" : "-"}{formatCurrency(Math.abs(pos.pnl))}
          </div>
          <div className="font-mono text-[10px] text-text-muted mt-0.5">
            {pos.rMultiple >= 0 ? "+" : ""}{pos.rMultiple.toFixed(2)}R
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-4 gap-2 mb-2.5">
        {[
          { label: "Entry", val: pos.entry, color: "text-gold" },
          { label: "Current", val: pos.current, color: "text-text-primary" },
          { label: `SL${pos.slLocked ? " 🔒" : ""}`, val: pos.sl, color: "text-accent-red" },
          { label: `TP${pos.tpLocked ? " 🔒" : ""}`, val: pos.tp, color: "text-accent-green" },
        ].map((m) => (
          <div key={m.label} className="text-center bg-surface/70 border border-border-subtle rounded-md py-1.5 px-1">
            <div className="text-[7px] text-text-muted tracking-[1px] uppercase mb-0.5">{m.label}</div>
            <div className={cn("font-mono text-[10px] font-bold", m.color)}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* SL/TP edit inline */}
      {editSL && (
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            value={newSL}
            step={0.01}
            onChange={(e) => setNewSL(parseFloat(e.target.value))}
            className="flex-1 px-2 py-1.5 bg-white/[0.04] border border-border-accent rounded font-mono text-[11px] text-text-primary outline-none"
          />
          <button onClick={handleSLSave} className="px-3 py-1.5 bg-accent-green/10 text-accent-green border border-accent-green/30 rounded text-[9px] font-bold hover:bg-accent-green hover:text-void transition-all">Save</button>
          <button onClick={() => setEditSL(false)} className="px-2 py-1.5 border border-border-subtle rounded text-[9px] text-text-muted hover:text-text-primary transition-all">✕</button>
        </div>
      )}
      {editTP && (
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            value={newTP}
            step={0.01}
            onChange={(e) => setNewTP(parseFloat(e.target.value))}
            className="flex-1 px-2 py-1.5 bg-white/[0.04] border border-border-accent rounded font-mono text-[11px] text-text-primary outline-none"
          />
          <button onClick={handleTPSave} className="px-3 py-1.5 bg-accent-green/10 text-accent-green border border-accent-green/30 rounded text-[9px] font-bold hover:bg-accent-green hover:text-void transition-all">Save</button>
          <button onClick={() => setEditTP(false)} className="px-2 py-1.5 border border-border-subtle rounded text-[9px] text-text-muted hover:text-text-primary transition-all">✕</button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-1.5">
        <button
          onClick={() => { if (pos.slLocked) return; setEditSL(!editSL); setEditTP(false) }}
          className={cn(
            "px-3 py-1.5 rounded-md text-[9px] font-bold tracking-[1px] uppercase border transition-all",
            pos.slLocked ? "border-amber-500/30 text-amber-400 cursor-not-allowed opacity-60" : "border-border-subtle text-text-secondary hover:border-border-accent hover:text-text-primary"
          )}
        >
          Edit SL
        </button>
        <button
          onClick={() => { if (pos.tpLocked) return; setEditTP(!editTP); setEditSL(false) }}
          className={cn(
            "px-3 py-1.5 rounded-md text-[9px] font-bold tracking-[1px] uppercase border transition-all",
            pos.tpLocked ? "border-amber-500/30 text-amber-400 cursor-not-allowed opacity-60" : "border-border-subtle text-text-secondary hover:border-border-accent hover:text-text-primary"
          )}
        >
          Edit TP
        </button>
        {pos.type === "limit" ? (
          <button
            onClick={() => cancelLimit(pos.id)}
            className="px-3 py-1.5 rounded-md text-[9px] font-bold tracking-[1px] uppercase border border-border-subtle text-text-secondary hover:border-border-accent hover:text-text-primary transition-all"
          >
            Cancel Limit
          </button>
        ) : (
          <button
            onClick={() => closePosition(pos.id)}
            className="px-3 py-1.5 rounded-md text-[9px] font-bold tracking-[1px] uppercase border border-accent-red/30 text-accent-red hover:bg-accent-red/10 hover:shadow-glow-red transition-all"
          >
            Close Position
          </button>
        )}
      </div>
    </div>
  )
}

export function PositionsTab() {
  const positions = useStore((s) => s.positions)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-deep border-b border-border-subtle">
        <div className="text-[10px] font-bold text-text-secondary">Active Orders & Positions</div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-accent-blue/10 text-accent-blue border border-accent-blue/30">
            {positions.filter(p => p.type === "limit").length} Limit Orders
          </span>
          <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-accent-green/10 text-accent-green border border-accent-green/30">
            {positions.filter(p => p.type === "market").length} In Trade
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3">
        {positions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted">
            <span className="text-3xl opacity-30">📋</span>
            <span className="text-[12px] tracking-wide">No open positions</span>
          </div>
        ) : (
          positions.map((pos) => <PositionCard key={pos.id} pos={pos} />)
        )}
      </div>
    </div>
  )
}
