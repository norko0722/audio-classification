// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-18',
  modules: ['@nuxtjs/tailwindcss', '@sidebase/nuxt-auth'],
  auth: {
    baseURL: 'http://localhost:3001',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/api/login', method: 'post' },
        signOut: { path: '/api/logout', method: 'post' },
        signUp: { path: '/api/signup', method: 'post' },
        getSession: { path: '/api/user', method: 'get' }
      },
      pages: {
        login: '/signin'
      }
    }
  }
})
