export default defineEventHandler(async (event) => {
  // In real app, verify JWT token from headers
  // For now, return mock user data
  return {
    id: 1,
    email: 'test@example.com',
    name: 'Test User'
  }
})