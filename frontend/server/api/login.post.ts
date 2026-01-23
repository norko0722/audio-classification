export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Mock authentication - replace with real authentication logic
  if (body.email === 'test@example.com' && body.password === 'password') {
    return {
      user: {
        id: 1,
        email: body.email,
        name: 'Test User'
      },
      token: 'mock-jwt-token'
    }
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Invalid credentials'
  })
})