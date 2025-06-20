<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">All Tasks</h1>
        <p class="text-gray-500">Manage your tasks and their steps</p>
      </div>
      <!-- Back button -->
      <div class="flex items-center mb-8 gap-4 justify-between">
        <BackButton to="/admin/admin" />
        <div class="flex items-center gap-4">
          <div class="max-w-xs w-full">
            <SearchInput v-model="search" placeholder="Search task name..." />
          </div>
          <TaskCreator 
            @task-created="addTask" 
          />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-flex items-center text-gray-400">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading tasks...
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-8 text-center text-red-500 bg-red-50 rounded-lg mx-4 my-6">
          {{ error }}
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Empty State -->
          <div v-if="!tasks.length" class="p-8 text-center text-gray-400">
            <p class="mb-2">No tasks found</p>
            <p class="text-sm">Create your first task above</p>
          </div>

          <!-- Task List -->
          <div v-else class="divide-y divide-gray-100">
            <div v-for="task in filteredTasks" :key="task.id" class="p-6 hover:bg-gray-50 transition-colors">
              <div class="flex justify-between items-start gap-4 mb-4">
                <div class="flex-1">
                  <!-- Task Name -->
                  <h2 v-if="!task.editing" class="text-xl font-semibold text-gray-800 mb-1">
                    {{ task.name }}
                  </h2>
                  <input 
                    v-else 
                    v-model="task.editName" 
                    class="text-xl font-semibold text-gray-800 mb-2 w-full px-2 py-1 border-b border-gray-200 focus:border-blue-300 focus:outline-none"
                  />

                  <!-- Task Description -->
                  <p v-if="!task.editing" class="text-gray-600 mb-3">
                    {{ task.description }}
                  </p>
                  <textarea 
                    v-else 
                    v-model="task.editDescription" 
                    class="text-gray-600 mb-3 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
                    rows="2"
                  ></textarea>
                </div>

                <!-- Task Actions -->
                <div class="flex gap-2 flex-shrink-0">
                  <button 
                    v-if="!task.editing" 
                    @click="startEditTask(task)" 
                    class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    v-if="task.editing" 
                    @click="saveEditTask(task)" 
                    class="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                  >
                    Save
                  </button>
                  <button 
                    v-if="task.editing" 
                    @click="cancelEditTask(task)" 
                    class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    @click="deleteTask(task.id)" 
                    class="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <!-- Steps Section -->
              <div class="pl-2 border-l-2 border-gray-100">
                <StepCreator 
                  :taskId="task.id" 
                  @step-created="step => addStep(task, step)"
                  class="mb-4"
                />
                <div v-if="task.steps && task.steps.length">
                  <h3 class="text-md font-medium text-gray-700 mb-3 flex items-center">
                    <span class="mr-2">Steps</span>
                    <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {{ task.steps.length }}
                    </span>
                  </h3>
                  <StepList2 
                    :task="task" 
                    @step-updated="onStepUpdated"
                    @step-deleted="onStepDeleted"
                    class="space-y-2"
                  />
                </div>
                <div v-else class="text-sm text-gray-400 italic">
                  No steps for this task yet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import TaskCreator from '@/components/TaskCreator.vue'
import StepCreator from '@/components/StepCreator.vue'
import StepList2 from '@/components/StepList2.vue'
import SearchInput from '@/components/SearchInput.vue'
import { useAuth } from '@/composables/useAuth.js'
import { useRuntimeConfig } from '#app'

