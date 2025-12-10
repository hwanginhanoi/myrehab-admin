import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// Get API base URL from environment variable
// You can change this in .env file: VITE_API_BASE_URL=http://your-backend:port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token from auth store
    let token: string | undefined

    if (typeof window !== 'undefined') {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('thisisjustarandomstring='))
        ?.split('=')[1]

      if (cookieValue) {
        try {
          // The cookie stores the token as a JSON string, so we need to parse it
          token = JSON.parse(decodeURIComponent(cookieValue))
        } catch {
          // Fallback if parsing fails
          token = cookieValue
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Default export required by Kubb
export default axiosInstance

// Named export for direct usage if needed
export { axiosInstance as apiClient }

// Type exports expected by Kubb-generated hooks
export type RequestConfig = AxiosRequestConfig
export type ResponseConfig<T = unknown> = AxiosResponse<T>
export type ResponseErrorConfig<T = unknown> = {
  message: string
  error: T
}
