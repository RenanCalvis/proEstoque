import { useState, useEffect, useCallback } from 'react';
import { api, useMocks } from '../services/api';
import { CATEGORIAS_MOCK } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export interface Categoria {
  id: string;
  nome: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const carregarCategorias = useCallback(async () => {
    if (!isAuthenticated && !useMocks) return;
    setIsLoading(true);
    setError(null);
    try {
      if (useMocks) {
        setCategorias(CATEGORIAS_MOCK);
      } else {
        const response = await api.get('/categorias');
        setCategorias(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar categorias');
      console.error('Erro ao carregar categorias', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  return { categorias, isLoading, error, carregarCategorias };
}
