import React, {useState} from "react";
import DatePicker from "react-datepicker";
import { ru } from 'date-fns/locale';
import "./MilitaryCenterMaterialAdd.css";


const MilitaryCenterMaterialAdd = ()=>{
    const [operationValue, setOperationValue] = useState(null)
    const [skladValue, setSkladValue] = useState(null)
    const [nameValue, setNameValue] = useState(null)
    const [date, setDate] = useState(null);
    const [user, setUser] = useState(null);
    return(
        <table className="addMaterial">
                <thead>
                    <tr>
                        <th>Склад</th>
                        <th>Название</th>
                        <th>Категория</th>
                        <th>Количество</th>
                        <th>Ответственный</th>
                        <th>Дата</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                <td>
                        <select
                >
                  <option value="Склад 1">Склад 1</option>
                  <option value="Склад 2">Склад 2</option>
                  <option value="Склад 3">Склад 3</option>
                </select>
                        </td>
                
                       
                        <td>
                            <input type="text" value={nameValue} onChange={(e)=>setNameValue(e.target.value)}/>
                        </td>
                        <td>
                        <select
                  value={skladValue}
                  onChange={(e) => setSkladValue(e.target.value) }
                >
                  <option value="Оружие">Оружие</option>
                  <option value="Форма">Форма</option>
                  <option value="Снаряжение">Снаряжение</option>
                </select>
                        </td>
                        <td>
                          <input type="number"/>
                        </td>
                        <td>
                    <select
                  value={user}
                  onChange={(e) => setUser(e.target.value) }
                >
                  <option value="Татаров М.О">Татаров М.О</option>
                  <option value="Попов А.Н">Попов А.Н</option>
                  <option value="Иванов И.И">Иванов И.И</option>
                </select>
                    </td>
                    <td>
                        <DatePicker selected={new Date()}
      onChange={(date) => setDate(date)}
      locale={ru}
      dateFormat="dd.MM.yyyy"/>
                    </td>
                    
                    </tr>
                </tbody>
          </table>
    );
}
export default MilitaryCenterMaterialAdd;