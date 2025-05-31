<template>
  <div class="min-h-screen bg-slate-900 p-8 text-slate-200">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-sky-400">Workflow Dashboard</h1>
      <p class="text-slate-400 mt-2">Manage your tasks and steps</p>
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
        <!-- Submit Button -->
              <div class="mt-4 flex justify-end">
                <button
                  @click="submitTask(task.id)"
                  class="bg-emerald-600 mb-4 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                >
                  Submit Task
                </button>
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
            No tasks found. Create your first task!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StepList from '@/components/StepList.vue'
import TaskCreator from '@/components/TaskCreator.vue'
import StepCreator from '@/components/StepCreator.vue'

export default {
  components: { TaskCreator, StepCreator, StepList },
  
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
        const [tasksRes, stepsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/tasks'),
          axios.get('http://localhost:8000/api/steps')
        ])

        this.tasks = tasksRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        this.allSteps = stepsRes.data

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

    handleNewTask(newTask) {
      this.tasks.unshift({ ...newTask, steps: [] })
      this.showSuccessPopup('Task created successfully!')
    },

    handleNewStep(newStep) {
      this.allSteps.push(newStep)
      const taskIndex = this.tasks.findIndex(t => t.id === newStep.task_id)
      if (taskIndex > -1) {
        const updatedTask = { ...this.tasks[taskIndex] }
        updatedTask.steps = [...(updatedTask.steps || []), newStep]
          .sort((a, b) => a.id - b.id)
        this.tasks.splice(taskIndex, 1, updatedTask)
      }
    },

    async deleteTask(taskId) {
      try {
        await axios.delete(`http://localhost:8000/api/tasks/${taskId}`)
        this.tasks = this.tasks.filter(t => t.id !== taskId)
        this.allSteps = this.allSteps.filter(s => s.task_id !== taskId)
        this.showSuccessPopup('Task deleted successfully!')
      } catch (err) {
        this.error = `Delete failed: ${err.response?.data?.message || err.message}`
        console.error('Delete error:', err)
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

    confirmDeleteTask(taskId) {
      const task = this.tasks.find(t => t.id === taskId)
      if (task && confirm(`Delete task "${task.name}"? This cannot be undone.`)) {
        this.deleteTask(taskId)
      }
    },

    openUpdateTaskModal(task) {
      // Implement your update modal logic here
      console.log('Open update modal for:', task)
    }
  }
}
</script>

<style scoped>
</style>