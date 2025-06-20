<template>
  <!-- Sidebar Navigation -->
  <div class="fixed inset-y-0 left-0 w-64 flex flex-col z-30 bg-gray-800 text-white border-r border-gray-700 shadow-xl">
    <!-- Profile Section -->
    <div class="p-5 flex items-center space-x-4 border-b border-gray-700 bg-gray-900">
      <div class="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600">
        <img v-if="user && user.profile_picture" :src="getProfilePictureUrl(user.profile_picture)" class="h-full w-full object-cover" alt="Profile Picture" />
        <span v-else class="text-2xl text-gray-300">👤</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-medium truncate">{{ user ? user.name : 'Guest' }}</p>
        <p class="text-xs text-gray-400 truncate">{{ user ? user.email : '' }}</p>
        <div class="flex flex-wrap gap-x-2 mt-1">
          <span v-if="departmentName" class="text-xs text-gray-400">Dept: {{ departmentName }}</span>
          <span v-if="roleName" class="text-xs text-gray-400">Role: {{ roleName }}</span>
          <span class="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">Access: {{ user ? user.access_level : '' }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto py-2 bg-gray-800">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.name">
          <NuxtLink 
            :to="item.path" 
            :class="[
              'flex items-center px-4 py-3 mx-2 rounded-lg transition-colors',
              $route.path === item.path
                ? 'bg-gray-700 text-white shadow-inner'
                : 'hover:bg-gray-700 text-gray-300 hover:text-white'
            ]"
          >
            <span class="mr-3 text-lg">{{ item.icon }}</span>
            <span class="text-sm font-medium">{{ item.name }}</span>
          </NuxtLink>
        </li>
        
        <!-- Admin/Manager Section -->
        <div v-if="user && (user.access_level === 'admin')" class="mt-4 pt-4 border-t border-gray-700">
          <p class="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
          <li>
            <NuxtLink to="/admin/all" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">👥</span>
              <span class="text-sm font-medium">All Employees</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/departments" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">🏢</span>
              <span class="text-sm font-medium">Departments</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/alltask" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">✅</span>
              <span class="text-sm font-medium">All Tasks</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/history" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">📜</span>
              <span class="text-sm font-medium">Edit History</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/register" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">➕</span>
              <span class="text-sm font-medium">Add Employee</span>
            </NuxtLink>
          </li>
        </div>
        <div v-if="user && (user.access_level === 'manager')" class="mt-4 pt-4 border-t border-gray-700">
          <p class="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
          <li>
            <NuxtLink to="/admin/all" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">👥</span>
              <span class="text-sm font-medium">All Employees</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/departments" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">🏢</span>
              <span class="text-sm font-medium">Departments</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/register" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">➕</span>
              <span class="text-sm font-medium">Add Employee</span>
            </NuxtLink>
          </li>
        </div>
        <!-- Auth Section -->
        <div class="mt-4 pt-4 border-t border-gray-700">
          <li v-if="user">
            <button @click="showLogoutModal = true" class="flex items-center w-full px-4 py-3 mx-2 rounded-lg transition-colors text-left hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">🚪</span>
              <span class="text-sm font-medium">Log Out</span>
            </button>
          </li>
          <li v-if="!user">
            <NuxtLink to="/login" class="flex items-center px-4 py-3 mx-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-300 hover:text-white">
              <span class="mr-3 text-lg">🔑</span>
              <span class="text-sm font-medium">Login</span>
            </NuxtLink>
          </li>
        </div>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="p-4 text-xs text-gray-400 border-t border-gray-700 bg-gray-900">
      © 2025 Workflow System v1.0
    </div>
  </div>

  <!-- Main Content -->
  <div class="min-h-screen bg-gray-50 text-gray-800 ml-0 lg:ml-64 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Workflow Dashboard</h1>
      <p class="text-gray-500">Welcome back, {{ user ? user.name : 'Guest' }}</p>
    </div>

    <!-- Loading/Error States -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">Error loading dashboard data: {{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-if="!loading && !error">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Employees Card -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Employees</p>
              <p class="text-3xl font-bold text-blue-600 mt-1">{{ employeesCount }}</p>
            </div>
            <div class="p-3 rounded-full bg-blue-50 text-blue-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs text-gray-500">Total Managers level access: {{ managersCount }}</p>
          </div>
        </div>

        <!-- Departments Card -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Departments</p>
              <p class="text-3xl font-bold text-emerald-600 mt-1">{{ departmentsCount }}</p>
            </div>
            <div class="p-3 rounded-full bg-emerald-50 text-emerald-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs text-gray-500">Total Roles: {{ rolesCount }}</p>
          </div>
        </div>

        <!-- Tasks Card -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Tasks</p>
              <p class="text-3xl font-bold text-amber-600 mt-1">{{ tasksCount }}</p>
            </div>
            <div class="p-3 rounded-full bg-amber-50 text-amber-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent History Section -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Recent Activity</h2>
          <NuxtLink to="/admin/history" class="text-sm text-blue-600 hover:text-blue-800 hover:underline">View All</NuxtLink>
        </div>
        
        <div v-if="recentHistory.length" class="divide-y divide-gray-100">
          <div v-for="item in recentHistory" :key="item.id" class="py-3 first:pt-0 last:pb-0">
            <div class="flex items-start">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                {{ item.user_name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">
                  {{ item.user_name }} <span class="font-normal text-gray-500">{{ item.action }}</span>
                </p>
                <p class="text-sm text-gray-500 mt-1">{{ item.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatDate(item.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mt-2 text-sm">No recent activity found</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Logout Confirmation Modal -->
  <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 mx-4 relative">
      <div class="absolute top-4 right-4">
        <button @click="showLogoutModal = false" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="sm:flex sm:items-start">
        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm Logout</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">Are you sure you want to log out of your account?</p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button @click="logout" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
          Log Out
        </button>
        <button @click="showLogoutModal = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StatsCards from '@/components/StatsCards.vue'
import { useAuth } from '../../composables/useAuth.js'
import { useRuntimeConfig } from '#app'

export default {
  components: { StatsCards },
  data() {
    const config = useRuntimeConfig();
    return {
      loading: true,
      error: null,
      showLogoutModal: false,
      user: null,
      employees: [],
      departments: [],
      roles: [],
      tasks: [],
      recentHistory: [],
      history: [],
      menuItems: [
        { name: 'Update Profile', path: '/UpdateProfile', icon: '👤' },
        { name: 'Home', path: '/', icon: '🏠' },
      ],
      apiUrl: config.public.apiUrl
    }
  },
  computed: {
    employeesCount() {
      return this.employees.length
    },
    managersCount() {
      return this.employees.filter(e => (e.access_level || '').toLowerCase() === 'manager').length
    },
    departmentsCount() {
      return this.departments.length
    },
    rolesCount() {
      return this.roles.length
    },
    tasksCount() {
      return this.tasks.length
    },
    departmentName() {
      if (!this.user || !this.user.department_id || !this.departments.length) return ''
      const dept = this.departments.find(d => d.id === this.user.department_id)
      return dept ? dept.name : ''
    },
    roleName() {
      if (!this.user || !this.user.role_id || !this.roles.length) return ''
      const role = this.roles.find(r => r.id === this.user.role_id)
      return role ? role.name : ''
    },
    recentHistory() {
      return this.history.slice(0, 10)
    },
  },
  async created() {
    const { user, loading, error, fetchUser } = useAuth()
    this.loading = loading.value
    this.error = error.value
    await fetchUser()
    this.user = user.value
    await Promise.all([
      this.fetchDepartments(),
      this.fetchRoles(),
      this.fetchTasks(),
      this.fetchEmployees(),
      this.fetchHistory()
    ])
    this.loading = false
  },
  methods: {
    async fetchDepartments() {
      try {
        const res = await axios.get(`${this.apiUrl}/departments`)
        this.departments = res.data
      } catch {}
    },
    async fetchRoles() {
      try {
        const res = await axios.get(`${this.apiUrl}/roles`)
        this.roles = res.data
      } catch {}
    },
    async fetchTasks() {
      try {
        const res = await axios.get(`${this.apiUrl}/tasks`)
        this.tasks = res.data
      } catch {}
    },
    async fetchEmployees() {
      try {
        const res = await axios.get(`${this.apiUrl}/users`)
        this.employees = res.data
      } catch {}
    },
    async fetchHistory() {
      try {
        const res = await axios.get(`${this.apiUrl}/history?_sort=created_at&_order=desc`)
        this.history = Array.isArray(res.data) ? res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : []
      } catch {}
    },
    getProfilePictureUrl(profile_picture) {
      if (!profile_picture) return ''
      return `${this.apiUrl}/storage/${profile_picture}`
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }
      return new Date(dateString).toLocaleString('en-US', options)
    },
    async logout() {
      try {
        await axios.post(`${this.apiUrl}/logout`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      } catch (e) {}
      localStorage.removeItem('token')
      window.location.href = '/login'
    },
  }
}
</script>

<style scoped>
:root {
  color-scheme: light;
}
</style>