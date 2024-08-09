import React, { useState } from 'react';

const SettingsModal = ({ isOpen, onClose, onSaveSettings }) => {
  const [color0, setColor0] = useState('#a19d26');  // Измените начальные значения на желаемые цвета
  const [color0_5, setColor0_5] = useState('#bf8282');
  const [color5, setColor5] = useState('#88b1dd');
  const [opacity, setOpacity] = useState(0.5); // Измените начальное значение прозрачности

  const handleSave = () => {
    const settings = {
      color0,
      color0_5,
      color5,
      opacity,
    };
    onSaveSettings(settings);
    onClose();
  };

  const handleDownloadCSV = () => {
    const csvContent = 
      `${color0},${color0_5},${color5},${opacity}\n`;
    
    const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'polygon_settings.csv');
    document.body.appendChild(link);
    link.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const lines = content.split(',').map(line => line.trim()); // Изменено на разбивку по запятой
        if (lines.length === 4) {
          setColor0(lines[0]);
          setColor0_5(lines[1]);
          setColor5(lines[2]);
          const parsedOpacity = parseFloat(lines[3]);
          setOpacity(isNaN(parsedOpacity) ? 0.6 : parsedOpacity); // Убедитесь, что значение корректное
        } else {
          console.error("Неверный формат файла. Должно быть 4 значения.");
          alert("Неверный формат файла. Убедитесь, что файл содержит 4 значения.");
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Настройки полигонов</h2>
        <div>
          <label>
            Цвет для рейтинга 0:
            <input type="color" value={color0} onChange={(e) => setColor0(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Цвет для рейтинга от 0 до 0.5:
            <input type="color" value={color0_5} onChange={(e) => setColor0_5(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Цвет для рейтинга 5 и выше:
            <input type="color" value={color5} onChange={(e) => setColor5(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Прозрачность:
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(e.target.value)}
            />
          </label>
        </div>
        <button onClick={handleSave}>Сохранить настройки</button>
        <button onClick={handleDownloadCSV}>Скачать настройки в CSV</button>
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
          <span>Загрузить настройки из CSV</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
