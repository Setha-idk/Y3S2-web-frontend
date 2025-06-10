<template>
    <!-- Step Item -->
    <div v-for="step in task.steps" :key="step.id" class="step-item group">
      <div class="flex items-center justify-between">    
        <div class="flex items-center gap-2">
          <!-- Status Indicator -->
          <span 
            class=" bg-white w-2 h-2 rounded-full "
            :class=" stepStatusClass(step.status)"
          ></span>
          <span class="text-sm text-white ml-2">{{ step.status }}</span>
          
          <!-- Step Name -->
          <span class="text-white">{{ step.name }}</span>
          <div>
            <span class="text-sm text-white ml-2">description: {{ step.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
      import axios from 'axios';
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
          status: 'pending',
          description: ''
        }
      }
    },
    methods: {
      stepStatusClass(status) {
        return {
          'pending': 'bg-gray-300',
          'in_progress': 'bg-blue-500',
          'completed': 'bg-green-500'
        }[status]
      }
    }
  }
  </script>