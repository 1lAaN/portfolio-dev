<template>
  <NuxtLink to="/" class="text-gray-600 hover:text-gray-600 transition-colors text-xs">
              Retour à l'accueil
            </NuxtLink>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Administration
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Connectez-vous pour accéder au panneau d'administration
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="password" class="sr-only">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            name="password"
            type="password"
            required
            class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:z-10 sm:text-sm"
            placeholder="Mot de passe"
          >
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <Icon name="mdi:alert-circle" class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">
                {{ error }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Se connecter</span>
            <span v-else class="flex items-center">
              <Icon name="mdi:loading" class="animate-spin h-5 w-5 mr-2" />
              Connexion...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: 'auth'
})

const { login } = useAuth()
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await login(password.value)
    
    if (result.success) {
      navigateTo('/admin')
    } else {
      error.value = result.error || 'Mot de passe incorrect'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>
