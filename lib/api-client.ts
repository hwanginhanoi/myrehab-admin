
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

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
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getConfig = () => _config;

export const setConfig = (config: RequestConfig) => {
  _config = config;
  return getConfig();
};

// Create axios instance
const axiosInstance = axios.create(getConfig());

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
