import { useEffect, useState } from 'react';
import './Character.css';

function Character({ userId, firstName }) {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'https://55b5-37-57-145-0.ngrok-free.app';

  useEffect(() => {
    const controller = new AbortController();

    const fetchCharacter = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/get_character/${userId}?firstname=${encodeURIComponent(firstName)}`,
          {
            signal: controller.signal,
            headers: { 'ngrok-skip-browser-warning': '1' },
          }
        );
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

    return () => controller.abort();
  }, [userId, firstName]);

  if (loading) return <div>Загрузка персонажа...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!characterData) return <div>Данные персонажа не найдены.</div>;

  return (
    <div className="character-container">
      {/* Название и уровень */}
      <div className="character-name">
        {characterData.name} [{characterData.level}]
      </div>

      {/* Раскладка ячеек */}
      <div className="inventory-grid">
        {/* Левая колонка */}
        <div className="cell top-left">🛡️</div>
        <div className="cell middle-left">💍</div>
        <div className="cell bottom-left">🗡️</div>

        {/* Центральное изображение */}
        <div className="cell middle-center">
          <img src={characterData.avatar_url} alt="Character" className="avatar-img" />
        </div>

        {/* Правая колонка */}
        <div className="cell top-right">🚜</div>
        <div className="cell middle-right">🔧</div>
        <div className="cell bottom-right">🛠️</div>

        {/* Нижние слоты */}
        <div className="bottom-slots">
          <div className="slot">💎</div>
          <div className="slot">❤️</div>
          <div className="slot">💖</div>
        </div>
      </div>

      {/* Дополнительные детали */}
      <div className="avatar-wrapper">
        <img src={characterData.avatar_url} alt="Персонаж" className="avatar-img" />
      </div>

      <div className="stats">
        <p>Сила: {characterData.strength}</p>
        <p>Ловкость: {characterData.agility}</p>
        <p>Удача: {characterData.luck}</p>
        <p>Здоровье: {characterData.health}</p>
      </div>

      <div className="buttons-container">
        <button>Инвентарь</button>
        <button>Настройки</button>
      </div>
    </div>
  );
}

export default Character;