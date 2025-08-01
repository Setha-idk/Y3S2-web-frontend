<template>
    <!-- Step Item -->
    <div v-for="(step, idx) in task.steps" :key="step.id" class="step-item group">
      <div class="flex items-center justify-between">    
        <div class="flex items-center gap-2">
          <!--step number: Step Name -->
          <span class="">Step {{ idx + 1 }}: {{ step.name }}</span>
          <div>
            <span class="text-sm ml-2">description: {{ step.description }}</span>
          </div>
        </div>
  
        <!-- Action Buttons -->
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <!-- Edit Button -->
          <button 
            @click="openEditModal(step)"
            class="text-blue-600 hover:text-blue-700 text-sm"
          >
            Edit
          </button>
          
          <!-- Delete Button -->
          <button 
            @click="confirmDelete(step.id)"
            class="text-red-600 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
  
      <!-- Edit Step Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">Edit Step</h3>
            <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
  
          <form @submit.prevent="updateStep">
            <div class="space-y-4">
              <!-- Step Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  v-model="editingStep.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded-lg"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  v-model="editingStep.description"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg"
                >
              </div>
  
              <div class="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  @click="closeEditModal"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Step
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRuntimeConfig } from '#app';
  export default {
    props: {
      task: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        showEditModal: false,
        editingStep: {
          id: null,
          name: '',
          description: ''
        },
        apiUrl: null
      }
    },
    mounted() {
      const config = useRuntimeConfig();
      this.apiUrl = config.public.apiUrl;
    },
    methods: {
      // Edit Step
      openEditModal(step) {
        this.editingStep = { ...step }
        this.showEditModal = true
      },
      
      async updateStep() {
        try {
          const oldStep = { ...this.task.steps.find(s => s.id === this.editingStep.id) };
          const response = await axios.put(`${this.apiUrl}/steps/${this.editingStep.id}`, {
            name: this.editingStep.name,
            description: this.editingStep.description
          })
          // Update local state
          const index = this.task.steps.findIndex(s => s.id === this.editingStep.id)
          if (index > -1) {
            this.task.steps.splice(index, 1, response.data)
          }
          this.$emit('step-updated', {
            oldStep,
            newStep: response.data,
            task: this.task
          });
          this.closeEditModal()
        } catch (error) {
          console.error('Error updating step:', error)
          alert(error.response?.data?.message || 'Failed to update step')
        }
      },
  
      // Delete Step
      async confirmDelete(stepId) {
        if (confirm('Are you sure you want to delete this step?')) {
          try {
            const step = this.task.steps.find(s => s.id === stepId)
            await axios.delete(`${this.apiUrl}/steps/${stepId}`)
            // Remove from local state
            const index = this.task.steps.findIndex(s => s.id === stepId)
            if (index > -1) {
              this.task.steps.splice(index, 1)
            }
            this.$emit('step-deleted', {
              step,
              task: this.task
            });
          } catch (error) {
            console.error('Error deleting step:', error)
            alert(error.response?.data?.message || 'Failed to delete step')
          }
        }
      },
  
      closeEditModal() {
        this.showEditModal = false
        this.editingStep = {
          id: null,
          name: '',
          description: ''
        }
      }
    }
  }
  </script>