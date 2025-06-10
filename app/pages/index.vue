<template>
  <!-- Sidebar Navigation -->
  <div class="fixed inset-y-0 left-0 w-64 flex flex-col z-30 bg-gray-900 text-white border-r border-gray-800">
    <!-- Profile Section -->
    <div class="p-4 flex items-center space-x-3 border-b border-gray-800">
      <div class="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
        <img v-if="user && user.profile_picture" :src="getProfilePictureUrl(user.profile_picture)" class="h-12 w-12 object-cover" alt="Profile Picture" />
        <span v-else class="text-2xl">👤</span>
      </div>
      <div>
        <p class="font-medium">{{ user ? user.name : 'Guest' }}</p>
        <p class="text-xs text-gray-400">{{ user ? user.email : '' }}</p>
        <p v-if="departmentName" class="text-xs mt-1 text-gray-400">Dept: {{ departmentName }}</p>
        <p v-if="roleName" class="text-xs text-gray-400">role: {{ roleName }}</p>
        <p class="text-xs text-gray-400">Access: {{ user ? user.access_level : '' }}</p>

      </div>
    </div>
    <!-- Profile Section ends-->
    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto">
      <ul>
        <li v-for="item in menuItems" :key="item.name">
          <NuxtLink 
            :to="item.path" 
            :class="[
              'flex items-center px-4 py-3 transition-colors',
              $route.path === item.path
                ? 'bg-gray-800 text-white'
                : 'hover:bg-gray-800 text-gray-300 hover:text-white'
            ]"
          >
            <span class="mr-3">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </NuxtLink>
        </li>
        <li v-if="user && (user.access_level === 'admin' || user.access_level === 'manager')">
          <NuxtLink to="/admin" class="flex items-center px-4 py-3 transition-colors hover:bg-gray-800 text-gray-300 hover:text-white">
            <span class="mr-3">🛠️</span>
            <span>Admin Panel</span>
          </NuxtLink>
        </li>
        <li v-if="user && (user.access_level === 'admin' || user.access_level === 'manager')">
          <NuxtLink to="/assign" class="flex items-center px-4 py-3 transition-colors hover:bg-gray-800 text-gray-300 hover:text-white">
            <span class="mr-3">🛠️</span>
            <span>Assign Tasks</span>
          </NuxtLink>
        </li>
        <li v-if="user">
          <button @click="showLogoutModal = true" class="flex items-center w-full px-4 py-3 transition-colors text-left hover:bg-gray-800 text-gray-300 hover:text-white">
            <span class="mr-3">🚪</span>
            <span>Log Out</span>
          </button>
        </li>
        <li v-if="!user">
          <NuxtLink to="/login" class="flex items-center px-4 py-3 transition-colors hover:bg-gray-800 text-gray-300 hover:text-white">
            <span class="mr-3">🔑</span>
            <span>Login</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <!-- Footer -->
    <div class="p-4 text-xs text-gray-500 border-t border-gray-800">
      © 2025 Workflow System
    </div>
  </div>
  <!-- Sidebar Navigation ends-->
   
  <!-- Main Content (offset for sidebar) -->
  <div class="min-h-screen p-8 bg-slate-100 text-slate-900 ml-0 sm:ml-64">
    <!-- Header Section -->
    <div class="mb-8 flex flex-col sm:flex-row justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-sky-400">Workflow Dashboard</h1>
        <p class="text-slate-400 mt-2">Manage your tasks and steps</p>
      </div>
    </div>
    <!-- User Profile Card (optional, can remove if redundant) -->
    <!-- <UserProfileCard v-if="user" :user="user" /> -->
    <!-- Loading & Error States -->
    <div v-if="loading" class="text-center py-8 text-slate-400">
      Loading dashboard data...
    </div>
    <div v-if="error" class="text-center py-8 text-red-400">
      Error loading data: {{ error }}
    </div>
    <!-- Main Content -->
    <div v-if="!loading && !error">
      <StatsCards :statsItems="statsItems" />
      <div class="rounded-lg shadow-lg p-6 bg-slate-100 text-slate-900">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 class="text-xl font-semibold text-sky-300 mb-3 sm:mb-0">Tasks</h2>
          <div>
            <div 
              v-if="showSuccess"
              class="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 z-50"
            >
              {{ successMessage }}
            </div>
          </div>
        </div>
        <TaskList
          :tasks="tasks"
          :expandedTasks="expandedTasks"
          :showSubmitModal="showSubmitModal"
          :submittingTask="submittingTask"
          :submitError="submitError"
          :getSubmittedFile="getSubmittedFile"
          :fileDownloadUrl="fileDownloadUrl"
          :statusClass="statusClass"
          :formatDate="formatDate"
          @toggle-steps="toggleSteps"
          @open-submit-modal="openSubmitModal"
          @close-submit-modal="closeSubmitModal"
          @file-change="onFileChange"
          @submit-task-file="submitTaskFile"
        />
      </div>
    </div>
  </div>

  <!-- Logout Confirmation Modal -->
  <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-xs p-6 relative text-gray-800">
      <h2 class="text-lg font-semibold mb-4">Confirm Logout</h2>
      <p class="mb-6">Are you sure you want to log out?</p>
      <div class="flex justify-end gap-2">
        <button @click="showLogoutModal = false" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button @click="logout" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Log Out</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StatsCards from '@/components/StatsCards.vue'
import TaskList from '@/components/TaskList.vue'
import { useAuth } from '../composables/useAuth.js'

export default {
  components: { StatsCards, TaskList },
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
  }
}
</script>

<style scoped>
:root {
  color-scheme: light;
}
</style>