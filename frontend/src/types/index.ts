// These are TypeScript interfaces.
// They define exactly what shape an object must have.
// If you try to use a User object without an 'email' field,
// TypeScript will show a red underline warning immediately.

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'lawyer' | 'worker'; // Can ONLY be one of these two values
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
  role: 'lawyer' | 'worker';
  bar_number?: string;      // ? means optional
  specialization?: string;
  department?: string;
}