<template>
  <div class="min-h-screen bg-slate-900 p-8 text-slate-200">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-sky-400">Workflow Dashboard</h1>
      <p class="text-slate-400 mt-2">Manage your tasks and steps</p>
    </div>
    <div class="flex items-center mb-6 space-x-4 overflow-x-auto pb-2">
      <div>
        <nuxt-link to="/history" class="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap">
          Edit History
        </nuxt-link>
      </div>
      <div>
        <nuxt-link to="/all" class="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap">
          Employees
        </nuxt-link>
      </div>
      <div>
        <nuxt-link to="/register" class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
          New Employee
        </nuxt-link>
      </div>
      <div>
        <nuxt-link to="/assign" class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
          Assign a Task
        </nuxt-link>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8 text-slate-400">
      Loading dashboard data...
    </div>

    <div v-if="error" class="text-center py-8 text-red-400">
      Error loading data: {{ error }}
    </div>

    <div v-if="!loading && !error">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-slate-800 p-4 rounded-lg shadow-lg">
          <h3 class="text-slate-400 text-sm">Total Tasks</h3>
          <p class="text-2xl font-bold text-sky-300">{{ stats.totalTasks }}</p>
        </div>
          <div class="bg-slate-800 p-4 rounded-lg shadow-lg">
          <h3 class="text-slate-400 text-sm">Pending Tasks</h3>
          <p class="text-2xl font-bold text-amber-400">{{ stats.pendingTasks }}</p>
        </div>
          <div class="bg-slate-800 p-4 rounded-lg shadow-lg">
          <h3 class="text-slate-400 text-sm">Completed Steps</h3>
          <p class="text-2xl font-bold text-emerald-400">{{ stats.completedSteps }}</p>
        </div>
          <div class="bg-slate-800 p-4 rounded-lg shadow-lg">
          <h3 class="text-slate-400 text-sm">Total Steps</h3>
          <p class="text-2xl font-bold text-sky-300">{{ stats.totalSteps }}</p>
        </div>
      </div>

      <div class="bg-slate-800 rounded-lg shadow-lg p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 class="text-xl font-semibold text-sky-300 mb-3 sm:mb-0">Tasks</h2>
          <div>
            <div 
                v-if="showSuccess"
                class="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 z-50"
              >
                Task created successfully!
              </div>
            <TaskCreator @task-created="handleNewTask" />
            
          </div>
        </div>


        <div class="space-y-4">
          <template v-if="tasks && tasks.length">
            <div 
            v-for="(task, index) in tasks" 
            :key="task?.id || index"
            class="task-item border border-slate-700 rounded-lg p-4 hover:shadow-xl hover:border-sky-500/70 transition-all duration-200 ease-in-out"
          >
          <div class="flex flex-col sm:flex-row justify-between sm:items-center">
            <div class="mb-3 sm:mb-0">
              <h3 class="font-medium text-lg text-sky-400">{{ task?.name }}</h3>
              <p class="text-slate-400 text-sm mt-1 max-w-md">{{ task?.description }}</p>
              <div class="mt-2 flex items-center gap-x-3 gap-y-1 flex-wrap">
                <span class="text-sm text-white">Due: {{ formatDate(task?.due_date) }}</span>
                <span 
                  class="px-2 py-0.5 text-xs rounded-full font-semibold"
                  :class="statusClass(task?.status)"
                >
                  {{ task?.status?.replace('_', ' ') }}
                </span>
              </div>
            </div>
            <div class="flex flex-shrink-0 flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-0">
                <button 
                    @click="openUpdateTaskModal(task)" 
                    class="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-700/50 w-full sm:w-auto text-left sm:text-center"
                >
                    Update
                </button>
                <button 
                    @click="confirmDeleteTask(task.id)" 
                    class="text-xs sm:text-sm font-medium text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-700/50 w-full sm:w-auto text-left sm:text-center"
                >
                    Delete
                </button>
                <button 
                    @click="toggleSteps(task?.id)"
                    class="text-xs sm:text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-700/50 w-full sm:w-auto text-left sm:text-center"
                >
                    {{ expandedTasks.includes(task?.id) ? 'Hide Steps' : 'Show Steps' }}
                </button>
            </div>
          </div>

          <div v-if="expandedTasks.includes(task?.id)" class="mt-3 pt-3 border-t border-slate-700" >
              <StepList :task="task" />
            <StepCreator 
              :task-id="task?.id" 
              @step-created="handleNewStep"
              class="mt-3"
            />
          </div>
            </div>
          </template>
          <div v-if="!loading && tasks.length === 0" class="text-center py-8 text-slate-500">
            No tasks found. Create your first task!
          </div>
      </div>
    </div>
  </div>
</div>
</template>


