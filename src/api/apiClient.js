import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

/**
 * Create a configured Axios instance for API communication
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ===== Request Interceptor =====
apiClient.interceptors.request.use(
  (config) => {
    // Attach auth token if available
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // localStorage not available, continue without token
    }

    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
        config.params || ''
      );
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ===== Response Interceptor =====
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(
        `[API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`
      );
    }

    // Return data directly for convenience
    return response.data !== undefined ? response : response;
  },
  (error) => {
    const { response, request, message } = error;

    // Build a structured error object
    const apiError = {
      message: 'An unexpected error occurred',
      status: null,
      data: null,
      originalError: error,
    };

    if (response) {
      // Server responded with an error status
      apiError.status = response.status;
      apiError.data = response.data;

      switch (response.status) {
        case 400:
          apiError.message = response.data?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          apiError.message = 'Session expired. Please login again.';
          // Clear auth data on 401
          try {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          } catch {
            // Ignore localStorage errors
          }
          // Optionally redirect to login
          if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login';
          }
          break;
        case 403:
          apiError.message = 'You do not have permission to perform this action.';
          break;
        case 404:
          apiError.message = response.data?.message || 'The requested resource was not found.';
          break;
        case 422:
          apiError.message = response.data?.message || 'Validation error. Please check your data.';
          break;
        case 429:
          apiError.message = 'Too many requests. Please try again later.';
          break;
        case 500:
          apiError.message = 'Internal server error. Please try again later.';
          break;
        case 502:
        case 503:
          apiError.message = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          apiError.message = response.data?.message || `Error: ${response.status}`;
      }
    } else if (request) {
      // Request was made but no response received (network error)
      apiError.message = 'Network error. Please check your internet connection.';
    } else {
      // Something happened in setting up the request
      apiError.message = message || 'Failed to make the request.';
    }

    if (import.meta.env.DEV) {
      console.error('[API Error]', apiError.message, apiError);
    }

    return Promise.reject(apiError);
  }
);

// ===== Convenience Methods =====

/**
 * GET request
 * @param {string} url - Endpoint URL
 * @param {Object} params - Query parameters
 * @param {Object} config - Additional axios config
 */
export const get = (url, params = {}, config = {}) =>
  apiClient.get(url, { params, ...config });

/**
 * POST request
 * @param {string} url - Endpoint URL
 * @param {Object} data - Request body
 * @param {Object} config - Additional axios config
 */
export const post = (url, data = {}, config = {}) =>
  apiClient.post(url, data, config);

/**
 * PUT request
 * @param {string} url - Endpoint URL
 * @param {Object} data - Request body
 * @param {Object} config - Additional axios config
 */
export const put = (url, data = {}, config = {}) =>
  apiClient.put(url, data, config);

/**
 * PATCH request
 * @param {string} url - Endpoint URL
 * @param {Object} data - Request body
 * @param {Object} config - Additional axios config
 */
export const patch = (url, data = {}, config = {}) =>
  apiClient.patch(url, data, config);

/**
 * DELETE request
 * @param {string} url - Endpoint URL
 * @param {Object} config - Additional axios config
 */
export const del = (url, config = {}) =>
  apiClient.delete(url, config);

export default apiClient;
