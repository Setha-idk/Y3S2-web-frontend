<template>
  <div class="flex items-center justify-between px-4 py-3 border-t border-gray-700">
    <span class="text-sm">Dark Mode</span>
    <button
      @click="$emit('toggle')"
      type="button"
      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      :class="darkMode ? 'bg-indigo-600' : 'bg-gray-200'"
      role="switch"
      :aria-checked="darkMode"
    >
      <span
        aria-hidden="true"
        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        :class="darkMode ? 'translate-x-5' : 'translate-x-0'"
      />
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  darkMode: Boolean
})
const emit = defineEmits(['toggle'])
</script>
