import { useEffect, useState } from 'react';

function App() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    strength: 43,
    agility: 37,
    luck: 52,
    health: 40,
    knowledge: 1,
    wisdom: 1,
  });
  const [level, setLevel] = useState(1);
  const [inventory, setInventory] = useState(['Ключ', 'Зелье']);

  const API_BASE_URL = 'https://localhost:8000';

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      setTg(telegram);
      telegram.ready();
      telegram.expand();

      const initData = telegram.initDataUnsafe;
      const userId = initData.user?.id;

      setUser({
        id: userId,
        firstName: initData.user?.first_name,
        lastName: initData.user?.last_name,
      });

      // Объявляем функцию внутри useEffect
      const loadProgress = async (userId) => {
        if (!userId) return;
        try {
          const res = await fetch(`${API_BASE_URL}/api/get_progress/${userId}`);
          if (res.ok) {
            const data = await res.json();
            if (Object.keys(data).length > 0) {
              // Используем функциональные обновления чтобы не зависеть от текущего состояния
              setStats(prev => ({ ...prev, ...data.stats }));
              setLevel(prev => data.level || prev);
              setInventory(prev => data.inventory || prev);
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
  }, []); // Запускается только один раз при монтировании

  const saveProgress = async () => {
    if (!user) return;
    try {
      await fetch(`${API_BASE_URL}/api/save_progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          stats,
          level,
          inventory,
        }),
      });
      tg?.showAlert('Прогресс сохранён!');
    } catch (error) {
      console.error('Ошибка при сохранении прогресса:', error);
    }
  };

  const handleLevelUp = () => {
    setLevel(prev => {
      const newLevel = prev + 1;
      // Обновляем параметры
      setStats(prevStats => ({
        ...prevStats,
        strength: prevStats.strength + 5,
        agility: prevStats.agility + 3,
        luck: prevStats.luck + 2,
      }));
      if (tg) tg.showAlert(`Поздравляем! Вы достигли уровня ${newLevel}`);
      saveProgress();
      return newLevel;
    });
  };

  const addItem = (item) => {
    setInventory(prev => {
      const newInventory = [...prev, item];
      if (tg) tg.showAlert(`Вы получили предмет: ${item}`);
      saveProgress();
      return newInventory;
    });
  };

  return (
    <div className="App">
      <h1>Neverlands RPG</h1>
      <h2>Привет, {user?.firstName || 'Игрок'}!</h2>

      <div className="character-stats">
        <h3>Параметры персонажа</h3>
        <ul>
          <li>Сила: {stats.strength}</li>
          <li>Ловкость: {stats.agility}</li>
          <li>Удача: {stats.luck}</li>
          <li>Здоровье: {stats.health}</li>
          <li>Знания: {stats.knowledge}</li>
          <li>Мудрость: {stats.wisdom}</li>
        </ul>
        <button onClick={handleLevelUp}>Повысить уровень</button>
      </div>

      <div className="experience">
        <h3>Опыт</h3>
        <p>Боевой: 30665962</p>
        <p>Слава: 892500</p>
        <p>Доблесть: 200</p>
      </div>

      <div className="inventory">
        <h3>Инвентарь</h3>
        <ul>
          {inventory.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <button onClick={() => addItem('Зелье')}>Получить Зелье</button>
      </div>

      <div className="actions">
        <button onClick={() => tg?.showAlert('Играем в Neverlands!')}>
          Поздороваться
        </button>
        <button className="close-button" onClick={() => tg?.close()}>
          Выйти
        </button>
      </div>
    </div>
  );
}

export default App;