<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Assign Tasks</h1>

      <!-- Tabs -->
      <div class="flex gap-4 mb-6">
        <button
          class="px-4 py-2 rounded-t font-semibold"
          :class="activeTab === 'assign' ? 'bg-white text-blue-700 shadow' : 'bg-gray-200 text-gray-700'"
          @click="activeTab = 'assign'"
        >Assign Task</button>
        <button
          class="px-4 py-2 rounded-t font-semibold"
          :class="activeTab === 'assigned' ? 'bg-white text-blue-700 shadow' : 'bg-gray-200 text-gray-700'"
          @click="activeTab = 'assigned'"
        >Tasks I've Assigned</button>
      </div>

      <!-- Assign Task Tab -->
      <div v-if="activeTab === 'assign'">
        <!-- Filters/Search for Users -->
        <div class="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Search User</label>
            <input v-model="userFilters.search" type="text" placeholder="Search by name or email" class="block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
        </div>

        <!-- Filters/Search/Sort for Tasks -->
        <div class="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div class="w-full md:w-1/2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Search Task</label>
            <input v-model="taskFilters.search" type="text" placeholder="Search by title or description" class="block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div class="w-full md:w-1/2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select v-model="taskFilters.sort" class="block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Default</option>
              <option value="dueDate">Due Date</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <!-- Assignment Form -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
          <form class="space-y-6" @submit.prevent="assignTask">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Task Select -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Task</label>
                <select v-model="form.task_id">
                  <option value="">Select Task</option>
                  <option v-for="task in filteredTasks" :key="task.id" :value="task.id">
                    {{ task.name }}
                  </option>
                </select>
              </div>
              <!-- User Select -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select v-model="form.employee_id" class="block w-full rounded-md border-gray-300 shadow-sm">
                  <option value="">Select Employee</option>
                  <option v-for="user in filteredUsers" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input v-model="form.due_date" type="date" class="block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Attach File</label>
              <input type="file" @change="onFileChange" accept=".pdf,.doc,.docx,.xls,.xlsx,.mp4,.avi,.mov,.txt,.csv,.ppt,.pptx,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,video/*,application/pdf" class="block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Assign Task
            </button>
            <p v-if="successMessage" class="text-green-600 text-sm mt-4">{{ successMessage }}</p>
          </form>
        </div>
      </div>

      <!-- Assigned Tasks Tab -->
      <div v-if="activeTab === 'assigned'">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">Tasks I've Assigned</h2>
          <div class="space-y-4">
            <div
              v-for="assignment in assignedByMe"
              :key="assignment.id"
              class="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">{{ getTaskName(assignment.task_id) }}</h3>
                  <p class="text-sm text-gray-500">{{ getTaskDescription(assignment.task_id) }}</p>
                </div>
                <span class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': assignment.status === 'completed',
                    'bg-yellow-100 text-yellow-800': assignment.status === 'in_progress',
                    'bg-red-100 text-red-800': assignment.status === 'pending'
                  }">
                  {{ assignment.status }}
                </span>
              </div>
              <div class="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div>
                  <p class="text-gray-500">Assigned to</p>
                  <p class="font-medium">{{ getUserName(assignment.employee_id) }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Due Date</p>
                  <p class="font-medium">{{ assignment.due_date }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Submitted Date</p>
                  <p class="font-medium">{{ assignment.submitted_date || '-' }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Submitted File</p>
                  <p v-if="assignment.submitted_file_path" class="font-medium">
<a :href="`http://localhost:8000/storage/${assignment.submitted_file_path}`" target="_blank" class="text-blue-600 underline">Download</a>                  </p>
                  <p v-else class="text-gray-400">No file</p>
                </div>
              </div>
            </div>
            <div v-if="assignedByMe.length === 0" class="text-gray-500 text-center py-8">
              No tasks assigned by you yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const tasks = ref([])
const assignments = ref([])
const loading = ref(true)
const error = ref('')
const form = ref({ task_id: '', employee_id: '', due_date: '' })
const activeTab = ref('assign')
const currentUserId = ref(null)
const file = ref(null)
const successMessage = ref('')

// Filters
const userFilters = ref({ search: '' })
const taskFilters = ref({ search: '', sort: '' })

const filteredUsers = computed(() => {
  let filtered = users.value
  if (userFilters.value.search) {
    const s = userFilters.value.search.toLowerCase()
    filtered = filtered.filter(u => u.name.toLowerCase().includes(s) || (u.email && u.email.toLowerCase().includes(s)))
  }
  return filtered
})

const filteredTasks = computed(() => {
  let filtered = tasks.value
  if (taskFilters.value.search) {
    const s = taskFilters.value.search.toLowerCase()
    filtered = filtered.filter(t => t.name.toLowerCase().includes(s) || (t.description && t.description.toLowerCase().includes(s)))
  }
  return filtered
})

const filteredAssignments = computed(() => {
  let filtered = assignments.value
  if (taskFilters.value.sort === 'dueDate') {
    filtered = filtered.slice().sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
  } else if (taskFilters.value.sort === 'status') {
    const order = { pending: 1, in_progress: 2, completed: 3 }
    filtered = filtered.slice().sort((a, b) => order[a.status] - order[b.status])
  }
  return filtered
})

const assignedByMe = computed(() =>
  assignments.value.filter(a => a.assigned_by === currentUserId.value)
)

function getUserName(userId) {
  const user = users.value.find(u => u.id === userId)
  return user ? user.name : 'Unassigned'
}
function getTaskName(taskId) {
  const task = tasks.value.find(t => t.id === taskId)
  return task ? task.name : 'Unknown Task'
}
function getTaskDescription(taskId) {
  const task = tasks.value.find(t => t.id === taskId)
  return task ? task.description : ''
}

onMounted(async () => {
  try {
    // Get current user info
    const token = localStorage.getItem('auth_token')
    const meRes = await axios.get('http://localhost:8000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    currentUserId.value = meRes.data.id

    const [usersRes, tasksRes, assignmentsRes] = await Promise.all([
      axios.get('http://localhost:8000/api/users'),
      axios.get('http://localhost:8000/api/tasks'),
      axios.get('http://localhost:8000/api/task-assignments')
    ])
    users.value = usersRes.data
    tasks.value = tasksRes.data
    assignments.value = assignmentsRes.data
  } catch (err) {
    error.value = err.response?.data?.message || err.message
  } finally {
    loading.value = false
  }
})

async function assignTask() {
  if (!form.value.task_id || !form.value.employee_id || !form.value.due_date) return
  try {
    const token = localStorage.getItem('auth_token')
    const meRes = await axios.get('http://localhost:8000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const formData = new FormData()
    formData.append('task_id', form.value.task_id)
    formData.append('employee_id', form.value.employee_id)
    formData.append('assigned_by', meRes.data.id)
    formData.append('due_date', form.value.due_date)
    formData.append('status', 'pending')
    if (file.value) {
      formData.append('file_path', file.value)
    }
    const res = await axios.post('http://localhost:8000/api/task-assignments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    assignments.value.push(res.data)
    form.value.task_id = ''
    form.value.employee_id = ''
    form.value.due_date = ''
    file.value = null
    successMessage.value = 'Task assigned successfully!'
  } catch (err) {
    alert('Failed to assign task: ' + (err.response?.data?.message || err.message))
  }
}

function onFileChange(e) {
  file.value = e.target.files[0]
}
</script>

<style scoped>
/* CSS only */
</style>