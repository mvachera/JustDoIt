const API_URL = 'http://localhost:5000';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem('token');
  
  // Requête avec le token actuel
  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // Si 401 ou 403, le token est expiré
  if (response.status === 401 || response.status === 403) {
    const newToken = await refreshAccessToken();
    
    if (newToken) {
      // Réessaye avec le nouveau token
      response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json',
        },
      });
    } else {
      // Impossible de refresh, déconnexion
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expirée');
    }
  }

  return response;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      localStorage.setItem('token', accessToken);
      return accessToken;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur refresh:', error);
    return null;
  }
}