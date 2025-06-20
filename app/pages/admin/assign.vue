<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- Success Notification -->
    <div v-if="assignSuccess" class="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
      <span class="text-sm">Task assigned successfully!</span>
    </div>

    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Assign Tasks</h1>
        <p class="text-gray-500 text-sm mt-1">Manage and track task assignments</p>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          class="px-4 py-2 text-sm font-medium relative -mb-px"
          :class="activeTab === 'assign' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'assign'"
        >
          Assign Task
        </button>
        <button
          class="px-4 py-2 text-sm font-medium relative -mb-px"
          :class="activeTab === 'assigned' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'assigned'"
        >
          My Assignments
        </button>
      </div>

      <!-- Assign Task Tab -->
      <div v-if="activeTab === 'assign'">
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-5">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">New Task Assignment</h2>
            
            <form @submit.prevent="assignTask" class="space-y-5">
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <!-- Task Selection -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700">Select Task</label>
                  <div class="relative" id="task-dropdown-container" ref="taskDropdownRef">
                    <input
                      :value="selectedTaskName"
                      @focus="taskDropdownOpen = true; userDropdownOpen = false"
                      @input="taskFilters.search = $event.target.value; taskDropdownOpen = true"
                      type="text"
                      placeholder="Search tasks..."
                      class="w-full rounded-md border-gray-300 border shadow-sm h-10 px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div 
                      v-if="taskDropdownOpen" 
                      class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div
                        v-for="task in (taskFilters.search ? filteredTasks : tasks)"
                        :key="task.id"
                        @click="selectTask(task)"
                        class="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div class="font-medium text-gray-800">{{ task.name }}</div>
                        <div class="text-xs text-gray-500 truncate">{{ task.description }}</div>
                      </div>
                      <div v-if="(taskFilters.search ? filteredTasks : tasks).length === 0" class="px-3 py-2 text-gray-400 text-xs">
                        No matching tasks found
                      </div>
                    </div>
                  </div>
                  <p v-if="errors.task_id" class="text-xs text-red-500 mt-1">{{ errors.task_id }}</p>
                </div>

                <!-- Assignee Selection -->
                <div class="space-y-1">
                  <div class="flex justify-between items-center">
                    <label class="block text-sm font-medium text-gray-700">Assign To</label>
                    <span class="text-xs text-gray-500">Dept: {{ currentUserDepartmentName }}</span>
                  </div>
                  <div class="relative" id="user-dropdown-container" ref="userDropdownRef">
                    <input
                      :value="selectedUserName"
                      @focus="userDropdownOpen = true; taskDropdownOpen = false"
                      @input="userFilters.search = $event.target.value; userDropdownOpen = true"
                      type="text"
                      placeholder="Search team members..."
                      class="w-full rounded-md border-gray-300 border shadow-sm h-10 px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div 
                      v-if="userDropdownOpen" 
                      class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div
                        v-for="user in filteredUsers"
                        :key="user.id"
                        @click="selectUser(user)"
                        class="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div class="font-medium text-gray-800">{{ user.name }}</div>
                        <div class="text-xs text-gray-500">
                          {{ getRoleName(user.role_id) }} • {{ getDepartmentName(user.department_id) }}
                        </div>
                      </div>
                      <div v-if="filteredUsers.length === 0" class="px-3 py-2 text-gray-400 text-xs">
                        No matching team members found
                      </div>
                    </div>
                  </div>
                  <p v-if="errors.employee_id" class="text-xs text-red-500 mt-1">{{ errors.employee_id }}</p>
                </div>
              </div>

              <!-- Due Date -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Due Date</label>
                <input 
                  v-model="form.due_date" 
                  type="date" 
                  class="w-full rounded-md border-gray-300 border shadow-sm h-10 px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <p v-if="errors.due_date" class="text-xs text-red-500 mt-1">{{ errors.due_date }}</p>
              </div>

              <!-- File Attachment -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Attachments (Optional)</label>
                <div v-if="file" class="flex items-center justify-between bg-gray-50 rounded-md p-2">
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-sm text-blue-600 hover:underline cursor-pointer" @click="openFilePreview">
                      {{ file.name }}
                    </span>
                  </div>
                  <button 
                    @click="file = null" 
                    class="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <div class="mt-1">
                  <label class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <input type="file" @change="onFileChange" class="sr-only">
                    <svg class="-ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Choose File
                  </label>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="errors.general" class="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p class="ml-2 text-sm text-red-700">{{ errors.general }}</p>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="pt-2">
                <button 
                  type="submit" 
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- My Assignments Tab -->
      <div v-if="activeTab === 'assigned'">
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-5">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-800">My Assignments</h2>
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {{ assignedByMe.length }} total
              </span>
            </div>

            <!-- Empty State -->
            <div v-if="assignedByMe.length === 0" class="text-center py-8 border border-gray-200 rounded-lg">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-700">No assignments yet</h3>
              <p class="mt-1 text-xs text-gray-500 mb-4">Get started by assigning your first task</p>
              <button 
                @click="activeTab = 'assign'" 
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Assign Task
              </button>
            </div>

            <!-- Assignment List -->
            <div v-else class="space-y-3">
              <div 
                v-for="assignment in assignedByMe" 
                :key="assignment.id"
                class="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-all"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ getTaskName(assignment.task_id) }}</h3>
                    <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ getTaskDescription(assignment.task_id) }}</p>
                  </div>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': assignment.status === 'completed',
                      'bg-yellow-100 text-yellow-800': assignment.status === 'in_progress',
                      'bg-red-100 text-red-800': assignment.status === 'pending'
                    }"
                  >
                    {{ assignment.status.replace('_', ' ') }}
                  </span>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-6">
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Assigned To</p>
                    <p class="font-medium text-gray-900">{{ getUserName(assignment.employee_id) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Due Date</p>
                    <p class="font-medium text-gray-900">{{ assignment.due_date }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Submitted</p>
                    <p class="font-medium text-gray-900">{{ assignment.submitted_date || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Your attachment</p>
                    <p v-if="assignment.file_path" class="font-medium">
                      <a 
                        :href="`http://localhost:8000/storage/${assignment.file_path}`" 
                        target="_blank" 
                        class="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                      >
                        View
                      </a>
                    </p>
                    <p v-else class="text-gray-400 text-sm">None</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Attachment</p>
                    <p v-if="assignment.submitted_file_path" class="font-medium">
                      <a 
                        :href="`http://localhost:8000/storage/${assignment.submitted_file_path}`" 
                        target="_blank" 
                        class="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                      >
                        View
                      </a>
                    </p>
                    <p v-else class="text-gray-400 text-sm">None</p>
                  </div>
                  <div class="flex items-end justify-end">
                    <button
                      v-if="deletingAssignmentId === assignment.id"
                      @click="deleteAssignment(assignment)"
                      class="text-white bg-red-600 hover:bg-red-700 text-sm flex items-center px-3 py-1 rounded shadow"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Confirm Remove
                    </button>
                    <button
                      v-else
                      @click="confirmDeleteAssignment(assignment)"
                      class="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

const users = ref([])
const tasks = ref([])
const assignments = ref([])
const departments = ref([])
const roles = ref([])
const loading = ref(true)
const error = ref('')
const form = ref({ task_id: '', employee_id: '', due_date: '' })
const activeTab = ref('assign')
const currentUserId = ref(null)
const currentUserDepartmentId = ref(null)
const taskDropdownOpen = ref(false)
const userDropdownOpen = ref(false)
const currentUserDepartmentName = computed(() => {
  if (!departments.value.length || !currentUserDepartmentId.value) return ''
  const dept = departments.value.find(d => d.id === currentUserDepartmentId.value)
  return dept ? dept.name : ''
})

const taskDropdownRef = ref(null)
const userDropdownRef = ref(null)

function handleDropdownsClickOutside(event) {
  nextTick(() => {
    const taskDropdown = taskDropdownRef.value
    const userDropdown = userDropdownRef.value
    if (taskDropdown && !taskDropdown.contains(event.target)) {
      taskDropdownOpen.value = false
    }
    if (userDropdown && !userDropdown.contains(event.target)) {
      userDropdownOpen.value = false
    }
  })
}
onMounted(() => {
  document.addEventListener('pointerdown', handleDropdownsClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('pointerdown', handleDropdownsClickOutside)
})

function selectTask(task) {
  form.value.task_id = task.id
  taskFilters.search = task.name
  taskDropdownOpen.value = false
}
function selectUser(user) {
  form.value.employee_id = user.id
  userFilters.search = user.name
  userDropdownOpen.value = false
}

// Filters
const userFilters = ref({ search: '' })
const taskFilters = ref({ search: '', sort: '' })

const filteredUsers = computed(() => {
  let filtered = users.value
  if (currentUserDepartmentId.value) {
    filtered = filtered.filter(u => u.department_id === currentUserDepartmentId.value)
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
const getDepartmentName = (id) => {
  const dept = departments.value.find(d => d.id === id)
  return dept ? dept.name : ''
}
const getRoleName = (id) => {
  const role = roles.value.find(r => r.id === id)
  return role ? role.name : ''
}

// Task input value computed
const selectedTaskName = computed(() => {
  if (form.value.task_id) {
    const t = tasks.value.find(t => t.id === form.value.task_id)
    return t ? t.name : taskFilters.search
  }
  return taskFilters.search
})
// User input value computed
const selectedUserName = computed(() => {
  if (form.value.employee_id) {
    const u = users.value.find(u => u.id === form.value.employee_id)
    return u ? u.name : userFilters.search
  }
  return userFilters.search
})

onMounted(async () => {
  try {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl
    // Get current user info
    const token = localStorage.getItem('auth_token')
    const meRes = await axios.get(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    currentUserId.value = meRes.data.id
    currentUserDepartmentId.value = meRes.data.department_id
    // Fetch departments and roles
    const [deptRes, rolesRes] = await Promise.all([
      axios.get(`${apiUrl}/departments`),
      axios.get(`${apiUrl}/roles`)
    ])
    departments.value = deptRes.data
    roles.value = rolesRes.data

    const [usersRes, tasksRes, assignmentsRes] = await Promise.all([
      axios.get(`${apiUrl}/users`),
      axios.get(`${apiUrl}/tasks`),
      axios.get(`${apiUrl}/task-assignments`)
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

const errors = ref({})
const assignSuccess = ref(false)
const file = ref(null)
const fileUrl = ref('')

function onFileChange(e) {
  const f = e.target.files[0]
  file.value = f
  if (f) {
    fileUrl.value = URL.createObjectURL(f)
  } else {
    fileUrl.value = ''
  }
}
function openFilePreview() {
  if (fileUrl.value) {
    window.open(fileUrl.value, '_blank')
  }
}

async function assignTask() {
  errors.value = {}
  assignSuccess.value = false
  // Validate fields
  if (!form.value.task_id) errors.value.task_id = 'Please select a task.'
  if (!form.value.employee_id) errors.value.employee_id = 'Please select an employee.'
  if (!form.value.due_date) errors.value.due_date = 'Please select a due date.'
  if (Object.keys(errors.value).length > 0) return
  try {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl
    const token = localStorage.getItem('auth_token')
    const meRes = await axios.get(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const payload = new FormData()
    payload.append('task_id', form.value.task_id)
    payload.append('employee_id', form.value.employee_id)
    payload.append('assigned_by', meRes.data.id)
    payload.append('due_date', form.value.due_date)
    payload.append('status', 'in_progress')
    if (file.value) payload.append('submitted_file', file.value)
    const res = await axios.post(`${apiUrl}/task-assignments`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    assignments.value.push(res.data)
    // Reset form fields and dropdowns
    form.value.task_id = ''
    form.value.employee_id = ''
    form.value.due_date = ''
    file.value = null
    fileUrl.value = ''
    taskFilters.search = ''
    userFilters.search = ''
    taskDropdownOpen.value = false
    userDropdownOpen.value = false
    assignSuccess.value = true
    setTimeout(() => assignSuccess.value = false, 2500)
  } catch (err) {
    errors.value.general = 'Failed to assign task: ' + (err.response?.data?.message || err.message)
  }
}

const deletingAssignmentId = ref(null)

function confirmDeleteAssignment(assignment) {
  deletingAssignmentId.value = assignment.id
  setTimeout(() => {
    if (deletingAssignmentId.value === assignment.id) {
      deletingAssignmentId.value = null
    }
  }, 5000)
}

async function deleteAssignment(assignment) {
  try {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl
    await axios.delete(`${apiUrl}/task-assignments/${assignment.id}`)
    const idx = assignments.value.findIndex(a => a.id === assignment.id)
    if (idx > -1) assignments.value.splice(idx, 1)
  } catch (err) {
    alert('Failed to delete assignment: ' + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease;
}
</style>