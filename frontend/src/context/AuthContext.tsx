import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import { authService } from '../services/api';

// This is what our context "provides" to the whole app.
// Any component can call useAuth() to access these values.
interface AuthContextType {
  user: User | null;          // null = not logged in
  token: string | null;
  isLoading: boolean;         // true while checking if user is logged in
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isLawyer: boolean;          // convenience shortcut
}

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider wraps your entire app and provides auth state everywhere
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true — checking localStorage

  // On app load, check if the user is already logged in (token in localStorage)
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser)); // Parse the saved user object
    }
    setIsLoading(false); // Done checking
  }, []); // Empty array = run only once when app starts

  const login = async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    // Save to state
    setToken(data.token);
    setUser(data.user);
    // Save to localStorage so user stays logged in after refresh
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const register = async (credentials: RegisterCredentials) => {
    const data = await authService.register(credentials);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    // Clear everything
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      isLawyer: user?.role === 'lawyer', // true if logged in AND a lawyer
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — any component calls useAuth() to get everything above
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};