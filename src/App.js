import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      setTg(telegram);
      telegram.ready();
      telegram.expand();
      
      // Инициализация пользователя
      const initData = telegram.initDataUnsafe;
      setUser({
        id: initData.user?.id,
        firstName: initData.user?.first_name,
        lastName: initData.user?.last_name
      });
      
      // Настройка основной кнопки
      telegram.MainButton.setText('Submit');
      telegram.MainButton.show();
      telegram.MainButton.onClick(() => {
        telegram.showAlert('Form submitted!');
      });
    }

    return () => {
      // Cleanup при размонтировании
      if (telegram) {
        telegram.MainButton.offClick();
      }
    };
  }, []);

  const handleClose = () => {
    tg?.close();
  };

  if (!tg) {
    return <div>Loading Telegram Web App...</div>;
  }

  return (
    <div className="App">
      <h1>Hello, {user?.firstName || 'Telegram User'}! 👋</h1>
      <div className="user-info">
        <p>User ID: {user?.id || 'Unknown'}</p>
        <p>Name: {[user?.firstName, user?.lastName].filter(Boolean).join(' ')}</p>
      </div>
      
      <button 
        className="button" 
        onClick={() => tg.showAlert('Custom button clicked!')}
      >
        Show Alert
      </button>
      
      <button 
        className="button close-button" 
        onClick={handleClose}
      >
        Close App
      </button>
    </div>
  );
}

export default App;
