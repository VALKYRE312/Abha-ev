import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import type { ApiError } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Get Firebase ID token if user is authenticated
        if (typeof window !== 'undefined') {
          const { auth } = await import('@/lib/firebase');
          const user = auth.currentUser;
          
          if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          // Server responded with error
          const apiError = error.response.data;
          
          // Handle specific error codes
          switch (apiError?.error?.code) {
            case 'AUTHENTICATION_REQUIRED':
              // Redirect to login or refresh token
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
              }
              break;
            case 'INSUFFICIENT_PERMISSIONS':
              console.error('Access denied:', apiError.error.message);
              break;
            case 'RATE_LIMIT_EXCEEDED':
              console.warn('Rate limit exceeded, please try again later');
              break;
          }

          return Promise.reject(apiError);
        } else if (error.request) {
          // Request made but no response
          return Promise.reject({
            success: false,
            error: {
              code: 'NETWORK_ERROR',
              message: 'Unable to connect to the server. Please check your internet connection.',
            },
          } as ApiError);
        } else {
          // Something else happened
          return Promise.reject({
            success: false,
            error: {
              code: 'UNKNOWN_ERROR',
              message: error.message || 'An unexpected error occurred',
            },
          } as ApiError);
        }
      }
    );
  }

  public get<T>(url: string, params?: any) {
    return this.client.get<T>(url, { params });
  }

  public post<T>(url: string, data?: any) {
    return this.client.post<T>(url, data);
  }

  public put<T>(url: string, data?: any) {
    return this.client.put<T>(url, data);
  }

  public patch<T>(url: string, data?: any) {
    return this.client.patch<T>(url, data);
  }

  public delete<T>(url: string) {
    return this.client.delete<T>(url);
  }
}

export const apiClient = new ApiClient();
