import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { authApi } from '../api/auth.service';
import type { RegisterFormValues, LoginFormValues } from './validation';
import { useUserStore } from '../../../entities/user/model/store';

export type AuthView = 'login' | 'register' | 'otp' | 'forgot-email' | 'forgot-reset';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<AuthView>('login');
  const [tempEmail, setTempEmail] = useState('');

  const { setAccessToken, setAuth } = useUserStore();

  useEffect(() => {
    setError(null);
  }, [view]);

  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(data);
      setTempEmail(data.email);
      setView('otp');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'REGISTRATION FAILED');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword(email);
      setTempEmail(email);
      setView('forgot-reset');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'EMAIL NOT FOUND');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authApi.resetPassword({ ...data, email: tempEmail });
      if (result.accessToken) {
        setAccessToken(result.accessToken);
        setAuth(result.user, result.accessToken);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.error || 'INVALID RECOVERY CODE');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authApi.login(data);
      if (result.accessToken) {
        setAccessToken(result.accessToken);
        setAuth(result.user || { id: 'user', email: data.email, nickname: 'User' }, result.accessToken);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'ACCESS DENIED');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const { email, given_name, picture, sub } = userInfo.data;
        const result = await authApi.socialLogin({
          email, firstName: given_name || `User_${sub.slice(-4)}`, avatarUrl: picture || '', provider: 'google', providerId: sub,
        });
        if (result.accessToken) {
          setAccessToken(result.accessToken);
          setAuth(result.user || { id: sub, email, nickname: given_name, avatarUrl: picture }, result.accessToken);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'GOOGLE AUTH PROTOCOL ERROR');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('GOOGLE LOGIN CANCELED'),
  });

  const handleVerifyOtp = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authApi.verifyOtp(tempEmail, code);
      if (result.accessToken) {
        setAccessToken(result.accessToken);
        setAuth(result.user, result.accessToken);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'INVALID CODE');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleRegister,
    handleForgotPassword,
    handleResetPassword,
    handleLogin,
    loginWithGoogle,
    handleVerifyOtp,
    view,
    setView,
    tempEmail,
    isLoading,
    error
  };
};