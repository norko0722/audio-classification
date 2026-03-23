export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const token = localStorage.getItem('token')

    if (!token) {
        throw createError({
        statusCode: 403,
        message: 'You need to be logged in to access the GTZAN classification tools.'
    })
    }
  }
})