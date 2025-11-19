export const useAuth = () => {
  const supabase = useSupabase()
  const user = useState('user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  // Vérifier si l'utilisateur est connecté au chargement
  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      // Vérifier la validité du token
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', token)
        .single()

      if (data && !error) {
        user.value = data
        return true
      } else {
        localStorage.removeItem('admin_token')
      }
    }
    return false
  }

  // Connexion
  const login = async (password: string) => {
    try {
      // Vérifier le mot de passe
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('password', password)
        .single()

      if (error || !data) {
        throw new Error('Mot de passe incorrect')
      }

      // Stocker le token (ici on utilise l'ID, mais tu peux générer un vrai token JWT)
      localStorage.setItem('admin_token', data.id)
      user.value = data
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('admin_token')
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
