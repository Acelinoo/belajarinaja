import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [require("./piardify.preset.js")],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Neo-Brutalism Light Mode Tokens
        neo: {
          bg: "#F7F4EA",
          surface: "#FFFFFF",
          ink: "#121212",
          yellow: "#FFD84D",
          "yellow-hover": "#F5CB32",
          blue: "#70B7FF",
          pink: "#FF6FAE",
          green: "#7BE495",
          orange: "#FF9B54",
          red: "#FF6B6B",
          muted: "#EAE4D5",
          border: "#121212",
        },
        // Obsidian Command Center Dark Mode Tokens (No Purple)
        obsidian: {
          base: "#05070A",
          surface: "#090D12",
          elevated: "#0F141A",
          highlight: "#151B22",
          sidebar: "#090D12",
          sunken: "#05070A",
          border: "#1C242D",
          borderStrong: "#26313C",
          cyan: "#22D3EE",
          "cyan-light": "#67E8F9",
          blue: "#38BDF8",
          emerald: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
        },
        // Playful Learning World Fun Mode Tokens (No Purple)
        fun: {
          bg: "#FFF8E7",
          surface: "#FFFFFF",
          ink: "#243447",
          sky: "#5CC8FF",
          mint: "#45E0C0",
          sun: "#FFD84D",
          orange: "#FF9F43",
          coral: "#FF6B6B",
          green: "#5EDC81",
          border: "#E2E8F0",
          borderWarm: "#FED7AA",
        },
      },
      boxShadow: {
        neo: "4px 4px 0px 0px #121212",
        "neo-sm": "2px 2px 0px 0px #121212",
        "neo-md": "5px 5px 0px 0px #121212",
        "neo-lg": "7px 7px 0px 0px #121212",
        "neo-xl": "10px 10px 0px 0px #121212",
        "neo-yellow": "4px 4px 0px 0px #FFD84D",
        "neo-blue": "4px 4px 0px 0px #70B7FF",
        "neo-pink": "4px 4px 0px 0px #FF6FAE",
        "neo-green": "4px 4px 0px 0px #7BE495",
      },
      borderWidth: {
        "2.5": "2.5px",
        "3": "3px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
