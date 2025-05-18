import React,{useState} from "react";
import MilitaryCenterAdminMaterialOperation from "./MilitaryCenterAdminMaterialOperation";
import "./MilitaryCenterMaterial.css"

import "react-datepicker/dist/react-datepicker.css";
import MilitaryCenterMaterialAdd from "./MilitaryCenterMaterialAdd";


const MilitaryCenterMaterial =()=>{
 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMaterial, setIsAddMaterial] = useState(false);
   const [userName, setUserName] = useState(null);
    const materials=[
        {
        id:1,
        name:"Противогазы",
        category:"Снаряжение",
        count: 20,
        defendant: "Татаров М.О.",
        lastCheck: "15-05-2025",
    },
    {
        id:2,
        name:"Масхалат",
        category:"Снаряжение",
        count: 10,
        defendant: "Татаров М.О.",
        lastCheck: "15-05-2025",
    },
    {
        id:3,
        name:"Автомат АК-47",
        category:"Оружие",
        count: 5,
        defendant: "Татаров М.О.",
        lastCheck: "15-05-2025",
    },
    {
        id:4,
        name:"Граната учебная",
        category:"Оружие",
        count: 200,
        defendant: "Татаров М.О.",
        lastCheck: "15-05-2025",
    },
    {
        id:5,
        name:"Патроны 7x62mm",
        category:"Снаряжение",
        count: 2000,
        defendant: "Татаров М.О.",
        lastCheck: "15-05-2025",
    },
];

    return(
        <div className="MilitaryMaterial">
            <div className="search-bar">
                <input type="text" placeholder="Поиск материала..." />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Категория</th>
                        <th>Количество</th>
                        <th>Ответственный</th>
                        <th>Дата последней проверки</th>
                        <th>Операции</th>
                    </tr>
                </thead>
                <tbody>
      {materials.map(user => (
          <tr key={user.id}>
            <td>
              {user.id}
            </td>
            <td>
              {user.name}
            </td>
            <td>
              {user.category}
            </td>
            
            <td>
              {user.count}
            </td>
            <td>
              {user.defendant}
            </td>
            <td>
              {user.lastCheck}
            </td>
            <td>
            <button onClick={()=>{
                setUserName(user.defendant);
                console.log("click");
                setIsModalOpen(true);
            }}>Операции с инвентарем</button>
            </td>
          </tr>
        ))}
      </tbody>
            </table>
            <div className="pagination-container">
  <nav className="military-pagination">
    <ul className="pagination-list">
      <li className="page-item disabled">
        <button className="page-link prev-next" aria-label="Previous">
          &laquo;
        </button>
      </li>
      <li className="page-item active">
        <button className="page-link">1</button>
      </li>
      <li className="page-item">
        <button className="page-link">2</button>
      </li>
      <li className="page-item">
        <button className="page-link">3</button>
      </li>
      <li className="page-item">
        <button className="page-link">4</button>
      </li>
      <li className="page-item">
        <button className="page-link">5</button>
      </li>
      <li className="page-item">
        <button className="page-link">...</button>
      </li>
      <li className="page-item">
        <button className="page-link">12</button>
      </li>
      <li className="page-item">
        <button className="page-link prev-next" aria-label="Next">
          &raquo;
        </button>
      </li>
    </ul>
  </nav>
            </div>
            <button className="submit-btn" onClick={() => setIsAddMaterial(true)}>Добавить запись</button>


{isAddMaterial && (
        <div className="military-modal-overlay" onClick={() => setIsAddMaterial(false)}>
          <div className="military-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setIsAddMaterial(false)}>&times;</span>
            <h2>Добавить новую запись</h2>
              <MilitaryCenterMaterialAdd/>
              <button type="submit" className="submit-btn">
                Добавить
              </button>
            
            </div>
        </div>
      )}

           
           
           {isModalOpen && (
  <div 
    className="military-modal-overlay" 
    onClick={() => setIsModalOpen(false)} // Исправлено здесь
  >
    <div 
      className="military-modal-content" 
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        className="military-modal-close-btn"
        onClick={() => setIsModalOpen(false)} // И здесь
      >
        ×
      </button>
      <MilitaryCenterAdminMaterialOperation/>
    </div>
  </div>
)}
        </div>
        
    );
}
export default MilitaryCenterMaterial;