import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15161C",
        paper: "#F7F5EF",
        "paper-dim": "#EDEAE0",
        accent: "#FF4D2E",
        "accent-2": "#3450FF",
        "accent-3": "#C8FF4D",
        muted: "#8A8578",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        wrap: "74rem",
      },
    },
  },
  plugins: [],
};

export default config;
