/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue"
    ],
    theme: {
        extend: {
            fontFamily: {
                'playfair': ['Playfair Display', 'serif'],
                'poppins': ['Poppins', 'sans-serif'],
            },
            colors: {
                'gold': {
                    50: '#fefce8',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                'royal': {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                }
            },
            animation: {
                'gold-glow': 'goldGlow 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'party': 'party 1s ease-in-out infinite',
            },
            keyframes: {
                goldGlow: {
                    '0%, 100%': {
                        boxShadow: '0 0 5px rgba(255, 215, 0, 0.3)'
                    },
                    '50%': {
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4)'
                    },
                },
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0px) rotate(0deg)'
                    },
                    '50%': {
                        transform: 'translateY(-10px) rotate(5deg)'
                    },
                },
                party: {
                    '0%, 100%': {
                        transform: 'scale(1) rotate(0deg)'
                    },
                    '50%': {
                        transform: 'scale(1.1) rotate(10deg)'
                    },
                }
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
