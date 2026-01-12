import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './features/welcome/WelcomePage';
import AuthPage from './features/auth/AuthPage';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;