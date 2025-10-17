
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
  baseURL?: string;
  url?: string;
  method?: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD';
  params?: unknown;
  data?: TData | FormData;
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
  signal?: AbortSignal;
  validateStatus?: (status: number) => boolean;
  headers?: AxiosRequestConfig['headers'];
};

/**
 * Subset of AxiosResponse
 */
export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
  headers: AxiosResponse['headers'];
};

export type ResponseErrorConfig<TError = unknown> = AxiosError<TError>;

let _config: Partial<RequestConfig> = {
  baseURL: typeof window === 'undefined' ? 'http://localhost:8080' : '',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getConfig = () => _config;

export const setConfig = (config: RequestConfig) => {
  _config = config;
  return getConfig();
};

// Custom params serializer to flatten pageable object for Spring Boot compatibility
const customParamsSerializer = (params: any) => {
  if (!params) return '';

  // Check if params has a pageable property and flatten it
  if (params.pageable) {
    const { pageable, ...rest } = params;
    const flattenedParams = {
      ...rest,
      ...(pageable.page !== undefined && { page: pageable.page }),
      ...(pageable.size !== undefined && { size: pageable.size }),
      ...(pageable.sort !== undefined && { sort: pageable.sort }),
    };
    // Use 'repeat' format for arrays: ?sort=createdAt,desc&sort=name,asc
    return qs.stringify(flattenedParams, { arrayFormat: 'repeat' });
  }

  return qs.stringify(params, { arrayFormat: 'repeat' });
};

// Create axios instance
const axiosInstance = axios.create({
  ...getConfig(),
  paramsSerializer: customParamsSerializer,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear token and user data from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');

        // Remove auth cookie
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

        // Redirect to login page
        window.location.href = '/auth/login';
      }

      // Return a rejected promise with a custom message
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    return Promise.reject(error);
  }
);

// Kubb-compatible client function
export const client = async <TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>
): Promise<ResponseConfig<TData>> => {
  const globalConfig = getConfig();

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
      throw e;
    });
};

client.getConfig = getConfig;
client.setConfig = setConfig;

export default client;
