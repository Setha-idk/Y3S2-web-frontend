<template>
  <div class="min-h-screen bg-slate-900 p-8 text-slate-200">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-sky-400">Workflow Dashboard</h1>
      <p class="text-slate-400 mt-2">Manage your tasks and steps</p>
      <div v-if="user" class="mt-4 bg-gradient-to-r from-sky-800 to-slate-800 rounded-xl p-5 shadow flex flex-col sm:flex-row sm:items-center gap-4 border border-sky-700/40">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center text-2xl font-bold text-white shadow-inner border-2 border-sky-400">
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <div class="font-semibold text-lg text-sky-200">{{ user.name }}</div>
            <div class="text-xs text-slate-400">{{ user.email }}</div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:ml-8">
          <span class="inline-flex items-center bg-sky-900/60 text-sky-300 px-3 py-1 rounded-full text-sm font-medium border border-sky-700">
            <svg class="w-4 h-4 mr-1 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7a1 1 0 00-1-1h-3m-10 0H4a1 1 0 00-1 1z"/></svg>
            {{ user.department }}
          </span>
          <span class="inline-flex items-center bg-sky-900/60 text-sky-300 px-3 py-1 rounded-full text-sm font-medium border border-sky-700">
            <svg class="w-4 h-4 mr-1 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 01-8 0"/></svg>
            {{ user.role }}
          </span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex items-center mb-6 space-x-4 overflow-x-auto pb-2">
      <nuxt-link 
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap"
      >
        {{ link.label }}
      </nuxt-link>
      <button
        v-if="user"
        @click="logout"
        class="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors whitespace-nowrap ml-2"
      >
        Log Out
      </button>
    </nav>

    <!-- Loading & Error States -->
    <div v-if="loading" class="text-center py-8 text-slate-400">
      Loading dashboard data...
    </div>
    <div v-if="error" class="text-center py-8 text-red-400">
      Error loading data: {{ error }}
    </div>

    <!-- Main Content -->
    <div v-if="!loading && !error">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div 
          v-for="stat in statsItems"
          :key="stat.label"
          class="bg-slate-800 p-4 rounded-lg shadow-lg"
        >
          <h3 class="text-slate-400 text-sm">{{ stat.label }}</h3>
          <p class="text-2xl font-bold" :class="stat.color">{{ stat.value }}</p>
        </div>
      </div>
      <!-- Tasks Section -->
      <div class="bg-slate-800 rounded-lg shadow-lg p-6">
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
        <!-- Tasks List -->
        <div class="space-y-4">
          <template v-if="tasks.length">
            <div 
              v-for="(task, index) in tasks" 
              :key="task.id || index"
              class="task-item border border-slate-700 rounded-lg p-4 hover:shadow-xl hover:border-sky-500/70 transition-all duration-200"
            >
              <!-- Task Header -->
              <div class="flex flex-col sm:flex-row justify-between sm:items-center">
                <div class="mb-3 sm:mb-0">
                  <h3 class="font-medium text-lg text-sky-400">{{ task.name }}</h3>
                  <p class="text-slate-400 text-sm mt-1 max-w-md">{{ task.description }}</p>
                  <!-- Task Metadata -->
                  <div class="mt-2 flex items-center gap-x-3 gap-y-1 flex-wrap">
                    <span class="text-sm text-white">
                      Due: {{ formatDate(task.due_date) || 'N/A' }}
                    </span>
                    <span 
                      class="px-2 py-0.5 text-xs rounded-full font-semibold"
                      :class="statusClass(task.status)"
                    >
                      {{ task.status?.replace('_', ' ') }}
                    </span>
                    <a 
                      v-if="task.file_path"
                      :href="fileDownloadUrl(task.id)"
                      class="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                      target="_blank"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                      Attached File
                    </a>
                  </div>
                </div>
                <!-- Task Actions -->
                <!-- Show Steps button for users to view steps, but no edit/delete -->
                <div class="flex flex-shrink-0 flex-col sm:flex-row items-start sm:items-center gap-2">
                  <button 
                    @click="toggleSteps(task.id)"
                    class="task-action-btn text-sky-500 hover:text-sky-400"
                  >
                    {{ expandedTasks.includes(task.id) ? 'Hide Steps' : 'Show Steps' }}
                  </button>
                </div>
              </div>
              <!-- Expanded Steps Section -->
              <div 
                v-if="expandedTasks.includes(task.id)" 
                class="mt-3 pt-3 border-t border-slate-700"
              >
                <StepList :task="task" />
              </div>
            </div>
          </template>
          <!-- Empty State -->
          <div v-if="!tasks.length" class="text-center py-8 text-slate-500">
            No tasks assigned to you.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StepList from '@/components/StepList.vue'
import { useAuth } from '../composables/useAuth.js'

export default {
  components: { StepList },
  setup() {
    const { user, loading: userLoading, error: userError, fetchUser } = useAuth()
    return { user, userLoading, userError, fetchUser }
  },
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
      ]
    }
  },
  computed: {
    statsItems() {
      return [
        { label: 'Total Tasks', value: this.tasks.length, color: 'text-sky-300' },
        { label: 'Pending Tasks', value: this.tasks.filter(t => t.status === 'pending').length, color: 'text-amber-400' },
        { label: 'Completed Steps', value: this.allSteps.filter(s => s.status === 'completed').length, color: 'text-emerald-400' },
        { label: 'Total Steps', value: this.allSteps.length, color: 'text-sky-300' }
      ]
    }
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
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
          .filter(Boolean) // Only tasks with assignments for this user

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
  }
}
</script>

<style scoped>
</style>