export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: '/cq-generator/',
  },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  devServer: {
    port: 6793,
  },
});
