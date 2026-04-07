import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 5000, // 5 seconds timeout for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;