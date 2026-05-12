import * as SecureStore from 'expo-secure-store';

const API_URL_KEY = 'apiUrl';

// IP par défaut (si rien n'est configuré)
const DEFAULT_API_URL = 'https://buzz-curable-glass.ngrok-free.dev';

// Sauvegarder l’IP
export const saveApiUrl = async (url: string) => {
  await SecureStore.setItemAsync(API_URL_KEY, url);
};

// Récupérer l’IP
export const getApiUrl = async () => {
  const url = await SecureStore.getItemAsync(API_URL_KEY);
  return url || DEFAULT_API_URL;
};