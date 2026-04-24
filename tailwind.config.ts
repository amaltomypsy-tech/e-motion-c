import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07060A",
          900: "#0B0A10",
          800: "#151321",
          700: "#1E1B2E"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 18px 60px rgba(0,0,0,0.55)"
      }
    }
  },
  plugins: []
} satisfies Config;
