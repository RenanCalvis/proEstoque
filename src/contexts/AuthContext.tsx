import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../services/api';

export type User = {
  id: string;
  nome: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  registrar: (data: any) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem('@ProEstoque:user'),
          AsyncStorage.getItem('@ProEstoque:token'),
        ]);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // O token é adicionado via interceptor, mas podemos confirmar
        }
      } catch (error) {
        console.error('Erro ao recuperar dados do AsyncStorage', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const login = async (data: any) => {
    try {
      const response = await api.post('/auth/login', data);
      const { usuario, token: apiToken, refreshToken } = response.data;

      await AsyncStorage.setItem('@ProEstoque:user', JSON.stringify(usuario));
      await AsyncStorage.setItem('@ProEstoque:token', apiToken);
      if (refreshToken) {
        await AsyncStorage.setItem('@ProEstoque:refreshToken', refreshToken);
      }
      
      setUser(usuario);
      setToken(apiToken);
    } catch (error) {
      throw error;
    }
  };

  const registrar = async (data: any) => {
    try {
      const response = await api.post('/auth/registro', data);
      const { usuario, token: apiToken, refreshToken } = response.data;

      await AsyncStorage.setItem('@ProEstoque:user', JSON.stringify(usuario));
      await AsyncStorage.setItem('@ProEstoque:token', apiToken);
      if (refreshToken) {
        await AsyncStorage.setItem('@ProEstoque:refreshToken', refreshToken);
      }
      
      setUser(usuario);
      setToken(apiToken);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@ProEstoque:user');
      await AsyncStorage.removeItem('@ProEstoque:token');
      await AsyncStorage.removeItem('@ProEstoque:refreshToken');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erro ao limpar AsyncStorage', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        registrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
