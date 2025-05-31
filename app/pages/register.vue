<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Register New Employee</h1>

      <form @submit.prevent="registerUser" class="bg-white p-6 rounded-lg shadow-md">
        <div class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              :class="{ 'border-red-500': errors.name }"
              placeholder="John Doe"
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              :class="{ 'border-red-500': errors.email }"
              placeholder="john@example.com"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>
        
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              :class="{ 'border-red-500': errors.password }"
              placeholder="Enter a secure password"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <!-- Department -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              v-model="form.department"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              :class="{ 'border-red-500': errors.department }"
            >
              <option value="">Select Department</option>
              <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
            </select>
            <p v-if="errors.department" class="text-red-500 text-sm mt-1">{{ errors.department }}</p>
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              v-model="form.role"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              :class="{ 'border-red-500': errors.role }"
            >
              <option value="">Select Role</option>
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
            <p v-if="errors.role" class="text-red-500 text-sm mt-1">{{ errors.role }}</p>
          </div>

          <!-- Password -->
          

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register Employee
          </button>

          <div class="text-center w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            <nuxt-link to="/">Back</nuxt-link>
          </div>
        </div>
      </form>
        
      <!-- Success Message -->
       <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>

      <!-- Table -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Registered Employees</h2>
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th class="px-3 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th class="px-3 py-3 text-left text-sm font-semibold text-gray-900">Password</th>
                <th class="px-3 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                <th class="px-3 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="employee in employees" :key="employee.email">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{{ employee.name }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ employee.email }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ employee.password }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ employee.department }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ employee.role }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  name: '',
  email: '',
  department: '',
  role: ''
})

const errors = ref({
  name: '',
  email: '',
  department: '',
  role: ''
})


const successMessage = ref('')
const errorMessage = ref('')
// Dummy data
const departments = ref([
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations'
])

const roles = ref([
  'Software Engineer',
  'Marketing Specialist',
  'Sales Representative',
  'HR Manager',
  'Financial Analyst',
  'Operations Manager'
])
const employees = ref([
  {
  },])

const registerUser = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/users', form.value)
    successMessage.value = 'User registered successfully!'
    errorMessage.value = ''
    form.value = { name: '', email: '', password: '', department: '', role: '' } // Reset form
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Registration failed.'
    }
    successMessage.value = ''
  }
  
}
</script>
