# SMC · JEA · FX — Institutional Trading Terminal

$50,000-tier Institutional SMC/JEA FX Automated Execution & Decision Terminal.

## Stack

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Zustand** (client-side state)
- **TradingView** Advanced Charting Widget
- **MT5 API Routes** (mock/demo — real bridge ready to wire in)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

| Tab | Description |
|-----|-------------|
| Overview | Account HUD, 6-pair watchlist, inter-market context |
| SMC Chart Terminal | TradingView embed + live SMC Golden Zone panel with FVG visualizer |
| Trade Approvals | Human-in-the-Loop signal approval: lot sizing, layer control, USER_LOCKED SL/TP, confidence ring, live R:R calculator |
| Active Positions | Live position board with inline SL/TP editing, USER_LOCKED indicator, close/cancel actions |
| Exness MT5 Config | Broker credentials, automation toggles, server status & account metrics |
| Analytics | 14-day PnL bars, pair breakdown, confidence distribution, session performance |

## MT5 Bridge (Production)

`src/app/api/mt5/route.ts` is currently a **mock/demo** endpoint.  
To wire up real execution, replace the POST handler with a call to your Python FastAPI service running the `MetaTrader5` library:

```
POST /api/mt5  →  your_bridge_host:8000/order
```

Or connect directly to the Exness REST API from the same route file.

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_MT5_API_URL=http://localhost:8000   # your Python MT5 bridge
```

## Project Structure

```
src/
  app/
    api/
      mt5/route.ts        ← MT5 bridge (mock → replace with real)
      signals/route.ts    ← SMC signal feed (mock → replace with real)
    page.tsx              ← Root page
    layout.tsx
    globals.css
  components/
    TopBar.tsx            ← UTC clock, connection pill, account HUD
    TabBar.tsx            ← 6-tab navigation with live badges
    tabs/
      OverviewTab.tsx
      ChartTab.tsx
      ApprovalsTab.tsx    ← Full HITL approval workflow
      PositionsTab.tsx
      MT5ConfigTab.tsx
      AnalyticsTab.tsx
  store/
    useStore.ts           ← Zustand store (signals, positions, MT5 config)
  lib/
    utils.ts              ← cn(), formatCurrency(), calcRiskReward()
```
