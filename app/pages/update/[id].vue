<template>
  <div class="p-8 max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Update Employee</h2>

    <form @submit.prevent="updateEmployee">
      <div class="mb-4">
        <label class="block mb-1 font-medium">Name</label>
        <input v-model="form.name" class="w-full border p-2 rounded" required />
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-medium">Access Level</label>
        <select v-model="form.access_level" class="w-full border p-2 rounded" required>
          <option value="user">Employee</option>
          <option value="manager">Manager</option>
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

    <div class="mt-8">
      <h3 class="text-xl font-semibold mb-4">Engineering Team</h3>
      <ul>
        <li v-for="member in engineeringTeam" :key="member.id" class="border-b py-2">
          {{ member.name }} - {{ member.access_level }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const form = ref({
  name: '',
  access_level: '',
  password: ''
})
const loading = ref(false)
const users = ref([])

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await axios.get(`http://localhost:8000/api/users/${id}`)
    form.value = { ...response.data, password: '' }
    // Fetch all users for team view
    const usersRes = await axios.get('http://localhost:8000/api/users')
    users.value = usersRes.data
  } catch (error) {
    alert('Failed to load employee data.')
    router.push('/') // go back if failure
  }
})

const engineeringTeam = computed(() => {
  // All users in Engineering except self
  if (!form.value || !form.value.name) return []
  return users.value.filter(u => u.department === 'Engineering' && u.id !== route.params.id)
})

const updateEmployee = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const payload = {
      name: form.value.name,
      access_level: form.value.access_level,
    }
    if (form.value.password) {
      payload.password = form.value.password
    }
    await axios.put(`http://localhost:8000/api/users/${id}`, payload)
    alert('Update completed successfully!')
    if (payload.access_level === 'manager') {
      router.push('/all?tab=managers')
    } else {
      router.push('/')
    }
  } catch (error) {
    alert('Failed to update: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}
</script>
