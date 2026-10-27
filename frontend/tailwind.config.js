/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ghost: {
          bg: "#070a07",
          panel: "#0b100c",
          panelBorder: "#19291c",
          green: "#38ef7d",
          greenDim: "#1d7943",
          greenGlow: "#2bfd72",
          amber: "#e69b22",
          amberDim: "#784e0e",
          crimson: "#d63031",
          crimsonDim: "#5c1414",
          text: "#a4e5b5",
          muted: "#486a51",
          ghostWhite: "#c9ecd3"
        }
      },
      fontFamily: {
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Cascadia Code',
          'Courier New',
          'monospace'
        ]
      },
      boxShadow: {
        'phosphor': '0 0 10px rgba(56, 239, 125, 0.3)',
        'phosphor-lg': '0 0 25px rgba(56, 239, 125, 0.25)',
        'crimson-glow': '0 0 15px rgba(214, 48, 49, 0.35)',
        'amber-glow': '0 0 15px rgba(230, 155, 34, 0.35)'
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.98' },
          '50%': { opacity: '0.94' },
          '70%': { opacity: '0.99' },
          '85%': { opacity: '0.95' }
        },
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(56,239,125,0.4))' },
          '50%': { filter: 'drop-shadow(0 0 10px rgba(56,239,125,0.8))' }
        }
      },
      animation: {
        flicker: 'flicker 4s infinite ease-in-out',
        pulseGlow: 'pulseGlow 2.5s infinite ease-in-out'
      }
    },
  },
  plugins: [],
}
