export const cookies = {
  httpOnly: true,
  secure: true,        // ✅ obligatorio si usás sameSite: 'none'
  sameSite: 'none',
  path: '/',
  maxAge: 3600000
}
