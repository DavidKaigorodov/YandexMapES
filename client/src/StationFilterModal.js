import React, { useState } from 'react';
import './App.css';

const StationFilterModal = ({ isOpen, onClose, onApply }) => {
    const [selectedFilter, setSelectedFilter] = useState('all'); // Устанавливаем значение по умолчанию

    const handleRadioChange = (e) => {
        setSelectedFilter(e.target.value);
    };

    const handleSubmit = () => {
        // Передаем только выбранный фильтр
        onApply([selectedFilter]); // Мы передаем массив с единственным выбранным фильтром
        onClose(); // Закрываем модальное окно после применения
    };

    const handleClearFilters = () => {
        setSelectedFilter('all'); // Сбрасываем выбор, устанавливая 'all' как начальное значение
        onApply([]); // Очищаем фильтры
        onClose(); // Закрываем модальное окно
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Выберите критерии для отображения станций</h2>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="all"
                            checked={selectedFilter === 'all'}
                            onChange={handleRadioChange}
                        />
                        Показать все
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            value="connector1"
                            checked={selectedFilter === 'connector1'}
                            onChange={handleRadioChange}
                        />
                        Показать по количеству портов - 1
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            value="connector2"
                            checked={selectedFilter === 'connector2'}
                            onChange={handleRadioChange}
                        />
                        Показать по количеству портов - 2
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            value="connector3"
                            checked={selectedFilter === 'connector3'}
                            onChange={handleRadioChange}
                        />
                        Показать по количеству портов - 3
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            value="slow"
                            checked={selectedFilter === 'slow'}
                            onChange={handleRadioChange}
                        />
                        Показать медленные зарядные станции
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            value="fast"
                            checked={selectedFilter === 'fast'}
                            onChange={handleRadioChange}
                        />
                        Показать быстрые зарядные станции
                    </label>
                </div>
                <button onClick={handleSubmit}>Применить</button>
                <button onClick={handleClearFilters}>Очистить фильтры</button>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default StationFilterModal;
