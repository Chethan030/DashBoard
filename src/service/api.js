import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Replace with your Django backend
});

// Attach token before each request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token if access token expires
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh_token')
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          'http://127.0.0.1:8000/token/refresh/',
          {
            refresh: localStorage.getItem('refresh_token'),
          }
        );

        const newAccessToken = refreshResponse.data.access;

        localStorage.setItem('access_token', newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest); // Retry the failed request
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;
