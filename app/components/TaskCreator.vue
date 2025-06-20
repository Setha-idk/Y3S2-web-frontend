<template>
    <!-- Trigger Button -->
    <button 
      @click="openModal"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
    New Task
    </button>
  
    <!-- Modal Backdrop -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <!-- Modal Content -->
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Create New Task</h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
  
        <!-- Form -->
        <form @submit.prevent="submitForm">
          <div class="space-y-4">
            <!-- Task Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
  
            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="form.description"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>
  
            <!-- Form Actions -->
            <div class="flex justify-end gap-2 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRuntimeConfig } from '#app';
  export default {
    emits: ['task-created'], 
    data() {
      return {
        showModal: false,
        form: {
          name: '',
          description: '',
          due_date: ''
        },
        apiUrl: null
      }
    },
    mounted() {
      const config = useRuntimeConfig();
      this.apiUrl = config.public.apiUrl;
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
          const token = localStorage.getItem('auth_token');
          // Always send description as a string
          const response = await axios.post(`${this.apiUrl}/tasks`, {
            name: this.form.name,
            description: this.form.description || ''
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.$emit('task-created', {
            ...response.data,
            steps: []
          });
          this.closeModal();
        } catch (error) {
            alert(
              error.response?.data?.message ||
              (error.response?.data?.errors && JSON.stringify(error.response.data.errors)) ||
              'Failed to create task. Please try again.'
            );
          
        }
      }
    }
  }
  </script>