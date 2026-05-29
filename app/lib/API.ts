import { getToken } from '../lib/auth';
import * as SecureStore from 'expo-secure-store';

import Constants from 'expo-constants';
export const getApiUrl = async () => {
  const stored = await SecureStore.getItemAsync('api_url');
  return stored || Constants.expoConfig?.extra?.apiUrl || '';
};


export const executePost = async (endpoint: string, params = {}) => {
  try {
    const token = await getToken();
    const API_URL = await getApiUrl();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: Object.keys(params).length ? JSON.stringify(params) : null
    });
    return response;
  } catch (e) {
    console.error('Erreur connexion API', e);
    throw e;
  }
};