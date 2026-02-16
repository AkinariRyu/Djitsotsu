import { RegisterForm } from "../features/auth/ui/RegisterForm";
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-paper-white overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none" />
      
      <div className="absolute top-10 left-10 hidden md:block text-left">
        <h1 className="text-6xl font-black uppercase tracking-tighter text-ink-black opacity-10 select-none">
          Chapter 01: <br /> Genesis
        </h1>
      </div>

      <section className="relative z-10 w-full px-4">
        <RegisterForm />
        
        <div className="text-center mt-4 max-w-md mx-auto">
          <span className="text-sm font-bold text-ink-black/60">Already have an account? </span>
          <Link to="/login" className="text-sm font-black uppercase underline hover:text-ink-black transition-colors">
            Login
          </Link>
        </div>
      </section>

      <div className="absolute bottom-0 right-0 p-4 text-right">
        <p className="font-bold text-xs uppercase tracking-widest text-ink-black/40">
          Djitsotsu // New Soul Registration
        </p>
      </div>
    </main>
  );
};