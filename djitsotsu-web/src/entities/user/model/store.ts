import { create } from 'zustand';

interface User {
  id: number | string;
  email: string;
  nickname: string;
  avatarUrl?: string | null;
  role?: string;
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  isAuth: boolean;
  
  setAuth: (user: User, token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  isAuth: false,

  setAuth: (user, token) => set({ user, accessToken: token, isAuth: true }),
  
  setAccessToken: (token) => set({ accessToken: token }),
  
  logout: () => {
    set({ user: null, accessToken: null, isAuth: false });
    window.location.href = '/login';
  },
}));