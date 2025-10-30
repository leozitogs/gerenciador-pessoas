import { useState, useEffect } from 'react';

const STORAGE_VERSION = '1.0';
const VERSION_KEY = 'app_version';

interface StorageData<T> {
  version: string;
  data: T;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, string | null] {
  const [error, setError] = useState<string | null>(null);
  
  // Inicializar estado com valor do localStorage ou valor inicial
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      const parsed: StorageData<T> = JSON.parse(item);
      
      // Verificar versão
      const storedVersion = window.localStorage.getItem(VERSION_KEY);
      if (storedVersion !== STORAGE_VERSION) {
        console.warn(
          `Storage version mismatch. Expected ${STORAGE_VERSION}, got ${storedVersion}. Using initial value.`
        );
        return initialValue;
      }
      
      return parsed.data;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      setError('Erro ao carregar dados salvos. Usando valores padrão.');
      return initialValue;
    }
  });
  
  // Salvar no localStorage quando o valor mudar
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      const storageData: StorageData<T> = {
        version: STORAGE_VERSION,
        data: valueToStore,
      };
      
      window.localStorage.setItem(key, JSON.stringify(storageData));
      window.localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
      setError(null);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      
      // Verificar se é erro de quota excedida
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        setError('Armazenamento local cheio. Por favor, remova alguns itens.');
      } else {
        setError('Erro ao salvar dados. Suas alterações podem não ser preservadas.');
      }
    }
  };
  
  return [storedValue, setValue, error];
}
