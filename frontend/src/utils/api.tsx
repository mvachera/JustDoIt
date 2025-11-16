const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let accessToken = localStorage.getItem('accessToken');
  
  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401 || response.status === 403) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      response = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: 'include',
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } else {
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expirée');
    }
  }

  return response;
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur refresh:', error);
    return null;
  }
}