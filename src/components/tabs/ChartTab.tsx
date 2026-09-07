"use client"
import { useStore } from "@/store/useStore"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

const ASSETS = [
  { value: "XAUUSD", label: "XAU/USD — Gold", sym: "OANDA:XAUUSD" },
  { value: "EURUSD", label: "EUR/USD", sym: "FX:EURUSD" },
  { value: "GBPUSD", label: "GBP/USD", sym: "FX:GBPUSD" },
  { value: "GBPJPY", label: "GBP/JPY", sym: "FX:GBPJPY" },
  { value: "USOIL", label: "USO/IL — Crude", sym: "TVC:USOIL" },
  { value: "BTCUSD", label: "BTC/USD", sym: "BITSTAMP:BTCUSD" },
]
const TFS = [
  { label: "1D", value: "D" },
  { label: "4H", value: "240" },
  { label: "1H", value: "60" },
  { label: "15M", value: "15" },
  { label: "5M", value: "5" },
]

const SMC_DATA: Record<string, { bias: string; bos: string; bosType: string; fvgHigh: string; fvgLow: string; entry: string; tp: string; sl: string; rr: string }> = {
  XAUUSD: { bias: "Bullish ↑", bos: "2,618.40", bosType: "Body Close ✓", fvgHigh: "2,638.50", fvgLow: "2,621.80", entry: "2,629.15", tp: "2,668.00", sl: "2,614.40", rr: "1:5.3" },
  EURUSD: { bias: "Bearish ↓", bos: "1.09340", bosType: "Body Close ✓", fvgHigh: "1.09360", fvgLow: "1.09180", entry: "1.09250", tp: "1.08800", sl: "1.09480", rr: "1:2.9" },
  GBPUSD: { bias: "Bearish ↓", bos: "1.26580", bosType: "Body Close ✓", fvgHigh: "1.26620", fvgLow: "1.26380", entry: "1.26500", tp: "1.25800", sl: "1.26750", rr: "1:2.8" },
  GBPJPY: { bias: "Bullish ↑", bos: "190.50", bosType: "Body Close ✓", fvgHigh: "191.40", fvgLow: "190.20", entry: "190.80", tp: "192.50", sl: "190.10", rr: "1:2.4" },
  USOIL: { bias: "Bearish ↓", bos: "84.10", bosType: "Body Close ✓", fvgHigh: "83.80", fvgLow: "83.20", entry: "83.50", tp: "82.00", sl: "84.20", rr: "1:2.1" },
  BTCUSD: { bias: "Bullish ↑", bos: "95,200", bosType: "Body Close ✓", fvgHigh: "96,900", fvgLow: "95,400", entry: "95,800", tp: "98,500", sl: "94,200", rr: "1:2.7" },
}

