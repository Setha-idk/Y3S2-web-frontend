<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Dashboard Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Workflow Dashboard</h1>
      <p class="text-gray-600 mt-2">Manage your tasks and steps</p>
    </div>
    <div>
      <nuxt-link to="/history" class="px-4 py-2 text-gray-700 hover:text-gray-900">
        Edit History
      </nuxt-link>
    </div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 text-gray-500">
      Loading dashboard data...
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center py-8 text-red-500">
      Error loading data: {{ error }}
    </div>

    <!-- Content -->
    <div v-if="!loading && !error">
      <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-gray-500 text-sm">Total Tasks</h3>
          <p class="text-2xl font-bold text-gray-800">{{ stats.totalTasks }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-gray-500 text-sm">Pending Tasks</h3>
          <p class="text-2xl font-bold text-yellow-600">{{ stats.pendingTasks }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-gray-500 text-sm">Completed Steps</h3>
          <p class="text-2xl font-bold text-green-600">{{ stats.completedSteps }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-gray-500 text-sm">Total Steps</h3>
          <p class="text-2xl font-bold text-gray-800">{{ stats.totalSteps }}</p>
        </div>
      </div>

      <!-- Tasks Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Tasks</h2>
          <div>
            <div 
                v-if="showSuccess"
                class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300"
              >
                Task created successfully!
              </div>
            <!-- Add this where you want the button -->
            <TaskCreator @task-created="handleNewTask" />
            
          </div>
        </div>


        <!-- Tasks List -->
        <div class="space-y-4">
          <template v-if="tasks && tasks.length">
            <div 
            v-for="(task, index) in tasks" 
            :key="task?.id || index"
            class="task-item border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-lg text-gray-800">{{ task?.name }}</h3>
              <p class="text-gray-600 text-sm mt-1">{{ task?.description }}</p>
              <div class="mt-2 flex items-center gap-2">
                <span class="text-sm text-gray-500">Due: {{ formatDate(task?.due_date) }}</span>
                <span 
                  class="px-2 py-1 text-sm rounded-full"
                  :class="statusClass(task?.status)"
                >
                  {{ task?.status }}
                </span>
              </div>
            </div>
            <button 
              @click="toggleSteps(task?.id)"
              class="text-blue-600 hover:text-blue-700 text-sm"
            >
              {{ expandedTasks.includes(task?.id) ? 'Hide Steps' : 'Show Steps' }}
            </button>
          </div>

          <!-- Steps List -->

          <div v-if="expandedTasks.includes(task?.id)" >
              <StepList :task="task" />
          
            <StepCreator 
              :task-id="task?.id" 
              @step-created="handleNewStep"
            />
          </div>
            </div>
          </template>
          <!-- Empty State -->
          <div v-if="tasks.length === 0" class="text-center py-8 text-gray-500">
            No tasks found. Create your first task!
          </div>
      </div>
    </div>
  </div>
</div>
</template>


<script>
import axios from 'axios';
import StepList from '@/components/StepList.vue'
import TaskCreator from '@/components/TaskCreator.vue'
import StepCreator from '@/components/StepCreator.vue'
export default {
  components: {
    TaskCreator,
    StepCreator,
    StepList
  },
  data() {
    return {
      showSuccess: false,
      successTimeout: null,
      loading: true,
      error: null,
      tasks: [],
      allSteps: [],
      expandedTasks: [],
      showTaskModal: false,
      showStepModal: false,
      newTask: {
        name: '',
        due_date: ''
      },
      newStep: {
        name: '',
        task_id: null
      }
    }
  },
  computed: {
    stats() {
      return {
        totalTasks: this.tasks?.length || 0,
        pendingTasks: this.tasks?.filter(t => t?.status === 'pending').length || 0,
        completedSteps: this.allSteps?.filter(s => s?.status === 'completed').length || 0,
        totalSteps: this.allSteps?.length || 0
      }
    }
  },
  
  mounted() {
    this.fetchData()
  },
  methods: {
    handleNewTask(newTask) {
      // Add to your tasks list or refresh data
      this.tasks.unshift(newTask)

      this.showSuccessPopup()
    },

    showSuccessPopup() {
      // Clear existing timeout
      if (this.successTimeout) clearTimeout(this.successTimeout)
      
      // Show and auto-hide after 3 seconds
      this.showSuccess = true
      this.successTimeout = setTimeout(() => {
        this.showSuccess = false
      }, 3000)
    },

    async fetchData() {
      try {
        const [tasksResponse, stepsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/tasks'),
          axios.get('http://localhost:8000/api/steps')
        ]);

        this.tasks = tasksResponse.data;
        this.allSteps = stepsResponse.data;

        console.log(this.tasks, this.allSteps);
        
        this.tasks = this.tasks.map(task => ({
          ...task,
          steps: this.getStepsForTask(task.id)
        }));
        
      } catch (err) {
        this.error = err.response?.data?.message || err.message
      } finally {
        this.loading = false
      }
    },

    handleNewStep(newStep) {
      const task = this.tasks.find(t => t.id === newStep.task_id)
      if (task) {
        if (!task.steps) task.steps = []
        task.steps.push(newStep)
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },

    statusClass(status) {
      return {
        'pending': 'bg-yellow-100 text-yellow-800',
        'in_progress': 'bg-blue-100 text-blue-800',
        'completed': 'bg-green-100 text-green-800'
      }[status]
    },

    stepStatusClass(status) {
      return {
        'pending': 'bg-gray-300',
        'in_progress': 'bg-blue-500',
        'completed': 'bg-green-500'
      }[status]
    },

    toggleSteps(taskId) {
      const index = this.expandedTasks.indexOf(taskId)
      if (index > -1) {
        this.expandedTasks.splice(index, 1)
      } else {
        this.expandedTasks.push(taskId)
      }
    },

    getStepsForTask(taskId) {
      return this.allSteps.filter(step => step.task_id === taskId)
        .sort((a, b) => a.id - b.id)
      },

    openNewTaskModal() {
      this.showTaskModal = true
    },

    openNewStepModal(taskId) {
      this.newStep.task_id = taskId
      this.showStepModal = true
    }
  }
}
</script>