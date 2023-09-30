/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        screens: {
            'sm': '320px',
            'md': '540px',
            'lg' : '640px'
        },
        fontFamily: {
            sans: ['Mulish', 'sans-serif'],
            heading: ['Poppins', 'serif'],
        },
        extend: {
            colors: {
                primary: {
                    dark: "#023047",
                    dark15: "#02304726",
                    middle: "#219ebc",
                    middle15: "#219ebc26",
                    light: "#8ecae6",
                    light15: "#8ecae266"
                },
                secondary: {
                    dark: "#fb8500",
                    dark15: "#fb850026",
                    middle: "#ffb703",
                    middle15: "#ffb70326",
                    light: "#EED8A4",
                    light15: "#EED8A426"
                },
                dark: "#023047",
                middleDark: "#53576a",
                lightyellow: "#fefdf2",
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
}