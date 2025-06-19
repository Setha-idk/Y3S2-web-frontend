<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">Employee Registration</h1>
        <p class="text-gray-500 mt-2 max-w-2xl mx-auto">Register new employees and manage their access within the organization</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 max-w-2xl mx-auto">
        <!-- Form Header -->
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">Register New Employee</h2>
        </div>
        
        <!-- Registration Form -->
        <form @submit.prevent="registerUser" class="p-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Name Field -->
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                :class="{ 'border-red-500': errors.name }"
                placeholder="John Doe"
              />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>

            <!-- Email Field -->
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                :class="{ 'border-red-500': errors.email }"
                placeholder="john@example.com"
              />
              <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
            </div>
          
            <!-- Password Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                v-model="form.password"
                type="password"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                :class="{ 'border-red-500': errors.password }"
                placeholder="••••••••"
              />
              <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
            </div>

            <!-- Department Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                v-model="form.department"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjJ2MnYyIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]"
                :class="{ 'border-red-500': errors.department }"
              >
                <option value="" disabled selected>Select Department</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
              <p v-if="errors.department" class="text-red-500 text-xs mt-1">{{ errors.department }}</p>
            </div>

            <!-- Role Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                v-model="form.role"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjJ2MnYyIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]"
                :class="{ 'border-red-500': errors.role }"
              >
                <option value="" disabled selected>Select Role</option>
                <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
              </select>
              <p v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</p>
            </div>

            <!-- Access Level Field -->
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
              <div class="grid grid-cols-3 gap-3">
                <label 
                  v-for="level in accessLevels" 
                  :key="level"
                  class="flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors"
                  :class="{
                    'border-blue-500 bg-blue-50': form.access_level === level,
                    'border-gray-200 hover:border-gray-300': form.access_level !== level,
                    'border-red-500': errors.access_level
                  }"
                >
                  <input
                    type="radio"
                    v-model="form.access_level"
                    :value="level"
                    class="hidden"
                  />
                  <span class="text-sm font-medium text-gray-700">
                    {{ level.charAt(0).toUpperCase() + level.slice(1) }}
                  </span>
                </label>
              </div>
              <p v-if="errors.access_level" class="text-red-500 text-xs mt-1">{{ errors.access_level }}</p>
            </div>
          </div>

          <!-- Status Messages -->
          <div v-if="successMessage || errorMessage" class="rounded-lg p-3"
            :class="{
              'bg-green-50 text-green-700': successMessage,
              'bg-red-50 text-red-700': errorMessage
            }"
          >
            <p v-if="successMessage">{{ successMessage }}</p>
            <p v-if="errorMessage">{{ errorMessage }}</p>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col sm:flex-row gap-3 pt-2">
            <BackButton 
              :to="'/admin/admin'" 
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg font-medium transition-colors shadow-sm"
            />
            <button
              type="submit"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
              </svg>
              Register Employee
            </button>
            
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth.js'

const form = ref({
  name: '',
  email: '',
  password: '',
  department: '',
  role: '',
  access_level: ''
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  department: '',
  role: '',
  access_level: ''
})

const successMessage = ref('')
const errorMessage = ref('')
const departments = ref([])
const roles = ref([])

// Store department and role objects for lookup
const departmentList = ref([])
const roleList = ref([])

// Fetch departments and roles from API
const fetchDepartmentsAndRoles = async () => {
  try {
    const [deptRes, roleRes] = await Promise.all([
      axios.get('http://localhost:8000/api/departments'),
      axios.get('http://localhost:8000/api/roles')
    ])
    departmentList.value = deptRes.data
    roleList.value = roleRes.data
    departments.value = deptRes.data.map(d => d.name)
    roles.value = roleRes.data.map(r => r.name)
  } catch (e) {
    // Optionally handle error
  }
}

fetchDepartmentsAndRoles()

// Helper to get department_id and role_id by name
function getDepartmentIdByName(name) {
  const dept = departmentList.value.find(d => d.name === name)
  return dept ? dept.id : null
}
function getRoleIdByName(name) {
  const role = roleList.value.find(r => r.name === name)
  return role ? role.id : null
}

const { user, fetchUser } = useAuth()

const allAccessLevels = ['admin', 'manager', 'user']
const accessLevels = computed(() => {
  if (user.value && user.value.access_level === 'manager') {
    return ['manager']
  }
  return allAccessLevels
})

onMounted(() => {
  fetchUser()
})


const employees = ref([])

const registerUser = async () => {
  try {
    // Attach role_id and department_id to payload
    const payload = {
      ...form.value,
      role_id: getRoleIdByName(form.value.role),
      department_id: getDepartmentIdByName(form.value.department)
    }
    const response = await axios.post('http://localhost:8000/api/users', payload)
    successMessage.value = 'User registered successfully!'
    errorMessage.value = ''
    employees.value.push(response.data)
    // Record in history API
    try {
      // Get current admin/creator user
      const token = localStorage.getItem('auth_token');
      const meRes = await axios.get('http://localhost:8000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = meRes.data
      await axios.post('http://localhost:8000/api/history', {
        action: 'created',
        name: response.data.name,
        description: `Registered new user: ${response.data.name} (${response.data.email}), department: ${response.data.department}, role: ${response.data.role}, access level: ${response.data.access_level}`,
        user_name: user.name,
        email: user.email,
        employee_id: user.id
      })
    } catch (e) {
      // Optionally handle error
    }
    form.value = { name: '', email: '', password: '', department: '', role: '', access_level: '' } // Reset form
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errs = error.response.data.errors
      Object.keys(errors.value).forEach(key => {
        errors.value[key] = errs[key] ? errs[key][0] : ''
      })
    } else if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Registration failed.'
    }
    successMessage.value = ''
  }
}
</script>
