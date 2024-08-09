import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { handleFileInputChange, handleFileInputChange2 } from './addFiles.js';
import { handleZoneButtonClick } from './zoneHandler.js';
import { handleStationButtonClick } from './StationHandler.js';
import SettingsModal from './SettingsModal';
import StationFilterModal from './StationFilterModal';  // Импортируйте ваш новый модуль

const YandexMap = () => {
    const [mapInitiated, setMapInitiated] = useState(false);
    const mapRef = useRef(null);
    const stationPlacemarks = useRef([]);
    const [zoneRectangles, setZoneRectangles] = useState([]);
    const [objectsAdded, setObjectsAdded] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [filterModalOpen, setFilterModalOpen] = useState(false); // Состояние для фильтрации
    const [currentFilter, setCurrentFilter] = useState(null); // Хранение выбранного фильтра
    const [polygonSettings, setPolygonSettings] = useState({
        color0: 'rgba(255, 0, 0, 0.5)',
        color0_5: 'rgba(255, 255, 0, 0.5)',
        color5: 'rgba(0, 255, 0, 0.5)',
        opacity: 0.5,
    });

  useEffect(() => {
    const apiKey = 'a0325676-108c-4a26-8b08-8ddbcf9ee724';
    const initializeMap = () => {
      if (!window.ymaps) {
        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
        script.onload = () => {
          if (mapInitiated) return;
          const mapContainer = document.getElementById('map');
          if (mapContainer) {
            mapContainer.innerHTML = '';
            window.ymaps.ready(() => {
              mapRef.current = new window.ymaps.Map("map", {
                center: [55.76, 37.64],
                zoom: 10,
                controls: []
              });
              mapRef.current.controls.add('zoomControl', { position: { top: 10, left: 10 } });
              mapRef.current.controls.add('typeSelector', { position: { top: 10, right: 10 } });
              setMapInitiated(true);
            });
          }
        };

        if (!document.querySelector('script[src^="https://api-maps.yandex.ru/2.1/"]')) {
          document.body.appendChild(script);
        }
      }
    };

    initializeMap();
  }, [mapInitiated]);

  const handleZoneButtonClick1 = () => {
    handleZoneButtonClick(mapRef, zoneRectangles, setZoneRectangles, objectsAdded, setObjectsAdded, polygonSettings);
  };

  const handleStationButtonClick1 = () => {
    setFilterModalOpen(true); // Открытие модального окна фильтрации
};
const applyFilter = (filters) => {
  setCurrentFilter(filters);
  handleStationButtonClick(mapRef, stationPlacemarks, filters); // Передаем выбранные фильтры в обработчик
};

  const handleSaveSettings = (settings) => {
    setPolygonSettings(settings);
    updatePolygonsColors(settings); // Обновление цветов полигонов
  };

  const updatePolygonsColors = (settings) => {
    zoneRectangles.forEach(rectangle => {
      const rating = parseFloat(rectangle.properties.get('balloonContent').split(': ')[1]); // Извлекаем рейтинг
      rectangle.options.set({
        fillColor: getRatingColor(rating, settings),
        opacity: settings.opacity,
      });
    });
  };

  const getRatingColor = (rating, settings) => {
    if (rating === 0) {
      return settings.color0;
    } else if (rating > 0 && rating <= 0.5) {
      return settings.color0_5;
    } else {
      return settings.color5;
    }
  };
  

  return (
    <div className="body">
      <div className="header">
        Добавте ЭЗС:
        <input
          type="file"
          className="header-button"
          onChange={handleFileInputChange}
        />
        <br></br>
        Добавте зоны:
        <input
          type="file"
          className="header-button"
          onChange={handleFileInputChange2}
        />
      </div>

      <div className='content'>
        <div className="controls">
          <div className='baton' onClick={handleStationButtonClick1}>Показать станции</div>
          <div className='baton' onClick={handleZoneButtonClick1}>Показать зоны</div>
          <div className='baton' style={{ textAlign: 'center' }} onClick={() => setSettingsModalOpen(true)}>
    Настройки полигонов
</div>

        </div>
        <div className="map" id="map"></div>

        {/* Модальное окно для фильтрации */}
        <StationFilterModal
                    isOpen={filterModalOpen}
                    onClose={() => setFilterModalOpen(false)}
                    onApply={applyFilter}
                />
        {/* Модальное окно */}
        <SettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          onSaveSettings={handleSaveSettings}
        />
      </div>
    </div>
  );
};

export default YandexMap;
