<template>
  <!-- Trigger Button -->
  <button 
    @click="openModal"
    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
  >
    File a Complaint
  </button>

  <!-- Modal -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Employee Complaint Portal</h1>
        <button @click="closeModal" class="text-2xl text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      <p class="text-gray-600 mb-6">
        Submit anonymous complaints about colleagues or issues.
      </p>

      <!-- Complaint Form -->
      <form @submit.prevent="submitComplaint" class="space-y-6">
        <!-- Complaint Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Complaint Type
          </label>
          <select 
            v-model="form.type"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select complaint type</option>
            <option value="Harassment">Harassment</option>
            <option value="Misconduct">Misconduct</option>
            <option value="Workplace Safety">Workplace Safety</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Target Person ID -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Target Person ID
          </label>
          <input
            v-model.number="form.target_person_id"
            type="number"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter employee ID"
            required
          >
        </div>

        <!-- Subject/Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Subject/Description
          </label>
          <textarea
            v-model="form.subject"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe the issue in detail..."
            required
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Complaint
        </button>
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
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Reactive state
const showModal = ref(false);
const showSuccess = ref(false);
const form = ref({
  type: '',
  subject: '',
  target_person_id: null,
});

// Methods
const openModal = () => {
  showModal.value = true;
  showSuccess.value = false;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    type: '',
    subject: '',
    target_person_id: null,
  };
  showSuccess.value = false;
};

const submitComplaint = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/complaints', {
      type: form.value.type,
      subject: form.value.subject,
      target_person_id: form.value.target_person_id,
    });
    console.log('Complaint created:', response.data);
    resetForm();
    showSuccess.value = true;
    setTimeout(() => {
      showModal.value = false;
    }, 2000); // Close modal after 2 seconds
  } catch (error) {
    console.error('Error submitting complaint:', error);
    alert('Failed to submit complaint. Please try again.');
  }
};
</script>