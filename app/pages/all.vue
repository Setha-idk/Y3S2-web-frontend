<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Company Employees</h1>

      <!-- Tabs Navigation -->
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'employees'"
            :class="[
              'pb-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'employees'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Employees ({{ employees.length }})
          </button>
          <button
            @click="activeTab = 'managers'"
            :class="[
              'pb-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'managers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Managers ({{ managers.length }})
          </button>
        </nav>
      </div>

      <!-- Employees Table -->
      <div v-if="activeTab === 'employees'" class="mt-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr 
                v-for="employee in employees" 
                :key="employee.id"
                class="group relative hover:bg-gray-50 transition-colors"
              >
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{{ employee.name }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ employee.email }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ employee.department }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ employee.role }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <router-link
                      :to="`/update/${employee.id}`"
                      class="text-blue-600 hover:text-blue-900 p-1 rounded-md"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </router-link>
                    <button
                      @click="deleteEmployee(employee.id)"
                      class="text-red-600 hover:text-red-900 p-1 rounded-md"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Managers Table -->
      <div v-if="activeTab === 'managers'" class="mt-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Team Size</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr 
                v-for="manager in managers" 
                :key="manager.id"
                class="group relative hover:bg-gray-50 transition-colors"
              >
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{{ manager.name }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ manager.email }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ manager.department }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ manager.teamSize }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <router-link
                      :to="`/update/${manager.id}`"
                      class="text-blue-600 hover:text-blue-900 p-1 rounded-md"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </router-link>
                    <button
                      @click="deleteEmployee(manager.id)"
                      class="text-red-600 hover:text-red-900 p-1 rounded-md"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios'

const activeTab = ref('employees')

const employees = ref([])
const managers = ref([])

// Edit modal state
const editingEmployee = ref(null)
const showEditModal = ref(false)
const updatedEmployee = ref({
  name: '',
  email: '',
  department: '',
  role: '',
  password: ''
})

const openEditModal = (employee) => {
  editingEmployee.value = employee
  updatedEmployee.value = { ...employee, password: '' }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingEmployee.value = null
}

// ✅ Step 4: Update employee in DB and local list
const updateEmployee = async () => {
  try {
    const { id, name, department, role, password } = updatedEmployee.value
    const payload = { name, department, role }

    if (password) {
      payload.password = password
    }

    await axios.put(`http://localhost:8000/api/users/${id}`, payload)

    const index = employees.value.findIndex(emp => emp.id === id)
    if (index !== -1) {
      employees.value[index] = { ...employees.value[index], ...payload }
    }

    closeEditModal()
    alert('Employee updated successfully.')
  } catch (error) {
    console.error('Failed to update employee:', error)
    alert('Error updating employee.')
  }
}

// Delete function
const deleteEmployee = async (id) => {
  if (!confirm('Are you sure you want to delete this employee?')) return;

  try {
    await axios.delete(`http://localhost:8000/api/users/${id}`);
    employees.value = employees.value.filter(emp => emp.id !== id);
  } catch (error) {
    console.error('Failed to delete employee:', error);
    alert('Error deleting employee.');
  }
}

// Fetch users
const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/users')
    const users = response.data

    employees.value = users.filter(user => user.role !== 'Manager')
    managers.value = users
      .filter(user => user.role === 'Manager')
      .map(manager => ({
        ...manager,
        teamSize: Math.floor(Math.random() * 15 + 1)
      }))
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

