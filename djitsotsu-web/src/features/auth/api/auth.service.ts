import { apiClient } from "../../../shared/api/base";
import type { RegisterFormValues, LoginFormValues } from '../model/validation';

export const authApi = {
  register: async (data: RegisterFormValues) => {
    const response = await apiClient.post('/register', data);
    return response.data;
  },

  login: async (data: LoginFormValues) => {
    const response = await apiClient.post('/login', data);
    return response.data; 
  },

  sendOtp: async (identifier: string) => {
    const response = await apiClient.post('/send-otp', { identifier });
    return response.data;
  },

  verifyOtp: async (identifier: string, code: string) => {
    const response = await apiClient.post('/verify-otp', { identifier, code });
    return response.data; 
  },

  socialLogin: async (data: any) => {
    const response = await apiClient.post('/social-login', data);
    return response.data; 
  },

  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  }
};