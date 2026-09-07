import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#03050a",
        deep: "#060a10",
        surface: "#0a1118",
        card: "#0e1826",
        gold: "#d4af37",
        "gold-bright": "#f0d060",
        "accent-blue": "#4090f8",
        "accent-green": "#00e0a0",
        "accent-red": "#ff4466",
        "accent-cyan": "#00ccff",
        "accent-orange": "#ff9500",
        "text-primary": "#dde8f8",
        "text-secondary": "#7a9cc4",
        "text-muted": "#3d5878",
        "border-subtle": "rgba(50,100,200,0.14)",
        "border-accent": "rgba(50,100,200,0.32)",
        "border-gold": "rgba(212,175,55,0.35)",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        ui: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        "glow-blue": "0 0 18px rgba(64,144,248,0.2)",
        "glow-green": "0 0 18px rgba(0,224,160,0.2)",
        "glow-red": "0 0 18px rgba(255,68,102,0.2)",
        "glow-gold": "0 0 18px rgba(212,175,55,0.25)",
      },
      keyframes: {
        blink: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.4)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        blink: "blink 2s infinite",
        "slide-in": "slide-in 0.25s ease",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
