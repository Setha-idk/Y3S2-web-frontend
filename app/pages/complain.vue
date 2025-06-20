<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8 flex items-center justify-between">
        <BackButton :to="'/'" />
        <h1 class="text-3xl font-bold text-gray-800 mb-2 mx-auto absolute left-1/2 transform -translate-x-1/2">Complaint</h1>
        <div style="width:42px"></div> <!-- Spacer to balance BackButton width -->
      </div>
      <p class="text-gray-600">View and manage complaints you've filed or received</p>

      <!-- Tab Navigation -->
      <div class="mb-8">
        <div class="flex border-b border-gray-200">
          <button
            :class="tabClass(0)"
            @click="activeTab = 0"
            class="focus:outline-none"
          >
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
              </svg>
              Complaints to Others
            </span>
          </button>
          <button
            :class="tabClass(1)"
            @click="activeTab = 1"
            class="focus:outline-none"
          >
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Complaints Against Me
            </span>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <!-- Complaints to Others Tab -->
        <div v-if="activeTab === 0" class="p-6">
          <!-- File Complaint Section -->
          <div class="mb-8">
            <button
              @click="showFileComplaintModal = true"
              class="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
              + File a New Complaint
            </button>
            <FileComplaintModal
              :show="showFileComplaintModal"
              :users="users"
              :currentUser="currentUser"
              @close="showFileComplaintModal = false"
              @submitted="onComplaintSubmitted"
            />
          </div>

          <!-- Your Complaints Section -->
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
              </svg>
              Your Filed Complaints
            </h2>
            <div v-if="complaintsTo.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="mt-2 text-gray-500">You haven't filed any complaints yet</p>
            </div>
            <ul v-else class="space-y-4">
              <li 
                v-for="c in complaintsTo" 
                :key="c.id" 
                class="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                      </svg>
                      Against: {{ userNameById(c.target_person_id) }}
                    </div>
                    <div class="mt-2">
                      <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                        {{ c.type }}
                      </span>
                    </div>
                    <div class="mt-2 text-sm text-gray-600">
                      {{ c.subject }}
                    </div>
                  </div>
                  <div class="text-xs text-gray-400 whitespace-nowrap">
                    {{ formatDate(c.created_at) }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Complaints Against Me Tab -->
        <div v-else class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Complaints Against You
          </h2>
          <div v-if="complaintsFrom.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="mt-2 text-gray-500">No complaints have been filed against you</p>
          </div>
          <ul v-else class="space-y-4">
            <li 
              v-for="c in complaintsFrom" 
              :key="c.id" 
              class="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-red-200 transition"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-medium text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
                    </svg>
                    Complaint from: {{ userNameById(c.user_id) }}
                  </div>
                  <div class="mt-2">
                    <span class="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                      {{ c.type }}
                    </span>
                  </div>
                  <div class="mt-2 text-sm text-gray-600">
                    {{ c.subject }}
                  </div>
                </div>
                <div class="text-xs text-gray-400 whitespace-nowrap">
                  {{ formatDate(c.created_at) }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import FileComplaintModal from '../components/FileComplaintModal.vue'
import BackButton from '../components/BackButton.vue'
import { useRuntimeConfig } from '#imports'
export default {
  components: { FileComplaintModal, BackButton },
  data() {
    return {
      activeTab: 0,
      users: [],
      complaintsTo: [],
      complaintsFrom: [],
      form: {
        target_person_id: '',
        type: '',
        subject: ''
      },
      currentUser: null,
      showFileComplaintModal: false
    }
  },
  async mounted() {
    await this.fetchCurrentUser()
    await Promise.all([
      this.fetchUsers(),
      this.fetchComplaints()
    ])
  },
  methods: {
    tabClass(idx) {
      return `px-4 py-2 -mb-px border-b-2 ${this.activeTab === idx ? 'border-blue-600 text-blue-700 font-semibold' : 'border-transparent text-gray-500'}`
    },
    async fetchCurrentUser() {
      try {
        const token = localStorage.getItem('auth_token');
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiUrl
        const res = await axios.get(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.currentUser = res.data
      } catch {
        this.currentUser = null
      }
    },
    async fetchUsers() {
      const config = useRuntimeConfig()
      const apiUrl = config.public.apiUrl
      const res = await axios.get(`${apiUrl}/users`)
      this.users = res.data.filter(u => !this.currentUser || u.id !== this.currentUser.id)
    },
    async fetchComplaints() {
      if (!this.currentUser) return
      const config = useRuntimeConfig()
      const apiUrl = config.public.apiUrl
      const res = await axios.get(`${apiUrl}/complaints`)
      this.complaintsTo = res.data.filter(c => c.user_id === this.currentUser.id)
      this.complaintsFrom = res.data.filter(c => c.target_person_id === this.currentUser.id)
    },
    async submitComplaint() {
      if (!this.form.target_person_id || !this.form.type || !this.form.subject) return
      try {
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiUrl
        await axios.post(`${apiUrl}/complaints`, {
          user_id: this.currentUser.id,
          target_person_id: this.form.target_person_id,
          type: this.form.type,
          subject: this.form.subject
        })
        this.form.target_person_id = ''
        this.form.type = ''
        this.form.subject = ''
        await this.fetchComplaints()
        // alert('Complaint submitted!')
      } catch (e) {
        alert(e.response?.data?.message || 'Failed to submit complaint')
      }
    },
    async onComplaintSubmitted() {
      await this.fetchComplaints()
      this.showFileComplaintModal = false
    },
    userNameById(id) {
      const u = this.users.find(u => u.id === id)
      return u ? u.name : 'Unknown'
    },
    formatDate(date) {
      return new Date(date).toLocaleString()
    }
  }
}
</script>

<style scoped>
button[aria-selected="true"] {
  border-bottom: 2px solid #2563eb;
  color: #2563eb;
}
</style>
