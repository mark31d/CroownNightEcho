import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@saved_ids_v1';

export const SavedContext = createContext({
  savedIds: new Set(),
  toggleSaved: () => {},
  clearAll: () => {},
});

export const SavedProvider = ({ children }) => {
  const [savedIds, setSavedIds] = useState(new Set());

  /* ---------- загрузка из памяти ---------- */
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSavedIds(new Set(JSON.parse(raw)));
      } catch (e) {
        console.warn('SavedContext: load error', e);
      }
    })();
  }, []);

  /* ---------- сохранение ---------- */
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...savedIds]));
      } catch (e) {
        console.warn('SavedContext: save error', e);
      }
    })();
  }, [savedIds]);

  /* ---------- api ---------- */
  const toggleSaved = useCallback((id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setSavedIds(new Set()), []);

  return (
    <SavedContext.Provider value={{ savedIds, toggleSaved, clearAll }}>
      {children}
    </SavedContext.Provider>
  );
};
