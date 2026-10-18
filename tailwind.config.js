/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        otb: {
          teal: '#003432',
          tealDark: '#002625',
          cyan: '#0BB4D2',
          cyanHover: '#0997b1',
          grayBg: '#efefef',
          bodyText: '#4d4e4f'
        },
        obsidian: {
          950: '#070c18',
          900: '#0f172a',
          850: '#131f37',
          800: '#1b2a47', // Deep Navy / Corporate Obsidian
          700: '#24365c',
          600: '#314878',
          500: '#435e98',
          100: '#e2e8f0',
          50: '#f8fafc'
        },
        canvas: '#f4f6f9',
        emerald: {
          accent: '#28a745',
          dark: '#1e7e34',
          light: '#eafaf1'
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Segoe UI', 'Roboto', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        source: ['"Source Sans Pro"', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace']
      },
      backgroundImage: {
        'gradient-mountain': 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
        'gradient-obsidian': 'linear-gradient(180deg, #1b2a47 0%, #0f172a 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'elevated': '0 10px 30px -5px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.06)'
      }
    },
  },
  plugins: [],
}
