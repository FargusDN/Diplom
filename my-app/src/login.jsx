import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Импортируем Axios
import './Login.css';
import eyeImg from "./imgs/menu_eye.png";


const API_BASE_URL = 'http://localhost:8000';

const Login = ({ onClose }) => {
    const [currentForm, setCurrentForm] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [resetLogin, setResetLogin] = useState('');
    const [error, setError] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 

    const [isMfaStage, setIsMfaStage] = useState(false);
    const [code, setCode] = useState(Array(6).fill(''));
    const [userEmail, setUserEmail] = useState('');
    const inputsRef = useRef([]); 
    const [mfaSessionToken, setMfaSessionToken] = useState(null); 

    const [isShow, setIsShow] = useState(false);



    useEffect(() => {
        if (isMfaStage && inputsRef.current[0]) {
            inputsRef.current[0].focus();
        }
    }, [isMfaStage]);


    const handleCodeChange = (index, value) => {
        const newCode = [...code];

        newCode[index] = value.slice(-1);
        setCode(newCode);


        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus(); 
        }

        if (newCode.every(c => c !== '') && index === 5) {
            handleMfaSubmit(newCode.join(''));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        setIsLoading(true); 

        try {
 
            const response = await axios.post(`${API_BASE_URL}/auth`, {
                username: username,
                password: password,
            });


            const data = response.data;

            if (data.requires_mfa) {

                setIsMfaStage(true);
                setCurrentForm("mfa");
                setUserEmail(data.email_for_mfa || userEmail);
                setMfaSessionToken(data.mfa_session_token);
            } else {

                localStorage.setItem('authToken', data.access_token); 

                window.location.href = "/profile"; 
                onClose(); 
            }

        } catch (err) {

            if (err.response) {

                setError(err.response.data.detail || "Ошибка авторизации");

                if (err.response.status === 429) {

                   setError(`Слишком много попыток. Повторите через ${err.response.data.retry_after} секунд.`);
                }

            } else if (err.request) {
                setError("Не удалось подключиться к серверу авторизации.");
            } else {
                setError("Произошла непредвиденная ошибка.");
                console.error("Axios error:", err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleMfaSubmit = async (fullCode) => {
         if (!fullCode) {
             fullCode = code.join('');
         }

        if (fullCode.length !== 6) {
            setError("Введите полный код.");
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/mfa`, {
                code: fullCode,
                mfa_session_token: mfaSessionToken
            });

            const data = response.data;
            localStorage.setItem('authToken', data.access_token);

            window.location.href = "/profile";
            onClose();

        } catch (err) {
            if (err.response) {
                setError(err.response.data.detail || "Ошибка подтверждения кода.");
            } else if (err.request) {
                 setError("Не удалось подключиться к серверу авторизации для подтверждения кода.");
            } else {
                 setError("Произошла непредвиденная ошибка при подтверждении кода.");
                 console.error("Axios error:", err.message);
            }
            
            setCode(Array(6).fill(''));
            inputsRef.current[0]?.focus(); 
        } finally {
            setIsLoading(false);
        }
    };


    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!resetLogin.trim()) {
            setError("Введите логин для восстановления пароля.");
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            
            const response = await axios.post(`${API_BASE_URL}/auth/reset-password-request`, {
                login: resetLogin,
            });

            
            alert(`Если аккаунт с логином "${resetLogin}" существует, инструкции по сбросу пароля отправлены на привязанную почту.`);
            setCurrentForm('login');

        } catch (err) {
            if (err.response) {


                setError(err.response.data.detail || "Произошла ошибка при запросе восстановления пароля.");
                
                alert(`Если аккаунт с логином "${resetLogin}" существует, инструкции по сбросу пароля отправлены на привязанную почту.`);
                setCurrentForm('login');
            } else if (err.request) {
                 setError("Не удалось подключиться к серверу для запроса восстановления пароля.");
            } else {
                 setError("Произошла непредвиденная ошибка при запросе восстановления пароля.");
                 console.error("Axios error:", err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="login_modal-content" onClick={(e) => e.stopPropagation()}>
            <button
                className="close-button"
                onClick={onClose}
                aria-label="Закрыть"
            >
                &times;
            </button>

            
            {error && <div className="error-message">{error}</div>}
            {isLoading && <div className="loading-indicator">Загрузка...</div>}


            {currentForm === 'passwordReset' ? (
                <form className="password-reset-form" onSubmit={handlePasswordReset}>
                    <h2>Восстановление пароля</h2>
                    <div className="form-group">
                        <label>Введите логин:</label> 
                        <input
                            type="text"
                            value={resetLogin}
                            onChange={(e) => setResetLogin(e.target.value)}
                            placeholder="Логин"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-buttons">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => {setCurrentForm('login'); setError(null);}}
                            disabled={isLoading}
                        >
                            Назад
                        </button>
                        <button type="submit" className="primary-button" disabled={isLoading}>
                            Отправить
                        </button>
                    </div>
                </form>

            ) : currentForm === 'mfa' ? (

                <div className="mfa-container">
                    <h2>Подтвердите вход</h2>
                    <p>Код отправлен на {userEmail || 'вашу почту'}</p> 

                    <div className="code-inputs">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                ref={(el) => (inputsRef.current[index] = el)}
                                className="code-input"
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    <button
                        className='LoginForm_form_button_submit'
                         onClick={() => handleMfaSubmit(code.join(''))}
                        disabled={!code.every(c => c !== '') || isLoading} 
                    >
                        Подтвердить
                    </button>

                    <div className="mfa-footer">
                         <button
                             type="button"
                             className='mfa-link'
                             onClick={() => {setIsMfaStage(false); setCurrentForm("login"); setCode(Array(6).fill('')); setError(null);}} // Сбросить состояние MFA при возврате
                             disabled={isLoading}
                         >
                             ← Вернуться
                         </button>
                         <button
                             type="button"
                             className='mfa-link'
                             
                             onClick={async () => {
                                if (!mfaSessionToken) return; 
                                setError(null);
                                setIsLoading(true);
                                try {
                                     
                                     await axios.post(`${API_BASE_URL}/auth/resend-mfa-code`, {
                                         mfa_session_token: mfaSessionToken
                                     });
                                     alert("Код отправлен повторно.");
                                } catch (err) {
                                     setError("Не удалось отправить код повторно.");
                                     console.error("Resend MFA error:", err);
                                } finally {
                                     setIsLoading(false);
                                }
                             }}
                             disabled={!mfaSessionToken || isLoading}
                         >
                             Отправить код повторно
                         </button>
                    </div>
                </div>

            ) : (
                <form className='LoginForm_form' onSubmit={handleSubmit}>
                    <div className='LoginForm_form_Name'><p>Авторизация</p></div>
                    <div className='LoginForm_form_fields'>
                        <div className='LoginForm_form_fields_field'>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type='text'
                                placeholder='Логин'
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className='LoginForm_form_fields_field password'>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={`${isShow ? "text" : "password"}`}
                                placeholder='Пароль'
                                required
                                disabled={isLoading}
                            />
                            <div className='showPass' onClick={() => setIsShow(!isShow)}>
                                <img src={eyeImg} alt="Toggle password visibility" />
                            </div>
                        </div>
                    </div>
                    <div className='LoginForm_form_checkbox'>
                        <input id='RememberMe' type='checkbox' disabled={isLoading} />
                        <label htmlFor='RememberMe'>Запомнить меня</label>
                    </div>
                    <div className='LoginForm_form_href'>
                        <button
                            type="button"
                            className="password-reset-link"
                            onClick={() => {setCurrentForm('passwordReset'); setError(null);}}
                            disabled={isLoading}
                        >
                            Получить пароль
                        </button>
                    </div>
                    <div className='LoginForm_form_button'>
                        <button
                            className='LoginForm_form_button_submit'
                            type='submit'
                            disabled={isLoading} 
                            
                        >
                            Вход
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Login;