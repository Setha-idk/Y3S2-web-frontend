<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Company Employees</h1>

      <!-- Alert Message -->
      <div v-if="alertMessage" :class="['my-4 px-4 py-3 rounded border', alertType === 'success' ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700']">
        {{ alertMessage }}
      </div>

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
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <button 
                    class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" 
                    @click="showTeamMembers(manager)"
                  >
                    Team Size ({{ getTeamSize(manager) }})
                  </button>
                </td>
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
        <!-- Team Members Modal -->
        <div v-if="showTeamModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 class="text-lg font-semibold mb-4 text-slate-900">Team Members for {{ selectedManager?.name }}</h3>
            <ul>
              <li v-for="member in teamMembers" :key="member.id" class="mb-2 text-gray-800">
                {{ member.name }} ({{ member.email }})
              </li>
            </ul>
            <button @click="showTeamModal = false" class="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Close</button>
          </div>
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

const alertMessage = ref('')
const alertType = ref('success')

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
      // Update local lists after DB update
      // Remove from employees if now a manager (by role or access_level)
      const updated = { ...employees.value[index], ...payload }
      const isManager = updated.role === 'Manager' || updated.access_level === 'manager'
      if (isManager) {
        // Remove from employees
        if (index !== -1) employees.value.splice(index, 1)
        // Add to managers if not already present
        if (!managers.value.some(mgr => mgr.id === id)) {
          managers.value.push({ ...updated, teamSize: Math.floor(Math.random() * 15 + 1) })
        }
      } else {
        // If not a manager, update in employees list
        if (index !== -1) employees.value[index] = updated
      }
    }
    closeEditModal()
    alertMessage.value = 'Employee updated successfully.'
    alertType.value = 'success'
  } catch (error) {
    console.error('Failed to update employee:', error)
    alertMessage.value = 'Error updating employee.'
    alertType.value = 'error'
  }
}

// Delete function
const deleteEmployee = async (id) => {
  if (!confirm('Are you sure you want to delete this employee?')) return;

  try {
    await axios.delete(`http://localhost:8000/api/users/${id}`);
    employees.value = employees.value.filter(emp => emp.id !== id);
    alertMessage.value = 'Employee deleted successfully.'
    alertType.value = 'success'
  } catch (error) {
    console.error('Failed to delete employee:', error);
    alertMessage.value = 'Error deleting employee.'
    alertType.value = 'error'
  }
}

// Fetch users
const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/users')
    const users = response.data

    employees.value = users.filter(user => user.role !== 'Manager' && user.access_level !== 'manager')
    managers.value = users
      .filter(user => user.role === 'Manager' || user.access_level === 'manager')
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

const showTeamModal = ref(false)
const selectedManager = ref(null)
const teamMembers = ref([])

function getTeamSize(manager) {
  // Example: all employees with a field like manager_id === manager.id
  return employees.value.filter(emp => emp.manager_id === manager.id).length
}

function showTeamMembers(manager) {
  selectedManager.value = manager
  // Example: all employees with a field like manager_id === manager.id
  teamMembers.value = employees.value.filter(emp => emp.manager_id === manager.id)
  showTeamModal.value = true
}
</script>

