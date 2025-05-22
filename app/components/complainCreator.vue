<template>
    <!-- Trigger Button -->
    <button 
      @click="openModal"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      file a complain
    </button>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <button @click="closeModal" class=" text-2xl text-gray-500 hover:text-gray-700">
            &times;
          </button>
        <h1 class="text-3xl font-bold text-gray-900">Employee Complaint Portal</h1>
        <p class="text-gray-600 mt-2">
          Submit complaints either about colleagues or external parties
        </p>
      </div>
      <!-- Complaint Form -->
      <form @submit.prevent="submitComplaint" class="bg-white p-6 rounded-lg shadow-md">
        <div class="space-y-6">
          <!-- Complaint Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Complaint Type
            </label>
            <select 
              v-model="form.complaintType"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select complaint type</option>
              <option value="internal">Internal (Complaint about colleague)</option>
              <option value="external">External (Complaint to other department/party)</option>
            </select>
          </div>

          <!-- Internal Complaint Fields -->
          <div v-if="form.complaintType === 'internal'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Employee Name
              </label>
              <input
                v-model="form.targetEmployee"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter employee name"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select 
                v-model="form.department"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select department</option>
                <option>HR</option>
                <option>IT</option>
                <option>Finance</option>
                <option>Operations</option>
              </select>
            </div>
          </div>

          <!-- External Complaint Fields -->
          <div v-if="form.complaintType === 'external'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Target Department/Party
              </label>
              <input
                v-model="form.targetDepartment"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter department or external party name"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Complaint Category
              </label>
              <select 
                v-model="form.category"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                <option>Vendor Issue</option>
                <option>Client Complaint</option>
                <option>Inter-departmental</option>
                <option>Government Agency</option>
              </select>
            </div>
          </div>

          <!-- Common Fields -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              v-model="form.subject"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Detailed Description
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe the issue in detail..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Complaint
          </button>
        </div>
      </form>

      <!-- Success Message -->
      <div 
        v-if="showSuccess"
        class="mt-4 p-4 bg-green-50 text-green-700 rounded-lg"
      >
        Complaint submitted successfully!
      </div>
    </div>
  </div>
</div>

  </template>
  
  <script>
  import axios from 'axios';
  export default {
    emits: ['task-created'], 
    data() {
      return {
        showModal: false,
        form: {
          name: '',
          description: '',
          due_date: ''
        }
      }
    },
    methods: {
      openModal() {
        this.showModal = true
      },
      closeModal() {
        this.showModal = false
        this.resetForm()
      },
      resetForm() {
        this.form = {
          name: '',
          description: '',
          due_date: ''
        }
      },
      async submitForm() {
        try {
          const response = await axios.post('http://localhost:8000/api/tasks', {
            name: this.form.name,
            due_date: this.form.due_date,
            description: this.form.description
          })
          // Emit event to parent component or update store
          this.$emit('task-created', {
          ...response.data,
          steps: [] // Add empty steps array
        })
          this.resetForm()
        } catch (error) {
          console.error('Error creating task:', error)
          alert('Failed to create task. Please try again.')
        }
      }
    }
  }
  </script>