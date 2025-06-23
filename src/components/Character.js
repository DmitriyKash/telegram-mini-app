import { useEffect, useState } from 'react';

function Character() {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const API_BASE_URL = 'http://localhost:8000';

  // Получение данных из Telegram
  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      telegram.ready();
      const initData = telegram.initDataUnsafe;
      if (initData?.user?.id) {
        setUser({
          id: initData.user.id,
          firstName: initData?.user?.first_name,
          lastName: initData?.user?.last_name,
        });
      }
    }
  }, []);

  // Загрузка персонажа при изменении user
  useEffect(() => {
    const fetchCharacter = async () => {
      if (!user?.id) {
        setError('Пользователь не выбран');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/get_character/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setCharacterData(data);
        } else {
          setError('Ошибка загрузки данных персонажа');
        }
      } catch (err) {
        console.error('Ошибка при получении данных персонажа:', err);
        setError('Ошибка загрузки данных персонажа');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [user]);

  if (loading) return <div>Загрузка персонажа...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="character-container">
      {/* Название и уровень */}
      <div className="character-name">
        {user?.firstName} [{characterData.level}]
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