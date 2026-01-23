export default defineEventHandler(async (event) => {
  // In real app, invalidate the token
  return { success: true }
})