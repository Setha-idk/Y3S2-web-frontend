import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRuntimeConfig } from '#app'

export function useAuth() {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Get token from localStorage
  const getToken = () => localStorage.getItem('auth_token')

  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl

  const fetchUser = async () => {
    loading.value = true
    error.value = null
    try {
      const token = getToken()
      if (!token) throw new Error('No auth token')
      const res = await axios.get(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      user.value = res.data
    } catch (err) {
      user.value = null
      error.value = err.response?.data?.message || err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchUser)

  return { user, loading, error, fetchUser }
}
