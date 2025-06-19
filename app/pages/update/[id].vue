<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <!-- Form Header -->
      <div class="bg-white px-6 py-5 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-gray-800">Update Employee</h1>
            <p class="text-sm text-gray-500 mt-1">Update employee details</p>
          </div>
          <div class="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
            <svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="updateUser" class="px-6 py-5 space-y-5">
        <!-- Name Field -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="w-full rounded-lg border-gray-200 px-3 py-2.5 border focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="John Doe"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <!-- Email Field -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="w-full rounded-lg border-gray-200 px-3 py-2.5 border focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="john@example.com"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <!-- Department Select -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Department</label>
          <div class="relative">
            <select 
              v-model="form.department_id" 
              class="w-full rounded-lg border-gray-200 px-3 py-2.5 border focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white pr-8"
            >
              <option value="" disabled selected>Select department</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          <p v-if="errors.department_id" class="mt-1 text-xs text-red-500">{{ errors.department_id }}</p>
        </div>

        <!-- Role Select -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Role</label>
          <div class="relative">
            <select 
              v-model="form.role_id" 
              class="w-full rounded-lg border-gray-200 px-3 py-2.5 border focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white pr-8"
            >
              <option value="" disabled selected>Select role</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          <p v-if="errors.role_id" class="mt-1 text-xs text-red-500">{{ errors.role_id }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="errors.general" class="rounded-md bg-red-50 p-3 flex items-start">
          <svg class="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="ml-2 text-sm text-red-700">{{ errors.general }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-2">
          <BackButton 
            :to="'/admin/all'" 
            class="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            class="flex-1 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Update Employee
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import BackButton from '../../components/BackButton.vue'
import { useAuth } from '../../composables/useAuth.js'

const { user, fetchUser } = useAuth()

const route = useRoute()
const router = useRouter()
const userId = route.params.id

const form = ref({
  name: '',
  email: '',
  department_id: '',
  role_id: '',
})
const errors = ref({})
const departments = ref([])
const roles = ref([])

onMounted(async () => {
  await fetchUser()
  try {
    const token = localStorage.getItem('auth_token')
    const [userRes, deptRes, roleRes] = await Promise.all([
      axios.get(`http://localhost:8000/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:8000/api/departments'),
      axios.get('http://localhost:8000/api/roles'),
    ])
    const userData = userRes.data
    form.value = {
      name: userData.name || '',
      email: userData.email || '',
      department_id: userData.department_id || '',
      role_id: userData.role_id || '',
    }
    departments.value = deptRes.data
    roles.value = roleRes.data
  } catch (err) {
    errors.value.general = 'Failed to load user or reference data.'
  }
})

async function updateUser() {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Name is required.'
  if (!form.value.email) errors.value.email = 'Email is required.'
  if (!form.value.department_id) errors.value.department_id = 'Department is required.'
  if (!form.value.role_id) errors.value.role_id = 'Role is required.'
  if (Object.keys(errors.value).length > 0) return
  try {
    const token = localStorage.getItem('auth_token')
    // Get old user data
    const oldUserRes = await axios.get(`http://localhost:8000/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
    const oldUser = oldUserRes.data

    await axios.put(`http://localhost:8000/api/users/${userId}`, form.value, { headers: { Authorization: `Bearer ${token}` } })
    // Record edit history
    if (user.value) {
      // Build change description
      let changes = []
      if (oldUser.name !== form.value.name) changes.push(`Name: old: ${oldUser.name} new: ${form.value.name}`)
      if (oldUser.email !== form.value.email) changes.push(`Email: old: ${oldUser.email} new: ${form.value.email}`)
      if (oldUser.department_id !== form.value.department_id) {
        const oldDept = departments.value.find(d => d.id === oldUser.department_id)
        const newDept = departments.value.find(d => d.id === form.value.department_id)
        changes.push(`Department: old: ${oldDept ? oldDept.name : oldUser.department_id} new: ${newDept ? newDept.name : form.value.department_id}`)
      }
      if (oldUser.role_id !== form.value.role_id) {
        const oldRole = roles.value.find(r => r.id === oldUser.role_id)
        const newRole = roles.value.find(r => r.id === form.value.role_id)
        changes.push(`Role: old: ${oldRole ? oldRole.name : oldUser.role_id} new: ${newRole ? newRole.name : form.value.role_id}`)
      }
      const description = changes.length > 0 
        ? `Updated employee (${oldUser.name}): ` + changes.join('; ') 
        : `No changes for employee (${oldUser.name})`
      await axios.post('http://localhost:8000/api/history', {
        action_time: new Date().toISOString(),
        user_name: user.value.name,
        email: user.value.email,
        name: form.value.name,
        employee_id: userId,
        action: 'update',
        description
      }, { headers: { Authorization: `Bearer ${token}` } })
    }
    router.push('/admin/all')
  } catch (err) {
    errors.value.general = err.response?.data?.message || 'Failed to update user.'
  }
}
</script>
