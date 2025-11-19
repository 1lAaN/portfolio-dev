export default defineNuxtRouteMiddleware(async (to, from) => {
  // Ne pas exécuter côté serveur
  if (process.server) return

  const { checkAuth } = useAuth()
  const isAuthenticated = await checkAuth()

  // Si pas authentifié et qu'on essaie d'accéder à une page admin (sauf login)
  if (!isAuthenticated && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }

  // Si authentifié et qu'on essaie d'accéder au login, rediriger vers le dashboard
  if (isAuthenticated && to.path === '/admin/login') {
    return navigateTo('/admin')
  }
})
