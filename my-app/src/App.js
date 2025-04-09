import logo from './logo.svg';
import './App.css';
import Header from './Header';
import NewsSlider from './NewsSlider';
import './main.css'
import Login from './login';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  
  const [isLoginVisible, setLoginVisible] = useState(false);

  const handleLoginClose = () => setLoginVisible(false);
  const handleLoginOpen = () => setLoginVisible(true);
  useEffect(() => {
    if (isLoginVisible) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isLoginVisible]);
  return (
    <div className="App">
      <Header onLoginClick={handleLoginOpen}/>
      <main>
        <NewsSlider />
        {isLoginVisible && (
          <div className="modal-overlay" onClick={handleLoginClose}>
            <Login onClose={handleLoginClose} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
