import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          turquoise: "#64D8DF",
          lilac: "#B58AD7",
          dark: "#2E2E2E",
          accent: "#FFE38F"
        }
      },
      boxShadow: {
        soft: "0 10px 20px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
