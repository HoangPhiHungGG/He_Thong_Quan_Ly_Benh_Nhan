// tailwind.config.js

import { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      // BẢNG MÀU SÁNG & CHUYÊN NGHIỆP
      colors: {
        background: "#F8F9FA", // Nền chính, màu xám rất nhạt
        foreground: "#FFFFFF", // Nền cho các card, modal
        primary: {
          DEFAULT: "#0D6EFD", // Xanh dương hiện đại, đáng tin cậy
          foreground: "#FFFFFF",
          light: "#E7F0FF", // Màu nền nhẹ cho các trạng thái hover
        },
        secondary: {
          DEFAULT: "#6C757D", // Xám trung tính cho văn bản phụ
        },
        destructive: {
          DEFAULT: "#DC3545",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#198754",
          foreground: "#FFFFFF",
        },
        text: {
          primary: "#212529", // Màu chữ chính (đen đậm)
          secondary: "#6C757D", // Màu chữ phụ
        },
        border: "#DEE2E6",
        input: "#CED4DA",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      backgroundImage: {
        appointments: "linear-gradient(135deg, #E7F0FF 0%, #CDE4FF 100%)",
        pending: "linear-gradient(135deg, #FFF3CD 0%, #FFEBAA 100%)",
        cancelled: "linear-gradient(135deg, #F8D7DA 0%, #F5C6CB 100%)",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.05)",
        input: "0 1px 2px rgba(0, 0, 0, 0.05)",
        button: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
