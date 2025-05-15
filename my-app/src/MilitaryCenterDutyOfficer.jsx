import React from "react";
import Image1 from "./imgs/dutyOfficer.jpg"
import "./MilitaryCenterDutyOfficer.css"

const MilitaryCenterMainDutyOfficer = () =>{
    return(
        <div className="dutyOfficer">
            <h4>Дежурный</h4>
            <div>
                
            </div>
            <div className="dutyFoto" style={{backgroundImage: Image1}}>
                
            </div>
            <div>
                <h4>Информация о дежурном</h4>
                <p>Прапорщик</p>
                <p>Шматко В. В.</p>
            </div>
        </div>
    );
}

export default MilitaryCenterMainDutyOfficer;