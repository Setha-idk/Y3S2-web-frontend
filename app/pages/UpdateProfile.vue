<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center items-start">
    <!-- Main Profile Card Container -->
    <div class="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Profile Header Section -->
      <div class="bg-indigo-600 px-6 py-4">
        <h1 class="text-2xl font-bold text-white">Profile Settings</h1>
        <p class="text-indigo-100">Manage your personal and account information</p>
      </div>

      <!-- Loading and Error States -->
      <LoadingSpinner v-if="loading" />
      <div v-else-if="error" class="p-8 text-center">
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md mx-auto" role="alert">
          <p>{{ error }}</p>
        </div>
        <button 
          @click="fetchProfile" 
          class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Profile Form -->
      <div v-else class="p-6 md:p-8">
        <form @submit.prevent="updateProfile" enctype="multipart/form-data" class="space-y-6">
          <!-- Profile Picture Section -->
          <div class="flex flex-col items-center mb-8">
            <div class="relative group">
              <img
                v-if="form.profile_picture_preview || user.profile_picture_url"
                :src="form.profile_picture_preview || user.profile_picture_url"
                class="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md group-hover:border-indigo-200 transition-all"
                alt="Profile Picture"
              />
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">Change</span>
              </div>
            </div>
            <label class="mt-4 cursor-pointer">
              <span class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Upload new photo</span>
              <input 
                type="file" 
                accept="image/*" 
                @change="onFileChange" 
                class="hidden" 
              />
            </label>
          </div>

          <!-- Form Grid Layout -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Personal Information -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
              
              <FormInput
                v-model="form.name"
                label="Full Name"
                placeholder="Your full name"
                inputClass="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />

              <FormInput
                v-model="form.email"
                label="Email"
                type="email"
                disabled
                inputClass="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <!-- Account Information -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">Account Information</h2>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select 
                  v-model="form.department_id" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="" disabled>Select department</option>
                  <option 
                    v-for="dept in departments" 
                    :key="dept.id" 
                    :value="dept.id"
                  >
                    {{ dept.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  v-model="form.role_id" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="" disabled>Select role</option>
                  <option 
                    v-for="role in roles" 
                    :key="role.id" 
                    :value="role.id"
                  >
                    {{ role.name }}
                  </option>
                </select>
              </div>

              <div><!-- Access Level -->
                <label class="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                <FormInput
                  v-model="form.access_level"
                  :disabled="true"
                  :readonly="true"
                  placeholder="Your access level"
                  inputClass="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div> <!-- Access Level ends-->
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            <p>{{ successMessage }}</p>
          </div>
          <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{{ errorMessage }}</p>
          </div>
          
          <!-- Password Section -->
          <div class="pt-4 border-t border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Password</h2>
            <div>
              <FormInput
                v-model="form.password"
                label="Change Password"
                type="password"
                placeholder="Leave blank to keep current password"
                inputClass="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6">
            <div class="w-full sm:w-auto flex justify-start">
              <BackButton :to="'/'" />
            </div>
            <div class="w-full sm:w-auto flex justify-end gap-3">
              <button 
                type="button" 
                @click="resetForm"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button 
                type="submit" 
                class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import FormInput from '../components/FormInput.vue'
import BackButton from '../components/BackButton.vue'

// Reactive state
const user = ref({})
const form = ref({
  name: '',
  email: '',
  department_id: '',
  role_id: '',
  access_level: '',
  password: '',
  profile_picture: null,
  profile_picture_preview: ''
})
const departments = ref([])
const roles = ref([])
const loading = ref(true)
const error = ref('')
const successMessage = ref('')
const errorMessage = ref('')

// Helper function to construct profile picture URL
const getProfilePictureUrl = (profile_picture) => {
  if (!profile_picture) return ''
  // Assuming you use Laravel's public disk for storage
  return `http://localhost:8000/storage/${profile_picture}`
}

// Fetch departments from API
const fetchDepartments = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/departments')
    departments.value = res.data
  } catch (err) {
    console.error('Failed to fetch departments:', err)
  }
}

// Fetch roles from API
const fetchRoles = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/roles')
    roles.value = res.data
  } catch (err) {
    console.error('Failed to fetch roles:', err)
  }
}

// Fetch user profile data
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
    
    // Initialize form with user data
    form.value = {
      name: res.data.name,
      email: res.data.email,
      department_id: res.data.department_id,
      role_id: res.data.role_id,
      access_level: res.data.access_level,
      password: '',
      profile_picture: null,
      profile_picture_preview: getProfilePictureUrl(res.data.profile_picture) || '',
    }
  } catch (err) {
    error.value = 'Failed to load profile. Please try again later.'
    console.error('Profile fetch error:', err)
  } finally {
    loading.value = false
  }
}

// Reset form to original values
const resetForm = () => {
  form.value = {
    name: user.value.name,
    email: user.value.email,
    department_id: user.value.department_id,
    role_id: user.value.role_id,
    access_level: user.value.access_level,
    password: '',
    profile_picture: null,
    profile_picture_preview: user.value.profile_picture_url || '',
  }
  successMessage.value = ''
  errorMessage.value = ''
}

// Handle file upload for profile picture
const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    // Validate file type and size
    if (!file.type.match('image.*')) {
      errorMessage.value = 'Please select an image file'
      return
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      errorMessage.value = 'Image size should be less than 2MB'
      return
    }
    
    form.value.profile_picture = file
    form.value.profile_picture_preview = URL.createObjectURL(file)
    errorMessage.value = ''
  }
}

// Submit updated profile data
const updateProfile = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  
  try {
    const token = localStorage.getItem('auth_token')
    const formData = new FormData()
    
    // Append all form data
    formData.append('name', form.value.name)
    formData.append('department_id', form.value.department_id)
    formData.append('role_id', form.value.role_id)
    formData.append('access_level', form.value.access_level)
    if (form.value.password) formData.append('password', form.value.password)
    if (form.value.profile_picture) formData.append('profile_picture', form.value.profile_picture)
    
    // Send PUT request with FormData
    await axios.post(
      `http://localhost:8000/api/users/${user.value.id}?_method=PUT`, 
      formData, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    successMessage.value = 'Profile updated successfully!'
    await fetchProfile() // Refresh user data
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to update profile. Please try again.'
    console.error('Update error:', err)
  }
}

// Fetch initial data when component mounts
onMounted(async () => {
  await Promise.all([fetchDepartments(), fetchRoles()])
  await fetchProfile()
})
</script>

<style scoped>
/* Custom transitions for smoother hover effects */
.profile-image-upload {
  transition: all 0.3s ease;
}

/* Custom focus styles for better accessibility */
input:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}
</style>