<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Departments & Roles</h1>
          <p class="text-sm text-gray-500 mt-1">Manage your organization's structure</p>
        </div>
        <BackButton 
          :to="'/admin/admin'" 
          class="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
        />
      </div>

      <!-- Admin Controls -->
      <div v-if="user && user.access_level === 'admin'" class=" p-4 rounded-lg mb-6 border flex flex-row justify-between border-gray-200">
        <h2 class="text-lg font-medium text-gray-700 mb-3">Department Management</h2>
        <AddDepartment @created="fetchDepartmentsAndRoles" />
      </div>

      <!-- Search and Filter Section -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <SearchInput 
              v-model="search" 
              placeholder="Search department or role..." 
              class="w-full pt-[23px]"
            />
          </div>
          <div class="w-full md:w-48">
            <DropdownFilter
              v-model="departmentFilter"
              :options="departmentList"
              label="Filter by:"
              allLabel="All Departments"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredDepartments.length === 0" class="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
        <p class="text-gray-500">No departments found matching your criteria.</p>
      </div>

      <!-- Departments List -->
      <div class="space-y-6">
        <div v-for="dept in filteredDepartments" :key="dept.id" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <!-- Department Header -->
          <div class="bg-gray-50 px-5 py-4 border-b border-gray-200">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <h2 class="text-lg font-semibold text-blue-600">Department: {{ dept.name }}</h2>
                <span class="text-sm text-gray-500">{{ dept.description }}</span>
              </div>
              <div v-if="user && user.access_level === 'admin'" class="flex gap-2">
                <button 
                  @click="editDepartment(dept)" 
                  class="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button 
                  @click="deleteDepartment(dept.id)" 
                  class="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Edit Department Form -->
          <div v-if="editingDepartment && editingDepartment.id === dept.id" class="bg-blue-50 p-4 border-b border-blue-100">
            <form @submit.prevent="updateDepartment" class="flex flex-col sm:flex-row gap-3">
              <input 
                v-model="editingDepartment.name" 
                class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Department name"
              />
              <input 
                v-model="editingDepartment.description" 
                class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description"
              />
              <div class="flex gap-2">
                <button 
                  type="submit" 
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Save
                </button>
                <button 
                  type="button" 
                  @click="editingDepartment = null" 
                  class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Roles Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <!-- Roles List -->
                <tr v-for="role in dept.roles" :key="role.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ role.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ role.description || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <div class="flex gap-3">
                      <button 
                        @click="editRole(role, dept.id)" 
                        class="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        @click="deleteRole(role.id)" 
                        class="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Edit Role Form -->
                <tr v-if="editingRole && editingRole.department_id === dept.id" class="bg-blue-50">
                  <td colspan="3" class="px-6 py-4">
                    <form @submit.prevent="updateRole" class="flex flex-col sm:flex-row gap-3">
                      <input 
                        v-model="editingRole.name" 
                        class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Role name"
                      />
                      <input 
                        v-model="editingRole.description" 
                        class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Description"
                      />
                      <div class="flex gap-2">
                        <button 
                          type="submit" 
                          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Save
                        </button>
                        <button 
                          type="button" 
                          @click="editingRole = null" 
                          class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>

                <!-- Add Role Section -->
                <tr v-if="user && (user.access_level === 'admin' || user.access_level === 'manager')">
                  <td colspan="3" class="px-6 py-4 bg-gray-50">
                    <AddRole :department-id="dept.id" @created="fetchDepartmentsAndRoles" />
                  </td>
                </tr>

                <!-- Empty Roles State -->
                <tr v-if="!dept.roles || dept.roles.length === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                    No roles in this department.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import DropdownFilter from '../../components/DropdownFilter.vue'
import SearchInput from '../../components/SearchInput.vue'
import AddDepartment from '../../components/AddDepartment.vue'
import AddRole from '../../components/AddRole.vue'
import { useAuth } from '../../composables/useAuth.js'
import BackButton from '../../components/BackButton.vue'
import { useRuntimeConfig } from '#imports'

const { user, fetchUser } = useAuth()
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

const departments = ref([])
const search = ref('')
const departmentFilter = ref('')
const newDepartment = ref({ name: '', description: '' })
const editingDepartment = ref(null)
const newRole = ref({ name: '', description: '' })
const editingRole = ref(null)

const filteredDepartments = computed(() => {
  let list = departments.value
  if (user.value && user.value.access_level === 'manager') {
    list = list.filter(d => d.id === user.value.department_id)
  }
  if (departmentFilter.value) {
    list = list.filter(d => d.name === departmentFilter.value)
  }
  if (search.value) {
    const s = search.value.toLowerCase()
    list = list.filter(d => d.name.toLowerCase().includes(s) || d.roles.some(r => r.name.toLowerCase().includes(s)))
  }
  // Sort by newest (highest id first)
  return list.slice().sort((a, b) => b.id - a.id)
})
const departmentList = computed(() => departments.value.map(d => d.name))

const fetchDepartmentsAndRoles = async () => {
  await fetchUser()
  try {
    const token = localStorage.getItem('auth_token')
    const [deptRes, roleRes] = await Promise.all([
      axios.get(`${apiUrl}/departments`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${apiUrl}/roles`, { headers: { Authorization: `Bearer ${token}` } })
    ])
    const deptList = deptRes.data
    const roles = roleRes.data
    // Group roles by department_id
    const rolesByDept = roles.reduce((acc, role) => {
      const deptId = role.department_id
      if (!acc[deptId]) acc[deptId] = []
      acc[deptId].push(role)
      return acc
    }, {})
    // Attach roles to each department
    departments.value = deptList.map(dept => ({
      ...dept,
      roles: rolesByDept[dept.id] || []
    }))
  } catch (error) {
    console.error('Failed to fetch departments or roles:', error)
    departments.value = []
  }
}

onMounted(() => {
  fetchDepartmentsAndRoles()
})

// CRUD for Department
function editDepartment(dept) {
  editingDepartment.value = { ...dept }
}
async function updateDepartment() {
  const token = localStorage.getItem('auth_token')
  await axios.put(`${apiUrl}/departments/${editingDepartment.value.id}`, editingDepartment.value, { headers: { Authorization: `Bearer ${token}` } })
  editingDepartment.value = null
  fetchDepartmentsAndRoles()
}
async function deleteDepartment(id) {
  if (!confirm('Delete this department?')) return
  const token = localStorage.getItem('auth_token')
  await axios.delete(`${apiUrl}/departments/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  fetchDepartmentsAndRoles()
}
// CRUD for Role
function editRole(role, department_id) {
  editingRole.value = { ...role, department_id }
}
async function updateRole() {
  const token = localStorage.getItem('auth_token')
  await axios.put(`${apiUrl}/roles/${editingRole.value.id}`, editingRole.value, { headers: { Authorization: `Bearer ${token}` } })
  editingRole.value = null
  fetchDepartmentsAndRoles()
}
async function deleteRole(id) {
  if (!confirm('Delete this role?')) return
  const token = localStorage.getItem('auth_token')
  await axios.delete(`${apiUrl}/roles/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  fetchDepartmentsAndRoles()
}
</script>
