import axios from 'axios';

/**
 * API Client Configuration
 * -----------------------
 * Dynamic Host Detection:
 * Instead of hardcoding an IP address, we use 'window.location.hostname'.
 * This ensures that if you access the frontend via localhost, the API calls go to localhost.
 * If you access via a local network IP (like 192.168.x.x), the API calls follow suit.
 */

// Determine the backend host dynamically based on the current browser URL
const currentHost = window.location.hostname;

// Your backend port remains constant
const BACKEND_PORT = '3000';

const client = axios.create({
  // Automatically switches between localhost and network IP
  baseURL: `http://${currentHost}:${BACKEND_PORT}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 */
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 */
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        console.log('Refreshing session...');

        // Use the same dynamic host for the refresh call
        const response = await axios.post(`http://${currentHost}:${BACKEND_PORT}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);

      } catch (refreshError) {
        console.error('Session expired. Clearing storage.');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;