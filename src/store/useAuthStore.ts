import { create } from 'zustand';

type UserRole = 'STUDENT' | 'ADMIN';

interface User {
  name: string;
  email?: string;
  id?: string;
  role: UserRole;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  login: (user, token) => set({ isLoggedIn: true, user, token }),
  logout: () => set({ isLoggedIn: false, user: null, token: null }),
}));
