import { useEffect, useState } from 'react';

function Character({ userId }) {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
  const API_BASE_URL = 'http://localhost:8000';
useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      // setTg(telegram); // убрали
      telegram.ready();

      const initData = telegram.initDataUnsafe;
      const userId = initData?.user?.id;

      setUser({
        id: userId,
        firstName: initData?.user?.first_name,
        lastName: initData?.user?.last_name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (!characterData) return <div>Данные персонажа не найдены</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      {/* Название и уровень */}
        <h2>
            {user?.firstName} [{characterData.level}]
        </h2>
      
      {/* Аватар */}
      <div style={{ margin: '20px 0' }}>
        <img
          src={characterData.avatarUrl}
          alt="Персонаж"
          style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
        />
      </div>
      
      {/* Характеристики */}
      <div style={{ textAlign: 'left', lineHeight: '1.5' }}>
        <p>Сила: {characterData.strength}</p>
        <p>Ловкость: {characterData.agility}</p>
        <p>Удача: {characterData.luck}</p>
        <p>Здоровье: {characterData.health}</p>
        {/* Можно добавить другие параметры */}
      </div>
      
      {/* Меню или дополнительные вкладки */}
      <div style={{ marginTop: '20px' }}>
        <button style={{ marginRight: '10px' }}>Инвентарь</button>
        <button>Настройки</button>
      </div>
    </div>
  );
}

export default Character;