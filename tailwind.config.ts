import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F0E6D2",
        "paper-dim": "#E6D9BE",
        ink: "#2B2620",
        denim: "#3E5C76",
        "denim-dark": "#293F52",
        rust: "#A85C32",
        "rust-dark": "#7E4324",
        dust: "#8B8577",
        "dust-line": "#D9CFB0",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        brand: ["var(--font-brand)", "serif"],
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};
export default config;
