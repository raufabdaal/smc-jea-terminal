import { NextResponse } from "next/server"

// Mock SMC signal engine — replace with real MT5 bridge later
export async function GET() {
  const signals = [
    {
      id: `sig_${Date.now()}`,
      pair: "XAU/USD",
      symbol: "XAUUSD",
      direction: "buy",
      entry: 2629.15 + (Math.random() - 0.5) * 2,
      sl: 2614.4,
      tp: 2668.0,
      confidence: 85 + Math.floor(Math.random() * 10),
      bos: "4H Bullish Body Close @ 2,618.40",
      fvg: "2,621.80 – 2,638.50",
      poi: "Golden Zone 50–61.8% of FVG",
      tfAlignment: "1D → 4H → 1H ✓",
      rr: "1:5.3",
      createdAt: new Date().toISOString(),
    },
  ]
  return NextResponse.json({ signals, timestamp: new Date().toISOString() })
}
