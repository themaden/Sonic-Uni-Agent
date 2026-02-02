import type { Config } from 'tailwindcss';

const config: Config = {

    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
       "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
   theme: {
    extend: {
      colors: {
        sonic: {
          dark: "#050b14",     // 
          card: "#0a1122",     // 
          cyan: "#00f0ff",      
          purple: "#bc13fe",   
          border: "#1e293b",   
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
        'cyber-gradient': "radial-gradient(circle at center, rgba(0, 240, 255, 0.15) 0%, transparent 70%)",
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 2s linear infinite',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'monospace'], // Terminal için
      }
    },
  },
  plugins: [],
}

export default config;