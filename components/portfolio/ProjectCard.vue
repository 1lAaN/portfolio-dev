<template>
  <div class="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
    <!-- Image du projet -->
    <div class="relative h-48 overflow-hidden bg-gray-100">
      <img 
        v-if="project.image_url"
        :src="project.image_url" 
        :alt="project.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      >
      <div 
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
      >
        <Icon name="mdi:image-outline" class="w-12 h-12 text-gray-400" />
      </div>
      
      <!-- Overlay au hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <!-- Actions rapides -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="flex space-x-3">
          <UI-Button
            v-if="project.demo_url"
            :href="project.demo_url"
            external
            variant="primary"
            size="sm"
            icon-left="mdi:eye"
          >
            Démo
          </UI-Button>
          <UI-Button
            v-if="project.github_url"
            :href="project.github_url"
            external
            variant="outline"
            size="sm"
            icon-left="mdi:github"
            class="bg-white/90 backdrop-blur"
          >
            Code
          </UI-Button>
        </div>
      </div>

      <!-- Badge de statut -->
      <div class="absolute top-3 left-3">
        <span 
          class="px-2 py-1 text-xs font-medium rounded-full backdrop-blur"
          :class="statusClasses"
        >
          {{ project.status || 'En cours' }}
        </span>
      </div>
    </div>

    <!-- Contenu -->
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
          {{ project.title }}
        </h3>
        <time 
          v-if="project.created_at"
          class="text-sm text-gray-500 ml-2 flex-shrink-0"
          :datetime="project.created_at"
        >
          {{ formatDate(project.created_at) }}
        </time>
      </div>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ project.description || 'Description du projet...' }}
      </p>

      <!-- Technologies -->
      <div class="flex flex-wrap gap-2 mb-4" v-if="project.technologies && project.technologies.length > 0">
        <span 
          v-for="tech in displayTechnologies" 
          :key="tech"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md font-medium"
        >
          {{ tech }}
        </span>
        <span 
          v-if="project.technologies.length > maxTechDisplay"
          class="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-md"
        >
          +{{ project.technologies.length - maxTechDisplay }}
        </span>
      </div>

      <!-- Footer avec actions -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-50">
        <div class="flex space-x-3">
          <button 
            v-if="project.demo_url"
            @click="openLink(project.demo_url)"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center transition-colors"
          >
            <Icon name="mdi:external-link" class="w-4 h-4 mr-1" />
            Voir
          </button>
          <button 
            v-if="project.github_url"
            @click="openLink(project.github_url)"
            class="text-gray-600 hover:text-gray-700 text-sm font-medium inline-flex items-center transition-colors"
          >
            <Icon name="mdi:github" class="w-4 h-4 mr-1" />
            Code
          </button>
        </div>

        <button 
          @click="$emit('view-details', project)"
          class="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center transition-colors"
        >
          Détails
          <Icon name="mdi:arrow-right" class="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  project: {
    type: Object,
    required: true,
    default: () => ({})
  },
  maxTechDisplay: {
    type: Number,
    default: 4
  }
})

// Émissions
const emit = defineEmits(['view-details'])

// Computed
const statusClasses = computed(() => {
  const status = props.project.status?.toLowerCase()
  
  const classes = {
    'terminé': 'bg-green-100 text-green-800',
    'en cours': 'bg-blue-100 text-blue-800',
    'en pause': 'bg-yellow-100 text-yellow-800',
    'archivé': 'bg-gray-100 text-gray-800'
  }
  
  return classes[status] || 'bg-blue-100 text-blue-800'
})

const displayTechnologies = computed(() => {
  if (!props.project.technologies || !Array.isArray(props.project.technologies)) {
    return []
  }
  return props.project.technologies.slice(0, props.maxTechDisplay)
})

// Méthodes
const formatDate = (date) => {
  if (!date) return ''
  
  const options = { 
    year: 'numeric', 
    month: 'short',
    day: 'numeric'
  }
  
  return new Date(date).toLocaleDateString('fr-FR', options)
}

const openLink = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>