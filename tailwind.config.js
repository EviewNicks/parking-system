/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom parking system colors
        parking: {
          available: "var(--parking-available)",
          occupied: "var(--parking-occupied)",
          maintenance: "var(--parking-maintenance)",
          error: "var(--parking-error)",
        },
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
        // Custom parking animations
        "slot-appear": {
          "0%": {
            opacity: "0",
            transform: "translateY(50px) rotateX(45deg) scale(0.8)",
          },
          "50%": {
            opacity: "0.7",
            transform: "translateY(10px) rotateX(25deg) scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) rotateX(0deg) scale(1)",
          },
        },
        "status-change-glow": {
          "0%": {
            transform: "rotateX(10deg) rotateY(-5deg) scale(1)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
          },
          "25%": {
            transform: "rotateX(10deg) rotateY(-5deg) scale(1.02)",
          },
          "50%": {
            transform: "rotateX(10deg) rotateY(-5deg) scale(1.05)",
            boxShadow: "0 20px 40px var(--shadow-color), 0 0 30px currentColor",
          },
          "75%": {
            transform: "rotateX(10deg) rotateY(-5deg) scale(1.02)",
          },
          "100%": {
            transform: "rotateX(10deg) rotateY(-5deg) scale(1)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
          },
        },
        "connection-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: "0.8",
          },
        },
        "real-time-ping": {
          "0%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
        "barrier-rotate": {
          "0%": {
            transform: "rotateZ(0deg)",
          },
          "100%": {
            transform: "rotateZ(85deg) translateY(-15px) translateX(25px)",
          },
        },
        "car-bounce": {
          "0%, 100%": {
            transform: "translateZ(20px) translateY(0px)",
          },
          "50%": {
            transform: "translateZ(25px) translateY(-5px)",
          },
        },
        "gate-warning": {
          "0%, 100%": {
            boxShadow: "0 0 5px currentColor",
          },
          "50%": {
            boxShadow: "0 0 20px currentColor, 0 0 30px currentColor",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Custom parking animations
        "slot-appear": "slot-appear 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "status-glow": "status-change-glow 1s ease-in-out",
        "connection-pulse": "connection-pulse 2s ease-in-out infinite",
        "real-time-ping": "real-time-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "barrier-open": "barrier-rotate 1s ease-in-out forwards",
        "car-bounce": "car-bounce 0.6s ease-in-out infinite",
        "gate-warning": "gate-warning 1s ease-in-out infinite",
      },
      // Custom CSS variables for 3D effects
      perspective: {
        parking: "var(--perspective-distance)",
      },
      transformOrigin: {
        parking: "50% 30%",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}