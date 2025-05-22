<template>
    <!-- Trigger Button (in parent component) -->
    <button 
      @click="openStepModal(taskId)"
      class="text-blue-600 hover:text-blue-700 text-sm"
    >
      + Add Step
    </button>
  
    <!-- Step Creation Modal -->
    <div v-if="showStepModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Add New Step</h3>
          <button @click="closeStepModal" class="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
  
        <form @submit.prevent="createStep">
          <div class="space-y-4">
            <!-- Step Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Step Name</label>
              <input
                v-model="newStep.name"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
  
            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="newStep.description"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              ></textarea>
            </div>
  
            <div class="flex justify-end gap-2 mt-6">
              <button
                type="button"
                @click="closeStepModal"
                class="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Adding...' : 'Add Step' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
    import axios from 'axios';

  export default {
    props: {
      taskId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        showStepModal: false,
        isSubmitting: false,
        newStep: {
          name: '',
          description: ''
        }
      }
    },
    methods: {
      openStepModal() {
        this.showStepModal = true
      },
      closeStepModal() {
        this.showStepModal = false
        this.resetForm()
      },
      resetForm() {
        this.newStep = {
          name: '',
          description: ''
        }
      },
      async createStep() {
        this.isSubmitting = true
        try {
          const response = await axios.post(`http://localhost:8000/api/tasks/${this.taskId}/steps`, {
            name: this.newStep.name,
            task_id: this.taskId,
            description: this.newStep.description
          })
  
          this.$emit('step-created', response.data)
          this.closeStepModal()
        } catch (error) {
          console.error('Error creating step:', error)
          alert(error.response?.data?.message || 'Failed to create step')
        } finally {
          this.isSubmitting = false
        }
      }
    }
  }
  </script>