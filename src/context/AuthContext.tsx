'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Simulated users storage - replace with real database in production
  const [users, setUsers] = useState<{ email: string; password: string }[]>([]);

  const register = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email and Password are required.");
    }
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      throw new Error("User already exists with this email.");
    }

    // Store new user
    setUsers([...users, { email, password }]);
    setUser({ email });
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email and Password are required.");
    }

    // Check if user exists and password matches
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    setUser({ email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
