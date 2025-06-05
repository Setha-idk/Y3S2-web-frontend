<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Complaints</h1>
      <div class="flex border-b mb-6">
        <button :class="tabClass(0)" @click="activeTab = 0">Complaints to Others</button>
        <button :class="tabClass(1)" @click="activeTab = 1">Complaints Against Me</button>
      </div>
      <div v-if="activeTab === 0">
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-2">File a Complaint</h2>
          <form @submit.prevent="submitComplaint" class="space-y-4 bg-white p-4 rounded shadow">
            <div>
              <label class="block text-sm font-medium mb-1">Target User</label>
              <select v-model="form.target_person_id" required class="w-full border rounded px-2 py-1">
                <option value="" disabled>Select user</option>
                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }} ({{ user.email }})</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Type</label>
              <input v-model="form.type" type="text" required class="w-full border rounded px-2 py-1" placeholder="Type (e.g. misconduct)" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Subject</label>
              <input v-model="form.subject" type="text" required class="w-full border rounded px-2 py-1" placeholder="Subject" />
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
          </form>
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-2">Your Complaints</h2>
          <div v-if="complaintsTo.length === 0" class="text-gray-400">No complaints filed.</div>
          <ul v-else class="divide-y">
            <li v-for="c in complaintsTo" :key="c.id" class="py-3">
              <div class="font-medium">To: {{ userNameById(c.target_person_id) }}</div>
              <div class="text-sm text-gray-600">Type: {{ c.type }}</div>
              <div class="text-sm text-gray-600">Subject: {{ c.subject }}</div>
              <div class="text-xs text-gray-400">Filed: {{ formatDate(c.created_at) }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <h2 class="text-xl font-semibold mb-2">Complaints Against You</h2>
        <div v-if="complaintsFrom.length === 0" class="text-gray-400">No complaints against you.</div>
        <ul v-else class="divide-y">
          <li v-for="c in complaintsFrom" :key="c.id" class="py-3">
            <div class="font-medium">Type: {{ c.type }}</div>
            <div class="text-sm text-gray-600">Subject: {{ c.subject }}</div>
            <div class="text-xs text-gray-400">Filed: {{ formatDate(c.created_at) }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
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
      currentUser: null
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
        const res = await axios.get('http://localhost:8000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.currentUser = res.data
      } catch {
        this.currentUser = null
      }
    },
    async fetchUsers() {
      const res = await axios.get('http://localhost:8000/api/users')
      this.users = res.data.filter(u => !this.currentUser || u.id !== this.currentUser.id)
    },
    async fetchComplaints() {
      if (!this.currentUser) return
      const res = await axios.get('http://localhost:8000/api/complaints')
      this.complaintsTo = res.data.filter(c => c.user_id === this.currentUser.id)
      this.complaintsFrom = res.data.filter(c => c.target_person_id === this.currentUser.id)
    },
    async submitComplaint() {
      if (!this.form.target_person_id || !this.form.type || !this.form.subject) return
      try {
        await axios.post('http://localhost:8000/api/complaints', {
          user_id: this.currentUser.id,
          target_person_id: this.form.target_person_id,
          type: this.form.type,
          subject: this.form.subject
        })
        this.form.target_person_id = ''
        this.form.type = ''
        this.form.subject = ''
        await this.fetchComplaints()
        alert('Complaint submitted!')
      } catch (e) {
        alert(e.response?.data?.message || 'Failed to submit complaint')
      }
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
