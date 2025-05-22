<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Assign Tasks</h1>

      <!-- Assignment Form -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <form class="space-y-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Task Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter task title"
              >
            </div>

            <!-- Assign To -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Employee</option>
                <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                  {{ employee.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Task Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter task details"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <!-- Due Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>

            <!-- Priority -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Assign Task
          </button>
        </form>
      </div>

      <!-- Task List -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Assigned Tasks</h2>
        
        <div class="space-y-4">
          <!-- Task Card -->
          <div v-for="task in tasks" :key="task.id" class="border rounded-lg p-4 hover:bg-gray-50">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium text-gray-900">{{ task.title }}</h3>
                <p class="text-sm text-gray-500">{{ task.description }}</p>
              </div>
              <span 
                class="px-2 py-1 text-xs rounded-full"
                :class="{
                  'bg-green-100 text-green-800': task.status === 'completed',
                  'bg-yellow-100 text-yellow-800': task.status === 'in-progress',
                  'bg-red-100 text-red-800': task.status === 'pending'
                }"
              >
                {{ task.status }}
              </span>
            </div>
            
            <div class="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div>
                <p class="text-gray-500">Assigned to</p>
                <p class="font-medium">{{ task.assignedTo }}</p>
              </div>
              <div>
                <p class="text-gray-500">Due Date</p>
                <p class="font-medium">{{ task.dueDate }}</p>
              </div>
              <div>
                <p class="text-gray-500">Priority</p>
                <p class="font-medium capitalize">{{ task.priority }}</p>
              </div>
              <div>
                <p class="text-gray-500">Task ID</p>
                <p class="font-medium">{{ task.id }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Dummy data
const employees = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' },
  { id: 4, name: 'Sarah Williams' }
])

const tasks = ref([
  {
    id: 'TASK-001',
    title: 'Website Redesign',
    description: 'Redesign company homepage with new branding',
    assignedTo: 'Jane Smith',
    dueDate: '2024-04-15',
    priority: 'high',
    status: 'in-progress'
  },
  {
    id: 'TASK-002',
    title: 'Marketing Campaign',
    description: 'Develop Q2 marketing strategy',
    assignedTo: 'John Doe',
    dueDate: '2024-04-10',
    priority: 'medium',
    status: 'pending'
  },
  {
    id: 'TASK-003',
    title: 'API Documentation',
    description: 'Update developer documentation for new API endpoints',
    assignedTo: 'Mike Johnson',
    dueDate: '2024-04-05',
    priority: 'low',
    status: 'completed'
  }
])
</script>