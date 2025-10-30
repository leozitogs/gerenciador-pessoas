import { useCallback, useMemo, useState } from 'react';
import type { Person, AppState } from '@/lib/types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'people_manager_state';

// Comparador alfabético pt-BR, case/accent-insensitive
const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });

function sortPeople(people: Person[]): Person[] {
  return [...people].sort((a, b) => {
    // Nomes vazios vão para o final
    if (!a.name.trim() && !b.name.trim()) {
      // Empate: ordenar por createdAt (estável)
      return a.createdAt - b.createdAt;
    }
    if (!a.name.trim()) return 1;
    if (!b.name.trim()) return -1;
    
    // Comparação alfabética
    const comparison = collator.compare(a.name, b.name);
    if (comparison !== 0) return comparison;
    
    // Empate: ordenar por createdAt (estável)
    return a.createdAt - b.createdAt;
  });
}

export function usePeople() {
  const [state, setState, storageError] = useLocalStorage<AppState>(
    STORAGE_KEY,
    { people: [], lastUsedTitle: undefined }
  );
  
  const [undoStack, setUndoStack] = useState<Person[]>([]);
  
  // Pessoas sempre ordenadas
  const sortedPeople = useMemo(() => sortPeople(state.people), [state.people]);
  
  // Adicionar pessoa
  const addPerson = useCallback(
    (person: Omit<Person, 'id' | 'createdAt'>) => {
      const newPerson: Person = {
        ...person,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      
      setState((prev) => ({
        ...prev,
        people: [...prev.people, newPerson],
      }));
    },
    [setState]
  );
  
  // Atualizar pessoa
  const updatePerson = useCallback(
    (id: string, updates: Partial<Omit<Person, 'id' | 'createdAt'>>) => {
      setState((prev) => ({
        ...prev,
        people: prev.people.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    [setState]
  );
  
  // Remover pessoa
  const removePerson = useCallback(
    (id: string) => {
      setState((prev) => {
        const personToRemove = prev.people.find((p) => p.id === id);
        if (personToRemove) {
          setUndoStack([personToRemove]);
        }
        return {
          ...prev,
          people: prev.people.filter((p) => p.id !== id),
        };
      });
    },
    [setState]
  );
  
  // Remover todas as pessoas
  const removeAll = useCallback(() => {
    setState((prev) => {
      setUndoStack(prev.people);
      return {
        ...prev,
        people: [],
      };
    });
  }, [setState]);
  
  // Desfazer última remoção
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    setState((prev) => ({
      ...prev,
      people: [...prev.people, ...undoStack],
    }));
    
    setUndoStack([]);
  }, [undoStack, setState]);
  
  // Salvar último título usado
  const saveLastUsedTitle = useCallback(
    (title: string) => {
      setState((prev) => ({
        ...prev,
        lastUsedTitle: title,
      }));
    },
    [setState]
  );
  
  return {
    people: sortedPeople,
    addPerson,
    updatePerson,
    removePerson,
    removeAll,
    undo,
    canUndo: undoStack.length > 0,
    lastUsedTitle: state.lastUsedTitle,
    saveLastUsedTitle,
    storageError,
  };
}
