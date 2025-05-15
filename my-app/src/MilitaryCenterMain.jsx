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

const MilitaryCenterMain = ()=>{
  const topSectionRef = useRef(null);
  const schedulesSectionRef = useRef(null);
  const schedulesDutySectionRef = useRef(null);
  const [activeRef, setActiveRef] = useState('topSectionRef');
  
  
  function scrollToTop(direction){
    console.log(topSectionRef);
    topSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    changeActiveRef(direction);
  };

  function changeActiveRef(direction){
    switch({activeRef}){
      case "topSectionRef":
        setActiveRef("schedulesSectionRef");
      break;
      case "schedulesSectionRef":
        switch(direction){
          case "up": setActiveRef("topSectionRef"); break;
          case "down": setActiveRef("schedulesDutySectionRef"); break;
          default: break;
        }
      break;
      case "schedulesDutySectionRef":
        setActiveRef("schedulesSectionRef");
      break;
      default: break;
    }
  }

  function scrollToSchedules(direction){ 
    console.log(schedulesSectionRef);
    schedulesSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    changeActiveRef(direction);
  };

  function scrollToDutySchedules(direction){
    console.log(schedulesDutySectionRef);
    schedulesDutySectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    changeActiveRef(direction);
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
          { group: "101", subject: "Тактика", room: "301", teacher: "Иванов А.В." },
          { group: "102", subject: "Строевая подготовка", room: "Спортзал", teacher: "Петров С.И." }
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
                <div ref={topSectionRef}><MilitaryNewsSlider items={items}/></div>
                {activeRef == "topSectionRef" &&(
                <div className="MilitaryNav">
                    <div className="arrowbtn arrowbtn-up"></div>
                    <div className="arrowbtn arrowbtn-down" onClick={scrollToSchedules("down")}></div>
                </div>)}
                {activeRef == "schedulesSectionRef" &&(
                <div className="MilitaryNav">
                    <div className="arrowbtn arrowbtn-up" onClick={scrollToTop("up")}></div>
                    <div className="arrowbtn arrowbtn-down" onClick={scrollToDutySchedules("down")}></div>
                </div>)}
                {activeRef == "schedulesDutySectionRef" &&(
                <div className="MilitaryNav">
                    <div className="arrowbtn arrowbtn-up" onClick={scrollToTop("up")}></div>
                    <div className="arrowbtn arrowbtn-down"></div>
                </div>)}
                <div className="schedules">
                    <div ref={schedulesSectionRef}><MilitarySchedule scheduleData={scheduleData}/></div>
                    <div ref={schedulesDutySectionRef}><MilitaryDutySchedule dutySchedule={dutySchedule}/></div>
                </div>
                
            </main>
            <Footer/>
        </div>
    );
}
export default MilitaryCenterMain;