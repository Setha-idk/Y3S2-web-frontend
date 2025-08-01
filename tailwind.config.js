/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    "./index.html", "./src/**/*.{vue,js,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
