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

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

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

// PUT request helper
export const putData = (endpoint, data, config) => apiClient.put(endpoint, data, config);

// Upload form-data (multipart)
export const uploadFormData = (endpoint, formData) =>
  apiClient.put(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// POST form-data (multipart)
export const postFormData = (endpoint, formData) =>
  apiClient.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// DELETE request helper
export const deleteData = (endpoint) => apiClient.delete(endpoint);
