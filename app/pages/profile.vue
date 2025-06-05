<template>
  <div class="min-h-screen bg-slate-900 p-8 text-slate-200 flex justify-center items-start">
    <div class="w-full max-w-xl bg-slate-800 rounded-lg shadow-lg p-8">
      <h1 class="text-2xl font-bold text-sky-400 mb-6">My Profile</h1>
      <div v-if="loading" class="text-center text-slate-400">Loading...</div>
      <div v-else-if="error" class="text-center text-red-400">{{ error }}</div>
      <div v-else>
        <form @submit.prevent="updateProfile" enctype="multipart/form-data" class="space-y-6">
          <div class="flex flex-col items-center mb-6">
            <img
              v-if="form.profile_picture_preview || user.profile_picture_url"
              :src="form.profile_picture_preview || user.profile_picture_url"
              class="w-24 h-24 rounded-full object-cover border-4 border-sky-500 mb-2"
              alt="Profile Picture"
            />
            <input type="file" accept="image/*" @change="onFileChange" class="mt-2" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Full Name</label>
            <input v-model="form.name" type="text" class="w-full px-3 py-2 border rounded-md bg-slate-700 text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full px-3 py-2 border rounded-md bg-slate-700 text-white" disabled />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Department</label>
            <input v-model="form.department" type="text" class="w-full px-3 py-2 border rounded-md bg-slate-700 text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Role</label>
            <input v-model="form.role" type="text" class="w-full px-3 py-2 border rounded-md bg-slate-700 text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Access Level</label>
            <input v-model="form.access_level" type="text" class="w-full px-3 py-2 border rounded-md bg-slate-700 text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Change Password</label>
            <input v-model="form.password" type="password" class="w-full px-3 py-2 border rounded-md bg-slate-700 text-white" placeholder="Leave blank to keep current password" />
          </div>
          <button type="submit" class="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700 transition-colors">Update Profile</button>
        </form>
        <p v-if="successMessage" class="text-green-400 mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref({})
const form = ref({
  name: '',
  email: '',
  department: '',
  role: '',
  access_level: '',
  password: '',
  profile_picture: null,
  profile_picture_preview: ''
})
const loading = ref(true)
const error = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const getProfilePictureUrl = (profile_picture) => {
  if (!profile_picture) return ''
  // Assuming you use Laravel's public disk for storage
  return `http://localhost:8000/storage/${profile_picture}`
}

const fetchProfile = async () => {
  loading.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('auth_token')
    const res = await axios.get('http://localhost:8000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    user.value = {
      ...res.data,
      profile_picture_url: getProfilePictureUrl(res.data.profile_picture)
    }
    form.value = {
      name: res.data.name,
      email: res.data.email,
      department: res.data.department,
      role: res.data.role,
      access_level: res.data.access_level,
      password: '',
      profile_picture: null,
      profile_picture_preview: '',
    }
  } catch (e) {
    error.value = 'Failed to load profile.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.profile_picture = file
    form.value.profile_picture_preview = URL.createObjectURL(file)
  }
}

const updateProfile = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  try {
    const token = localStorage.getItem('auth_token')
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('department', form.value.department)
    formData.append('role', form.value.role)
    formData.append('access_level', form.value.access_level)
    if (form.value.password) formData.append('password', form.value.password)
    if (form.value.profile_picture) formData.append('profile_picture', form.value.profile_picture)
    const res = await axios.post('http://localhost:8000/api/users/' + user.value.id + '?_method=PUT', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    successMessage.value = 'Profile updated successfully!'
    await fetchProfile()
  } catch (e) {
    errorMessage.value = e.response?.data?.message || 'Failed to update profile.'
  }
}
</script>

<style scoped>
</style>
