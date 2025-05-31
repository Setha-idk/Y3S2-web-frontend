<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Company Employees</h1>
      <!-- Employee Table -->
      <div class="mt-8">
        <table class="min-w-full divide-y divide-gray-300 bg-white shadow rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-900">Department</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-900">Role</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="employee in employees" :key="employee.id">
              <td class="py-3 px-4">{{ employee.name }}</td>
              <td class="py-3 px-4">{{ employee.email }}</td>
              <td class="py-3 px-4">{{ employee.department }}</td>
              <td class="py-3 px-4">{{ employee.role }}</td>
              <td class="py-3 px-4">
                <button
                  @click="openEditModal(employee)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Edit Modal -->
      <EditEmployeeModal
        v-if="showEditModal"
        :employee="updatedEmployee"
        @close="closeEditModal"
        @update="updateEmployee"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import EditEmployeeModal from './EditEmployeeModal.vue'

const employees = ref([])
const showEditModal = ref(false)
const updatedEmployee = ref({})

const openEditModal = (employee) => {
  updatedEmployee.value = { ...employee, password: '' }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const updateEmployee = async (employeeData) => {
  try {
    const payload = {
      name: employeeData.name,
      role: employeeData.role,
    }

    if (employeeData.password) {
      payload.password = employeeData.password
    }

    await axios.put(`http://localhost:8000/api/users/${employeeData.id}`, payload)

    const index = employees.value.findIndex(emp => emp.id === employeeData.id)
    if (index !== -1) {
      employees.value[index] = { ...employees.value[index], ...payload }
    }

    closeEditModal()
    alert('Update completed successfully') //This shows the message
  } catch (error) {
    console.error(error)
    alert(' Failed to update employee')
  }
}

const fetchEmployees = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/users')
    employees.value = res.data
  } catch (error) {
    console.error('Failed to fetch employees:', error)
  }
}

onMounted(fetchEmployees)
</script>
