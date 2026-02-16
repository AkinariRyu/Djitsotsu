import { LoginForm } from "../features/auth/ui/LoginForm";

export const LoginPage = () => {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-paper-white overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none" />
      
      <div className="absolute top-10 right-10 hidden md:block text-right">
        <h1 className="text-6xl font-black uppercase tracking-tighter text-ink-black opacity-10 select-none">
          Chapter 02: <br /> Return
        </h1>
      </div>

      <section className="relative z-10 w-full px-4">
        <LoginForm />
      </section>

      <div className="absolute bottom-0 left-0 p-4">
        <p className="font-bold text-xs uppercase tracking-widest text-ink-black/40">
          Djitsotsu
        </p>
      </div>
    </main>
  );
};