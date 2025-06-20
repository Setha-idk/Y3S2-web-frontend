<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Company Employees</h1>

      <!-- Name search and Department search -->
      <!-- back -->
      <BackButton :to="`/admin/admin`" class="mb-6" />

      <div class="flex items-center gap-4 mb-4">
        <div class="flex-1">
          <SearchInput v-model="search" placeholder="Search by name..." />
        </div>
        <div class="w-48">
          <DropdownFilter
            v-model="departmentFilter"
            :options="departmentList"
            label=""
            allLabel="All Departments"
          />
        </div>
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
                v-for="employee in filteredEmployees" 
                :key="employee.id"
                class="group relative hover:bg-gray-50 transition-colors"
              >
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{{ employee.name }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ employee.email }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ getDepartmentName(employee.department_id) }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ getRoleName(employee.role_id) }}</td>
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

      <!-- Edit Employee Modal -->
      <Transition name="fade">
        <div
          v-if="showEditModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
        >
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900">Edit Employee</h3>
              <div class="mt-2 max-w-xl text-sm text-gray-500">
                <p>Update the employee details below.</p>
              </div>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm_gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <input
                      v-model="updatedEmployee.name"
                      type="text"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm_gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <input
                      v-model="updatedEmployee.email"
                      type="email"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm_gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Department</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <input
                      v-model="updatedEmployee.department"
                      type="text"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm_gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Role</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <input
                      v-model="updatedEmployee.role"
                      type="text"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm_gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Password</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <input
                      v-model="updatedEmployee.password"
                      type="password"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                  </dd>
                </div>
              </dl>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                @click="updateEmployee"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save
              </button>
              <button
                @click="closeEditModal"
                class="mt-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import SearchInput from '../../components/SearchInput.vue'
import DropdownFilter from '../../components/DropdownFilter.vue'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

const activeTab = ref('employees')
const employees = ref([])
const managers = ref([])
const departments = ref([])
const roles = ref([])

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

    await axios.put(`${apiUrl}/users/${id}`, payload)

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
    await axios.delete(`${apiUrl}/users/${id}`);
    employees.value = employees.value.filter(emp => emp.id !== id);
  } catch (error) {
    console.error('Failed to delete employee:', error);
    alert('Error deleting employee.');
  }
}

// Fetch users
const fetchUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`)
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

const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${apiUrl}/departments`)
    departments.value = response.data
  } catch (error) {
    console.error('Failed to fetch departments:', error)
    departments.value = []
  }
}

const fetchRoles = async () => {
  try {
    const response = await axios.get(`${apiUrl}/roles`)
    roles.value = response.data
  } catch (error) {
    console.error('Failed to fetch roles:', error)
    roles.value = []
  }
}

const getDepartmentName = (id) => {
  const dept = departments.value.find(d => d.id === id)
  return dept ? dept.name : ''
}
const getRoleName = (id) => {
  const role = roles.value.find(r => r.id === id)
  return role ? role.name : ''
}

const search = ref('')
const departmentFilter = ref('')
const departmentList = computed(() => departments.value.map(d => d.name).filter(Boolean))
const filteredEmployees = computed(() => {
  let list = employees.value
  if (search.value) {
    list = list.filter(e =>
      e.name.toLowerCase().includes(search.value.toLowerCase())
    )
  }
  if (departmentFilter.value) {
    // Find department by name, get its id, then filter employees by department_id
    const dept = departments.value.find(d => d.name === departmentFilter.value)
    if (dept) {
      list = list.filter(e => e.department_id === dept.id)
    }
  }
  return list
})

onMounted(() => {
  fetchUsers()
  fetchDepartments()
  fetchRoles()
})
</script>

