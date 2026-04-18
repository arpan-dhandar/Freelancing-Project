/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['font-300','font-400','font-500','font-600','font-700'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans:    ['"DM Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      fontWeight: { '300':'300','400':'400','500':'500','600':'600','700':'700' },
      colors: {
        canvas:         '#FAFAFA',
        ink:            '#111111',
        'ink-muted':    '#6B6B6B',
        'ink-faint':    '#AAAAAA',
        scarr: {
          red:          '#FF2D2D',
          'red-light':  '#FFE8E8',
          'red-dark':   '#CC0000',
        },
        pastel: {
          pink:   '#FFD6E0', blue:   '#C8E6FF', green:  '#C8F5E0',
          yellow: '#FFF3C4', purple: '#E8D5FF', orange: '#FFE0C8', coral: '#FFCDB8',
        },
        border:          '#E4E4E4',
        'border-strong': '#BBBBBB',
        surface:         '#FFFFFF',
        'surface-2':     '#F5F5F5',
      },
      boxShadow: {
        card:         '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.13)',
        btn:          '0 2px 8px rgba(0,0,0,0.08)',
        'btn-red':    '0 6px 20px rgba(255,45,45,0.3)',
        pop:          '3px 3px 0px #111111',
        'pop-red':    '3px 3px 0px #FF2D2D',
        'pop-sm':     '2px 2px 0px #111111',
      },
      borderRadius: { pill: '999px', '4xl': '2rem' },
      animation: {
        'marquee':     'marquee 28s linear infinite',
        'marquee-rev': 'marquee-rev 32s linear infinite',
        'fade-up':     'fadeUp 0.5s ease-out forwards',
        'pop-in':      'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
        'float':       'float 4s ease-in-out infinite',
        'shimmer':     'shimmer 1.8s infinite',
        'pulse-red':   'pulseRed 2s ease-in-out infinite',
      },
      keyframes: {
        marquee:       { '0%':{transform:'translateX(0)'},      '100%':{transform:'translateX(-50%)'} },
        'marquee-rev': { '0%':{transform:'translateX(-50%)'},   '100%':{transform:'translateX(0)'} },
        fadeUp:        { '0%':{opacity:'0',transform:'translateY(18px)'}, '100%':{opacity:'1',transform:'translateY(0)'} },
        popIn:         { '0%':{opacity:'0',transform:'scale(0.88)'}, '100%':{opacity:'1',transform:'scale(1)'} },
        float:         { '0%,100%':{transform:'translateY(0)'}, '50%':{transform:'translateY(-10px)'} },
        shimmer:       { '0%':{backgroundPosition:'-200% 0'},   '100%':{backgroundPosition:'200% 0'} },
        pulseRed:      { '0%,100%':{boxShadow:'0 0 0 0 rgba(255,45,45,0.4)'}, '50%':{boxShadow:'0 0 0 8px rgba(255,45,45,0)'} },
      },
    },
  },
  plugins: [],
};
