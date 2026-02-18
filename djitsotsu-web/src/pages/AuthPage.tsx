import { useAuth } from '../features/auth/model/use-auth';
import { LoginForm } from '../features/auth/ui/LoginForm';
import { RegisterForm } from '../features/auth/ui/RegisterForm';
import { ForgotPasswordForm } from '../features/auth/ui/ForgotPasswordForm';

export const AuthPage = () => {
  const auth = useAuth(); 

  return (
    <div className="min-h-screen w-full bg-paper-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1.5px,transparent_1.5px)] bg-size-[12px_12px]" />
      
      <div className="w-full max-w-105 z-10">
        
        {auth.view === 'login' && (
          <LoginForm auth={auth} />
        )}

        {(auth.view === 'register' || auth.view === 'otp') && (
          <RegisterForm auth={auth} />
        )}
        
        {(auth.view === 'forgot-email' || auth.view === 'forgot-reset') && (
          <ForgotPasswordForm auth={auth} />
        )}
        
      </div>

      <div className="absolute bottom-4 right-6 text-[10px] font-black uppercase opacity-20">
        Djitsotsu
      </div>
    </div>
  );
};