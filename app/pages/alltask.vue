<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">All Tasks</h1>
      <TaskCreator @task-created="addTask" />
      <div class="bg-white rounded-lg shadow p-6 mt-6">
        <div v-if="loading" class="text-center text-gray-400 py-8">Loading tasks...</div>
        <div v-else-if="error" class="text-center text-red-400 py-8">{{ error }}</div>
        <div v-else>
          <div v-if="tasks.length">
            <div v-for="task in tasks" :key="task.id" class="mb-8 border-b pb-6 last:border-b-0 last:pb-0">
              <div class="flex justify-between items-center mb-2">
                <div>
                  <h2 v-if="!task.editing" class="text-xl font-semibold text-sky-700 mb-1">{{ task.name }}</h2>
                  <input v-else v-model="task.editName" class="text-xl font-semibold text-sky-700 mb-1 border-b" />
                  <p v-if="!task.editing" class="text-gray-600 mb-2">{{ task.description }}</p>
                  <textarea v-else v-model="task.editDescription" class="text-gray-600 mb-2 border rounded w-full"></textarea>
                </div>
                <div class="flex gap-2">
                  <button v-if="!task.editing" @click="startEditTask(task)" class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  <button v-if="task.editing" @click="saveEditTask(task)" class="text-green-600 hover:text-green-800 text-sm">Save</button>
                  <button v-if="task.editing" @click="cancelEditTask(task)" class="text-gray-500 hover:text-gray-700 text-sm">Cancel</button>
                  <button @click="deleteTask(task.id)" class="text-red-600 hover:text-red-800 text-sm">Delete</button>
                </div>
              </div>
              <StepCreator :taskId="task.id" @step-created="step => addStep(task, step)" />
              <div v-if="task.steps && task.steps.length">
                <h3 class="text-md font-medium text-gray-800 mb-1 mt-4">Steps:</h3>
                <StepList2 :task="task" 
                  @step-updated="onStepUpdated"
                  @step-deleted="onStepDeleted"
                />
              </div>
              <div v-else class="text-sm text-gray-400">No steps for this task.</div>
            </div>
          </div>
          <div v-else class="text-center text-gray-400 py-8">No tasks found.</div>
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

export default {
  components: { TaskCreator, StepCreator, StepList2 },
  data() {
    return {
      tasks: [],
      loading: true,
      error: null
    }
  },
  async mounted() {
    await this.fetchTasks()
  },
  methods: {
    async fetchTasks() {
      try {
        const [tasksRes, stepsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/tasks'),
          axios.get('http://localhost:8000/api/steps')
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
    async recordHistory({action, name, description, userName, email, employeeId}) {
      try {
        await axios.post('http://localhost:8000/api/history', {
          action,
          name,
          description,
          user_name: userName,
          email,
          employee_id: employeeId
        })
      } catch (e) {
        // Optionally handle error
      }
    },
    async getCurrentUser() {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('http://localhost:8000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
      } catch {
        return null;
      }
    },
    addTask(newTask) {
      this.tasks.push({ ...newTask, steps: [], editing: false, editName: newTask.name, editDescription: newTask.description })
      this.getCurrentUser().then(user => {
        if (user) {
          this.recordHistory({
            action: 'created',
            name: newTask.name,
            description: `Task created: ${newTask.name} - description: ${newTask.description}`,
            userName: user.name,
            email: user.email,
            employeeId: user.id
          })
        }
      })
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
        const response = await axios.put(`http://localhost:8000/api/tasks/${task.id}`, {
          name: task.editName,
          description: task.editDescription
        })
        const oldName = task.name
        const oldDesc = task.description
        task.name = response.data.name
        task.description = response.data.description
        task.editing = false
        const user = await this.getCurrentUser()
        if (user) {
          this.recordHistory({
            action: 'updated',
            name: response.data.name,
            description: `Task updated from name: ${oldName}, desc: ${oldDesc} to name: ${response.data.name}, desc: ${response.data.description}`,
            userName: user.name,
            email: user.email,
            employeeId: user.id
          })
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update task')
      }
    },
    async deleteTask(taskId) {
      if (!confirm('Are you sure you want to delete this task?')) return
      const task = this.tasks.find(t => t.id === taskId)
      try {
        await axios.delete(`http://localhost:8000/api/tasks/${taskId}`)
        this.tasks = this.tasks.filter(t => t.id !== taskId)
        const user = await this.getCurrentUser()
        if (user && task) {
          this.recordHistory({
            action: 'deleted',
            name: task.name,
            description: `Task deleted: ${task.name} - description: ${task.description}`,
            userName: user.name,
            email: user.email,
            employeeId: user.id
          })
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task')
      }
    },
    addStep(task, step) {
      task.steps.push(step)
      this.getCurrentUser().then(user => {
        if (user) {
          this.recordHistory({
            action: 'created',
            name: step.name,
            description: `Step created for task '${task.name}': ${step.description}`,
            userName: user.name,
            email: user.email,
            employeeId: user.id
          })
        }
      })
    },
    onStepUpdated({ oldStep, newStep, task }) {
      this.getCurrentUser().then(user => {
        if (user) {
          this.recordHistory({
            action: 'updated',
            name: newStep.name,
            description: `Step updated for task '${task.name}': from name: ${oldStep.name}, desc: ${oldStep.description}, status: ${oldStep.status} to name: ${newStep.name}, desc: ${newStep.description}, status: ${newStep.status}`,
            userName: user.name,
            email: user.email,
            employeeId: user.id
          })
        }
      })
    },
    onStepDeleted({ step, task }) {
      this.getCurrentUser().then(user => {
        if (user) {
          this.recordHistory({
            action: 'deleted',
            name: step.name,
            description: `Step deleted from task '${task.name}': ${step.description}`,
            userName: user.name,
            email: user.email,
            employeeId: user.id
          })
        }
      })
    }
  }
}
</script>
