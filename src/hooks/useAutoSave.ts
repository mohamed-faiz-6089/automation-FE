import { useEffect } from 'react';
export function useAutoSave(key: string, value: any, delay = 2000) {
  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem(key, JSON.stringify(value)), delay);
    return () => clearTimeout(id);
  }, [key, value, delay]);
}
