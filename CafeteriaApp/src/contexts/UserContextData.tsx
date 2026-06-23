import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

type User = {
  id: string;
  name: string;
  email: string;
  copos: number;
  premios: Array<{ codigo: string; usado: boolean }>;
};

type UserContextData = {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
};

const UserContext = createContext<UserContextData>({} as UserContextData);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      }
    };
    loadData();
  }, []);

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...data };
      setUser(newUser);
      AsyncStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.Authorization;
  };

  return (
    <UserContext.Provider value={{ user, token, setUser, setToken, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);