module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        fontSize: {
            11: '11px',
            13: '13px',
            15: '15px',
            xs: '.75rem',
            sm: '.875rem',
            tiny: '.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '4rem',
            '7xl': '5rem',
        },
        extend: {
            lineHeight: {
                0: '0',
            },
            screens: {},
            keyframes: {
                slideInRight: {
                    '0%': {
                        transform: 'translateX(100%)',
                    },
                    '100%': {
                        transform: 'translateX(0)',
                    },
                },
            },
            animation: {
                slideInRight: 'slideInRight 0.5s linear forwards',
            },
        },
        screens: {
            xs: '576px',
            sm: '640px',
            md: '768px',
            lg: '900px',
            llg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
    },
    variants: {
        extend: {},
    },

    plugins: [require('@tailwindcss/line-clamp')],
};
