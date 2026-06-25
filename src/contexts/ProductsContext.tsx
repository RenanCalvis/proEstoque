import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
  useCallback,
} from 'react';
import { ProdutoFormData } from '../schemas/produtoSchema';
import { PRODUTOS_MOCK } from '../data/mockData';
import { api, useMocks } from '../services/api';
import { useAuth } from './AuthContext';

export type Product = Omit<ProdutoFormData, 'id'> & {
  id: string;
};

type ProductState = Product[];

type ProductAction =
  | { type: 'LOAD'; payload: Product[] }
  | { type: 'ADD'; payload: Product }
  | { type: 'UPDATE'; payload: Product }
  | { type: 'DELETE'; payload: string };

const ProductsContext = createContext<
  | {
      products: Product[];
      isLoading: boolean;
      error: string | null;
      carregarProdutos: () => Promise<void>;
      adicionarProduto: (produto: Omit<Product, 'id'>) => Promise<void>;
      atualizarProduto: (produto: Product) => Promise<void>;
      deletarProduto: (id: string) => Promise<void>;
    }
  | undefined
>(undefined);

function productsReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE':
      return state.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
    case 'DELETE':
      return state.filter((product) => product.id !== action.payload);
    default:
      return state;
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, dispatch] = useReducer(productsReducer, []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const carregarProdutos = useCallback(async () => {
    if (!isAuthenticated && !useMocks) return; // Don't fetch if not authenticated
    setIsLoading(true);
    setError(null);
    try {
      if (useMocks) {
        // Carrega produtos do AsyncStorage quando em mock
        const storedProducts = await AsyncStorage.getItem('@proestoque:produtos_mock');
        if (storedProducts) {
          const parsed = JSON.parse(storedProducts);
          if (Array.isArray(parsed)) {
            dispatch({ type: 'LOAD', payload: parsed });
          }
        } else {
          dispatch({ type: 'LOAD', payload: PRODUTOS_MOCK as any });
        }
      } else {
        const response = await api.get('/produtos');
        dispatch({ type: 'LOAD', payload: response.data });
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produtos');
      console.error('Erro ao carregar produtos', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  // Salva no AsyncStorage (somente modo mock) toda vez que o estado de produtos mudar
  useEffect(() => {
    if (!useMocks || isLoading) return;
    async function saveProducts() {
      try {
        await AsyncStorage.setItem('@proestoque:produtos_mock', JSON.stringify(products));
      } catch (error) {
        console.error('Erro ao salvar no AsyncStorage mock', error);
      }
    }
    saveProducts();
  }, [products, isLoading]);

  const adicionarProduto = async (produto: Omit<Product, 'id'>) => {
    if (useMocks) {
      const newProduct: Product = {
        ...produto,
        id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      };
      dispatch({ type: 'ADD', payload: newProduct });
      return;
    }

    try {
      const response = await api.post('/produtos', produto);
      dispatch({ type: 'ADD', payload: response.data });
    } catch (err: any) {
      console.error('Erro ao adicionar produto', err);
      throw err;
    }
  };

  const atualizarProduto = async (produto: Product) => {
    if (useMocks) {
      dispatch({ type: 'UPDATE', payload: produto });
      return;
    }

    try {
      const { id, ...data } = produto;
      const response = await api.put(`/produtos/${id}`, data);
      dispatch({ type: 'UPDATE', payload: response.data });
    } catch (err: any) {
      console.error('Erro ao atualizar produto', err);
      throw err;
    }
  };

  const deletarProduto = async (id: string) => {
    if (useMocks) {
      dispatch({ type: 'DELETE', payload: id });
      return;
    }

    try {
      await api.delete(`/produtos/${id}`);
      dispatch({ type: 'DELETE', payload: id });
    } catch (err: any) {
      console.error('Erro ao deletar produto', err);
      throw err;
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        error,
        carregarProdutos,
        adicionarProduto,
        atualizarProduto,
        deletarProduto,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductsProvider');
  }
  return context;
}
