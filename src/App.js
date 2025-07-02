import { useEffect, useState } from 'react';
import Character from './components/Character';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [started, setStarted] = useState(false);

  // Инициализация Telegram при монтировании
  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      telegram.ready();

      const initData = telegram.initDataUnsafe;

      if (initData?.user?.id) {
        setUser({
          id: initData.user.id,
          firstName: initData.user.first_name,
          lastName: initData.user.last_name,
        });
      } else {
        console.error('Данные пользователя из initDataUnsafe недоступны или некорректны');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartGame = () => {
    if (user && user.id) {
      setStarted(true);
    } else {
      alert('Не удалось получить данные пользователя. Попробуйте перезагрузить страницу.');
    }
  };

  // Пока не получены данные пользователя
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Загрузка данных пользователя...</h2>
        <p>Пожалуйста, дождитесь загрузки данных из Telegram.</p>
      </div>
    );
  }

  // После начала игры
  if (started) {
    return <Character userId={user.id} firstName={user.firstName} />;
  }

  // Экран приветствия
  return (
    <div className="App" style={{ textAlign: 'center', padding: '50px' }}>
      <h2>
        Привет, {user.firstName ?? user.lastName ?? 'Игрок'}!
      </h2>
      <h1>Land of Chaos</h1>
      <button className="logo-button" onClick={handleStartGame}>
        Начать играть
      </button>
    </div>
  );
}

export default App;