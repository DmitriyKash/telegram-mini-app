import { useEffect, useState } from 'react';

function App() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [level, setLevel] = useState(null); // Изначально null, чтобы показывать загрузку

  const API_BASE_URL = 'http://localhost:8000';

  // Инициализация Telegram и получение данных о пользователе
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
    }
  }, []);

  // Загрузка прогресса пользователя после установки user
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
            setLevel(1); // Новый игрок — начинаем с 1
          }
        } else {
          // Можно проверить статус и обработать случаи, например 404 — нет данных
          if (res.status === 404) {
            setLevel(1);
          } else {
            // Другие ошибки
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

  // Функция для сохранения прогресса
  const saveProgress = async (newLevel) => {
    if (!user) return;
    try {
      await fetch(`${API_BASE_URL}/api/save_progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          level: newLevel,
        }),
      });
    } catch (error) {
      console.error('Ошибка при сохранении прогресса:', error);
    }
  };

  // Обработчик повышения уровня
  const handleLevelUp = () => {
    setLevel(prev => {
      const newLevel = (prev ?? 0) + 1; // Если prev null, считаем его 0
      saveProgress(newLevel);
      if (tg) tg.showAlert(`Поздравляем! Вы достигли уровня ${newLevel}`);
      return newLevel;
    });
  };

  // Пока уровень не загружен, показываем индикатор
  if (level === null) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="App">
      <h1>Neverlands RPG</h1>
      <h2>Привет, {user?.firstName ?? user?.last_name ?? 'Игрок'}!</h2>
      <p>Уровень: {level}</p>
      <button onClick={handleLevelUp}>Повысить уровень</button>
    </div>
  );
}

export default App;