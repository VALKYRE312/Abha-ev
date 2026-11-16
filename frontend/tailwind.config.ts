import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        // ========== ABHA ENTERPRISE BRAND PALETTE ==========
        'space-cadet': {
          DEFAULT: '#25344F',
          50: '#f5f7fa',
          100: '#e9ecf2',
          200: '#d3dae5',
          300: '#b1bdd2',
          400: '#8899ba',
          500: '#617891',
          600: '#4d6178',
          700: '#3f4f63',
          800: '#25344F',
          900: '#1a2537',
        },
        'slate-gray': {
          DEFAULT: '#617891',
          50: '#f6f8fa',
          100: '#edf1f4',
          200: '#dce3ea',
          300: '#c0ced9',
          400: '#9fb0c2',
          500: '#617891',
          600: '#4d6178',
          700: '#3f4f63',
          800: '#2d3a4b',
          900: '#1f2937',
        },
        'tan': {
          DEFAULT: '#D5B893',
          50: '#faf8f4',
          100: '#f5f0e6',
          200: '#ebe0cc',
          300: '#e0cfb2',
          400: '#D5B893',
          500: '#c9a878',
          600: '#b4915f',
          700: '#947749',
          800: '#6F4D38',
          900: '#4a3325',
        },
        'coffee': {
          DEFAULT: '#6F4D38',
          50: '#faf7f5',
          100: '#f4ede8',
          200: '#e8dbd1',
          300: '#d7c1ae',
          400: '#c19f83',
          500: '#a47d5f',
          600: '#8b6749',
          700: '#6F4D38',
          800: '#5a3d2d',
          900: '#3d2920',
        },
        'caput-mortuum': {
          DEFAULT: '#632024',
          50: '#fef5f6',
          100: '#fde9eb',
          200: '#fbd3d7',
          300: '#f7a8b0',
          400: '#f17684',
          500: '#e53e51',
          600: '#c92a3d',
          700: '#a21f31',
          800: '#632024',
          900: '#4a181b',
        },
        
        // ========== SEMANTIC TOKENS ==========
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          active: "hsl(var(--primary-active))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-hover))",
          active: "hsl(var(--secondary-active))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          hover: "hsl(var(--destructive-hover))",
          active: "hsl(var(--destructive-active))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
          active: "hsl(var(--accent-active))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          hover: "hsl(var(--card-hover))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      boxShadow: {
        'brand': '0 4px 6px -1px rgb(37 52 79 / 0.1), 0 2px 4px -2px rgb(37 52 79 / 0.1)',
        'brand-lg': '0 10px 15px -3px rgb(37 52 79 / 0.1), 0 4px 6px -4px rgb(37 52 79 / 0.1)',
        'brand-xl': '0 20px 25px -5px rgb(37 52 79 / 0.1), 0 8px 10px -6px rgb(37 52 79 / 0.1)',
        'tan': '0 4px 14px 0 rgba(213, 184, 147, 0.4)',
        'tan-lg': '0 8px 24px 0 rgba(213, 184, 147, 0.5)',
        'caput-mortuum': '0 4px 14px 0 rgba(99, 32, 36, 0.3)',
        'caput-mortuum-lg': '0 8px 24px 0 rgba(99, 32, 36, 0.4)',
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-in-out",
        "slide-in": "slide-in-from-top 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
