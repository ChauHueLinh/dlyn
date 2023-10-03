// npx tailwindcss -i ./public/assets/tailwind/input.css -o ./public/assets/tailwind/output.css --watch --minify

module.exports = {
    content: [
        "./resources/**/*.{php,js,jsx}",
        "./resources/views/**/*.{php,js}"
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/aspect-ratio')
    ],
}