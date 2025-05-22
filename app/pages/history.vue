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
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Changes</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(edit, index) in edits" :key="index" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(edit.date) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ edit.user }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ edit.action }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div v-for="(change, cIndex) in edit.changes" :key="cIndex" class="mb-2 last:mb-0">
                        <span class="font-medium text-gray-700">{{ change.field }}:</span>
                        <span class="ml-2 line-through text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{{ change.old || 'None' }}</span>
                        <span class="mx-2 text-gray-400">→</span>
                        <span class="text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{{ change.new }}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            <!-- Dummy Pagination -->
            <div class="mt-6 flex justify-center">
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        edits: [
          {
            date: '2024-02-15T09:30:00',
            user: 'John Doe',
            action: 'Updated profile',
            changes: [
              { field: 'Email', old: 'john@old.com', new: 'john@new.com' },
              { field: 'Phone', old: '123-4567', new: '987-6543' }
            ]
          },
          {
            date: '2024-02-14T14:15:00',
            user: 'Jane Smith',
            action: 'Modified settings',
            changes: [
              { field: 'Timezone', old: 'UTC', new: 'EST' }
            ]
          },
          {
            date: '2024-02-13T16:45:00',
            user: 'Admin',
            action: 'Created post',
            changes: [
              { field: 'Title', old: '', new: 'Welcome Post' }
            ]
          }
        ]
      }
    },
    methods: {
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        return new Date(dateString).toLocaleDateString('en-US', options)
      }
    }
  }
  </script>