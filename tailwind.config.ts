import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Aurora theme colors
        aurora: {
          lavender: "#C7CEEA",
          skyblue: "#A7FFEB", 
          blushpink: "#FFB7B2",
        },
        dark: {
          navy: "#1A1A2E",
          purple: "#16213E",
          teal: "#0F3460",
        },
        glow: {
          teal: "#4FD1C7",
          purple: "#9F7AEA",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "aura-pulse": {
          "0%, 100%": { 
            transform: "scale(1)", 
            opacity: "0.7" 
          },
          "50%": { 
            transform: "scale(1.1)", 
            opacity: "1" 
          },
        },
        "breathe": {
          "0%, 100%": { 
            transform: "scale(1)" 
          },
          "50%": { 
            transform: "scale(1.1)" 
          },
        },
        "gentle-glow": {
          "0%": { 
            boxShadow: "0 0 10px rgba(132, 250, 176, 0.3)" 
          },
          "50%": { 
            boxShadow: "0 0 20px rgba(132, 250, 176, 0.6)" 
          },
          "100%": { 
            boxShadow: "0 0 10px rgba(132, 250, 176, 0.3)" 
          },
        },
        "float": {
          "0%, 100%": { 
            transform: "translateY(0px)" 
          },
          "50%": { 
            transform: "translateY(-10px)" 
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "aura-pulse": "aura-pulse 3s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "gentle-glow": "gentle-glow 2s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite",
      },
      backgroundImage: {
        "aurora-gradient": "linear-gradient(135deg, #C7CEEA 0%, #A7FFEB 50%, #FFB7B2 100%)",
        "dark-aurora": "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #1A1A2E 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
