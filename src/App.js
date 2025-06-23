import { useEffect, useState } from 'react';
import Character from './components/Character'; // импорт компонента "Ваш персонаж"

function App() {
//   const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [level, setLevel] = useState(null); // уровень игрока
  const [started, setStarted] = useState(false); // чтобы понять, началась ли игра

  const API_BASE_URL = 'http://localhost:8000';

  // Инициализация Telegram и получение данных
  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      setTg(telegram);
      telegram.ready();

      const initData = telegram.initDataUnsafe;
      const userId = initData?.user?.id;

      setUser({
        id: userId,
        firstName: initData?.user?.first_name,
        lastName: initData?.user?.last_name,
      });
    }
  }, []);

  // Загрузка прогресса после получения user
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
              setLevel(1); // Новый игрок
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

  // Сохранение прогресса
//   const saveProgress = async (newLevel) => {
//     if (!user) return;
//     try {
//       await fetch(`${API_BASE_URL}/api/save_progress`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId: user.id,
//           level: newLevel,
//         }),
//       });
//     } catch (error) {
//       console.error('Ошибка при сохранении прогресса:', error);
//     }
//   };

  // Обработчик начала игры
  const handleStartGame = () => {
    setStarted(true);
  };

  // Обработчик повышения уровня (для теста)
//   const handleLevelUp = () => {
//     setLevel(prev => {
//       const newLevel = (prev ?? 0) + 1;
//       saveProgress(newLevel);
//       if (tg) tg.showAlert(`Поздравляем! Вы достигли уровня ${newLevel}`);
//       return newLevel;
//     });
//   };

  // Пока уровень не загружен, показываем индикатор
  if (level === null && !started) {
    return <div>Загрузка...</div>;
  }

  // Если игра запущена, показываем компонент "Ваш персонаж"
  if (started) {
    return <Character userId={user?.id} />;
  }

  // Главная страница перед началом игры
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