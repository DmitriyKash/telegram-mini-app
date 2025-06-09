import { useEffect, useState } from 'react';

function App() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [level, setLevel] = useState(1);

  const API_BASE_URL = 'https://localhost:8000';

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      setTg(telegram);
      telegram.ready();

      const initData = telegram.initDataUnsafe;
      const userId = initData.user?.id;

      setUser({
        id: userId,
        firstName: initData.user?.first_name,
        lastName: initData.user?.last_name,
      });

      const loadProgress = async (userId) => {
        if (!userId) return;
        try {
          const res = await fetch(`${API_BASE_URL}/api/get_progress/${userId}`);
          if (res.ok) {
            const data = await res.json();
            if (Object.keys(data).length > 0) {
              setLevel(prev => data.level || prev);
            }
          }
        } catch (error) {
          console.error('Ошибка при загрузке прогресса:', error);
        }
      };

      if (userId) {
        loadProgress(userId);
      }
    }
  }, []);

  const handleLevelUp = () => {
    setLevel(prev => {
      const newLevel = prev + 1;
      // Можно отправить обновление на сервер, если нужно
      if (tg) tg.showAlert(`Поздравляем! Вы достигли уровня ${newLevel}`);
      return newLevel;
    });
  };

  return (
    <div className="App">
      <h1>Neverlands RPG</h1>
      <h2>Привет, {user?.firstName || 'Игрок'}!</h2>
      <p>Уровень: {level}</p>
      <button onClick={handleLevelUp}>Повысить уровень</button>
    </div>
  );
}

export default App;