export default {
  components: { TaskCreator, StepCreator, StepList2, SearchInput },
  data() {
    return {
      tasks: [],
      loading: true,
      error: null,
      search: '',
      user: null,
      userLoading: true,
      userError: null,
      apiUrl: null
    }
  },
  computed: {
    filteredTasks() {
      let list = [...this.tasks]
      // Sort by created_at descending (recent first)
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      if (!this.search) return list
      return list.filter(t => t.name.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  async mounted() {
    const config = useRuntimeConfig()
    this.apiUrl = config.public.apiUrl
    await this.fetchUser()
    await this.fetchTasks()
  },
  methods: {
    async fetchUser() {
      // Use useAuth composable to fetch user
      const { user, fetchUser, error, loading } = useAuth()
      this.userLoading = loading.value
      this.userError = error.value
      await fetchUser()
      this.user = user.value
      this.userLoading = loading.value
      this.userError = error.value
    },
    async fetchTasks() {
      try {
        const [tasksRes, stepsRes] = await Promise.all([
          axios.get(`${this.apiUrl}/tasks`),
          axios.get(`${this.apiUrl}/steps`)
        ])
        const allTasks = tasksRes.data
        const allSteps = stepsRes.data
        this.tasks = allTasks.map(task => ({
          ...task,
          steps: allSteps.filter(s => s.task_id === task.id),
          editing: false,
          editName: task.name,
          editDescription: task.description
        }))
      } catch (err) {
        this.error = err.response?.data?.message || err.message
      } finally {
        this.loading = false
      }
    },
    async addTask(newTask) {
      this.tasks.push({ ...newTask, steps: [], editing: false, editName: newTask.name, editDescription: newTask.description })
      if (this.user) {
        await this.recordHistory({
          action: 'created',
          name: newTask.name,
          description: `Task created: ${newTask.name} - description: ${newTask.description}`,
          userName: this.user.name,
          email: this.user.email,
          employeeId: this.user.id
        })
      }
    },
    startEditTask(task) {
      task.editing = true
      task.editName = task.name
      task.editDescription = task.description
    },
    cancelEditTask(task) {
      task.editing = false
    },
    async saveEditTask(task) {
      try {
        const oldName = task.name;
        const oldDesc = task.description;
        const response = await axios.put(`${this.apiUrl}/tasks/${task.id}`, {
          name: task.editName,
          description: task.editDescription
        })
        task.name = response.data.name
        task.description = response.data.description
        task.editing = false
        // Record history
        if (this.user) {
          await this.recordHistory({
            action: 'updated',
            name: task.name,
            description: `Task updated: old name: ${oldName}, new name: ${task.name}; old desc: ${oldDesc}, new desc: ${task.description}`,
            userName: this.user.name,
            email: this.user.email,
            employeeId: this.user.id
          })
        }
      } catch (err) {
        alert('Failed to update task.')
      }
    },
    async deleteTask(id) {
      const task = this.tasks.find(t => t.id === id)
      if (!confirm('Are you sure you want to delete this task?')) return
      try {
        await axios.delete(`${this.apiUrl}/tasks/${id}`)
        this.tasks = this.tasks.filter(t => t.id !== id)
        // Record history
        if (this.user && task) {
          await this.recordHistory({
            action: 'deleted',
            name: task.name,
            description: `Task deleted: ${task.name} - description: ${task.description}`,
            userName: this.user.name,
            email: this.user.email,
            employeeId: this.user.id
          })
        }
      } catch (err) {
        alert('Failed to delete task.')
      }
    },
    async addStep(task, step) {
      task.steps.push(step)
      if (this.user) {
        await this.recordHistory({
          action: 'created',
          name: step.name,
          description: `Step created: ${step.name} for task: ${task.name}`,
          userName: this.user.name,
          email: this.user.email,
          employeeId: this.user.id
        })
      }
    },
    async onStepUpdated({ taskId, stepId, newData }) {
      const task = this.tasks.find(t => t.id === taskId)
      const step = task.steps.find(s => s.id === stepId)
      const oldData = { ...step }
      Object.assign(step, newData)
      try {
        await axios.put(`${this.apiUrl}/steps/${stepId}`, newData)
        // Record history
        if (this.user) {
          await this.recordHistory({
            action: 'updated',
            name: step.name,
            description: `Step updated for task: ${task.name} - ` +
                         `Field changes: ${Object.keys(newData).map(key => `${key}: ${oldData[key]} -> ${newData[key]}`).join(', ')}`,
            userName: this.user.name,
            email: this.user.email,
            employeeId: this.user.id
          })
        }
      } catch (err) {
        Object.assign(step, oldData)
        alert('Failed to update step.')
      }
    },
    async onStepDeleted({ taskId, stepId }) {
      const task = this.tasks.find(t => t.id === taskId)
      const step = task.steps.find(s => s.id === stepId)
      if (!confirm(`Are you sure you want to delete the step "${step.name}"?`)) return
      try {
        await axios.delete(`${this.apiUrl}/steps/${stepId}`)
        task.steps = task.steps.filter(s => s.id !== stepId)
        // Record history
        if (this.user) {
          await this.recordHistory({
            action: 'deleted',
            name: step.name,
            description: `Step deleted from task: ${task.name} - ${step.name}`,
            userName: this.user.name,
            email: this.user.email,
            employeeId: this.user.id
          })
        }
      } catch (err) {
        alert('Failed to delete step.')
      }
    },
    async recordHistory(payload) {
      // Call the backend API to record history
      try {
        // Add action_time if not present
        if (!payload.action_time) {
          payload.action_time = new Date().toISOString();
        }
        await axios.post(`${this.apiUrl}/history`, {
          action_time: payload.action_time,
          user_name: payload.userName,
          email: payload.email,
          name: payload.name,
          employee_id: payload.employeeId,
          action: payload.action,
          description: payload.description
        });
      } catch (err) {
        // Optionally handle/log error
        console.error('Failed to record history:', err);
      }
    }
  }
}
</script>
