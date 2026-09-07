import { NextRequest, NextResponse } from "next/server"

// Mock MT5 bridge — replace body with real MetaTrader5 Python subprocess or WebSocket bridge
export async function GET() {
  return NextResponse.json({
    connected: true,
    server: "Exness-MT5Real14",
    latency: 4,
    account: {
      id: "84291047",
      balance: 24850,
      equity: 25312.4,
      freeMargin: 24826.2,
      usedMargin: 486.2,
      leverage: "1:500",
      floatPnl: 462.4,
    },
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, symbol, direction, entry, sl, tp, lot } = body

  // DEMO MODE: just echo back a success. In production, call MT5 Python bridge here.
  console.log("[MT5 MOCK] Order request:", { action, symbol, direction, entry, sl, tp, lot })

  if (action === "place_limit") {
    return NextResponse.json({
      success: true,
      orderId: `ord_${Date.now()}`,
      message: `[DEMO] ${direction.toUpperCase()} LIMIT placed on ${symbol} @ ${entry}`,
      timestamp: new Date().toISOString(),
    })
  }

  if (action === "close_position") {
    return NextResponse.json({
      success: true,
      message: `[DEMO] Position closed`,
      timestamp: new Date().toISOString(),
    })
  }

  return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 })
}
