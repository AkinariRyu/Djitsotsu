import { useState } from 'react';

export const ForgotPasswordForm = ({ auth }: { auth: any }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccess = await auth.handleResetPassword({ code, newPassword });
    if (isSuccess) {
      auth.setView('login');
    }
  };

  const onForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth.handleForgotPassword(email);
  };

  if (auth.view === 'forgot-reset') {
    return (
      <form 
        onSubmit={onResetSubmit} 
        className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-right-4 duration-300"
      >
        <h2 className="text-3xl font-black uppercase italic mb-6 border-b-4 border-black pb-2">Restructuring</h2>
        
        {auth.error && (
          <div className="p-3 mb-4 bg-red-50 border-2 border-black font-black text-[10px] uppercase text-red-600 italic">
            CRITICAL ERROR: {auth.error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase mb-1 opacity-50 tracking-widest">Verification Code</label>
            <input 
              placeholder="000000" 
              className="w-full p-3 border-3 border-black font-black uppercase focus:bg-yellow-50 outline-none" 
              onChange={(e) => setCode(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase mb-1 opacity-50 tracking-widest">New Security Key</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 border-3 border-black font-bold focus:bg-yellow-50 outline-none" 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit"
            disabled={auth.isLoading || !code || !newPassword}
            className="w-full py-4 mt-2 bg-black text-white font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {auth.isLoading ? 'Rewriting...' : 'Update Password'}
          </button>

          <button 
            type="button" 
            onClick={() => auth.setView('forgot-email')} 
            className="w-full text-[10px] font-black uppercase underline opacity-50 hover:opacity-100"
          >
            Resend Code
          </button>
        </div>
      </form>
    );
  }

  return (
    <form 
      onSubmit={onForgotSubmit} 
      className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in duration-300"
    >
      <h2 className="text-3xl font-black uppercase italic mb-2 border-b-4 border-black pb-2">Lost?</h2>
      <p className="text-[10px] font-black uppercase mb-8 text-black/40 tracking-widest leading-tight">
        Enter registered mail to receive<br/>recovery protocol
      </p>

      {auth.error && (
        <div className="p-3 mb-6 bg-red-50 border-2 border-black font-black text-[10px] uppercase text-red-600">
          {auth.error}
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">Target Email</label>
        <input 
          type="email" 
          placeholder="USER@PROTO.MAIL" 
          className="w-full p-3 border-3 border-black font-bold outline-none focus:bg-yellow-50 transition-colors" 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
      </div>
      
      <button 
        type="submit"
        disabled={auth.isLoading || !email} 
        className="w-full py-4 bg-black text-white font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        {auth.isLoading ? 'Transmitting...' : 'Send Recovery Code'}
      </button>

      <button 
        type="button" 
        onClick={() => auth.setView('login')} 
        className="w-full mt-4 text-[10px] font-black uppercase underline decoration-2 hover:text-blue-600"
      >
        Abort Mission
      </button>
    </form>
  );
};