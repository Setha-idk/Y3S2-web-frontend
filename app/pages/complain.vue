<template>
  <div class="min-h-screen bg-gray-100 p-6">
        <div>
      <nuxt-link to="/" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        back
      </nuxt-link>
    </div>
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Complaint Dashboard</h1>
    <div>
        <complainCreator/>
    </div>
      <!-- Tabs -->
      <div class="flex border-b border-gray-300 mb-6">
        <button
          :class="[
            'px-4 py-2 font-semibold',
            activeTab === 'incoming' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          ]"
          @click="activeTab = 'incoming'"
        >
          Incoming Complaints
        </button>
        <button
          :class="[
            'px-4 py-2 font-semibold',
            activeTab === 'outgoing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          ]"
          @click="activeTab = 'outgoing'"
        >
          Outgoing Complaints
        </button>
                <button
          :class="[
            'px-4 py-2 font-semibold',
            activeTab === 'company' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          ]"
          @click="activeTab = 'company'"
        >
          company 
        </button>
      </div>

      <!-- Complaint List -->
      <div v-if="activeTab === 'incoming'" class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700">Complaints From Others</h2>
        <div
          v-for="complaint in incomingComplaints"
          :key="complaint.id"
          class="bg-white p-4 rounded-lg shadow-md"
        >
          <div class="flex justify-between">
            <div>
              <p class="text-lg font-medium text-gray-800">{{ complaint.title }}</p>
              <p class="text-sm text-gray-500">From: {{ complaint.from }}</p>
              <p class="text-sm text-gray-500">Date: {{ complaint.date }}</p>
            </div>
            <span
              :class="[
                'px-2 py-1 text-sm rounded',
                complaint.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              ]"
            >
              {{ complaint.status }}
            </span>
          </div>
          <p class="mt-2 text-gray-600">{{ complaint.description }}</p>
        </div>
      </div>

      <div v-if="activeTab === 'outgoing'" class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700">My Complaints</h2>
        <div
          v-for="complaint in outgoingComplaints"
          :key="complaint.id"
          class="bg-white p-4 rounded-lg shadow-md"
        >
          <div class="flex justify-between">
            <div>
              <p class="text-lg font-medium text-gray-800">{{ complaint.title }}</p>
              <p class="text-sm text-gray-500">To: {{ complaint.to }}</p>
              <p class="text-sm text-gray-500">Date: {{ complaint.date }}</p>
            </div>
            <span
              :class="[
                'px-2 py-1 text-sm rounded',
                complaint.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              ]"
            >
              {{ complaint.status }}
            </span>
          </div>
          <p class="mt-2 text-gray-600">{{ complaint.description }}</p>
        </div>
      </div>

      <div v-if="activeTab ==='company'" class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700">company conplaint</h2>
        <div
          v-for="complaint in companyComplaints"
          :key="complaint.id"
          class="bg-white p-4 rounded-lg shadow-md"
        >
          <div class="flex justify-between">
            <div>
              <p class="text-lg font-medium text-gray-800">{{ complaint.title }}</p>
              <p class="text-sm text-gray-500">To: {{ complaint.to }}</p>
              <p class="text-sm text-gray-500">Date: {{ complaint.date }}</p>
            </div>
            <span
              :class="[
                'px-2 py-1 text-sm rounded',
                complaint.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              ]"
            >
              {{ complaint.status }}
            </span>
          </div>
          <p class="mt-2 text-gray-600">{{ complaint.description }}</p>
        </div>
      </div>

      <!-- No Complaints Message -->
      <div v-if="activeTab === 'incoming' && incomingComplaints.length === 0" class="text-center text-gray-500">
        No incoming complaints found.
      </div>
      <div v-if="activeTab === 'outgoing' && outgoingComplaints.length === 0" class="text-center text-gray-500">
        No outgoing complaints found.
      </div>
    </div>
  </div>
</template>

<script setup>
import complainCreator from '@/components/complainCreator.vue'

import { ref } from 'vue';

// Tab state
const activeTab = ref('incoming');

// Dummy data for incoming complaints (from others)
const incomingComplaints = ref([
  {
    id: 1,
    title: 'Unprofessional Behavior',
    from: 'John Doe',
    date: '2025-05-15',
    status: 'Open',
    description: 'Colleague was unprofessional during the team meeting, interrupting others repeatedly.'
  },
  {
    id: 2,
    title: 'Work Overload Concern',
    from: 'Jane Smith',
    date: '2025-05-10',
    status: 'Resolved',
    description: 'Reported excessive workload impacting work-life balance.'
  }
]);

// Dummy data for outgoing complaints (from me)
const outgoingComplaints = ref([
  {
    id: 1,
    title: 'Delayed Project Feedback',
    to: 'Sarah Johnson',
    date: '2025-05-12',
    status: 'Open',
    description: 'Requested feedback on project deliverables, but no response received after two weeks.'
  },
  {
    id: 2,
    title: 'Resource Allocation Issue',
    to: 'Mark Wilson',
    date: '2025-05-08',
    status: 'Resolved',
    description: 'Insufficient resources allocated for the Q2 marketing campaign.'
  }
]);
const companyComplaints = ref([
  {
    id: 1,
    title: 'no air conditioner',
    to: 'Sarah Johnson',
    date: '2025-05-12',
    status: 'Open',
    description: 'Requested feedback on project deliverables, but no response received after two weeks.'
  },
  {
    id: 2,
    title: 'windows broken',
    to: 'Mark Wilson',
    date: '2025-05-08',
    status: 'Resolved',
    description: 'Insufficient resources allocated for the Q2 marketing campaign.'
  }
]);
</script>

<style>
/* Tailwind CSS is already included via Nuxt configuration */
</style>