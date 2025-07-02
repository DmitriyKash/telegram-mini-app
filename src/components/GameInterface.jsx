import React from 'react';
import './GameInterface.css';

function GameInterface() {
  return (
    <div className="game-container">
      {/* Верхняя панель */}
      <div className="top-panel">
        <div className="player-info">
          <div className="nickname"><b>FeNoM</b> [17]</div>
          <div className="hp-bar">
            <div className="hp-progress" style={{ width: '70%' }}></div> {/* пример HP */}
          </div>
        </div>
        <div className="buttons">
          <button disabled>��� ��������</button>
          <button onClick={() => window.location='main.php?go=inv'}>���������</button>
          <button onClick={() => window.location='main.php?go=ret'}>���������</button>
        </div>
        <div className="exit-link">
          <a href="#" onClick={() => alert('Выход')}>Выход</a>
        </div>
      </div>

      {/* Основной контент */}
      <div className="main-content">
        {/* Левая колонка */}
        <div className="left-column">
          {/* Здесь можно вставить слоты или изображения */}
          <div className="slot">🛡️</div>
          <div className="slot">💍</div>
          <div className="slot">🗡️</div>
        </div>

        {/* Центральная часть */}
        <div className="center-section">
          {/* Здесь ваше изображение персонажа */}
          <img src="your_avatar.png" alt="Персонаж" className="avatar" />
        </div>

        {/* Правая колонка */}
        <div className="right-column">
          {/* Финансы и меню */}
          <div className="money-info">
            <div>NV: 66923.01</div>
            <div>Gold: 66$</div>
            <div>DNV: 0.12</div>
          </div>
          <div className="menu-buttons">
            <button>�������</button>
            <button>����� DNV</button>
            <button>����-������</button>
            {/* Другие кнопки */}
          </div>
        </div>
      </div>

      {/* Статистика и дополнительные блоки */}
      <div className="bottom-section">
        {/* Статистика */}
        <div className="stats">
          <p>����: 95 (47+48)</p>
          <p>��������: 46 (37+9)</p>
          {/* Другие показатели */}
        </div>
        {/* Другие блоки, сообщения, эффекты и т.п. */}
      </div>
    </div>
  );
}

export default GameInterface;