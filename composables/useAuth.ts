export const useAuth = () => {
  const pb = usePb()
  const user = useState('user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  const checkAuth = () => {
    if (pb.authStore.isValid) {
      user.value = pb.authStore.model
      return true
    }
    user.value = null
    return false
  }

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password)
      user.value = authData.record
      return { success: true }
    } catch {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }
  }

  const logout = () => {
    pb.authStore.clear()
    user.value = null
    navigateTo('/admin/login')
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}
