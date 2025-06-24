import { useEffect, useState } from 'react';

function Character({ userId }) {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'http://192.168.0.131:8000';

  useEffect(() => {
    const fetchCharacter = async () => {
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