import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number, decimals = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}

export function calcRiskReward(
  entry: number,
  sl: number,
  tp: number,
  lot: number,
  isGold = false
): { risk: number; reward: number; rr: number } {
  const multiplier = isGold ? 100 : 10000
  const risk = Math.abs(entry - sl) * lot * multiplier
  const reward = Math.abs(tp - entry) * lot * multiplier
  return { risk, reward, rr: risk > 0 ? reward / risk : 0 }
}

export function pad(n: number): string {
  return String(n).padStart(2, "0")
}
