// Portfolio.js
import React, { useState } from 'react';
import ModalAch from './ModalAch';
import './Portfolio.css';
import Header from './Header';
import Footer from './Footer';
import AchLogo from './imgs/userLogo.jpg'

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('Научные');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievements, setAchievements] = useState({
    Научные: [
        {
            title:"Грамота",
            type:"Благодарственная",
            event:"За волонтерство",
            date: "14.04.2025",
            image: AchLogo
        },
        {
            title:"Грамота",
            type:"1 место",
            event:"Олимпиада по математике",
            date: "14.04.2025"
        },
        {
            title:"Грамота",
            type:"2 место",
            event:"Олимпиада по информатике",
            date: "14.04.2025"
        },
        {
            title:"Диплом",
            type:"Участник",
            event:"Конкурс красоты",
            date: "14.04.2025"
        },
        {
            title:"Грамота",
            type:"Благодарственная",
            event:"За волонтерство",
            date: "14.04.2025"
        },
        {
            title:"Грамота",
            type:"Благодарственная",
            event:"За волонтерство",
            date: "14.04.2025"
        },
    ],
    Спортивные: [],
    Художественные: [],
    Прочее: []
  });

  const tabs = ['Научные', 'Спортивные', 'Художественные', 'Прочее'];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...achievements[activeTab]].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc' 
        ? new Date(aValue) - new Date(bValue) 
        : new Date(bValue) - new Date(aValue);
    }
    
    if (sortConfig.key === 'place') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return sortConfig.direction === 'asc' 
      ? aValue.localeCompare(bValue) 
      : bValue.localeCompare(aValue);
  });

  const handleAddAchievement = (newAchievement) => {
    setAchievements(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newAchievement]
    }));
    setShowAddModal(false);
  };

  return (
    <div className="portfolio-container">
      
      <div className='portfolio_body'>
      <div className="tabs-container">
      
      {tabs.map(tab => (
        <button
          key={tab}
          className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>

    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('title')}>
              Название {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('type')}>
              Тип/Место {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('event')}>
              Мероприятие {sortConfig.key === 'event' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('date')}>
              Дата {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index} onClick={() => setSelectedAchievement(item)}>
              <td>{item.title}</td>
              <td>{item.type}</td>
              <td>{item.event}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <button className="add-btn" onClick={() => setShowAddModal(true)}>
      Добавить достижение
    </button>
      </div>
      

      {showAddModal && (
        <AddAchievementModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddAchievement}
        />
      )}

      {selectedAchievement && (
        <AchievementDetailsModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}

    </div>
  );
};

// Модальное окно добавления
const AddAchievementModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    event: '',
    date: '',
    image: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;
    onSubmit({
      ...formData,
      id: Date.now()
    });
  };

  return (
    <ModalAch isOpen onClose={onClose} title="Добавить достижение" width="700px">
      <form onSubmit={handleSubmit} className="achievement-form">
      <div className="form-grid">
    <div className="form-row">
      <label>Название <span className="required-star">*</span></label>
      <input
        type="text"
        className="form-input"
        placeholder="Введите название"
        required
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />
    </div>

    <div className="form-row">
      <label>Тип/Место</label>
      <input
        type="text"
        className="form-input"
        placeholder="Укажите тип или место"
        onChange={(e) => setFormData({...formData, type: e.target.value})}
      />
    </div>

    <div className="form-row">
      <label>Мероприятие</label>
      <input
        type="text"
        className="form-input"
        placeholder="Укажите мероприятие"
        onChange={(e) => setFormData({...formData, event: e.target.value})}
      />
    </div>

    <div className="form-row">
      <label>Дата <span className="required-star">*</span></label>
      <input
        type="date"
        className="form-input date-input"
        required
        onChange={(e) => setFormData({...formData, date: e.target.value})}
      />
    </div>

    <div className="form-row file-upload">
      <label>Прикрепить файл</label>
      <div className="file-input-wrapper">
        <input
          type="file"
          className="file-input"
          accept="image/*"
          onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
        />
        <span className="file-name">
          {formData.image ? formData.image.name : "Файл не выбран"}
        </span>
        <button type="button" className="browse-btn">Выбрать файл</button>
      </div>
    </div>
  </div>

  <button type="submit" className="submit-btn">Сохранить</button>
      </form>
    </ModalAch>
  );
};

// Модальное окно просмотра
const AchievementDetailsModal = ({ achievement, onClose }) => (
  <ModalAch isOpen onClose={onClose}>
    <h2>{achievement.title}</h2>
    <div className="details-content">
      <p><strong>Тип:</strong> {achievement.type}</p>
      <p><strong>Мероприятие:</strong> {achievement.event}</p>
      <p><strong>Дата:</strong> {achievement.date}</p>
      {achievement.image && (
        <img 
          src={achievement.image} 
          alt="Документ" 
          className="achievement-image"
        />
      )}
    </div>
  </ModalAch>
);

export default Portfolio;