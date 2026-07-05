module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#0F172A',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        surface: '#F8FAFC',
        // Brand colors to match the provided mockup (deep navy + cyan accents)
        brand: {
          DEFAULT: '#071A2F',
          600: '#0b355f',
          500: '#0b3b6f',
        },
        panel: '#081425',
        accent: '#06B6D4',
      },
    },
  },
  plugins: [],
};
