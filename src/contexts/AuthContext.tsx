import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

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
  login: () => Promise<void>;
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
          new Promise((resolve) => setTimeout(resolve, 1500)), 
        ]);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Erro ao recuperar dados do AsyncStorage', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const login = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockUser: User = {
      id: '1',
      nome: 'Renan Teste',
      email: 'teste@proestoque.com',
    };
    const mockToken = 'abc123token';

    try {
      await AsyncStorage.setItem('@ProEstoque:user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('@ProEstoque:token', mockToken);
      setUser(mockUser);
      setToken(mockToken);
    } catch (error) {
      console.error('Erro ao salvar no AsyncStorage', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('@ProEstoque:user');
      await AsyncStorage.removeItem('@ProEstoque:token');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erro ao limpar AsyncStorage', error);
    } finally {
      setIsLoading(false);
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
