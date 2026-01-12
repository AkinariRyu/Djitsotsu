import { useState } from 'react';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Transmitting data to secure backend...");
    // Тут пізніше буде твій запит до БД
  };

  return (
    <div className="auth-root">
      {/* Декоративні звуки на фоні */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', color: '#333', fontSize: '5rem', fontFamily: 'Permanent Marker', opacity: 0.3 }}>
        ドドド
      </div>

      <div className="auth-panel">
        <div className="form-badge">
          {isLogin ? "EXISTING SOUL" : "NEW RECRUIT"}
        </div>

        <h2 className="auth-title">
          {isLogin ? "IDENTIFICATION" : "REGISTRATION"}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="manga-input-group">
              <label>CODENAME (USERNAME)</label>
              <input type="text" className="manga-input" placeholder="Enter codename..." required />
            </div>
          )}

          <div className="manga-input-group">
            <label>DIGITAL ADDRESS (EMAIL)</label>
            <input type="email" className="manga-input" placeholder="user@abyss.com" required />
          </div>

          <div className="manga-input-group">
            <label>SECURITY KEY (PASSWORD)</label>
            <input type="password" className="manga-input" placeholder="••••••••" required />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? "INITIATE LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="toggle-text" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "NO IDENTITY? REGISTER HERE" : "ALREADY ENLISTED? LOGIN HERE"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;