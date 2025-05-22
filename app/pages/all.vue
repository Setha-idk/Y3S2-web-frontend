<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Company Employees</h1>
      
      <!-- Tabs Navigation -->
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'employees'"
            :class="[
              'pb-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'employees'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Employees ({{ employees.length }})
          </button>
          <button
            @click="activeTab = 'managers'"
            :class="[
              'pb-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'managers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Managers ({{ managers.length }})
          </button>
        </nav>
      </div>

      <!-- Employees Table -->
      <div v-if="activeTab === 'employees'" class="mt-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="employee in employees" :key="employee.id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{{ employee.name }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ employee.email }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ employee.department }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ employee.role }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Managers Table -->
      <div v-if="activeTab === 'managers'" class="mt-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Team Size</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="manager in managers" :key="manager.id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{{ manager.name }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ manager.email }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ manager.department }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ manager.teamSize }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('employees')

const employees = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Marketing',
    role: 'Marketing Specialist'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    department: 'Engineering',
    role: 'Software Engineer'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    department: 'Sales',
    role: 'Sales Representative'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.williams@company.com',
    department: 'HR',
    role: 'HR Coordinator'
  }
])

const managers = ref([
  {
    id: 1,
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    department: 'Engineering',
    teamSize: 12
  },
  {
    id: 2,
    name: 'David Brown',
    email: 'david.brown@company.com',
    department: 'Marketing',
    teamSize: 8
  },
  {
    id: 3,
    name: 'Linda Wilson',
    email: 'linda.wilson@company.com',
    department: 'Sales',
    teamSize: 15
  },
  {
    id: 4,
    name: 'Michael Taylor',
    email: 'michael.taylor@company.com',
    department: 'HR',
    teamSize: 6
  }
])
</script>