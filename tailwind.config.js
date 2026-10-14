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
        background: '#0c0d14',
        surface: {
          DEFAULT: '#10121d',
          card: '#131522',
          muted: '#181b2c',
          border: '#23273e',
        },
        stitch: {
          dark: '#0c0d14',
          card: '#131522',
          cardLight: '#181b2c',
          border: '#23273e',
          mint: {
            DEFAULT: '#10e599',
            glow: '#00df8f',
            dark: '#064e3b',
          },
          purple: {
            DEFAULT: '#8b5cf6',
            glow: '#a855f7',
            light: '#c084fc',
            dark: '#4c1d95',
          },
          gold: {
            DEFAULT: '#ffb800',
            glow: '#ffa000',
            dark: '#78350f',
          },
          rose: {
            DEFAULT: '#f43f5e',
            glow: '#fb7185',
            dark: '#881337',
          }
        },
        gamer: {
          purple: {
            DEFAULT: '#8b5cf6',
            glow: '#a855f7',
            light: '#c084fc',
            dark: '#581c87',
          },
          green: {
            DEFAULT: '#10e599',
            glow: '#00df8f',
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
            DEFAULT: '#ffb800',
            glow: '#ffa000',
          }
        }
      },
      boxShadow: {
        'glow-purple': '0 0 25px -2px rgba(139, 92, 246, 0.45)',
        'glow-green': '0 0 25px -2px rgba(16, 229, 153, 0.45)',
        'glow-mint': '0 0 25px -2px rgba(16, 229, 153, 0.5)',
        'glow-gold': '0 0 25px -2px rgba(255, 184, 0, 0.45)',
        'glow-rose': '0 0 25px -2px rgba(244, 63, 94, 0.45)',
        'glow-cyan': '0 0 25px -2px rgba(6, 182, 212, 0.45)',
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
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
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
