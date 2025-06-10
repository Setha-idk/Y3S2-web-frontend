<template>
  <button
    @click="goBack"
    :class="[
      'inline-flex items-center rounded-md font-medium transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      sizeClasses,
      variantClasses,
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'
    ]"
    :disabled="disabled"
    aria-label="Go back"
  >
    <!-- Back Arrow Icon -->
    <svg 
      class="flex-shrink-0" 
      :class="iconSizeClasses" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>

    <!-- Button Text (slot) -->
    <span v-if="$slots.default" class="ml-2">
      <slot />
    </span>
    <span v-else class="ml-2">Back</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Component props with defaults
const props = defineProps({
  /**
   * Custom route path to navigate to
   */
  to: {
    type: [String, Object],
    default: null
  },
  /**
   * Button size variant
   * @values 'sm', 'md', 'lg'
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  /**
   * Button color variant
   * @values 'primary', 'secondary', 'ghost', 'danger'
   */
  variant: {
    type: String,
    default: 'secondary',
    validator: (value) => ['primary', 'secondary', 'ghost', 'danger'].includes(value)
  },
  /**
   * Disabled state
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * Show loading spinner
   */
  loading: {
    type: Boolean,
    default: false
  }
});

// Handle navigation
const goBack = () => {
  if (props.disabled) return;
  
  if (props.to) {
    router.push(props.to);
  } else {
    router.back();
  }
};

// Dynamic classes based on props
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg'
  };
  return sizes[props.size];
});

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-indigo-600 text-white focus:ring-indigo-500 hover:bg-indigo-700',
    secondary: 'bg-gray-100 text-gray-700 focus:ring-gray-500 hover:bg-gray-200',
    ghost: 'text-gray-700 focus:ring-gray-300 hover:bg-gray-100',
    danger: 'bg-red-100 text-red-700 focus:ring-red-500 hover:bg-red-200'
  };
  return variants[props.variant];
});

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  return sizes[props.size];
});
</script>

<style scoped>
/* Custom transition for smoother hover effects */
button {
  transition-property: color, background-color, border-color, opacity, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Better focus-visible styling */
button:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(99, 102, 241, 0.5);
}
</style>