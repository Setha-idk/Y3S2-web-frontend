<template>
  <div class="min-h-screen bg-slate-900 p-8 text-slate-200"> <div class="mb-8">
      <h1 class="text-3xl font-bold text-sky-400">Workflow Dashboard</h1> <p class="text-slate-400 mt-2">Manage your tasks and steps</p>
    </div>
    <div class="flex items-center mb-4">
    <div class="pl-4">
      <nuxt-link to="/complain" class="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"> Complain
      </nuxt-link>
    </div>
    <div class="pl-4">
      <nuxt-link to="/admin" class="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"> dashboard
      </nuxt-link>
    </div>
    </div>

    <div v-if="loading" class="text-center py-8 text-slate-400"> Loading dashboard data...
    </div>

    <div v-if="error" class="text-center py-8 text-red-400"> Error loading data: {{ error }}
    </div>

    <div v-if="!loading && !error">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-slate-800 p-4 rounded-lg shadow-lg"> <h3 class="text-slate-400 text-sm">Total Tasks</h3>
          <p class="text-2xl font-bold text-sky-300">{{ stats.totalTasks }}</p> </div>
          <div class="bg-slate-800 p-4 rounded-lg shadow-lg">
          <h3 class="text-slate-400 text-sm">Pending Tasks</h3>
          <p class="text-2xl font-bold text-amber-400">{{ stats.pendingTasks }}</p> </div>
          <div class="bg-slate-800 p-4 rounded-lg shadow-lg">
          <h3 class="text-slate-400 text-sm">Completed Steps</h3>
          <p class="text-2xl font-bold text-emerald-400">{{ stats.completedSteps }}</p> </div>
          <div class="bg-slate-800 p-4 rounded-lg shadow-lg">
          <h3 class="text-slate-400 text-sm">Total Steps</h3>
          <p class="text-2xl font-bold text-sky-300">{{ stats.totalSteps }}</p> </div>
      </div>

      <div class="bg-slate-800 rounded-lg shadow-lg p-6"> <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-sky-300">Tasks</h2>
        </div>
        <div class="space-y-4">
          <template v-if="tasks && tasks.length">
            <div 
            v-for="(task, index) in tasks" 
            :key="task?.id || index"
            class="task-item border border-slate-700 rounded-lg p-4 hover:shadow-xl hover:border-sky-500 transition-shadow" >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-lg text-sky-400">{{ task?.name }}</h3> <p class="text-slate-400 text-sm mt-1">{{ task?.description }}</p>
              <div class="mt-2 flex items-center gap-2">
                <span class="text-sm text-white">Due: {{ formatDate(task?.due_date) }}</span>
                <span 
                  class="px-2 py-1 text-xs rounded-full font-semibold"
                  :class="statusClass(task?.status)"
                >
                  {{ task?.status }}
                </span>
              </div>
            </div>
            <button 
              @click="toggleSteps(task?.id)"
              class="text-sky-500 hover:text-sky-400 text-sm transition-colors" >
              {{ expandedTasks.includes(task?.id) ? 'Hide Steps' : 'Show Steps' }}
            </button>
          </div>

          <div v-if="expandedTasks.includes(task?.id)" >
              <StepList :task="task" />
          </div>
          <p>upload</p><p>Summit</p>
            </div>
          </template>
          <div v-if="tasks.length === 0" class="text-center py-8 text-slate-500">
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
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString()
    },

    statusClass(status) {
      // Adjusted status colors for dark theme
      return {
        'pending': 'bg-amber-500/20 text-amber-300',
        'in_progress': 'bg-sky-500/20 text-sky-300',
        'completed': 'bg-emerald-500/20 text-emerald-300'
      }[status]
    },

    stepStatusClass(status) {
      // Adjusted step status colors for dark theme
      return {
        'pending': 'bg-slate-600',
        'in_progress': 'bg-sky-600',
        'completed': 'bg-emerald-600'
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

<style scoped>
/* You can add component-specific styles here if needed,
   but Tailwind CSS classes are preferred for consistency. */
</style>
