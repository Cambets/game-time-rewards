/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0f1d',
        surface: {
          DEFAULT: '#0f172a',
          card: '#131d36',
          muted: '#1e293b',
          border: '#334155',
        },
        gamer: {
          purple: {
            DEFAULT: '#8b5cf6',
            glow: '#a855f7',
            light: '#c084fc',
            dark: '#581c87',
          },
          green: {
            DEFAULT: '#10b981',
            glow: '#34d399',
            light: '#6ee7b7',
            dark: '#064e3b',
          },
          cyan: {
            DEFAULT: '#06b6d4',
            glow: '#22d3ee',
          },
          rose: {
            DEFAULT: '#f43f5e',
            glow: '#fb7185',
            dark: '#881337',
          },
          amber: {
            DEFAULT: '#f59e0b',
            glow: '#fbbf24',
          }
        }
      },
      boxShadow: {
        'glow-purple': '0 0 25px -3px rgba(139, 92, 246, 0.45)',
        'glow-green': '0 0 25px -3px rgba(16, 185, 129, 0.45)',
        'glow-rose': '0 0 25px -3px rgba(244, 63, 94, 0.45)',
        'glow-cyan': '0 0 25px -3px rgba(6, 182, 212, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'scale-up': 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(2px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
