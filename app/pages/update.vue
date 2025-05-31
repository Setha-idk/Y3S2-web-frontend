<template>
  <div class="p-8 max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Update Employee</h2>

    <form @submit.prevent="updateEmployee">
      <div class="mb-4">
        <label class="block mb-1 font-medium">Name</label>
        <input v-model="form.name" class="w-full border p-2 rounded" required />
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-medium">Role</label>
        <select v-model="form.role" class="w-full border p-2 rounded" required>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-medium">New Password (optional)</label>
        <input v-model="form.password" type="password" class="w-full border p-2 rounded" />
      </div>

      <button 
        type="submit" 
        class="bg-blue-600 text-white px-4 py-2 rounded"
        :disabled="loading"
      >
        {{ loading ? 'Updating...' : 'Update' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const form = ref({
  name: '',
  role: '',
  password: ''
})
const loading = ref(false)

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await axios.get(`http://localhost:8000/api/users/${id}`)
    form.value = { ...response.data, password: '' }
  } catch (error) {
    alert('Failed to load employee data.')
    router.push('/') // go back if failure
  }
})

const updateEmployee = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const payload = {
      name: form.value.name,
      role: form.value.role,
    }
    if (form.value.password) {
      payload.password = form.value.password
    }
    await axios.put(`http://localhost:8000/api/users/${id}`, payload)
    alert('Update completed successfully!')
    router.push('/') // redirect to list or home page
  } catch (error) {
    alert('Failed to update: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}
</script>
