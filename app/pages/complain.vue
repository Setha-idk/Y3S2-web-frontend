<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <div class="mb-6">
        <nuxt-link 
          to="/" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back
        </nuxt-link>
      </div>

      <!-- Complaint Creator Component -->
      <div class="mb-6">
        <complainCreator />
      </div>

      <!-- Header -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Complaint Dashboard</h1>

      <!-- Complaint List -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700">All Complaints</h2>
        <div
          v-for="complaint in complaints"
          :key="complaint.id"
          class="bg-white p-4 rounded-lg shadow-md"
        >
          <div class="flex justify-between">
            <div>
              <p class="text-lg font-medium text-gray-800">{{ complaint.type }}</p>
              <p class="text-sm text-gray-500">Target Person ID: {{ complaint.target_person_id }}</p>
              <p class="text-sm text-gray-500">Date: {{ formatDate(complaint.created_at) }}</p>
            </div>
            <span
              class="px-2 py-1 text-sm rounded bg-yellow-100 text-yellow-800"
            >
              Open
            </span>
          </div>
          <p class="mt-2 text-gray-600">{{ complaint.subject }}</p>
        </div>

        <!-- No Complaints Message -->
        <div v-if="complaints.length === 0" class="text-center text-gray-500">
          No complaints found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import complainCreator from '~/components/complainCreator.vue';
// Reactive state
const complaints = ref([]);

// Fetch complaints from API
const fetchComplaints = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/complaints');
    complaints.value = response.data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    alert('Failed to load complaints. Please try again.');
  }
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Fetch complaints on component mount
onMounted(fetchComplaints);
</script>