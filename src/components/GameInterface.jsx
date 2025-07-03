import { useEffect, useState } from 'react';
import Character from './Character';
import './GameInterface.css';

function GameInterface({ userId, firstName }) {
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
    <div className="game-container">
      {/* Верхняя панель */}
      <div className="top-panel">
        <div className="player-info">
          <div className="nickname"><b>{characterData.name}</b> [{characterData.level}]</div>
          <div className="hp-bar">
            <div className="hp-progress" style={{ width: '70%' }}></div> {/* пример HP */}
          </div>
        </div>
        <div className="buttons">
          <button disabled>Ваш Персонаж</button>
          <button onClick={() => window.location='main.php?go=inv'}>Инвентарь</button>
          <button onClick={() => window.location='main.php?go=ret'}>Настройки</button>
        </div>
        <div className="exit-link">
          {/* заменили <a> на <button> */}
          <button
            onClick={() => alert('Выход')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer'
            }}
            aria-label="Выход"
          >
            <img
              src="http://image.neverlands.ru/exit.gif"
              alt="Выход"
              width={15}
              height={15}
              style={{ verticalAlign: 'middle' }}
            />
          </button>
        </div>
      </div>
        
      {/* {/* Основной контент */}
      <div className="main-content">
        <Character userId={userId} firstName={firstName} />;
        {/* Левая колонка */}
        {/* <div className="left-column"> */}
          {/* Здесь можно вставить слоты или изображения */}
          {/* <div className="slot">🛡️</div> */}
          {/* <div className="slot">💍</div> */}
          {/* <div className="slot">🗡️</div> */}
        {/* </div> */}

        {/* Центральная часть */}
        {/* <div className="center-section"> */}
          {/* Здесь ваше изображение персонажа */}
          {/* <img src={characterData.avatar_url} alt="Персонаж" className="avatar" /> */}
        {/* </div> */}

        {/* Правая колонка */}
        {/* <div className="right-column"> */}
            {/* <div className="slot">🛡️</div> */}
            {/* <div className="slot">💍</div> */}
            {/* <div className="slot">🗡️</div> */}
          {/* Финансы и меню */}
          {/* <div className="money-info"> */}
            {/* <div>NV: 66923.01</div> */}
            {/* <div>Gold: 66$</div> */}
            {/* <div>DNV: 0.12</div>/ */}
          {/* </div> */}
          {/* <div className="menu-buttons"> */}
            {/* <button>�������</button> */}
            {/* <button>����� DNV</button> */}
            {/* <button>����-������</button> */}
            {/* Другие кнопки можно добавить здесь */}
          {/* </div> */}
        {/* </div> */}
      </div> 

      {/* Статистика и дополнительные блоки */}
      <div className="bottom-section">
        {/* Статистика */}
        <div className="stats">
            <p>Сила: {characterData.strength}</p>
            <p>Ловкость: {characterData.agility}</p>
            <p>Удача: {characterData.luck}</p>
            <p>Здоровье: {characterData.health}</p>
          {/* Другие показатели */}
        </div>
        {/* Можно добавить дополнительные блоки и сообщения */}
      </div>
    </div>
  );
}

export default GameInterface;