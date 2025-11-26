<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo et navigation -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/admin" class="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
              Admin Portfolio
            </NuxtLink>
          </div>
          <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
            <NuxtLink
              to="/admin"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/admin' }"
            >
              <Icon name="mdi:view-dashboard" class="w-5 h-5 mr-2" />
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/admin/projects"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/admin/projects' }"
            >
              <Icon name="mdi:folder-multiple" class="w-5 h-5 mr-2" />
              Projets
            </NuxtLink>
            <NuxtLink
              to="/admin/skills"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/admin/skills' }"
            >
              <Icon name="mdi:tools" class="w-5 h-5 mr-2" />
              Skills
            </NuxtLink>
            <NuxtLink
              to="/admin/categories"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/admin/categories' }"
            >
              <Icon name="mdi:shape" class="w-5 h-5 mr-2" />
              Catégories
            </NuxtLink>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-3">
          <NuxtLink
            to="/"
            class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Icon name="mdi:arrow-left" class="w-4 h-4 mr-2" />
            Retour au site
          </NuxtLink>
          <button
            @click="handleLogout"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
          >
            <Icon name="mdi:logout" class="w-4 h-4 mr-2" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const { logout } = useAuth()

const handleLogout = () => {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    logout()
  }
}
</script>

<style scoped>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors;
}

.nav-link-active {
  @apply border-black text-gray-900;
}
</style>