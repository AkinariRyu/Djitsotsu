import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../model/validation';

export const LoginForm = ({ auth }: { auth: any }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ 
    resolver: zodResolver(loginSchema) 
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    const isSuccess = await auth.handleLogin(data);
    if (isSuccess) {
      window.location.href = '/';
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onLoginSubmit)} 
      className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative animate-in fade-in duration-300"
    >
      <div className="absolute -top-4 -right-4 bg-black text-white px-4 py-1 font-black uppercase italic rotate-2 border-2 border-white text-sm">
        Log: Access
      </div>

      <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8 border-b-4 border-black pb-2">Identify</h2>

      {auth.error && (
        <div className="p-3 mb-6 bg-red-100 border-2 border-black font-black text-[10px] uppercase italic text-red-600">
          SYSTEM ERROR: {auth.error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase mb-1 tracking-widest opacity-50">Email Protocol</label>
          <input 
            {...register('email')} 
            className="w-full p-3 border-3 border-black font-bold focus:bg-yellow-50 outline-none transition-colors"
            placeholder="USER@PROTO.MAIL"
          />
          {errors.email && <p className="text-[9px] font-black text-red-600 mt-1 uppercase">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase mb-1 tracking-widest opacity-50">Security Key</label>
          <input 
            type="password" 
            {...register('password')} 
            className="w-full p-3 border-3 border-black font-bold focus:bg-yellow-50 outline-none transition-colors"
            placeholder="••••••••"
          />
          <button 
            type="button" 
            onClick={() => auth.setView('forgot-email')} 
            className="text-[10px] font-black underline mt-2 uppercase hover:text-blue-600 tracking-tighter"
          >
            Lost Access to pass?
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={auth.isLoading} 
        className="w-full mt-8 py-4 bg-black text-white font-black uppercase text-xl border-4 border-black hover:bg-white hover:text-black transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        {auth.isLoading ? 'Syncing...' : 'Establish Link'}
      </button>

      <div className="relative my-8 h-px bg-black/20">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black uppercase text-black/40 tracking-widest">External Data</span>
      </div>

      <button 
        type="button" 
        onClick={() => auth.loginWithGoogle()} 
        className="w-full py-3 border-3 border-black font-black uppercase flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
      >
        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="" />
        Link Google ID
      </button>

      <p className="mt-6 text-center text-[10px] font-black uppercase">
        New candidate? <button type="button" onClick={() => auth.setView('register')} className="underline decoration-2 hover:text-blue-600">Create Record</button>
      </p>
    </form>
  );
};