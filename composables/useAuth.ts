export const useAuth = () => {
  const supabase = useSupabase()
  const user = useState('user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      user.value = session.user
      return true
    }
    user.value = null
    return false
  }

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error('Email ou mot de passe incorrect')
      user.value = data.user
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
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
