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
        // 3 ColorHunt Palette Themes
        palette: {
          // Light Mode (#FAFAFA, #E8F1F5, #005691, #004A7C)
          light: {
            canvas: "#FAFAFA",
            ice: "#E8F1F5",
            ocean: "#005691",
            navy: "#004A7C",
          },
          // Dark Mode (#DBD8E3, #5C5470, #352F44, #2A2438)
          dark: {
            base: "#2A2438",
            surface: "#352F44",
            border: "#5C5470",
            lavender: "#DBD8E3",
          },
          // Fun Mode (#218DAE, #2BBBD7, #FCE59A, #FFD758)
          fun: {
            teal: "#218DAE",
            cyan: "#2BBBD7",
            vanilla: "#FCE59A",
            sun: "#FFD758",
          },
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
