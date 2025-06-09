import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState('start'); // текущая локация
  const [inventory, setInventory] = useState([]); // инвентарь

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
        lastName: initData.user?.last_name
      });
      
      telegram.MainButton.setText('Инвентарь');
      telegram.MainButton.show();
      telegram.MainButton.onClick(() => {
        // Показываем инвентарь
        telegram.showAlert(`Инвентарь: ${inventory.join(', ') || 'пуст'}`);
      });
    }

    return () => {
      if (telegram) {
        telegram.MainButton.offClick();
      }
    };
  }, [inventory]);

  const handleClose = () => {
    tg?.close();
  };

  // Перемещение по локациям
  const moveTo = (newLocation) => {
    setLocation(newLocation);
    tg?.showAlert(`Вы переместились в ${newLocation}`);
  };

  // Взаимодействие с объектом
  const interact = () => {
    if (location === 'start') {
      // пример взаимодействия
      setInventory(prev => [...prev, 'Ключ']);
      tg?.showAlert('Вы нашли ключ!');
    } else {
      tg?.showAlert('Нет объектов для взаимодействия здесь.');
    }
  };

  if (!tg) {
    return <div>Loading Telegram Web App...</div>;
  }

  return (
    <div className="App">
      <h1>Neverlands 🌍</h1>
      <h2>Привет, {user?.firstName || 'Игрок'}!</h2>
      
      <div className="game-area">
        <h3>Текущая локация: {location}</h3>
        <button onClick={() => moveTo('forest')}>Идти в лес</button>
        <button onClick={() => moveTo('cave')}>Войти в пещеру</button>
        <button onClick={interact}>Взаимодействовать</button>
      </div>

      <div className="status">
        <h4>Инвентарь:</h4>
        <ul>
          {inventory.length > 0 ? (
            inventory.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>Пусто</li>
          )}
        </ul>
      </div>

      <button className="button" onClick={() => tg.showAlert('Добро пожаловать в Neverlands!')}>
        Поздороваться
      </button>
      <button className="button close-button" onClick={handleClose}>
        Выйти
      </button>
    </div>
  );
}

export default App;