import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0284c7",
          600: "#0369a1",
          700: "#1d4ed8", // Deep Corporate Royal Blue
          800: "#1e3a8a", // Navy Blue
          900: "#0f1e36", // Midnight Blue
          950: "#0b132b", // Deep Obsidian Executive
        },
        accent: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0284c7", // Sky / Electric Cyan
          600: "#0369a1",
          700: "#075985",
          800: "#0c4a6e",
          900: "#082f49",
        },
        corporate: {
          navy: "#0F1E36",
          blue: "#1E3A8A",
          cobalt: "#2563EB",
          cyan: "#0284C7",
          slate: "#334155",
          light: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
};
export default config;
