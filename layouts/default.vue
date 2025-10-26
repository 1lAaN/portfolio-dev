<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-white">
    <LayoutHeader />
    <main>
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>