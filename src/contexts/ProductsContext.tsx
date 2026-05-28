import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { ProdutoFormData } from '../schemas/produtoSchema';
import { PRODUTOS_MOCK } from '../data/mockData';

export type Product = Omit<ProdutoFormData, 'id'> & {
  id: string;
};

type ProductState = Product[];

type ProductAction =
  | { type: 'LOAD'; payload: Product[] }
  | { type: 'ADD'; payload: Omit<Product, 'id'> & { id?: string } }
  | { type: 'UPDATE'; payload: Product }
  | { type: 'DELETE'; payload: string };

const ProductsContext = createContext<
  | {
      products: Product[];
      dispatch: React.Dispatch<ProductAction>;
      adicionarProduto: (produto: Omit<Product, 'id'>) => void;
      atualizarProduto: (produto: Product) => void;
      deletarProduto: (id: string) => void;
    }
  | undefined
>(undefined);

function productsReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD': {
      const newProduct: Product = {
        ...action.payload,
        id: action.payload.id || Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      };
      return [...state, newProduct];
    }
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
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega produtos do AsyncStorage quando o app abre
  useEffect(() => {
    async function loadProducts() {
      try {
        const storedProducts = await AsyncStorage.getItem('@proestoque:produtos');
        if (storedProducts) {
          const parsed = JSON.parse(storedProducts);
          if (Array.isArray(parsed)) {
            dispatch({ type: 'LOAD', payload: parsed });
          }
        } else {
          // Preenche com os produtos simulados se o armazenamento estiver vazio
          dispatch({ type: 'LOAD', payload: PRODUTOS_MOCK as any });
        }
      } catch (error) {
        console.error('Erro ao recuperar dados do AsyncStorage', error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadProducts();
  }, []);

  // Salva no AsyncStorage toda vez que o estado de produtos mudar (após o carregamento inicial)
  useEffect(() => {
    if (!isLoaded) return;

    async function saveProducts() {
      try {
        await AsyncStorage.setItem('@proestoque:produtos', JSON.stringify(products));
      } catch (error) {
        console.error('Erro ao salvar no AsyncStorage', error);
      }
    }

    saveProducts();
  }, [products, isLoaded]);

  const adicionarProduto = (produto: Omit<Product, 'id'>) => {
    dispatch({ type: 'ADD', payload: produto });
  };

  const atualizarProduto = (produto: Product) => {
    dispatch({ type: 'UPDATE', payload: produto });
  };

  const deletarProduto = (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        dispatch,
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
