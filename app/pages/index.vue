<template>
  <!-- Sidebar Navigation -->
  <div class="fixed inset-y-0 left-0 w-64 flex flex-col z-30 bg-white text-gray-800 border-r border-gray-200 shadow-lg">
    <!-- Profile Section -->
    <div class="p-5 flex items-center gap-4 border-b border-gray-200 bg-gray-50">
      <div class="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
        <img v-if="user?.profile_picture" :src="getProfilePictureUrl(user.profile_picture)" class="h-full w-full object-cover" alt="Profile" />
        <span v-else class="text-2xl text-gray-400">👤</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-medium truncate text-gray-900">{{ user?.name || 'Guest' }}</p>
        <p class="text-xs text-gray-500 truncate">{{ user?.email || '' }}</p>
        <div class="flex flex-wrap gap-x-2 mt-1">
          <span v-if="departmentName" class="text-xs text-gray-500">Dept: {{ departmentName }}</span>
          <span v-if="roleName" class="text-xs text-gray-500">Role: {{ roleName }}</span>
          <span class="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">Access: {{ user?.access_level || '' }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto py-4 bg-white">
      <ul class="space-y-1 px-2">
        <li v-for="item in menuItems" :key="item.name">
          <NuxtLink 
            :to="item.path" 
            :class="[
              'flex items-center px-4 py-3 rounded-lg transition-all',
              $route.path === item.path
                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
            ]"
          >
            <span class="mr-3 text-lg">{{ item.icon }}</span>
            <span class="text-sm font-medium">{{ item.name }}</span>
          </NuxtLink>
        </li>

        <!-- Admin/Manager Section -->
        <div v-if="user && (user.access_level === 'admin' || user.access_level === 'manager')" class="mt-6 pt-4 border-t border-gray-200">
          <p class="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</p>
          <li>
            <NuxtLink to="/admin/admin" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-gray-50 text-gray-600 hover:text-gray-900">
              <span class="mr-3 text-lg">⚙️</span>
              <span class="text-sm font-medium">Admin Panel</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/assign" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-gray-50 text-gray-600 hover:text-gray-900">
              <span class="mr-3 text-lg">📝</span>
              <span class="text-sm font-medium">Assign Tasks</span>
            </NuxtLink>
          </li>
        </div>

        <!-- Auth Section -->
        <div class="mt-6 pt-4 border-t border-gray-200">
          <li v-if="user">
            <button @click="showLogoutModal = true" class="flex items-center w-full px-4 py-3 rounded-lg text-left hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors">
              <span class="mr-3 text-lg">🚪</span>
              <span class="text-sm font-medium">Log Out</span>
            </button>
          </li>
          <li v-if="!user">
            <NuxtLink to="/login" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-gray-50 text-gray-600 hover:text-gray-900">
              <span class="mr-3 text-lg">🔑</span>
              <span class="text-sm font-medium">Login</span>
            </NuxtLink>
          </li>
        </div>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="p-4 text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
      © 2025 Workflow System v1.0
    </div>
  </div>

  <!-- Main Content -->
  <div class="min-h-screen bg-gray-50 text-gray-800 ml-0 lg:ml-64 p-4 sm:p-6">
    <!-- Header -->
    <div class="mb-6 bg-white rounded-xl p-5 shadow-sm">
      <h1 class="text-2xl font-bold text-gray-900">Workflow Dashboard</h1>
      <p class="text-gray-500 mt-1">Manage your tasks and steps efficiently</p>
    </div>

    <!-- Loading/Error States -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
      <div class="flex items-start">
        <svg class="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-red-700">Error loading dashboard data: {{ error }}</p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-if="!loading && !error" class="space-y-6">
      <!-- Stats Cards -->
      <StatsCards :statsItems="statsItems" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" />

      <!-- Tasks Section -->
      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
          <h2 class="text-xl font-semibold text-gray-900">Your Tasks</h2>
          <div 
            v-if="showSuccess"
            class="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 z-50"
          >
            {{ successMessage }}
          </div>
        </div>
        
        <div class="space-y-5">
          <template v-if="tasks.length">
            <div 
              v-for="(task, index) in tasks" 
              :key="task.id || index" 
              class="border border-gray-200 bg-white rounded-xl p-5 hover:shadow-md transition-all duration-200"
            >
              <!-- Task Header -->
              <div class="flex flex-col sm:flex-row justify-between gap-4">
                <div class="flex-1">
                  <div class="flex flex-wrap items-start gap-2 mb-3">
                    <h3 class="font-semibold text-gray-900 text-lg">{{ task.name }}</h3>
                    <span class="px-2.5 py-0.5 text-xs rounded-full font-medium" :class="statusClass(task.status)">
                      {{ task.status?.replace('_', ' ') }}
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm mb-4">{{ task.description }}</p>
                  
                  <!-- Task Metadata -->
                  <div class="flex flex-wrap items-center gap-4">
                    <div class="flex items-center text-sm text-gray-700">
                      <svg class="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      Due: {{ formatDate(task.due_date) || 'N/A' }}
                    </div>

                    <a 
                      v-if="task.file_path" 
                      :href="fileDownloadUrl(task.id)" 
                      class="text-sm flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                      View File
                    </a>
                  </div>
                </div>
                
                <!-- Task Actions -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-2 sm:mt-0">
                  <button 
                    @click="toggleSteps(task.id)" 
                    class="flex items-center text-sm text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <svg 
                      class="w-4 h-4 mr-1.5 transition-transform" 
                      :class="{'rotate-180': expandedTasks.includes(task.id)}" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                    {{ expandedTasks.includes(task.id) ? 'Hide Steps' : 'Show Steps' }}
                  </button>
                  
                  <button 
                    v-if="task.status !== 'completed'" 
                    @click="submitTask(task)" 
                    class="flex items-center text-sm text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Submit
                  </button>
                  
                  <button 
                    v-else 
                    @click="deleteTask(task)" 
                    class="flex items-center text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
              
              <!-- File Upload Component -->
              <div class="mt-4">
                <TaskFileUpload v-model="task.uploadedFile" />
              </div>
              
              <!-- Expanded Steps Section -->
              <div 
                v-if="expandedTasks.includes(task.id)" 
                class="mt-5 pt-5 border-t border-gray-200"
              >
                <StepList :task="task" />
              </div>
            </div>
          </template>
          
          <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
            <div class="mx-auto max-w-md">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <h3 class="mt-3 text-lg font-medium text-gray-900">No tasks assigned</h3>
              <p class="mt-1 text-sm text-gray-500">You don't have any tasks assigned to you yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Logout Confirmation Modal -->
  <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 mx-4 relative">
      <button 
        @click="showLogoutModal = false" 
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div class="flex items-start">
        <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
          <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-medium text-gray-900">Confirm Logout</h3>
          <p class="mt-2 text-sm text-gray-500">Are you sure you want to log out of your account?</p>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end gap-3">
        <button 
          @click="showLogoutModal = false" 
          class="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
        <button 
          @click="logout" 
          class="px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StatsCards from '@/components/StatsCards.vue'
