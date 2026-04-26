import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

// Create an axios "instance" with your backend's base URL.
// Now instead of typing the full URL every time,
// you just call api.post('/auth/login') and it knows the base.
const api = axios.create({
  // AFTER
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: This runs automatically before EVERY request.
// It checks if we have a saved token and attaches it to the header.
// This means you never have to manually add the token — it's automatic.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH SERVICE: Functions that call your backend auth endpoints
export const authService = {
  // Register a new user
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  // Log in an existing user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Get the currently logged-in user's profile
  getMe: async (): Promise<{ user: any }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;
