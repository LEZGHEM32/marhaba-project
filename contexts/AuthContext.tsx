import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { User, UserType } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string, type: UserType) => boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { users, findUserByEmail, addUser } = useData();

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (name: string, email: string, password: string, type: UserType): boolean => {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return false; // User already exists
    }
    const newUser: User = {
      id: `u${users.length + 1}`,
      name,
      email,
      password,
      type,
    };
    addUser(newUser);
    setUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    register,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  }), [user, isAuthModalOpen, users]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
