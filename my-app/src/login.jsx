import React from 'react';
import './Login.css';

const Login = ({ onClose }) =>{
    const handleFormClick = (e) => {
        e.stopPropagation(); // Предотвращаем закрытие при клике на саму форму
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Обработка логина
      };
    return(
        <div className="modal-content" onClick={handleFormClick}>
            <button 
                className="close-button" 
                onClick={onClose}
                aria-label="Закрыть форму авторизации"
            >
                &times;
            </button>
        <form className='LoginForm_form' onSubmit={handleSubmit}>
        <div className='LoginForm_form_Name'><p>Авторизация</p></div>
                <div className='LoginForm_form_fields'>
                    <div className='LoginForm_form_fields_field'><input type='email' placeholder='Логин'/></div>
                    <div className='LoginForm_form_fields_field'><input type='password' placeholder='Пароль'/>
                    </div>
                </div>
                <div className='LoginForm_form_checkbox'>
                    <input id='RememberMe' type='checkbox'/><label htmlFor='RememberMe'>Запомнить меня</label>
                </div>
                <div className='LoginForm_form_href'>
                    <a href='/'> Получить пароль (для студентов)</a>
                </div>
        <div className='LoginForm_form_button'>
            <button className='LoginForm_form_button_submit' type='submit'>Вход</button>
        </div>
        </form>
      </div>
    );
};
export default Login;