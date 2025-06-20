<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
    <div 
      v-for="stat in statsItems"
      :key="stat.label"
      class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <h3 class="text-sm font-medium text-gray-500 mb-1">{{ stat.label }}</h3>
      <p class="text-2xl font-bold" :class="stat.color || 'text-gray-800'">{{ stat.value }}</p>
      <div class="mt-3 flex items-center">
        <div class="w-full bg-gray-100 rounded-full h-1.5">
          <div 
            class="h-1.5 rounded-full" 
            :class="stat.color || 'bg-blue-500'"
            :style="{ width: stat.percentage ? `${stat.percentage}%` : '0%' }"
          ></div>
        </div>
        <span v-if="stat.percentage" class="ml-2 text-xs text-gray-500">{{ stat.percentage }}%</span>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ statsItems: Array, darkMode: Boolean })
</script>
