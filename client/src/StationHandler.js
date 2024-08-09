export const handleStationButtonClick = (mapRef, stationPlacemarks, filters) => {
  clearStations(mapRef, stationPlacemarks);
  fetchStationData(mapRef, stationPlacemarks, filters);
};

const fetchStationData = (mapRef, stationPlacemarks, filters) => {
  fetch('http://localhost:5000/api/Station')
      .then(response => response.json())
      .then(data => {
          const filteredData = data.filter(coord => {
              const matchesAll = filters.includes('all');

              const matchesConnector1 = filters.includes('connector1') && coord.connectors_total === 1;
              const matchesConnector2 = filters.includes('connector2') && coord.connectors_total === 2;
              const matchesConnector3 = filters.includes('connector3') && coord.connectors_total === 3;

              const matchesSlow = filters.includes('slow') && coord.evse_type === false; 
              const matchesFast = filters.includes('fast') && coord.evse_type === true; 

              if (matchesAll) return true;

              const connectorCriteria = [matchesConnector1, matchesConnector2, matchesConnector3].some(Boolean);
              const typeCriteria = matchesSlow || matchesFast;

              if (connectorCriteria && typeCriteria) {
                  return true;
              }

              if (connectorCriteria) {
                  return true;
              }


              if (typeCriteria) {
                  return true;
              }

              return false;
          });

          filteredData.forEach(coord => {
              const placemark = new window.ymaps.Placemark(
                  [coord.latitude, coord.longitude],
                  { hintContent: coord.adress }
              );

              stationPlacemarks.current.push(placemark);
              mapRef.current.geoObjects.add(placemark);
          });
      })
      .catch(error => {
          console.error('Error fetching station data:', error);
      });
};


const clearStations = (mapRef, objectsAdded1) => {
  objectsAdded1.current.forEach((placemark) => {
      mapRef.current.geoObjects.remove(placemark);
  });
  objectsAdded1.current = [];
};
