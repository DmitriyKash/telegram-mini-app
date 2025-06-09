import { useEffect, useState } from 'react';

function App() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  
  // Параметры персонажа
  const [stats, setStats] = useState({
    strength: 43,
    agility: 37,
    luck: 52,
    health: 40,
    knowledge: 1,
    wisdom: 1,
  });

  const experience = {
    combat: 30665962,
    glory: 892500,
    valor: 200,
  };

  const [level, setLevel] = useState(1);
  const [inventory, setInventory] = useState(['Ключ', 'Зелье']);

  // Укажите ваш публичный API-адрес
  const API_BASE_URL = 'https://localhost:8000';

  // Загрузка прогресса при старте
  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      setTg(telegram);
      telegram.ready();
      telegram.expand();

      const initData = telegram.initDataUnsafe;
      setUser({
        id: initData.user?.id,
        firstName: initData.user?.first_name,
        lastName: initData.user?.last_name,
      });

      // Загружаем прогресс с сервера
      loadProgress(initData.user?.id);
    }
  }, []);

  // Функция для сохранения прогресса
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
      if (tg) tg.showAlert('Прогресс сохранён!');
    } catch (error) {
      console.error('Ошибка при сохранении прогресса:', error);
    }
  };

  // Функция для загрузки прогресса
  const loadProgress = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/get_progress/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (Object.keys(data).length > 0) {
          setStats(data.stats || stats);
          setLevel(data.level || level);
          setInventory(data.inventory || inventory);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке прогресса:', error);
    }
  };

  const handleLevelUp = () => {
    setLevel(prev => prev + 1);
    setStats(prev => ({
      ...prev,
      strength: prev.strength + 5,
      agility: prev.agility + 3,
      luck: prev.luck + 2,
    }));
    if (tg) tg.showAlert(`Поздравляем! Вы достигли уровня ${level + 1}`);
    saveProgress(); // сохраняем прогресс после повышения уровня
  };

  const addItem = (item) => {
    setInventory(prev => [...prev, item]);
    if (tg) tg.showAlert(`Вы получили предмет: ${item}`);
    saveProgress(); // сохраняем прогресс после получения предмета
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
        <p>Боевой: {experience.combat}</p>
        <p>Слава: {experience.glory}</p>
        <p>Доблесть: {experience.valor}</p>
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