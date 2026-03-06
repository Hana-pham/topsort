import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ts: {
          DEFAULT: "#FF5C00",
          mid: "#FF7A2E",
          pale: "#FFF0E6",
        },
        cream: {
          DEFAULT: "#FAF7F2",
          2: "#F4F0E8",
          3: "#EDE7DA",
        },
        ink: {
          DEFAULT: "#1A1410",
          mid: "#4A3F35",
          muted: "#9A8E82",
          faint: "#C8BFB5",
        },
        brand: {
          green: "#1A7A52",
          amber: "#B05E00",
          red: "#C0392B",
          blue: "#1A5FA8",
        },
      },
      fontFamily: {
        sans:  ["DM Sans", "sans-serif"],
        mono:  ["DM Mono", "monospace"],
        serif: ["Playfair Display", "serif"],
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
      },
      animation: {
        "pulse-green":  "pulseGreen 2.5s infinite",
        "pulse-orange": "pulseOrange 2s infinite",
        "fade-up":      "fadeUp 0.5s ease both",
        "fade-right":   "fadeRight 0.5s ease both",
      },
      keyframes: {
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(26,122,82,0.4)" },
          "50%":       { boxShadow: "0 0 0 4px rgba(26,122,82,0)" },
        },
        pulseOrange: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,92,0,0.4)" },
          "50%":       { boxShadow: "0 0 0 4px rgba(255,92,0,0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeRight: {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
