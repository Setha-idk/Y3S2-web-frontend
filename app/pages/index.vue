<template>
  <!-- Sidebar Navigation -->
  <div class="fixed inset-y-0 left-0 w-64 flex flex-col z-30 bg-gray-800 text-white border-r border-gray-700 shadow-xl">
    <!-- Profile Section -->
    <div class="p-5 flex items-center gap-4 border-b border-gray-700 bg-gray-900">
      <div class="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600">
        <img v-if="user && user.profile_picture" :src="getProfilePictureUrl(user.profile_picture)" class="h-full w-full object-cover" alt="Profile Picture" />
        <span v-else class="text-2xl text-gray-300">👤</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-medium truncate">{{ user ? user.name : 'Guest' }}</p>
        <p class="text-xs text-gray-400 truncate">{{ user ? user.email : '' }}</p>
        <div class="flex flex-wrap gap-x-2 mt-1">
          <span v-if="departmentName" class="text-xs text-gray-400">Dept: {{ departmentName }}</span>
          <span v-if="roleName" class="text-xs text-gray-400">Role: {{ roleName }}</span>
          <span class="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">Access: {{ user ? user.access_level : '' }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto py-2 bg-gray-800">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.name">
          <NuxtLink 
            :to="item.path" 
            :class="[
              'flex items-center px-4 py-3 mx-2 rounded-lg transition-colors',
              $route.path === item.path
                ? 'bg-gray-700 text-white shadow-inner'
                : 'hover:bg-gray-700 text-gray-300 hover:text-white'
            ]"
          >
            <span class="mr-3 text-lg">{{ item.icon }}</span>
            <span class="text-sm font-medium">{{ item.name }}</span>
          </NuxtLink>
        </li>

        <!-- Admin/Manager Section -->
        <div v-if="user && (user.access_level === 'admin' || user.access_level === 'manager')" class="mt-4 pt-4 border-t border-gray-700">
          <p class="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
          <li>
            <NuxtLink to="/admin/admin" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">⚙️</span>
              <span class="text-sm font-medium">Admin Panel</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/assign" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">📝</span>
              <span class="text-sm font-medium">Assign Tasks</span>
            </NuxtLink>
          </li>
        </div>

        <!-- Auth Section -->
        <div class="mt-4 pt-4 border-t border-gray-700">
          <li v-if="user">
            <button @click="showLogoutModal = true" class="flex items-center w-full px-4 py-3 mx-2 rounded-lg transition-colors text-left hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">🚪</span>
              <span class="text-sm font-medium">Log Out</span>
            </button>
          </li>
          <li v-if="!user">
            <NuxtLink to="/login" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">🔑</span>
              <span class="text-sm font-medium">Login</span>
            </NuxtLink>
          </li>
        </div>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="p-4 text-xs text-gray-400 border-t border-gray-700 bg-gray-900">
      © 2025 Workflow System v1.0
    </div>
  </div>

  <!-- Main Content -->
  <div class="min-h-screen bg-white text-gray-800 ml-0 lg:ml-64 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Workflow Dashboard</h1>
      <p class="text-gray-500">Manage your tasks and steps efficiently</p>
    </div>

    <!-- Loading/Error States -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">Error loading dashboard data: {{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-if="!loading && !error" class="space-y-6">
      <!-- Stats Cards -->
      <StatsCards :statsItems="statsItems" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" />

      <!-- Tasks Section -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Your Tasks</h2>
          <div 
            v-if="showSuccess"
            class="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 z-50"
          >
            {{ successMessage }}
          </div>
        </div>
        <div class="space-y-6">
          <template v-if="tasks.length">
            <div v-for="(task, index) in tasks" :key="task.id || index" class="task-item border border-gray-200 bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-sky-300">
              <!-- Task Header -->
              <div class="flex flex-col sm:flex-row justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-start gap-3">
                    <h3 class="font-semibold text-lg text-sky-700">{{ task.name }}</h3>
                    <span class="px-2.5 py-0.5 text-xs rounded-full font-semibold mt-0.5" :class="statusClass(task.status)">{{ task.status?.replace('_', ' ') }}</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-2 max-w-md">{{ task.description }}</p>
                  <!-- Task Metadata -->
                  <div class="mt-3 flex items-center gap-3 flex-wrap">
                    <div class="flex items-center text-sm text-gray-700">
                      <svg class="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      Due: {{ formatDate(task.due_date) || 'N/A' }}
                    </div>
                    <a v-if="task.file_path" :href="fileDownloadUrl(task.id)" class="text-sm flex items-center text-blue-600 hover:text-blue-800 transition-colors underline cursor-pointer" target="_blank" rel="noopener noreferrer">
                      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                      View Submitted File
                    </a>
                  </div>
                </div>
                <!-- Task Actions -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button @click="toggleSteps(task.id)" class="flex items-center text-sm text-sky-700 hover:text-sky-900 px-3 py-1.5 rounded-lg hover:bg-sky-50 transition-colors">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                    {{ expandedTasks.includes(task.id) ? 'Hide Steps' : 'Show Steps' }}
                  </button>
                  <!-- File Upload (optional) -->
                  <div class="flex flex-col items-start gap-2">
                    <div v-if="task.uploadedFile" class="mb-1">
                      <span class="text-xs text-gray-600">Selected file:</span>
                      <span class="text-xs font-medium text-blue-700">{{ task.uploadedFile.name }}</span>
                    </div>
                    <input type="file" @change="handleFileChange($event, task)" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                    <button v-if="task.uploadedFile" @click="removeUploadedFile(task)" class="text-xs text-red-500 hover:underline mt-1" type="button">Remove</button>
                  </div>
                  <!-- Submit Task Button (does not require file) -->
                  <button v-if="task.status !== 'completed'" @click="submitTask(task)" class="flex items-center text-sm text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Submit Task
                  </button>
                  <div v-else class="flex items-center text-sm text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Completed
                  </div>
                </div>
              </div>
              <!-- Expanded Steps Section -->
              <div v-if="expandedTasks.includes(task.id)" class="mt-4 pt-4 border-t border-gray-200">
                <StepList :task="task" />
              </div>
            </div>
          </template>
          <div v-else class="text-center py-12">
            <div class="mx-auto max-w-md">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <h3 class="mt-2 text-lg font-medium text-gray-900">No tasks assigned</h3>
              <p class="mt-1 text-sm text-gray-500">You don't have any tasks assigned to you yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Logout Confirmation Modal -->
  <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 mx-4 relative">
      <div class="absolute top-4 right-4">
        <button @click="showLogoutModal = false" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="sm:flex sm:items-start">
        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm Logout</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">Are you sure you want to log out of your account?</p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button @click="logout" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
          Log Out
        </button>
        <button @click="showLogoutModal = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StatsCards from '@/components/StatsCards.vue'
