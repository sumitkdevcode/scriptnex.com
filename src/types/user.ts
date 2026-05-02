export interface User {
  id: number;
  name: string;
  username: string | null;
  email: string;
  avatar: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  role: 'user' | 'admin';
  is_verified: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}
