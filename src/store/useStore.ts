import { create } from "zustand"

export type SignalDirection = "buy" | "sell"
export type SignalStatus = "pending" | "placed" | "rejected"
export type PositionType = "market" | "limit"

export interface Signal {
  id: string
  pair: string
  symbol: string
  direction: SignalDirection
  entry: number
  sl: number
  tp: number
  confidence: number
  bos: string
  fvg: string
  poi: string
  tfAlignment: string
  rr: string
  lot: number
  layers: number
  slLocked: boolean
  tpLocked: boolean
  status: SignalStatus
  createdAt: Date
}

export interface Position {
  id: string
  pair: string
  direction: SignalDirection
  type: PositionType
  entry: number
  current: number
  sl: number
  tp: number
  lot: number
  slLocked: boolean
  tpLocked: boolean
  pnl: number
  rMultiple: number
  openedAt: Date
}

export interface MT5Config {
  accountId: string
  server: string
  mode: "live" | "demo"
  autoPlacement: boolean
  earlyWarning: boolean
  respectUserLocked: boolean
  connected: boolean
  latency: number
  balance: number
  equity: number
  freeMargin: number
  floatPnl: number
  leverage: string
}

export interface AppState {
  activeTab: string
  chartAsset: string
  chartTF: string
  signals: Signal[]
  positions: Position[]
  mt5Config: MT5Config
  setActiveTab: (tab: string) => void
  setChartAsset: (asset: string) => void
  setChartTF: (tf: string) => void
  updateSignal: (id: string, updates: Partial<Signal>) => void
  approveSignal: (id: string, lot: number, sl: number, tp: number) => void
  rejectSignal: (id: string) => void
  closePosition: (id: string) => void
  cancelLimit: (id: string) => void
  editPositionSL: (id: string, sl: number) => void
  editPositionTP: (id: string, tp: number) => void
  updateMT5Config: (updates: Partial<MT5Config>) => void
}

const MOCK_SIGNALS: Signal[] = [
  {
    id: "s1",
    pair: "XAU/USD",
    symbol: "XAUUSD",
    direction: "buy",
    entry: 2629.15,
    sl: 2614.4,
    tp: 2668.0,
    confidence: 87,
    bos: "4H Bullish Body Close @ 2,618.40",
    fvg: "2,621.80 – 2,638.50",
    poi: "Golden Zone 50–61.8% of FVG",
    tfAlignment: "1D → 4H → 1H ✓",
    rr: "1:5.3",
    lot: 0.1,
    layers: 1,
    slLocked: false,
    tpLocked: false,
    status: "pending",
    createdAt: new Date(),
  },
  {
    id: "s2",
    pair: "EUR/USD",
    symbol: "EURUSD",
    direction: "sell",
    entry: 1.0925,
    sl: 1.0948,
    tp: 1.088,
    confidence: 74,
    bos: "1H Bearish Body Close @ 1.09340",
    fvg: "1.09180 – 1.09360",
    poi: "FVG Retest Zone",
    tfAlignment: "4H → 1H → 15M ✓",
    rr: "1:2.9",
    lot: 0.05,
    layers: 1,
    slLocked: false,
    tpLocked: false,
    status: "pending",
    createdAt: new Date(),
  },
]

const MOCK_POSITIONS: Position[] = [
  {
    id: "p1",
    pair: "GBP/USD",
    direction: "buy",
    type: "market",
    entry: 1.2621,
    current: 1.26438,
    sl: 1.2598,
    tp: 1.271,
    lot: 0.1,
    slLocked: true,
    tpLocked: false,
    pnl: 228.0,
    rMultiple: 1.04,
    openedAt: new Date(),
  },
  {
    id: "p2",
    pair: "GBP/JPY",
    direction: "buy",
    type: "limit",
    entry: 190.8,
    current: 191.24,
    sl: 190.2,
    tp: 192.5,
    lot: 0.05,
    slLocked: false,
    tpLocked: true,
    pnl: 148.5,
    rMultiple: 0.72,
    openedAt: new Date(),
  },
  {
    id: "p3",
    pair: "BTC/USD",
    direction: "buy",
    type: "limit",
    entry: 95400,
    current: 96840,
    sl: 94200,
    tp: 98500,
    lot: 0.01,
    slLocked: false,
    tpLocked: false,
    pnl: 85.9,
    rMultiple: 0.57,
    openedAt: new Date(),
  },
]

export const useStore = create<AppState>((set) => ({
  activeTab: "overview",
  chartAsset: "XAUUSD",
  chartTF: "240",
  signals: MOCK_SIGNALS,
  positions: MOCK_POSITIONS,
  mt5Config: {
    accountId: "84291047",
    server: "Exness-MT5Real14",
    mode: "demo",
    autoPlacement: true,
    earlyWarning: true,
    respectUserLocked: true,
    connected: true,
    latency: 4,
    balance: 24850,
    equity: 25312.4,
    freeMargin: 24826.2,
    floatPnl: 462.4,
    leverage: "1:500",
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setChartAsset: (chartAsset) => set({ chartAsset }),
  setChartTF: (chartTF) => set({ chartTF }),

  updateSignal: (id, updates) =>
    set((state) => ({
      signals: state.signals.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  approveSignal: (id, lot, sl, tp) =>
    set((state) => {
      const sig = state.signals.find((s) => s.id === id)
      if (!sig) return state
      const newPos: Position = {
        id: `p_${Date.now()}`,
        pair: sig.pair,
        direction: sig.direction,
        type: "limit",
        entry: sig.entry,
        current: sig.entry,
        sl,
        tp,
        lot,
        slLocked: sig.slLocked,
        tpLocked: sig.tpLocked,
        pnl: 0,
        rMultiple: 0,
        openedAt: new Date(),
      }
      return {
        signals: state.signals.map((s) => (s.id === id ? { ...s, status: "placed" as SignalStatus, lot, sl, tp } : s)),
        positions: [newPos, ...state.positions],
      }
    }),

  rejectSignal: (id) =>
    set((state) => ({
      signals: state.signals.map((s) => (s.id === id ? { ...s, status: "rejected" as SignalStatus } : s)),
    })),

  closePosition: (id) =>
    set((state) => ({ positions: state.positions.filter((p) => p.id !== id) })),

  cancelLimit: (id) =>
    set((state) => ({ positions: state.positions.filter((p) => p.id !== id) })),

  editPositionSL: (id, sl) =>
    set((state) => ({
      positions: state.positions.map((p) => (p.id === id ? { ...p, sl } : p)),
    })),

  editPositionTP: (id, tp) =>
    set((state) => ({
      positions: state.positions.map((p) => (p.id === id ? { ...p, tp } : p)),
    })),

  updateMT5Config: (updates) =>
    set((state) => ({ mt5Config: { ...state.mt5Config, ...updates } })),
}))
