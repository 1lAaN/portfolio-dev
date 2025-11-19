<template>
  <div class="min-h-screen bg-gray-50">
    <AdminAdminNav />
    <main class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
// Le layout admin utilise le middleware auth
definePageMeta({
  middleware: 'auth'
})
</script>
