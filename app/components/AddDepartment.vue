<template>
  <div>
    <button @click="show = true" class="bg-blue-600 text-white px-3 py-1 rounded mb-2">
      Add Department
    </button>
    <Modal :show="show" @close="show = false">
      <form @submit.prevent="submit" class="flex flex-col gap-3 w-72">
        <h2 class="text-lg font-semibold mb-2">Add Department</h2>
        <input v-model="form.name" placeholder="Department Name" class="border rounded px-2 py-1" />
        <input v-model="form.description" placeholder="Description" class="border rounded px-2 py-1" />
        <div v-if="error" class="text-red-500 text-xs">{{ error }}</div>
        <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-3 py-1 rounded mt-2">{{ loading ? 'Saving...' : 'Save' }}</button>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Modal from './Modal.vue'
import axios from 'axios'
import { useRuntimeConfig } from '#app'
const emit = defineEmits(['created'])
const show = ref(false)
const form = ref({ name: '', description: '' })
const loading = ref(false)
const error = ref('')
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl
async function submit() {
  if (!form.value.name) { error.value = 'Name required'; return }
  loading.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('auth_token')
    await axios.post(`${apiUrl}/departments`, form.value, { headers: { Authorization: `Bearer ${token}` } })
    emit('created')
    form.value = { name: '', description: '' }
    show.value = false
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to add department.'
  } finally {
    loading.value = false
  }
}
</script>
