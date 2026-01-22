
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockBackend } from '../services/mockBackend';

interface AuthContextType {
  user: User | null;
  login: (username: string, email: string) => void;
  logout: () => void;
  updateStats: (score: number, experienceGained: number) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = mockBackend.getCurrentUser();
    if (savedUser) setUser(savedUser);
  }, []);

  const login = (username: string, email: string) => {
    const users = mockBackend.getUsers();
    let existingUser = users.find(u => u.email === email);

    if (!existingUser) {
      existingUser = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email,
        totalScore: 0,
        level: 1,
        experience: 0,
        gamesPlayed: 0
      };
    }

    setUser(existingUser);
    mockBackend.updateUser(existingUser);
  };

  const logout = () => {
    setUser(null);
    mockBackend.setCurrentUser(null);
  };

  const updateStats = (score: number, experienceGained: number) => {
    if (!user) return;

    const newExp = user.experience + experienceGained;
    const nextLevelExp = 100 * Math.pow(user.level, 1.5);
    let newLevel = user.level;
    let finalExp = newExp;

    if (finalExp >= nextLevelExp) {
      newLevel += 1;
      finalExp -= nextLevelExp;
    }

    const updatedUser: User = {
      ...user,
      totalScore: user.totalScore + score,
      experience: Math.floor(finalExp),
      level: newLevel,
      gamesPlayed: user.gamesPlayed + 1
    };

    setUser(updatedUser);
    mockBackend.updateUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateStats, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
