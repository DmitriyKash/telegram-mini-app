import { useEffect, useState } from 'react';
import Character from './components/Character';
import './App.css';

function App() {
  // Удалите переменную tg, если она не используется
  // const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [level, setLevel] = useState(null);
  const [started, setStarted] = useState(false);

  const API_BASE_URL = 'http://localhost:8000';

  // Инициализация Telegram
  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      // setTg(telegram); // убрали
      telegram.ready();

      const initData = telegram.initDataUnsafe;
      const userId = initData?.user?.id;

      setUser({
        id: userId,
        firstName: initData?.user?.first_name,
        lastName: initData?.user?.last_name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Загрузка прогресса
  useEffect(() => {
    const loadProgress = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/get_progress/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.level !== undefined && data.level !== null) {
              setLevel(data.level);
            } else {
              setLevel(1);
            }
          } else {
            if (res.status === 404) {
              setLevel(1);
            } else {
              setLevel(1);
            }
          }
        } catch (error) {
          console.error('Ошибка при загрузке прогресса:', error);
          setLevel(1);
        }
      }
    };
    loadProgress();
  }, [user?.id]);

  const handleStartGame = () => {
    setStarted(true);
  };

  if (level === null && !started) {
    return <div>Загрузка...</div>;
  }

  if (started) {
    return <Character userId={user?.id} />;
  }

  return (
    <div className="App" style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Neverlands RPG</h1>
      <h2>Привет, {user?.firstName ?? user?.last_name ?? 'Игрок'}!</h2>
      <button onClick={handleStartGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Начать играть
      </button>
    </div>
  );
}

export default App;