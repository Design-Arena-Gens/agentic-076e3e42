import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      },
      colors: {
        primary: {
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF"
        },
        accent: {
          DEFAULT: "#22D3EE",
          foreground: "#020617"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(99, 102, 241, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
