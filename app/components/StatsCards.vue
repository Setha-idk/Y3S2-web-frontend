<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div 
      v-for="stat in statsItems"
      :key="stat.label"
      :class="['p-4 rounded-lg shadow-lg', darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-900']"
    >
      <h3 :class="darkMode ? 'text-slate-400' : 'text-slate-600'" class="text-sm">{{ stat.label }}</h3>
      <p class="text-2xl font-bold" :class="stat.color">{{ stat.value }}</p>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ statsItems: Array, darkMode: Boolean })
</script>
