<template>
  <div class="mb-2">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <input
      v-if="type !== 'select'"
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="inputClass"
    />
    <select
      v-else
      :id="id"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      :class="inputClass"
    >
      <slot></slot>
    </select>
    <p v-if="error" class="text-xs text-red-600 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number],
  label: String,
  id: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
  error: String,
  inputClass: {
    type: String,
    default: 'w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
  }
})
</script>
