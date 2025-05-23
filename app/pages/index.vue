<template>
  <div class="min-h-screen bg-slate-900 p-8 text-slate-200">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-sky-400">Workflow Dashboard</h1>
      <p class="text-slate-400 mt-2">Manage your tasks and steps</p>
    </div>

    <!-- Navigation -->
    <div class="flex items-center mb-4 space-x-4">
      <nuxt-link 
        to="/complain" 
        class="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
      >
        Complain
      </nuxt-link>
      <nuxt-link 
        to="/admin" 
        class="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
      >
        Dashboard
      </nuxt-link>
    </div>

    <!-- Loading & Error States -->
    <div v-if="loading" class="text-center py-8 text-slate-400">
      Loading dashboard data...
    </div>
    <div v-if="error" class="text-center py-8 text-red-400">
      Error loading data: {{ error }}
    </div>

    <!-- Main Content -->
    <div v-if="!loading && !error">
      <!-- Statistics Cards (keep existing stats code) -->
      
      <!-- Tasks Section -->
      <div class="bg-slate-800 rounded-lg shadow-lg p-6">
        <div class="space-y-4">
          <template v-if="tasks.length">
            <div 
              v-for="(task, index) in tasks" 
              :key="task?.id || index"
              class="border border-slate-700 rounded-lg p-4 hover:shadow-xl hover:border-sky-500 transition-shadow"
            >
              <!-- Task Header -->
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-medium text-lg text-sky-400">{{ task.name }}</h3>
                  <p class="text-slate-400 text-sm mt-1">{{ task.description }}</p>
                  <div class="mt-2 flex items-center gap-2">
                    <span class="text-sm text-white">
                      Due: {{ formatDate(task.due_date) }}
                    </span>
                    <span 
                      class="px-2 py-1 text-xs rounded-full font-semibold"
                      :class="statusClass(task.status)"
                    >
                      {{ task.status }}
                    </span>
                  </div>
                </div>
                <button 
                  @click="toggleSteps(task.id)"
                  class="text-sky-500 hover:text-sky-400 text-sm transition-colors"
                >
                  {{ expandedTasks.includes(task.id) ? 'Hide Steps' : 'Show Steps' }}
                </button>
              </div>

              <!-- File Upload Section -->
              <div class="mt-4 border-t border-slate-700 pt-4">
                <div class="flex items-center gap-4">
                  <input
                    type="file"
                    @change="handleFileSelect(task, $event)"
                    class="block w-full text-sm text-slate-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-slate-700 file:text-sky-400
                      hover:file:bg-slate-600"
                  >
                  <button
                    @click="uploadFile(task)"
                    :disabled="!task.selectedFile || uploadLoading"
                    class="px-4 py-2 bg-emerald-600 text-white rounded-full 
                           hover:bg-emerald-700 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ uploadLoading ? 'Uploading...' : 'Upload File' }}
                  </button>
                </div>

                <!-- Uploaded File Display -->
                <div v-if="task.file_path" class="mt-3 flex items-center gap-2">
      <a 
        :href="`http://localhost:8000/api/tasks/${task.id}/file`"
        class="text-sky-400 hover:text-sky-300 inline-flex items-center"
        target="_blank"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
        View File
      </a>
      <button 
        @click="deleteFile(task)"
        class="text-red-400 hover:text-red-300 inline-flex items-center ml-2"
        :disabled="isDeletingFile"
      >
        <svg 
          class="w-4 h-4 mr-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        <span v-if="isDeletingFile">Deleting...</span>
        <span v-else>Delete File</span>
      </button>
    </div>
              </div>

              <!-- Expanded Steps Section -->
              <div v-if="expandedTasks.includes(task.id)" class="mt-4">
                <StepList :task="task" />
              </div>
            </div>
          </template>

          <!-- Empty State -->
          <div v-if="tasks.length === 0" class="text-center py-8 text-slate-500">
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

export default {
  components: { StepList },
  data() {
    return {
      loading: true,
      error: null,
      tasks: [],
      expandedTasks: [],
      uploadLoading: false,
      isDeletingFile: false
    }
  },
  async mounted() {
    await this.fetchTasks()
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.get('http://localhost:8000/api/tasks')
        this.tasks = response.data.map(task => ({
          ...task,
          selectedFile: null // Add temporary file storage to each task
        }))
      } catch (err) {
        this.error = err.response?.data?.message || err.message
      } finally {
        this.loading = false
      }
    },

    handleFileSelect(task, event) {
      // Store selected file with the task
      const file = event.target.files[0]
      this.tasks = this.tasks.map(t => 
        t.id === task.id ? { ...t, selectedFile: file } : t
      )
    },
    async deleteFile(task) {
      if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
        return
      }

      this.isDeletingFile = true
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/tasks/${task.id}/file`
        )

        // Update the task in the local state
        const taskIndex = this.tasks.findIndex(t => t.id === task.id)
        if (taskIndex > -1) {
          this.tasks.splice(taskIndex, 1, response.data.task)
        }

        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'File deleted successfully'
        })

      } catch (error) {
        console.error('Delete file error:', error)
        this.$notify({
          type: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete file'
        })
      } finally {
        this.isDeletingFile = false
      }
    },
    async uploadFile(task) {
      if (!task.selectedFile) return
      
      this.uploadLoading = true
      try {
        const formData = new FormData()
        formData.append('file', task.selectedFile)

        const response = await axios.post(
          `http://localhost:8000/api/tasks/${task.id}/file`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        // Update task with new file path
        this.tasks = this.tasks.map(t =>
          t.id === task.id ? { ...t, file_path: response.data.file_path, selectedFile: null } : t
        )
        
      } catch (err) {
        console.error('File upload failed:', err)
        alert(err.response?.data?.message || 'File upload failed')
      } finally {
        this.uploadLoading = false
      }
    },

    // Keep existing helper methods
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch {
        return 'Invalid date'
      }
    },

    statusClass(status) {
      return {
        'pending': 'bg-amber-500/20 text-amber-300',
        'in_progress': 'bg-sky-500/20 text-sky-300',
        'completed': 'bg-emerald-500/20 text-emerald-300'
      }[status] || 'bg-slate-500/20 text-slate-300'
    },

    toggleSteps(taskId) {
      const index = this.expandedTasks.indexOf(taskId)
      index > -1 
        ? this.expandedTasks.splice(index, 1)
        : this.expandedTasks.push(taskId)
    }
  }
}
</script>
<style scoped>
/* Add animation for delete button */
button {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}
</style>