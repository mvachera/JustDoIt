export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  refreshToken?: string;
  created_at: string;
}

// Types pour les requêtes API
export interface CreateUserRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Types pour les réponses API
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password'>;
}