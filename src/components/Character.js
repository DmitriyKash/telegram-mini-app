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
    <div className="character_wrapper">
      {/* <h2>{characterData.name || `${firstName}`}</h2> */}

      <div className="middle_block">
        <div className="character_tab_content clearfix">

          {/* Верхние предметы */}
          <div className="character_things_block clearfix">
            {characterData.upperItems?.map((item, index) => (
              <img
                key={index}
                src={item.img}
                width="62"
                height={item.height || 65}
                title={item.tooltip}
                alt={item.alt || 'Предмет'}
              />
            ))}
          </div>

          {/* Аватар и кольца */}
          <div className="character_avatar_block">
            <div className="avatar_block">
              <img
                src={characterData.avatar_url || 'http://image.neverlands.ru/obrazy/male_17.gif'}
                width="115"
                height="255"
                alt="Аватар"
              />
            </div>
            <div className="things_slots clearfix">
              {characterData.rings?.map((ring, index) => (
                <img
                  key={index}
                  src={ring.img}
                  width="31"
                  height="31"
                  title={ring.tooltip}
                  alt={ring.alt || 'Кольцо'}
                />
              ))}
            </div>
          </div>

          {/* Нижние предметы */}
          <div className="character_things_block clearfix">
            {characterData.lowerItems?.map((item, index) => (
              <img
                key={index}
                src={item.img}
                width="62"
                height={item.height || 40}
                title={item.tooltip}
                alt={item.alt || 'Предмет'}
              />
            ))}
          </div>
        </div>

        {/* Статусы */}
        <div className="character_hp_block" style={{ height: '182px', marginTop: 0 }} />
        <div style={{ position: 'relative', left: '1px', top: '3px' }}>
          {characterData.beltSlots?.map((slot, index) => (
            <img
              key={index}
              src={slot.img}
              width="20"
              height="20"
              title={slot.tooltip}
              alt={slot.alt || 'Слот пояса'}
            />
          ))}
        </div>
        <div className="character_mp_block" style={{ height: '182px', marginTop: 0 }} />

        {/* HP/MP */}
        <div className="character_info_bottom">
          <div className="hp">{characterData.hp || '????/????'}</div>
          <div className="mp">{characterData.mp || '????/????'}</div>
        </div>
      </div>
    </div>
  );
}

export default Character;
