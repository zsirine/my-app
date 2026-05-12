import { getApiUrl } from '../lib/config';
import { getToken } from '../lib/auth';

export const executePost = async (endpoint: string, params = {}) => {
  try {
    const apiUrl = await getApiUrl();
    const token = await getToken();

    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 🔥 IMPORTANT
      },
      body: Object.keys(params).length ? JSON.stringify(params) : null
    });

    return response;
  } catch (e) {
    console.error("Erreur connexion API", e);
    throw e;
  }
};