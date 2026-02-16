import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../model/validation';
import { useAuth } from '../model/use-auth';
import { Link } from 'react-router-dom';

export const LoginForm = () => {
  const { handleLogin, loginWithGoogle, isLoading, error } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ 
    resolver: zodResolver(loginSchema) 
  });

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col p-8 bg-paper-white heavy-border max-w-120 w-full mx-auto shadow-solid">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-ink-black">
          Welcome Back!
        </h2>
        <p className="font-bold text-sm text-ink-black/60 mt-1">
          We're so excited to see you again!
        </p>
      </div>

      {error && <div className="p-3 mb-4 bg-red-100 border-2 border-red-500 font-bold text-sm text-red-700 text-center">{error}</div>}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-black text-xs uppercase text-ink-black/80">
            Email <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            {...register('email')} 
            className="p-3 bg-white border-3 border-ink-black focus:outline-none focus:shadow-solid transition-shadow font-bold" 
          />
          {errors.email && <span className="text-red-500 text-xs font-bold">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-black text-xs uppercase text-ink-black/80">
            Password <span className="text-red-500">*</span>
          </label>
          <input 
            type="password" 
            {...register('password')} 
            className="p-3 bg-white border-3 border-ink-black focus:outline-none focus:shadow-solid transition-shadow font-bold" 
          />
          {errors.password && <span className="text-red-500 text-xs font-bold">{errors.password.message}</span>}
          
          <Link to="/forgot-password" className="text-xs font-black text-blue-600 hover:underline mt-1 w-fit">
            Forgot your password?
          </Link>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading} 
        className="mt-6 py-3 bg-ink-black text-paper-white heavy-border font-black uppercase hover:shadow-solid transition-all disabled:opacity-50 text-lg"
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>

      <div className="text-left mt-2 mb-6">
        <span className="text-sm font-bold text-ink-black/60">Need an account? </span>
        <Link to="/register" className="text-sm font-black text-blue-600 hover:underline transition-colors">
          Register
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-0.5 w-full bg-ink-black/10"></div>
        <span className="text-xs font-black uppercase text-ink-black/40 shrink-0">Or log in with</span>
        <div className="h-0.5 w-full bg-ink-black/10"></div>
      </div>

      <button 
        type="button" 
        onClick={() => loginWithGoogle()} 
        disabled={isLoading} 
        className="py-3 bg-white text-ink-black border-3 border-ink-black font-black uppercase flex items-center justify-center gap-3 hover:shadow-solid transition-all disabled:opacity-50"
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