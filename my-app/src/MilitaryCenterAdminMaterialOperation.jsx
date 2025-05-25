import React,{useState} from "react";
import DatePicker from "react-datepicker";
import { ru } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";


const MilitaryCenterAdminMaterialOperation = ()=>{
    const [operationValue, setOperationValue] = useState(null)
    const [skladValue, setSkladValue] = useState(null)
    const [date, setDate] = useState(null);
    const [user, setUser] = useState(null);
    return(
        <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Инвентарь</th>
                        <th>Тип операции</th>
                        <th>Количество</th>
                        <th>Дата операции</th>
                        <th>Ответственный</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            1
                        </td>
                        <td>
                        <select
                  value={skladValue}
                  onChange={(e) => setSkladValue(e.target.value) }
                >
                  <option value="Склад №1">Склад №1</option>
                  <option value="Склад №2">Склад №2</option>
                  <option value="Склад №3">Склад №3</option>
                </select>
                        </td>
                        <td>
                        <select
                  value={operationValue}
                  onChange={(e) => setOperationValue(e.target.value) }
                >
                  <option value="Выдача">Выдача</option>
                  <option value="Возврат">Возврат</option>
                  <option value="Списание">Списание</option>
                </select>
                        </td>
                    <td>
                        <input type="number"/>
                    </td>
                    <td>
                        <DatePicker selected={date}
      onChange={(date) => setDate(date)}
      locale={ru}
      dateFormat="dd.MM.yyyy"/>
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
                    </tr>
                </tbody>
            </table>
           
    );
}
export default MilitaryCenterAdminMaterialOperation;