const handleZoneButtonClick = (mapRef, zoneRectangles, setZoneRectangles, objectsAdded, setObjectsAdded, settings) => {
  if (!objectsAdded) {
      fetchZoneData(mapRef, setZoneRectangles, settings);
      setObjectsAdded(true);
  } else {
      clearZones(mapRef, zoneRectangles, setZoneRectangles);
      setObjectsAdded(false);
  }
};

const clearZones = (mapRef, zoneRectangles, setZoneRectangles) => {
  if (mapRef.current) {
      zoneRectangles.forEach((rectangle) => {
          mapRef.current.geoObjects.remove(rectangle);
      });
      setZoneRectangles([]);
  }
};

const fetchZoneData = (mapRef, setZoneRectangles, settings) => {
  fetch('http://localhost:5000/api/Zone')
      .then(response => response.json())
      .then(data => {
          const polygonLayers = data.map(item => {
              const { polygon, rating } = item;

              if (polygon && polygon.coordinates) {
                  // Меняем местами долготу и широту
                  const swappedCoordinates = polygon.coordinates.map(coord => 
                      coord.map(([lon, lat]) => [lat, lon]) // Поменять местами
                  );

                  return processPolygon(swappedCoordinates, rating, settings); // Передаем переменные
              } else {
                  console.error('Некорректные данные полигона:', item);
                  return null;
              }
          }).filter(layer => layer !== null);

          if (mapRef.current) {
              const newZoneRectangles = [];
              polygonLayers.forEach(layer => {
                  mapRef.current.geoObjects.add(layer);
                  newZoneRectangles.push(layer);
              });

              setZoneRectangles(newZoneRectangles);
          }
      })
      .catch(error => {
          console.error('Ошибка при получении данных полигонов:', error);
      });
};

const processPolygon = (coordinates, rating, settings) => {
  const color = getRatingColor(rating, settings); // Изменение цвета в зависимости от настроек
  try {
      return new window.ymaps.GeoObject({
          geometry: {
              type: 'Polygon',
              coordinates: coordinates,
          },
          properties: {
              hintContent: `Рейтинг: ${rating}`,
              balloonContent: `Рейтинг: ${rating}`,
          },
      }, {
          fillColor: color,
          strokeColor: '#0000ff',
          opacity: settings.opacity, // Используем прозрачность из настроек
      });
  } catch (error) {
      console.error('Ошибка при создании полигона:', error);
      return null;
  }
};

const getRatingColor = (rating, settings) => {
  if (rating === 0) {
      return settings.color0; // Используем цвет для рейтинга 0
  } else if (rating > 0 && rating <= 0.5) {
      return settings.color0_5; // Используем цвет для рейтинга от 0 до 0.5
  } else {
      return settings.color5; // Используем цвет для рейтинга 5 и выше
  }
};

export { handleZoneButtonClick, clearZones, fetchZoneData, processPolygon, getRatingColor };
