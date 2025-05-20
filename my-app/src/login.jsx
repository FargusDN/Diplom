import React, { useState, useEffect, useRef } from 'react';
import './Login.css';
import eyeImg from "./imgs/menu_eye.png"

const Login = ({ onClose }) => {
    const [currentForm, setCurrentForm] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [resetLogin, setResetLogin] = useState('');
    const [countOfTry, setCountOfTry] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600);
    const [isMfaStage, setIsMfaStage] = useState(false);
    const [code, setCode] = useState(Array(6).fill(''));
    const [userEmail, setUserEmail] = useState('user@example.com');
    const inputsRef = useRef([]);
    const [isShow, setIsShow] = useState(false);

    // Эффекты для таймера блокировки
    useEffect(() => {
        const blockTime = localStorage.getItem('loginBlockTime');
        if (blockTime) {
            const remaining = Math.floor((blockTime - Date.now()) / 1000);
            if (remaining > 0) {
                setIsBlocked(true);
                setTimeLeft(remaining);
            }
        }
    }, []);

    useEffect(() => {
        let timer;
        if (isBlocked && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsBlocked(false);
                        localStorage.removeItem('loginBlockTime');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isBlocked, timeLeft]);

    // Логика MFA
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
            inputsRef.current[index + 1].focus();
        }

        if (newCode.every(c => c !== '') && index === 5) {
            handleMfaSubmit();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isBlocked) return;

        // Заглушка проверки логина
        const loginSuccess = username === 'test' && password === 'test123';
        
        if (!loginSuccess) {
            setCountOfTry(prev => {
                const newCount = prev + 1;
                if (newCount >= 5) {
                    setIsBlocked(true);
                    localStorage.setItem('loginBlockTime', Date.now() + 600000);
                    setTimeLeft(600);
                }
                return newCount;
            });
            return;
        }

        // Если логин успешен и есть MFA
        const userHasMfa = true; // Заглушка - должен приходить с бэка
        if (userHasMfa) {
            setIsMfaStage(true);
            setCurrentForm("mfa")
            // Здесь вызов API для отправки кода на почту
        } else {
            onClose();
        }
    };

    const handleMfaSubmit = async () => {
        const fullCode = code.join('');
        // Проверка кода на бэкенде
        console.log('MFA Code:', fullCode);
        onClose();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    const handlePasswordReset = (e) => {
        e.preventDefault();
        if (resetLogin.trim()) {
            alert(`Новый пароль отправлен на почту, привязанную к аккаунту ${resetLogin}`);
            setCurrentForm('login');
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


            {currentForm === 'passwordReset' ? (
                <form className="password-reset-form" onSubmit={handlePasswordReset}>
                    <h2>Восстановление пароля</h2>
                    <div className="form-group">
                        <label>Введите логин:</label>
                        <input
                            type="text"
                            value={resetLogin}
                            onChange={(e) => setResetLogin(e.target.value)}
                            placeholder="Ваш логин"
                            required
                        />
                    </div>
                    <div className="form-buttons">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => setCurrentForm('login')}
                        >
                            Назад
                        </button>
                        <button type="submit" className="primary-button">
                            Отправить
                        </button>
                    </div>
                </form>
            ): currentForm === 'mfa'? (
                <div className="mfa-container">
                    <h2>Подтвердите вход</h2>
                    <p>Код отправлен на {userEmail}</p>
                    
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
                            />
                        ))}
                    </div>

                    <button 
                        className='LoginForm_form_button_submit'
                        onClick={handleMfaSubmit}
                        disabled={!code.every(c => c !== '')}
                    >
                        Подтвердить
                    </button>

                    <div className="mfa-footer">
                        <button 
                            type="button" 
                            className='mfa-link'
                            onClick={() => {setIsMfaStage(false); setCurrentForm("login")}}
                        >
                            ← Вернуться
                        </button>
                        <button 
                            type="button"
                            className='mfa-link'
                            onClick={() => alert("Код отправлен")}
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
                                disabled={isBlocked}
                            />
                        </div>
                        <div className='LoginForm_form_fields_field password'>
                            <input 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={`${isShow? "text": "password"}`}
                                placeholder='Пароль'
                                disabled={isBlocked}
                            />
                            <div className='showPass' onClick={()=>setIsShow(!isShow)}>
                                <img src={eyeImg}/>
                            </div>
                        </div>
                    </div>
                    <div className='LoginForm_form_checkbox'>
                        <input id='RememberMe' type='checkbox'/>
                        <label htmlFor='RememberMe'>Запомнить меня</label>
                    </div>
                    <div className='LoginForm_form_href'>
                        <button 
                            type="button" 
                            className="password-reset-link"
                            onClick={() => setCurrentForm('passwordReset')}
                        >
                            Получить пароль
                        </button>
                    </div>
                    <div className='LoginForm_form_button'>
                        <button 
                            className='LoginForm_form_button_submit' 
                            type='submit'
                            disabled={isBlocked}
                        >
                            Вход
                        </button>
                        {isBlocked && (
                            <div className='blocked-timer'>
                                Повторите через: {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default Login;

