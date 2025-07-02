import { useEffect, useState } from 'react';

function Character({ userId }) {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'https://55b5-37-57-145-0.ngrok-free.app';

useEffect(() => {
  const controller = new AbortController();

  // const fetchCharacter = async () => {
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/api/get_character/${userId}`, {
  //       signal: controller.signal,
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       setCharacterData(data);
  //     } else {
  //       setError('Ошибка загрузки данных персонажа');
  //     }
  //   } catch (err) {
  //     if (err.name !== 'AbortError') {
  //       console.error('Ошибка при получении данных персонажа:', err);
  //       setError('Ошибка загрузки данных персонажа');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // fetchCharacter();
  
  const fetchCharacter = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/get_character/${userId}`, {
      signal: controller.signal,
      headers: {
        'ngrok-skip-browser-warning': '1', // добавляем нужный заголовок
      },
    });
    if (res.ok) {
      const data = await res.json();
      setCharacterData(data);
    } else {
      setError('Ошибка загрузки данных персонажа');
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Ошибка при получении данных персонажа:', err);
      setError('Ошибка загрузки данных персонажа');
    }
  } finally {
    setLoading(false);
  }
};

fetchCharacter();

  return () => {
    // Отменяем запрос при размонтировании или изменении userId
    controller.abort();
  };
}, [userId]);

  if (loading) return <div>Загрузка персонажа...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Проверка наличия данных
  if (!characterData) return <div>Данные персонажа не найдены.</div>;

  return (
    <div className="character-container">
      {/* Название и уровень */}
      <div className="character-name">
        {characterData.name} [{characterData.level}]
      </div>
      
      {/* Аватар */}
      <div className="avatar-wrapper">
        <img
          src={characterData.avatar_url}
          alt="Персонаж"
          className="avatar-img"
        />
      </div>
      
      {/* Характеристики */}
      <div className="stats">
        <p>Сила: {characterData.strength}</p>
        <p>Ловкость: {characterData.agility}</p>
        <p>Удача: {characterData.luck}</p>
        <p>Здоровье: {characterData.health}</p>
      </div>
      
      {/* Меню или дополнительные вкладки */}
      <div className="buttons-container">
        <button>Инвентарь</button>
        <button>Настройки</button>
      </div>
    </div>
  );
}

export default Character;