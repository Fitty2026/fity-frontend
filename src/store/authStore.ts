import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,

      setUser: (user) => set({ user, isLoggedIn: true }),

      setToken: (token) => {
        localStorage.setItem('accessToken', token);
        set({ accessToken: token });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null, isLoggedIn: false });
      },
    }),
    {
      name: 'fitty-auth', // localStorage key
      partialize: (state) => ({
        // accessToken은 localStorage에 따로 관리하므로 여기선 user만 persist
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);

export default useAuthStore;