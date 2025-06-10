<script setup>
import axios from 'axios'
const emit = defineEmits(['close', 'submitted'])
const props = defineProps({
  show: Boolean,
  users: Array,
  form: Object,
  currentUser: Object
})

const localForm = reactive({
  target_person_id: '',
  type: '',
  subject: ''
})

watch(() => props.show, (val) => {
  if (val) {
    localForm.target_person_id = ''
    localForm.type = ''
    localForm.subject = ''
  }
})

const submit = async () => {
  if (!localForm.target_person_id || !localForm.type || !localForm.subject) return
  try {
    await axios.post('http://localhost:8000/api/complaints', {
      user_id: props.currentUser.id,
      target_person_id: localForm.target_person_id,
      type: localForm.type,
      subject: localForm.subject
    })
    emit('submitted')
    emit('close')
  } catch (e) {
    alert(e.response?.data?.message || 'Failed to submit complaint')
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
        </svg>
        File a New Complaint
      </h2>
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Target User</label>
          <select 
            v-model="localForm.target_person_id" 
            required 
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="" disabled>Select user to file complaint against</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }} ({{ user.email }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input 
            v-model="localForm.type" 
            type="text" 
            required 
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="e.g. Professional Misconduct, Harassment"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input 
            v-model="localForm.subject" 
            type="text" 
            required 
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Brief description of your complaint"
          />
        </div>
        <div class="pt-2">
          <button type="submit" class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition">
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
