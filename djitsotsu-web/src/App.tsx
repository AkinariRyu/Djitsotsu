import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { useUserStore } from './entities/user/model/store';

function App() {
  const isAuth = useUserStore((state) => state.isAuth);

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/forgot-password" element={<AuthPage />} />
      
      <Route 
        path="/" 
        element={
          isAuth ? (
            <div className="flex h-screen items-center justify-center bg-paper-white font-black text-3xl uppercase text-ink-black heavy-border m-10">
              Main Chat Application (WIP)
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;