import TaskFileUpload from '@/components/TaskFileUpload.vue'
import { useAuth } from '../composables/useAuth.js'

export default {
  components: { StatsCards, TaskFileUpload },
  data() {
    return {
      showSuccess: false,
      successMessage: '',
      successTimeout: null,
      loading: true,
      error: null,
      tasks: [],
      allSteps: [],
      expandedTasks: [],
      assignments: [],
      departments: [],
      roles: [],
      menuItems: [
        { name: 'Update Profile', path: '/UpdateProfile', icon: '👤' },
        { name: 'Home', path: '/', icon: '🏠' },
        { name: 'Complain', path: '/complain', icon: '📝' },
      ],
      user: null,
      userLoading: false,
      userError: null,
      showLogoutModal: false,
    }
  },
  computed: {
    statsItems() {
      return [
        { label: 'Total Tasks', value: this.tasks.length, color: 'text-sky-300' },
        { label: 'Pending Tasks', value: this.tasks.filter(t => t.status === 'pending').length, color: 'text-amber-400' },
        { label: 'Completed Tasks', value: this.tasks.filter(t => t.status === 'completed').length, color: 'text-emerald-400' },
        { 
          label: 'Total Steps', 
          value: this.allSteps.filter(s => this.tasks.some(t => t.id === s.task_id)).length, 
          color: 'text-sky-300' 
        }
      ]
    },
    departmentName() {
      if (!this.user || !this.user.department_id || !this.departments.length) return ''
      const dept = this.departments.find(d => d.id === this.user.department_id)
      return dept ? dept.name : ''
    },
    roleName() {
      if (!this.user || !this.user.role_id || !this.roles.length) return ''
      const role = this.roles.find(r => r.id === this.user.role_id)
      return role ? role.name : ''
    },
  },
  async created() {
    // Fetch user info using useAuth composable
    const { user, loading, error, fetchUser } = useAuth()
    this.userLoading = loading.value
    this.userError = error.value
    await fetchUser()
    this.user = user.value
    // Fetch departments, roles, and all dashboard data in parallel
    await Promise.all([
      this.fetchDepartments(),
      this.fetchRoles(),
      this.fetchData()
    ])
  },
  methods: {
    getProfilePictureUrl(profile_picture) {
      if (!profile_picture) return ''
      return `http://localhost:8000/storage/${profile_picture}`
    },
    async fetchData() {
      try {
        // Fetch tasks, steps, and assignments in parallel
        const [tasksRes, stepsRes, assignmentsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/tasks'),
          axios.get('http://localhost:8000/api/steps'),
          axios.get('http://localhost:8000/api/task-assignments')
        ])
        const allTasks = tasksRes.data
        this.allSteps = stepsRes.data
        this.assignments = assignmentsRes.data
        // Filter assignments for current user
        const userAssignments = this.assignments.filter(a => this.user && a.employee_id === this.user.id)
        // Map tasks with assignment info for current user
        this.tasks = allTasks.reduce((acc, task) => {
          const assignment = userAssignments.find(a => a.task_id === task.id)
          if (assignment) {
            acc.push({
              ...task,
              status: assignment.status,
              due_date: assignment.due_date,
              file_path: assignment.file_path,
              assignment_id: assignment.id,
              assigned_by: assignment.assigned_by,
              steps: this.getStepsForTask(task.id)
            })
          }
          return acc
        }, [])
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        console.error('Fetch error:', err)
      } finally {
        this.loading = false
      }
    },
    showSuccessPopup(message) {
      this.successMessage = message
      this.showSuccess = true
      clearTimeout(this.successTimeout)
      this.successTimeout = setTimeout(() => this.showSuccess = false, 3000)
    },
    fileDownloadUrl(taskId) {
      return `http://localhost:8000/api/tasks/${taskId}/file`
    },
    statusClass(status) {
      const classes = {
        pending: 'bg-amber-500/20 text-amber-300',
        in_progress: 'bg-sky-500/20 text-sky-300',
        completed: 'bg-emerald-500/20 text-emerald-300'
      }
      return `${classes[status] || 'bg-slate-500/20 text-slate-300'} px-2 py-0.5 text-xs rounded-full font-semibold`
    },
    formatDate(dateString) {
      if (!dateString) return null
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch {
        return null
      }
    },
    toggleSteps(taskId) {
      const index = this.expandedTasks.indexOf(taskId)
      index > -1 
        ? this.expandedTasks.splice(index, 1)
        : this.expandedTasks.push(taskId)
    },
    getStepsForTask(taskId) {
      return this.allSteps
        .filter(s => s.task_id === taskId)
        .sort((a, b) => a.id - b.id)
    },
    async logout() {
      try {
        await axios.post('http://localhost:8000/api/logout', {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      } catch (e) {
        // Ignore errors, just clear local state
      }
      localStorage.removeItem('token')
      window.location.href = '/login'
    },
    async submitTask(task) {
      if (task.status === 'completed') return
      try {
        const assignment = this.assignments.find(a => a.task_id === task.id && a.employee_id === this.user.id)
        if (!assignment) {
          this.showSuccessPopup('Assignment not found.')
          return
        }
        // If there's an uploaded file, submit it to the assignment API
        if (task.uploadedFile) {
          const formData = new FormData()
          formData.append('submitted_file_path', task.uploadedFile)
          formData.append('status', 'completed')
          formData.append('submitted_date', new Date().toISOString().slice(0, 10))
          await axios.post(
            `http://localhost:8000/api/task-assignments/${assignment.id}?_method=PUT`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )
        } else {
          // Otherwise, just update the status to completed
          await axios.patch(`http://localhost:8000/api/task-assignments/${assignment.id}`, {
            status: 'completed',
            submitted_date: new Date().toISOString().slice(0, 10)
          })
        }
        this.tasks = this.tasks.map(t =>
          t.id === task.id ? { ...t, status: 'completed' } : t
        )
        this.showSuccessPopup('Task submitted successfully!')
        this.removeUploadedFile(task)
        await this.fetchData()
      } catch (err) {
        this.showSuccessPopup(err.response?.data?.message || err.message)
      }
    },
    async deleteTask(task) {
      try {
        const assignment = this.assignments.find(a => a.task_id === task.id && a.employee_id === this.user.id)
        if (!assignment) {
          this.showSuccessPopup('Assignment not found.')
          return
        }
        // Delete the assignment (not the task itself, to preserve multi-user assignments)
        await axios.delete(`http://localhost:8000/api/task-assignments/${assignment.id}`)
        // Remove the task from the local list
        this.tasks = this.tasks.filter(t => t.id !== task.id)
        this.showSuccessPopup('Task deleted successfully!')
        await this.fetchData()
      } catch (err) {
        this.showSuccessPopup(err.response?.data?.message || err.message)
      }
    },
    async fetchDepartments() {
      try {
        const res = await axios.get('http://localhost:8000/api/departments')
        this.departments = res.data
      } catch (e) {
        this.departments = []
      }
    },
    async fetchRoles() {
      try {
        const res = await axios.get('http://localhost:8000/api/roles')
        this.roles = res.data
      } catch (e) {
        this.roles = []
      }
    },
    onFileChange(event, task) {
      const file = event.target.files[0]
      if (file) {
        this.$set(task, 'uploadedFile', file)
        if (task._uploadedFileUrl) {
          URL.revokeObjectURL(task._uploadedFileUrl)
        }
        this.$set(task, '_uploadedFileUrl', URL.createObjectURL(file))
      } else {
        this.removeUploadedFile(task)
      }
    },
    removeUploadedFile(task) {
      if (task._uploadedFileUrl) {
        URL.revokeObjectURL(task._uploadedFileUrl)
      }
      this.$delete(task, 'uploadedFile')
      this.$delete(task, '_uploadedFileUrl')
    },
    uploadedFileUrl(task) {
      if (task.uploadedFile) {
        if (!task._uploadedFileUrl) {
          this.$set(task, '_uploadedFileUrl', URL.createObjectURL(task.uploadedFile))
        }
        return task._uploadedFileUrl
      }
      return null
    },
  }
}
</script>

<style scoped>
:root {
  color-scheme: light;
}
</style>