<script>
import axios from 'axios';
import StepList from '@/components/StepList.vue' // Assuming this component exists
import TaskCreator from '@/components/TaskCreator.vue' // Assuming this component exists
import StepCreator from '@/components/StepCreator.vue' // Assuming this component exists

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
      allSteps: [], // To store all steps fetched initially
      expandedTasks: [], // To track which tasks have their steps expanded
      // newTask and newStep are likely used by TaskCreator/StepCreator or modals not shown here
      // For this example, we'll assume they are handled by those components or would be part of modal logic
    }
  },
  computed: {
    stats() {
      const totalTasks = this.tasks?.length || 0;
      const pendingTasks = this.tasks?.filter(t => t?.status === 'pending').length || 0;
      // Calculate total and completed steps based on the allSteps array for accuracy
      const completedSteps = this.allSteps?.filter(s => s?.status === 'completed').length || 0;
      const totalSteps = this.allSteps?.length || 0;
      return {
        totalTasks,
        pendingTasks,
        completedSteps,
        totalSteps
      };
    }
  },
  
  mounted() {
    this.fetchData();
  },
  methods: {
    handleNewTask(newTask) {
      // Add to tasks list (optimistic update or after API success)
      // Assuming newTask is the complete task object from the API after creation
      this.tasks.unshift(newTask); // Add to the beginning of the list
      this.showSuccessPopup('Task created successfully!');
    },

    showSuccessPopup(message) {
      this.successMessage = message; // You might want a data property for custom messages
      if (this.successTimeout) clearTimeout(this.successTimeout);
      this.showSuccess = true;
      this.successTimeout = setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    },

    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        // Fetch tasks and steps in parallel
        const [tasksResponse, stepsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/tasks'),
          axios.get('http://localhost:8000/api/steps')
        ]);

        this.tasks = tasksResponse.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by creation date, newest first
        this.allSteps = stepsResponse.data;
        
        // Optionally, if tasks need their steps embedded directly (current code does this)
        // This is less efficient if StepList fetches its own data or if steps are numerous
        // For now, matching existing logic:
        this.tasks = this.tasks.map(task => ({
          ...task,
          steps: this.getStepsForTask(task.id) 
        }));
        
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Failed to load data.';
        console.error("Error fetching data:", err);
      } finally {
        this.loading = false;
      }
    },

    handleNewStep(newStep) {
      // Add the new step to the allSteps array
      this.allSteps.push(newStep);
      // Find the parent task and update its steps array
      const taskIndex = this.tasks.findIndex(t => t.id === newStep.task_id);
      if (taskIndex !== -1) {
        // Create a new task object to ensure reactivity if steps array didn't exist
        const updatedTask = { ...this.tasks[taskIndex] };
        if (!updatedTask.steps) {
          updatedTask.steps = [];
        }
        updatedTask.steps.push(newStep);
        updatedTask.steps.sort((a,b) => a.id - b.id); // Keep steps sorted
        
        // Replace the task in the array to trigger reactivity
        this.tasks.splice(taskIndex, 1, updatedTask);
      }
       // this.showSuccessPopup('Step created successfully!'); // Optional success message
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (e) {
        return 'Invalid Date';
      }
    },

    statusClass(status) {
      const baseStyle = 'px-2 py-0.5 text-xs rounded-full font-semibold';
      const statusStyles = {
        'pending': 'bg-amber-500/20 text-amber-300',
        'in_progress': 'bg-sky-500/20 text-sky-300',
        'completed': 'bg-emerald-500/20 text-emerald-300'
      };
      return `${baseStyle} ${statusStyles[status] || 'bg-slate-500/20 text-slate-300'}`;
    },

    // stepStatusClass is not directly used in this template but kept for StepList or other components
    stepStatusClass(status) {
      return {
        'pending': 'bg-slate-600',
        'in_progress': 'bg-sky-600',
        'completed': 'bg-emerald-600'
      }[status];
    },

    toggleSteps(taskId) {
      const index = this.expandedTasks.indexOf(taskId);
      if (index > -1) {
        this.expandedTasks.splice(index, 1);
      } else {
        this.expandedTasks.push(taskId);
      }
    },

    getStepsForTask(taskId) {
      // Filters steps from the allSteps array for a specific task
      return this.allSteps
        .filter(step => step.task_id === taskId)
        .sort((a, b) => a.id - b.id); // Assuming steps have an 'id' or 'order' field for sorting
    },
    
    openUpdateTaskModal(task) {
      console.log('Open update modal for task:', task);
      // Implementation would involve:
      // 1. Setting a data property like `editingTask` to a *copy* of the task.
      //    this.editingTask = { ...task };
      // 2. Showing a modal (e.g., by setting `showUpdateTaskModal = true`).
      // 3. The modal would have a form, pre-filled with `editingTask` data.
      // 4. On submit, the modal would emit an event or call a method to update the task via API.
      //    For now, this is a placeholder.
      alert(`Update functionality for "${task.name}" would open a modal here. (Alerts are for demo only, use custom modals in app)`);
    },

    confirmDeleteTask(taskId) {
      console.log('Confirm delete for task ID:', taskId);
      // In a real application, you MUST use a custom modal for confirmation,
      // as window.confirm() is not allowed and may not work in all environments.
      // For demonstration, we'll proceed with deletion.
      // const taskName = this.tasks.find(t => t.id === taskId)?.name || 'this task';
      // if (confirm(`Are you sure you want to delete "${taskName}"? This action cannot be undone.`)) {
      //   this.deleteTask(taskId);
      // }
      
      // TEMPORARY: Using alert for now as custom modal is not implemented. Replace with custom modal.
      const taskToDelete = this.tasks.find(t => t.id === taskId);
      if (taskToDelete) {
        alert(`Deletion confirmation for "${taskToDelete.name}" would use a custom modal. (Alerts are for demo only) Proceeding with delete for now.`);
        this.deleteTask(taskId);
      }
    },

    async deleteTask(taskId) {
      console.log('Deleting task ID:', taskId);
      // Placeholder for API call
      try {
        // await axios.delete(`http://localhost:8000/api/tasks/${taskId}`);
        // If API call is successful:
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        // Also remove associated steps from allSteps to keep stats accurate
        this.allSteps = this.allSteps.filter(s => s.task_id !== taskId);
        // this.showSuccessPopup('Task deleted successfully!'); // Optional
      } catch (err) {
        console.error('Error deleting task:', err);
        this.error = `Failed to delete task: ${err.response?.data?.message || err.message}`;
      }
    }
  }
}
</script>

<style scoped>
/* Minor style for horizontal scrollbar on nav if needed */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #475569; /* slate-600 */
  border-radius: 20px;
}
</style>
