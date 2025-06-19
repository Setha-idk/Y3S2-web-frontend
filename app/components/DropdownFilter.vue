<template>
  <div class="mb-4">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <select
      v-model="selected"
      @change="$emit('update:modelValue', selected)"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white shadow-sm"
    >
      <option :value="''">{{ allLabel }}</option>
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: String,
  options: {
    type: Array,
    default: () => []
  },
  label: String,
  allLabel: {
    type: String,
    default: 'All'
  }
})
const selected = ref(props.modelValue || '')
watch(() => props.modelValue, val => { selected.value = val })
</script>
