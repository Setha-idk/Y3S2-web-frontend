<template>
  <div>
    <div v-if="!task.steps || !task.steps.length" class="text-gray-400 italic py-2">
      There is no step for this task
    </div>
    <div v-else>
      <!-- Step Item -->
      <div v-for="(step, idx) in task.steps" :key="step.id" class="step-item group">
        <div class="flex items-center justify-between">    
          <div class="flex items-center gap-2">
            <!-- step number: Step Name -->
            <span class="font-semibold">{{ idx + 1 }}.</span>
            <span>{{ step.name }}</span>
            <div>
              <span class="text-sm ml-2">description: {{ step.description }}</span>
            </div>
          </div>
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
        description: ''
      }
    }
  },
  methods: {
  }
}
</script>