export function ChartTab() {
  const asset = useStore((s) => s.chartAsset)
  const tf = useStore((s) => s.chartTF)
  const setChartAsset = useStore((s) => s.setChartAsset)
  const setChartTF = useStore((s) => s.setChartTF)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [cursorY, setCursorY] = useState(50)

  const sym = ASSETS.find((a) => a.value === asset)?.sym || "OANDA:XAUUSD"
  const chartUrl = `https://www.tradingview.com/widgetembed/?frameElementId=tv-widget&symbol=${encodeURIComponent(sym)}&interval=${tf}&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&overrides=%7B%22paneProperties.background%22%3A%22%23020408%22%2C%22paneProperties.backgroundType%22%3A%22solid%22%7D&locale=en`
  const smc = SMC_DATA[asset] || SMC_DATA.XAUUSD

  useEffect(() => {
    const id = setInterval(() => {
      setCursorY((y) => Math.max(14, Math.min(80, y + (Math.random() * 3 - 1))))
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-deep border-b border-border-subtle flex-wrap">
        <select
          value={asset}
          onChange={(e) => setChartAsset(e.target.value)}
          className="bg-card border border-border-accent text-text-primary font-bold text-[12px] px-2.5 py-1.5 rounded-md outline-none cursor-pointer"
        >
          {ASSETS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
        <div className="flex gap-1">
          {TFS.map((t) => (
            <button
              key={t.value}
              onClick={() => setChartTF(t.value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-[0.5px] transition-all",
                tf === t.value
                  ? "border-accent-blue text-accent-blue bg-accent-blue/10"
                  : "border-border-subtle text-text-muted hover:text-text-secondary hover:border-border-accent"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="ml-auto text-[9px] text-text-muted">TradingView Advanced Chart</div>
      </div>

      {/* Chart + SMC panel */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative bg-[#020408]">
          <iframe
            ref={iframeRef}
            key={`${asset}-${tf}`}
            src={chartUrl}
            className="w-full h-full border-none"
            allowTransparency={true}
          />
        </div>

        {/* SMC side panel */}
        <div className="w-[260px] flex-shrink-0 bg-deep border-l border-border-subtle overflow-y-auto scrollbar-thin p-3.5 flex flex-col gap-2">
          <div className="text-[8px] font-extrabold tracking-[2.5px] text-text-muted uppercase pb-2 border-b border-border-subtle">
            SMC Golden Zone
          </div>

          {[
            ["Asset", asset.replace("USD", "/USD").replace("JPY", "/JPY").replace("OIL", "/OIL")],
            ["HTF Bias (1D)", smc.bias],
            ["4H BOS Level", smc.bos],
            ["BOS Type", smc.bosType],
            ["FVG Range", `${smc.fvgLow} – ${smc.fvgHigh}`],
            ["POI Entry", smc.entry],
            ["Structural TP", smc.tp],
            ["R:R", smc.rr],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center py-1.5 border-b border-white/[0.03] last:border-0">
              <span className="text-[9px] text-text-secondary">{k}</span>
              <span className={cn(
                "font-mono text-[10px] font-bold",
                k === "HTF Bias (1D)" ? (smc.bias.includes("↑") ? "text-accent-green" : "text-accent-red") :
                k === "POI Entry" || k === "4H BOS Level" ? "text-gold" :
                k === "Structural TP" ? "text-accent-green" :
                k === "R:R" ? "text-accent-blue" : "text-text-primary"
              )}>{v}</span>
            </div>
          ))}

          {/* FVG Zone visualizer */}
          <div className="bg-card border border-border-accent rounded-lg p-3 mt-1">
            <div className="text-[8px] font-extrabold tracking-[2px] text-accent-blue uppercase mb-2">FVG Zone</div>
            <div className="relative h-[60px] rounded bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(64,144,248,0.03)_5px,rgba(64,144,248,0.03)_10px)] border border-border-accent overflow-hidden mb-2">
              <div className="absolute top-0 left-0 right-0 h-[12px] bg-accent-blue/18 flex items-center px-1.5 font-mono text-[8px] text-accent-blue font-semibold">
                HIGH {smc.fvgHigh}
              </div>
              <div className="absolute top-[12px] bottom-[12px] left-[18%] right-[18%] bg-gradient-to-b from-gold/18 to-gold/6 border-l-2 border-r-2 border-gold flex items-center justify-center">
                <span className="text-[7px] font-black text-gold tracking-[2px] uppercase">✦ Golden Zone ✦</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[12px] bg-accent-blue/18 flex items-center px-1.5 font-mono text-[8px] text-accent-blue font-semibold">
                LOW {smc.fvgLow}
              </div>
              {/* price cursor */}
              <div
                className="absolute left-0 right-0 h-px bg-accent-cyan shadow-[0_0_5px_#00ccff]"
                style={{ transition: "top 1.5s ease-in-out" }}
                style={{ top: `${cursorY}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] text-text-muted">
              <span>SL: {smc.sl}</span>
              <span>Entry: {smc.entry}</span>
              <span>TP: {smc.tp}</span>
            </div>
          </div>

          <div className="p-2.5 bg-accent-green/10 border border-accent-green/20 rounded-lg">
            <div className="text-[8px] font-extrabold text-accent-green tracking-[1.5px] uppercase mb-1">⚡ Signal Active</div>
            <div className="text-[9px] text-text-secondary leading-relaxed">
              Approaching {tf === "240" ? "4H" : tf} FVG. Approval pending in Trade Approvals tab.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
