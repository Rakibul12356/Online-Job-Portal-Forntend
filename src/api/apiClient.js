import { appConfig } from '@/config/env';
import { AUTH_STORAGE_KEY } from '@/constants';

const BASE_URL = appConfig.apiUrl;

// Helper to get stored auth data
function getAuthData() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Helper to set stored auth data
function setAuthData(data) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving session', e);
  }
}

// Helper to clear stored auth data
function clearAuthData() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing session', e);
  }
}

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

async function handleTokenRefresh() {
  const authData = getAuthData();
  if (!authData || !authData.refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken: authData.refreshToken,
    }),
  });

  if (!response.ok) {
    clearAuthData();
    // Dispatch custom event so the UI can redirect to login if necessary
    window.dispatchEvent(new Event('auth_session_expired'));
    throw new Error('Session expired');
  }

  const result = await response.json();
  if (result.success && result.data) {
    const updatedAuthData = {
      ...authData,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken || authData.refreshToken,
    };
    setAuthData(updatedAuthData);
    return result.data.accessToken;
  }

  clearAuthData();
  window.dispatchEvent(new Event('auth_session_expired'));
  throw new Error('Session expired');
}

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const authData = getAuthData();
  
  // Set default headers
  const headers = { ...options.headers };
  
  if (authData && authData.accessToken) {
    headers['Authorization'] = `Bearer ${authData.accessToken}`;
  }

  // Do not set Content-Type if body is FormData (fetch does it automatically with correct boundary)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  try {
    let response = await fetch(url, config);

    // If unauthorized, attempt token refresh once
    if (response.status === 401 && authData?.refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await handleTokenRefresh();
          isRefreshing = false;
          onRefreshed(newAccessToken);
        } catch (refreshErr) {
          isRefreshing = false;
          refreshSubscribers = [];
          throw refreshErr;
        }
      }

      // Queue request until token is refreshed
      const retryRequest = new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          config.headers['Authorization'] = `Bearer ${newToken}`;
          resolve(fetch(url, config));
        });
      });

      response = await retryRequest;
    }

    const contentType = response.headers.get('content-type');
    let responseData = null;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      // For file download streams or other media formats
      responseData = await response.blob();
    }

    if (!response.ok) {
      // Build standard error envelope if response was not ok
      const errorObj = responseData?.error || {
        code: responseData?.code || 'HTTP_ERROR',
        message: responseData?.message || response.statusText || 'An error occurred',
        details: responseData?.details || null,
      };
      throw errorObj;
    }

    // Return the response data (envelope structure is handled by the calling service)
    return responseData;
  } catch (error) {
    if (error.message && !error.code) {
      // Convert typical connection/parsing errors to our standard error envelope format
      throw {
        code: 'NETWORK_ERROR',
        message: error.message,
        details: null,
      };
    }
    throw error;
  }
}

export const apiClient = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) =>
    request(path, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (path, body, options = {}) =>
    request(path, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: (path, body, options = {}) =>
    request(path, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
};

export default apiClient;
