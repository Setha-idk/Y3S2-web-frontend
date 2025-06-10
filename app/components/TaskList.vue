<template>
  <div :class="['space-y-4', darkMode ? 'dark' : '']">
    <template v-if="tasks.length">
      <div 
        v-for="(task, index) in tasks" 
        :key="task.id || index"
        :class="['task-item border rounded-lg p-4 hover:shadow-xl transition-all duration-200', darkMode ? 'border-slate-700 bg-slate-800 hover:border-sky-500/70' : 'border-slate-300 bg-slate-100 hover:border-sky-400/70']"
      >
        <!-- Task Header -->
        <div class="flex flex-col sm:flex-row justify-between sm:items-center">
          <div class="mb-3 sm:mb-0">
            <h3 :class="['font-medium text-lg', darkMode ? 'text-sky-400' : 'text-sky-700']">{{ task.name }}</h3>
            <p :class="['text-sm mt-1 max-w-md', darkMode ? 'text-slate-400' : 'text-slate-600']">{{ task.description }}</p>
            <!-- Task Metadata -->
            <div class="mt-2 flex items-center gap-x-3 gap-y-1 flex-wrap">
              <span :class="darkMode ? 'text-white' : 'text-slate-800'" class="text-sm">
                Due: {{ formatDate(task.due_date) || 'N/A' }}
              </span>
              <span 
                class="px-2 py-0.5 text-xs rounded-full font-semibold"
                :class="statusClass(task.status)"
              >
                {{ task.status?.replace('_', ' ') }}
              </span>
              <a 
                v-if="task.file_path"
                :href="fileDownloadUrl(task.id)"
                :class="['text-sm flex items-center', darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-500']"
                target="_blank"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Attached File
              </a>
            </div>
          </div>
          <!-- Task Actions -->
          <div class="flex flex-shrink-0 flex-col sm:flex-row items-start sm:items-center gap-2">
            <button 
              @click="$emit('toggle-steps', task.id)"
              :class="['task-action-btn', darkMode ? 'text-sky-500 hover:text-sky-400' : 'text-sky-700 hover:text-sky-900']"
            >
              {{ expandedTasks.includes(task.id) ? 'Hide Steps' : 'Show Steps' }}
            </button>
            <button
              v-if="task.status !== 'completed'"
              @click="$emit('open-submit-modal', task)"
              :class="['task-action-btn ml-2', darkMode ? 'text-emerald-500 hover:text-emerald-400' : 'text-emerald-700 hover:text-emerald-900']"
            >
              Submit Task
            </button>
            <span v-else :class="darkMode ? 'text-emerald-400' : 'text-emerald-700'" class="font-semibold ml-2">Completed</span>
          </div>
        </div>
        <!-- Expanded Steps Section -->
        <div 
          v-if="expandedTasks.includes(task.id)" 
          :class="['mt-3 pt-3 border-t', darkMode ? 'border-slate-700' : 'border-slate-300']"
        >
          <StepList :task="task" />
        </div>
        <!-- Submit Modal -->
        <div v-if="showSubmitModal && submittingTask && submittingTask.id === task.id" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div :class="['p-6 rounded-lg shadow-lg w-full max-w-md', darkMode ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-900']">
            <h3 :class="['text-lg font-semibold mb-4', darkMode ? 'text-slate-200' : 'text-slate-900']">Submit Task: {{ submittingTask.name }}</h3>
            <!-- Show existing submitted file if available -->
            <div v-if="getSubmittedFile(submittingTask)">
              <p :class="['mb-2 text-sm', darkMode ? 'text-gray-300' : 'text-gray-700']">Current submitted file:</p>
              <a
                :href="`http://localhost:8000/storage/${getSubmittedFile(submittingTask)}`"
                target="_blank"
                :class="['underline break-all', darkMode ? 'text-blue-400' : 'text-blue-700']"
              >View Submitted File</a>
            </div>
            <form @submit.prevent="$emit('submit-task-file')">
              <input type="file" @change="$emit('file-change', $event)" class="mb-4" required />
              <div class="flex gap-2">
                <button type="submit" :class="['px-4 py-2 rounded', darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-400 text-emerald-900 hover:bg-emerald-500']">Submit</button>
                <button type="button" @click="$emit('close-submit-modal')" :class="['px-4 py-2 rounded', darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-300 text-gray-900 hover:bg-gray-400']">Cancel</button>
              </div>
              <div v-if="submitError" :class="darkMode ? 'text-red-400' : 'text-red-500'" class="mt-2">{{ submitError }}</div>
            </form>
          </div>
        </div>
      </div>
    </template>
    <div v-else :class="darkMode ? 'text-slate-400' : 'text-slate-500'" class="text-center py-8">
      No tasks assigned to you.
    </div>
  </div>
</template>
<script setup>
import StepList from '@/components/StepList.vue'
const props = defineProps([
  'tasks', 'expandedTasks', 'showSubmitModal', 'submittingTask', 'submitError',
  'getSubmittedFile', 'fileDownloadUrl', 'statusClass', 'formatDate', 'darkMode'
])
const emits = defineEmits(['toggle-steps', 'open-submit-modal', 'close-submit-modal', 'file-change', 'submit-task-file'])
</script>
