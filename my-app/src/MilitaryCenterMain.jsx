import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import LogoHeader from './imgs/MTC.png'
import './MilitaryCenterMain.css'
import MilitaryNewsSlider from "./MilitaryNewsSlider";
import Image1 from './imgs/Frame-819.webp'
import Image2 from './imgs/Frame-820.webp'
import MilitarySchedule from "./MilitarySchedule";
import MilitaryDutySchedule from "./MilitaryDutySchedule";
import MilitaryCenterMainDutyOfficer from "./MilitaryCenterDutyOfficer";
import { useRef } from "react";
import Image3 from "./imgs/userLogo.jpg"
import MilitaryCenterUserCard from "./MilitaryCenterUserCard";

const MilitaryCenterMain = ()=>{

  
  
    const user={
      name:"Чикалев Илья Максимович",
      rank:"Рядовой",
      role:"Студент",
      photo: "./imgs/userLogo.jpg"
    };

    const mockUser = {
        name: 'Чикалев Илья Максимович',
        photo: '/default-avatar.jpg'
      };
      const items=[
        {
          date: "15.02.2024",
          title: "Смотр строевой подготовки",
          description: "Состоялся ежегодный смотр строевой подготовки курсантов...",
          image: Image1
        },
        {
          date: "14.02.2024",
          title: "Новые программы обучения",
          description: "Введены новые программы по кибербезопасности...",
          image: Image2
        },
        {
            date: "15.02.2024",
            title: "Смотр строевой подготовки",
            description: "Состоялся ежегодный смотр строевой подготовки курсантов...",
            image: Image1
          },
          {
            date: "14.02.2024",
            title: "Новые программы обучения",
            description: "Введены новые программы по кибербезопасности...",
            image: Image2
          },
          {
            date: "15.02.2024",
            title: "Смотр строевой подготовки",
            description: "Состоялся ежегодный смотр строевой подготовки курсантов...",
            image: Image1
          },
          {
            date: "14.02.2024",
            title: "Новые программы обучения",
            description: "Введены новые программы по кибербезопасности...",
            image: Image2
          },
        // ... другие новости
      ]
      const scheduleData={
        "ПН": [
          { group: "8:30", subject: "Тактика", room: "301", teacher: "Иванов А.В." },
          { group: "10:10", subject: "Строевая подготовка", room: "Спортзал", teacher: "Петров С.И." }
        ],
        "ВТ": [
          { group: "101", subject: "Огневая подготовка", room: "Тир", teacher: "Сидоров В.К." }
        ],
        // ... остальные дни
      }
      const dutySchedule={
        "Утро": [
          { 
            time: "06:00-09:00", 
            responsible: "Иванов А.В.", 
            position: "Дежурный по роте",
            location: "КПП №1",
            task: "Контроль входа/выхода"
          }
        ],
        "День": [
          { 
            time: "12:00-15:00", 
            responsible: "Петров С.И.", 
            position: "Начальник караула",
            location: "Оружейная комната",
            task: "Проверка оружия"
          }
        ],
        // ... другие периоды
      }
    return(
        <div>
            <Header LogoHeader={LogoHeader} user={mockUser} isMillitary={true}/>
            <main className="MilitaryCenter">
              <MilitaryCenterMainDutyOfficer/>
              <MilitaryCenterUserCard user={user} />
                <MilitaryNewsSlider items={items}/> 
                <div className="schedules">
                    <MilitarySchedule scheduleData={scheduleData}/>
                    <MilitaryDutySchedule dutySchedule={dutySchedule}/>
                </div>
                
            </main>
            <Footer/>
        </div>
    );
}
export default MilitaryCenterMain;