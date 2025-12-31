import axios from 'axios'
// eslint-disable-next-line no-duplicate-imports
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
	baseURL?: string
	url?: string
	method?: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD'
	params?: unknown
	data?: TData | FormData
	responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
	signal?: AbortSignal
	validateStatus?: (status: number) => boolean
	headers?: AxiosRequestConfig['headers']
}

/**
 * Subset of AxiosResponse
 */
export type ResponseConfig<TData = unknown> = {
	data: TData
	status: number
	statusText: string
	headers: AxiosResponse['headers']
}

export type ResponseErrorConfig<TError = unknown> = AxiosError<TError>

let _config: Partial<RequestConfig> = {
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
	headers: {
		'Content-Type': 'application/json',
	},
}

export const getConfig = () => _config

export const setConfig = (config: RequestConfig) => {
	_config = config
	return getConfig()
}

// Create axios instance with interceptors
const axiosInstance = axios.create({
	...getConfig(),
	paramsSerializer: {
		serialize: (params) => {
			// Manually build query string to avoid encoding commas
			const parts: string[] = []

			Object.entries(params).forEach(([key, value]) => {
				if (value === undefined || value === null) {
					return
				}

				// Special handling for 'pageable' - flatten it to Spring Data Web format
				if (key === 'pageable' && typeof value === 'object' && !Array.isArray(value)) {
					Object.entries(value as Record<string, unknown>).forEach(([pageableKey, pageableValue]) => {
						if (pageableValue !== undefined && pageableValue !== null) {
							const encodedKey = encodeURIComponent(pageableKey)
							const encodedValue = encodeURIComponent(String(pageableValue))
							parts.push(`${encodedKey}=${encodedValue}`)
						}
					})
				} else if (Array.isArray(value)) {
					// Serialize arrays as comma-separated values without encoding the comma
					if (value.length > 0) {
						const encodedKey = encodeURIComponent(key)
						const encodedValues = value.map(v => encodeURIComponent(String(v))).join(',')
						parts.push(`${encodedKey}=${encodedValues}`)
					}
				} else if (typeof value === 'object') {
					// For other nested objects, use dot notation
					Object.entries(value as Record<string, unknown>).forEach(([nestedKey, nestedValue]) => {
						if (nestedValue !== undefined && nestedValue !== null) {
							const fullKey = `${key}.${nestedKey}`
							const encodedKey = encodeURIComponent(fullKey)
							const encodedValue = encodeURIComponent(String(nestedValue))
							parts.push(`${encodedKey}=${encodedValue}`)
						}
					})
				} else {
					const encodedKey = encodeURIComponent(key)
					const encodedValue = encodeURIComponent(String(value))
					parts.push(`${encodedKey}=${encodedValue}`)
				}
			})

			return parts.join('&')
		},
	},
})

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
	(config) => {
		const token = useAuthStore.getState().auth.accessToken

		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`
		}

		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Kubb-compatible client function
export const client = async <TData, TError = unknown, TVariables = unknown>(
	config: RequestConfig<TVariables>
): Promise<ResponseConfig<TData>> => {
	const globalConfig = getConfig()

	return axiosInstance
		.request<TData, ResponseConfig<TData>>({
			...globalConfig,
			...config,
			headers: {
				...globalConfig.headers,
				...config.headers,
			},
		})
		.catch((e: AxiosError<TError>) => {
			throw e
		})
}

client.getConfig = getConfig
client.setConfig = setConfig

// Export axios instance for debugging tools
export { axiosInstance }

export default client
