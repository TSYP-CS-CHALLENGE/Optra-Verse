export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  prenom: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  role: 'jobseeker' | 'recruiter';
  cin?: string;
  company?: string;
  position?: string;
  industry?: string;
  website?: string;
  resume?: File;
  company_logo?: File;
}

export interface User {
  id: number;
  name: string;
  prenom: string;
  email: string;
  role: 'jobseeker' | 'recruiter' | 'admin';
  phone: string;
  cin?: string;
  company?: string;
  position?: string;
  industry?: string;
  website?: string;
  resume?: string;
  company_logo?: string;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}