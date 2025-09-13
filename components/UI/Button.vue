<template>
  <component 
    :is="tag"
    :to="to"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <Icon v-if="iconLeft" :name="iconLeft" class="w-4 h-4" />
    <slot />
    <Icon v-if="iconRight" :name="iconRight" class="w-4 h-4" />
  </component>
</template>

<script setup>
// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  to: {
    type: String,
    default: null
  },
  href: {
    type: String,
    default: null
  },
  external: {
    type: Boolean,
    default: false
  },
  iconLeft: {
    type: String,
    default: null
  },
  iconRight: {
    type: String,
    default: null
  }
})

// Émissions
const emit = defineEmits(['click'])

// Computed
const tag = computed(() => {
  if (props.to) return 'NuxtLink'
  if (props.href) return 'a'
  return 'button'
})

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Tailles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  // Variantes
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm focus:ring-gray-500',
    outline: 'border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500'
  }
  
  return [
    base,
    sizes[props.size],
    variants[props.variant],
    props.loading && 'opacity-75 cursor-wait'
  ].filter(Boolean).join(' ')
})

// Méthodes
const handleClick = (event) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>