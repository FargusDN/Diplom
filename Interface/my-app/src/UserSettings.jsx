import React from "react";


const UserSettings = ()=>{
    return(
        <div>
            <div>
                <h4>Многофакторная аутентификация</h4>
                <button>ВЫКЛЮЧЕНА</button>
            </div>
            <div>
                <h4>Смена пароля</h4>
                <button>СМЕНИТЬ</button>
            </div>
        </div>
    );
}

export default UserSettings;