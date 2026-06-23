import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

// Attach the JWT to every outgoing request automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ainoviro_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is missing/expired, the backend returns 401 for every route.
// Log out immediately rather than showing a confusing error in whichever
// tab happened to be open — App.jsx will detect there's no token and
// render <Login /> again on the next render.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ainoviro_token');
      localStorage.removeItem('ainoviro_user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;