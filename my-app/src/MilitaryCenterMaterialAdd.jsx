import React, {useState} from "react";
import DatePicker from "react-datepicker";
import { ru } from 'date-fns/locale';


const MilitaryCenterMaterialAdd = ()=>{
    const [operationValue, setOperationValue] = useState(null)
    const [skladValue, setSkladValue] = useState(null)
    const [nameValue, setNameValue] = useState(null)
    const [date, setDate] = useState(null);
    const [user, setUser] = useState(null);
    return(
        <table>
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Категория</th>
                        <th>Количество</th>
                        <th>Ответственный</th>
                        <th>Дата последней проверки</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
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
                        <DatePicker selected={date}
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