<template>
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Edit History</h1>
        <div>
            <nuxt-link to="/" class="px-4 py-2 text-gray-700 hover:text-gray-900">
                back
            </nuxt-link>
        </div>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(edit, index) in edits" :key="edit.id || index" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(edit.action_time) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ edit.user_name }}<br><span class="text-xs text-gray-400">{{ edit.email }}</span></td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ edit.action }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ edit.description || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Dummy Pagination (optional, not implemented) -->
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      edits: [],
      loading: true,
      error: null
    }
  },
  async mounted() {
    try {
      const res = await axios.get('http://localhost:8000/api/history')
      this.edits = res.data
    } catch (err) {
      this.error = err.response?.data?.message || err.message
    } finally {
      this.loading = false
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    }
  }
}
</script>