import React from "react";
import "./MilitaryCenterUserCard.css";
import { Link } from 'react-router-dom';
import { useState } from "react";
import Analitics from "./Analytics"


const MilitaryCenterUserCard = ({isProfile,user})=>{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openMilitaryModal = () => setIsModalOpen(true);
  const closeMilitaryModal = () => setIsModalOpen(false);
    return(
        <div className={`userMilitaryCard ${isProfile ? 'profile' : ''}`}>
            <h4>{user.role+" "}{user.name}</h4>
            <div>
                
            </div>
            <div className="userPhoto">
                <img src={user.photo} width="100%" height="100%"/>
            </div>
            <div>
                <h4>Звание - {user.rank}</h4>
            </div>
            {!isProfile&&(
              <div>
              {user.role == "Преподаватель" &&(
                  <button className="btn" onClick={openMilitaryModal}>Электронный журнал</button>
              )}
              {user.role == "Студент" &&(
                  <button className="btn" onClick={openMilitaryModal}>Электронный журнал</button>
              )}
              {user.role == "Администратор" &&(
                  <div>
                      <button className="btn" onClick={openMilitaryModal}>Электронный журнал</button>
                      <Link to="/Militaryadmin" className="btn">Администрирование</Link>
                  </div>
                  
              )}
              
          </div>
            )}
            
            {isModalOpen && (
        <div className="military-modal-overlay" onClick={closeMilitaryModal}>
          <div 
            className="military-modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="military-modal-close-btn"
              onClick={closeMilitaryModal}
            >
              ×
            </button>
            <Analitics user={user}/>
          </div>
        </div>
      )}
        </div>
        
    );
}
export default MilitaryCenterUserCard;