import { useAuth } from '../composables/useAuth.js'

export default {
  components: { StatsCards },
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
      navLinks: [
        { path: '/complain', label: 'Complain' },
      ],
      showSubmitModal: false,
      submittingTask: null,
      submitFile: null,
      submitError: '',
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
        // 1. Fetch tasks
        const tasksRes = await axios.get('http://localhost:8000/api/tasks')
        const allTasks = tasksRes.data
        // 2. Fetch steps
        const stepsRes = await axios.get('http://localhost:8000/api/steps')
        this.allSteps = stepsRes.data
        // 3. Fetch assignments
        const assignmentsRes = await axios.get('http://localhost:8000/api/task-assignments')
        this.assignments = assignmentsRes.data
        // 4. Filter assignments for current user
        const userAssignments = this.assignments.filter(a => this.user && a.employee_id === this.user.id)
        // 5. For each task, check if there's an assignment for this user
        this.tasks = allTasks
          .map(task => {
            const assignment = userAssignments.find(a => a.task_id === task.id)
            if (assignment) {
              return {
                ...task,
                status: assignment.status,
                due_date: assignment.due_date,
                file_path: assignment.file_path,
                assignment_id: assignment.id,
                assigned_by: assignment.assigned_by,
              }
            }
            return null
          })
          .filter(Boolean)
        // Attach steps to tasks
        this.tasks = this.tasks.map(task => ({
          ...task,
          steps: this.getStepsForTask(task.id)
        }))
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
    openSubmitModal(task) {
      this.submittingTask = task
      this.showSubmitModal = true
      this.submitFile = null
      this.submitError = ''
    },
    closeSubmitModal() {
      this.showSubmitModal = false
      this.submittingTask = null
      this.submitFile = null
      this.submitError = ''
    },
    onFileChange(e) {
      this.submitFile = e.target.files[0]
    },
    async submitTaskFile() {
      if (!this.submitFile || !this.submittingTask) {
        this.submitError = 'Please select a file.'
        return
      }
      try {
        const assignment = this.assignments.find(a => a.task_id === this.submittingTask.id && a.employee_id === this.user.id)
        if (!assignment) {
          this.submitError = 'Assignment not found.'
          return
        }
        const formData = new FormData()
        formData.append('submitted_file_path', this.submitFile)
        formData.append('status', 'completed')
        formData.append('submitted_date', new Date().toISOString().slice(0, 10))
        await axios.post(
          `http://localhost:8000/api/task-assignments/${assignment.id}?_method=PUT`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        this.tasks = this.tasks.map(t =>
          t.id === this.submittingTask.id ? { ...t, status: 'completed' } : t
        )
        this.showSuccessPopup('Task submitted successfully!')
        this.closeSubmitModal()
        await this.fetchData()
      } catch (err) {
        this.submitError = err.response?.data?.message || err.message
      }
    },
    getSubmittedFile(task) {
      const assignment = this.assignments.find(a => a.task_id === task.id && a.employee_id === this.user.id)
      return assignment && assignment.submitted_file_path ? assignment.submitted_file_path : null
    },
    async fetchDepartments() {
      try {
        const res = await axios.get('http://localhost:8000/api/departments')
        this.departments = res.data
      } catch {}
    },
    async fetchRoles() {
      try {
        const res = await axios.get('http://localhost:8000/api/roles')
        this.roles = res.data
      } catch {}
    },
    handleFileChange(event, task) {
      const file = event.target.files[0]
      if (file) {
        this.$set(task, 'uploadedFile', file)
      }
    },
    removeUploadedFile(task) {
      this.$delete(task, 'uploadedFile')
    },
    async submitTask(task) {
      if (task.status === 'completed') return
      try {
        const assignment = this.assignments.find(a => a.task_id === task.id && a.employee_id === this.user.id)
        if (!assignment) {
          this.showSuccessPopup('Assignment not found.')
          return
        }
        // If there's an uploaded file, submit it
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
  }
}
</script>

<style scoped>
:root {
  color-scheme: light;
}
</style>