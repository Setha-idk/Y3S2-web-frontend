<template>
  <div class="mb-4">
    <input
      v-model="searchValue"
      @input="$emit('update:modelValue', searchValue)"
      type="text"
      :placeholder="placeholder || 'Search...'"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg 
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             focus:border-blue-500 transition duration-200 
             placeholder-gray-400 bg-white shadow-sm"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: String,
  placeholder: String
})
const searchValue = ref(props.modelValue || '')
watch(() => props.modelValue, val => { searchValue.value = val })
</script>
