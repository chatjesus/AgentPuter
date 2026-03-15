/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Primary dark backgrounds - pure black terminal
        'dark-primary': '#0D0D0D',
        'dark-secondary': '#111111',
        'dark-tertiary': '#1A1A1A',
        // Accent green - classic terminal (main)
        'accent': '#00FF41',
        'accent-dark': '#00CC33',
        // Terminal orange - for warnings/highlights
        'terminal-orange': '#FFAA33',
        'terminal-yellow': '#FFD700',
        // Terminal blue/cyan - for info/links
        'terminal-blue': '#00BFFF',
        'terminal-cyan': '#00CED1',
        // Terminal magenta - for special
        'terminal-magenta': '#FF55FF',
        // Text colors - terminal style
        'text-primary': '#E0E0E0',
        'text-secondary': '#808080',
        'text-muted': '#505050',
        'text-dark': '#404040',
        // Status colors
        'success': '#00FF41',
        'error': '#EF4444',
        'warning': '#FFAA33',
        'danger': '#F87171',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'JetBrains Mono Fallback', 'Fira Code', 'Consolas', 'monospace'],
        'sans': ['Inter', 'Inter Fallback', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
