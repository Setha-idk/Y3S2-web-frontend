<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Assign Tasks</h1>

      <!-- Filters/Search for Users -->
      <div class="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div class="w-full md:w-1/2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select v-model="userFilters.department" class="block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">All Departments</option>
            <option v-for="dept in uniqueDepartments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
        </div>
        <div class="w-full md:w-1/2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search User</label>
          <input v-model="userFilters.search" type="text" placeholder="Search by name or email" class="block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
      </div>

      <!-- Filters/Search/Sort for Tasks -->
      <div class="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div class="w-full md:w-1/3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search Task</label>
          <input v-model="taskFilters.search" type="text" placeholder="Search by title or description" class="block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div class="w-full md:w-1/3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="taskFilters.status" class="block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="w-full md:w-1/3">
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
              <select v-model="form.task_id" class="block w-full rounded-md border-gray-300 shadow-sm">
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
                  {{ user.name }} ({{ user.department }})
                </option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input v-model="form.due_date" type="date" class="block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Assign Task
          </button>
        </form>
      </div>

      <!-- Assignment List -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">All Task Assignments</h2>
        <div class="space-y-4">
          <div v-for="assignment in filteredAssignments" :key="assignment.id" class="border rounded-lg p-4 hover:bg-gray-50">
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
                <p class="text-gray-500">Assigned By</p>
                <p class="font-medium">{{ getUserName(assignment.assigned_by) }}</p>
              </div>
              <div>
                <p class="text-gray-500">Task ID</p>
                <p class="font-medium">{{ assignment.task_id }}</p>
              </div>
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

// Filters
const userFilters = ref({ department: '', search: '' })
const taskFilters = ref({ search: '', status: '', sort: '' })

const uniqueDepartments = computed(() => [...new Set(users.value.map(u => u.department).filter(Boolean))])

const filteredUsers = computed(() => {
  let filtered = users.value
  if (userFilters.value.department) {
    filtered = filtered.filter(u => u.department === userFilters.value.department)
  }
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
  if (taskFilters.value.status) {
    filtered = filtered.filter(a => a.status === taskFilters.value.status)
  }
  if (taskFilters.value.sort === 'dueDate') {
    filtered = filtered.slice().sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
  } else if (taskFilters.value.sort === 'status') {
    const order = { pending: 1, in_progress: 2, completed: 3 }
    filtered = filtered.slice().sort((a, b) => order[a.status] - order[b.status])
  }
  return filtered
})

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
    // Get assigner from auth (replace with actual logic)
    const token = localStorage.getItem('auth_token')
    const meRes = await axios.get('http://localhost:8000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const payload = {
      task_id: form.value.task_id,
      employee_id: form.value.employee_id,
      assigned_by: meRes.data.id,
      due_date: form.value.due_date,
      status: 'pending'
    }
    const res = await axios.post('http://localhost:8000/api/task-assignments', payload)
    assignments.value.push(res.data)
    form.value.task_id = ''
    form.value.employee_id = ''
    form.value.due_date = ''
  } catch (err) {
    alert('Failed to assign task: ' + (err.response?.data?.message || err.message))
  }
}
</script>