// // src/api/api.js
// import axios from 'axios';

// const API_URL = 'http://localhost:1000/api'; // replace with your backend URL

// const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// // Add token automatically if needed (optional, not required for signup)
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) config.headers['Authorization'] = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // POST request helper
// export const postData = (endpoint, data) => apiClient.post(endpoint, data);


// src/api/api.js
import axios from 'axios';

const API_URL = 'http://localhost:1000/api'; // replace with your backend URL

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token automatically if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// POST request helper
export const postData = (endpoint, data) => apiClient.post(endpoint, data);

// GET request helper (optional, if needed)
export const getData = (endpoint) => apiClient.get(endpoint);
