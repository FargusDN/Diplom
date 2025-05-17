import React,{useState} from "react";
import MilitaryCenterAdminMaterialOperation from "./MilitaryCenterAdminMaterialOperation";
import "./MilitaryCenterMaterial.css"


const MilitaryCenterMaterial =()=>{
    const [isModalOpen, setIsModalOpen] = useState(false);
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