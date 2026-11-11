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
        // Màu Vàng Kim / Gold chủ đạo của Logo GT
        gold: {
          50: "#fffdf0",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#f59e0b", // Amber Gold rực rỡ
          600: "#d97706", // Royal Gold
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Màu Xanh Dương / Cyan Azure của chữ GT
        azure: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#00a7e6", // Màu Cyan Azure chuẩn từ Logo.png
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#00a7e6",
          600: "#0284c7",
          700: "#1d4ed8",
          800: "#1e3a8a",
          900: "#0f1e36",
          950: "#070d1e", // Midnight Navy sâu thẳm
        },
        accent: {
          50: "#fffdf0",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
    },
  },
  plugins: [],
};
export default config;
