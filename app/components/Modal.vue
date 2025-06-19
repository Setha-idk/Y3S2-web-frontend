<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-full relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean
})
</script>
