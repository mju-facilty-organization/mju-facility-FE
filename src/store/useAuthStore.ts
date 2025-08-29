import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserRole = 'STUDENT' | 'ADMIN';

type User = {
  name: string;
  email?: string;
  id?: string;
  role: UserRole;
};

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      refreshToken: null,
      login: (user, token, refreshToken) =>
        set({ isLoggedIn: true, user, token, refreshToken }),
      logout: () =>
        set({ isLoggedIn: false, user: null, token: null, refreshToken: null }),
      updateUser: (updatedUser) =>
        set((state) => ({
          ...state,
          user: updatedUser,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
