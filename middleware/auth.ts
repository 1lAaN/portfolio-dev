export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  const { checkAuth } = useAuth()
  const isAuthenticated = checkAuth()

  if (!isAuthenticated && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }

  if (isAuthenticated && to.path === '/admin/login') {
    return navigateTo('/admin')
  }
})
