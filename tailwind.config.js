/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                'josefin': ['"Josefin Sans"', 'sans-serif'], // Añade la fuente personalizada
            },
        },
    },
    plugins: [],
}

