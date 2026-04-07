import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 5000, // 5 seconds timeout for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// This is the Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // 1. Every time a request is made, quietly grab the token from the vault
    const token = await SecureStore.getItemAsync('metro_jwt');
    
    // 2. If a token exists, attach it to the standard Bearer header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Send the modified request on its way
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;