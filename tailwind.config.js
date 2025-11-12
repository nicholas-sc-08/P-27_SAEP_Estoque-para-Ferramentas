// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Adicione os caminhos dos seus arquivos para que o Tailwind possa escanear as classes
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Ou o caminho padrão para a pasta src, se você não tiver as pastas app/pages/components na raiz
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {}, // Aqui você adiciona temas customizados
  },
  plugins: [
    // 👈 ESTA LINHA É ESSENCIAL
    require('tailwindcss-animate'),
  ],
}