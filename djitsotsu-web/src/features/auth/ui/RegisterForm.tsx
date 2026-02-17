import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '../model/validation';

export const RegisterForm = ({ auth }: { auth: any }) => {
  const [otpCode, setOtpCode] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({ 
    resolver: zodResolver(registerSchema) 
  });

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      const isSuccess = await auth.handleVerifyOtp(otpCode);
      if (isSuccess) {
        auth.setView('login');
      }
    }
  };

  if (auth.view === 'otp') {
    return (
      <div className="flex flex-col gap-5 p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter border-b-4 border-black pb-2">Verification</h2>
          <p className="font-bold text-[10px] uppercase bg-black text-white p-2 mt-4 tracking-widest">
            Protocol sent to: {auth.tempEmail}
          </p>
        </div>

        {auth.error && (
          <div className="p-3 bg-red-50 border-2 border-black font-black text-[10px] uppercase italic text-red-600">
            {auth.error}
          </div>
        )}

        <form onSubmit={onOtpSubmit} className="flex flex-col gap-4">
          <label className="font-black text-[10px] uppercase tracking-widest text-center opacity-50">Enter security code</label>
          <input 
            type="text" 
            maxLength={6} 
            value={otpCode} 
            onChange={(e) => setOtpCode(e.target.value)} 
            className="p-4 border-3 border-black text-center text-4xl font-black tracking-[0.4em] focus:bg-yellow-50 outline-none transition-colors" 
            placeholder="000000"
            autoFocus 
          />
          <button 
            type="submit" 
            disabled={auth.isLoading || otpCode.length < 6}
            className="py-4 bg-black text-white font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {auth.isLoading ? 'Confirming...' : 'Finalize Sync'}
          </button>
          
          <button 
            type="button" 
            onClick={() => auth.setView('register')} 
            className="text-[10px] font-black uppercase underline opacity-50 hover:opacity-100"
          >
            Wrong email? Go back
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative animate-in fade-in duration-300">
      <div className="absolute -top-4 -right-4 bg-black text-white px-4 py-1 font-black uppercase italic rotate-2 border-2 border-white text-sm">
        New Unit
      </div>

      <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4 border-b-4 border-black pb-2">Registration</h2>
      
      {auth.error && (
        <div className="p-3 bg-red-50 border-2 border-black font-black text-[10px] uppercase text-red-600">
          SYSTEM ERROR: {auth.error}
        </div>
      )}

      <form onSubmit={handleSubmit(auth.handleRegister)} className="flex flex-col gap-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">Email Protocol</label>
          <input 
            {...register('email')} 
            className="w-full p-3 border-3 border-black font-bold outline-none focus:bg-yellow-50 transition-colors" 
            placeholder="USER@MAIL.COM"
          />
          {errors.email && <span className="text-red-600 text-[9px] font-black uppercase mt-1">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">Codename (Nickname)</label>
          <input 
            {...register('nickname')} 
            className="w-full p-3 border-3 border-black font-bold outline-none focus:bg-yellow-50 transition-colors" 
            placeholder="HERO_01"
          />
          {errors.nickname && <span className="text-red-600 text-[9px] font-black uppercase mt-1">{errors.nickname.message}</span>}
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">Security Key</label>
          <input 
            type="password" 
            {...register('password')} 
            className="w-full p-3 border-3 border-black font-bold outline-none focus:bg-yellow-50 transition-colors" 
            placeholder="••••••••"
          />
          {errors.password && <span className="text-red-600 text-[9px] font-black uppercase mt-1">{errors.password.message}</span>}
        </div>

        <button 
          type="submit" 
          disabled={auth.isLoading} 
          className="mt-4 py-4 bg-black text-white font-black uppercase text-xl border-4 border-black hover:bg-white hover:text-black transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          {auth.isLoading ? 'Initializing...' : 'Join Protocol'}
        </button>
      </form>

      <div className="relative my-6 h-px bg-black/20">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-black uppercase text-black/40 tracking-widest">Social Sync</span>
      </div>

      <button 
        type="button" 
        onClick={() => auth.loginWithGoogle()} 
        disabled={auth.isLoading} 
        className="py-3 border-3 border-black font-black uppercase flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
      >
        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="" />
        Register via Google
      </button>

      <p className="mt-6 text-center text-[10px] font-black uppercase">
        Have an ID? <button type="button" onClick={() => auth.setView('login')} className="underline decoration-2 hover:text-blue-600 transition-colors">Log In</button>
      </p>
    </div>
  );
};