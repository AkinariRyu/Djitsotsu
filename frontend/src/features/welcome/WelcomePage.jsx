import { useNavigate } from 'react-router-dom'; // 1. Імпортуємо навігатор
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate(); // 2. Ініціалізуємо функцію переходу

  return (
    <div className="splash-root">
      <div className="action-lines"></div>

      <div className="sfx-layer" style={{ top: '15%', left: '10%', transform: 'rotate(-20deg)' }}>ドドドド</div>
      <div className="sfx-layer" style={{ bottom: '15%', right: '10%', transform: 'rotate(15deg)' }}>ゴゴゴゴ</div>

      <div className="main-frame">
        <div style={{
          border: '3px solid black',
          borderRadius: '50%',
          padding: '10px 20px',
          display: 'inline-block',
          background: 'white',
          marginBottom: '20px',
          fontSize: '1.2rem'
        }}>
          FINAL TRANSMISSION RECEIVED...
        </div>

        <br />
        <h1 className="manga-title" data-text="DJITSOTSU">DJITSOTSU</h1>
        <br />

        <div className="narration-box">
          A NEW ERA OF COMMUNICATION HAS BEGUN. 
          WILL YOU ANSWER THE CALL?
        </div>

        <div className="welcome-actions">
          {/* 3. Додаємо onClick для переходу на сторінку /auth */}
          <button className="impact-btn" onClick={() => navigate('/auth')}>
            ENTER
          </button>
          
          <button className="impact-btn impact-btn-alt" onClick={() => navigate('/auth')}>
            JOIN US
          </button>
        </div>

        <div style={{ marginTop: '60px', fontSize: '1.5rem', textDecoration: 'underline wavy black' }}>
          VOL. 1: THE VIRTUAL ABYSS
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;