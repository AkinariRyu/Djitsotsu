import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '../model/validation';
import { useAuth } from '../model/use-auth';

export const RegisterForm = () => {
  const { 
    handleRegister, 
    handleVerifyOtp, 
    loginWithGoogle, 
    view, 
    tempEmail, 
    isLoading, 
    error 
  } = useAuth();

  const [otpCode, setOtpCode] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({ 
    resolver: zodResolver(registerSchema) 
  });

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      await handleVerifyOtp(otpCode);
    }
  };

  if (view === 'otp') {
    return (
      <form onSubmit={onOtpSubmit} className="flex flex-col gap-5 p-8 bg-paper-white heavy-border max-w-md w-full mx-auto shadow-solid">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-ink-black">
            Verify Email
          </h2>
          <p className="font-bold text-sm text-ink-black/60 mt-2 uppercase">
            Code sent to: <span className="text-ink-black">{tempEmail}</span>
          </p>
        </div>

        {error && <div className="p-3 bg-red-100 border-2 border-red-500 font-bold text-sm text-red-700 text-center">{error}</div>}

        <div className="flex flex-col gap-1 mt-4">
          <label className="font-bold text-xs uppercase text-ink-black text-center">Enter 6-digit code</label>
          <input 
            type="text" 
            maxLength={6} 
            value={otpCode} 
            onChange={(e) => setOtpCode(e.target.value)} 
            className="p-4 bg-white border-3 border-ink-black focus:outline-none focus:shadow-solid transition-shadow text-center text-4xl font-black tracking-[0.5em]" 
            placeholder="000000"
            autoFocus 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading || otpCode.length < 6} 
          className="mt-4 py-4 bg-ink-black text-paper-white heavy-border font-black uppercase hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-solid transition-all disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Confirm Registration'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-5 p-8 bg-paper-white heavy-border max-w-md w-full mx-auto shadow-solid">
      <h2 className="text-3xl font-black uppercase tracking-tighter text-ink-black">
        Create Account
      </h2>
      
      {error && <div className="p-3 bg-red-100 border-2 border-red-500 font-bold text-sm text-red-700">{error}</div>}

      <div className="flex flex-col gap-1">
        <label className="font-bold text-xs uppercase text-ink-black">Email</label>
        <input type="email" {...register('email')} className="p-3 bg-white border-3 border-ink-black focus:outline-none focus:shadow-solid transition-shadow font-bold" placeholder="your@email.com" />
        {errors.email && <span className="text-red-500 text-xs font-bold">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-bold text-xs uppercase text-ink-black">Nickname</label>
        <input type="text" {...register('nickname')} className="p-3 bg-white border-3 border-ink-black focus:outline-none focus:shadow-solid transition-shadow font-bold" placeholder="Ryomen" />
        {errors.nickname && <span className="text-red-500 text-xs font-bold">{errors.nickname.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-bold text-xs uppercase text-ink-black">Password</label>
        <input type="password" {...register('password')} className="p-3 bg-white border-3 border-ink-black focus:outline-none focus:shadow-solid transition-shadow font-bold" placeholder="********" />
        {errors.password && <span className="text-red-500 text-xs font-bold">{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isLoading} className="mt-2 py-4 bg-ink-black text-paper-white heavy-border font-black uppercase hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-solid transition-all disabled:opacity-50">
        {isLoading ? 'Processing...' : 'Register'}
      </button>

      <div className="flex items-center gap-3 my-2">
        <div className="h-0.5 w-full bg-ink-black"></div>
        <span className="text-xs font-black uppercase text-ink-black shrink-0">Or continue with</span>
        <div className="h-0.5 w-full bg-ink-black"></div>
      </div>

      <button 
        type="button" 
        onClick={() => loginWithGoogle()} 
        disabled={isLoading} 
        className="py-4 bg-white text-ink-black border-3 border-ink-black font-black uppercase flex items-center justify-center gap-3 hover:shadow-solid transition-all disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </button>
    </form>
  );
};