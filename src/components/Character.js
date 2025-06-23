import { useEffect, useState } from 'react';
import './Character.css';

function Character({ userId }) {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
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

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!userId) {
        setError('Пользователь не выбран');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/get_character/${userId}`);
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
  }, [userId]);

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