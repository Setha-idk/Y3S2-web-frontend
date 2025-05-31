<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

      <form @submit.prevent="loginUser" autocomplete="off">
        <div class="mb-4">
          <label class="block mb-1 font-medium">Email</label>
          <input
            v-model="form.email"
            type="email"
            name="login_email"
            autocomplete="off"
            class="w-full border p-2 rounded"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1 font-medium">Password</label>
          <input
            v-model="form.password"
            type="password"
            name="login_password"
            autocomplete="new-password"
            class="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  email: '',
  password: ''
})

const successMessage = ref('')
const errorMessage = ref('')

const loginUser = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/login', form.value)
    successMessage.value = response.data.message
    errorMessage.value = ''
    console.log('User info:', response.data.user)
    // TODO: store token or redirect
  } catch (error) {
    if (error.response && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Login failed'
    }
    successMessage.value = ''
  }
}
</script>
