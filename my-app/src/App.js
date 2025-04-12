import logo from './logo.svg';
import './App.css';
import Header from './Header';
import NewsSlider from './NewsSlider';
import './main.css'
import Login from './login';
import { useState } from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentProfile from './StudentProfile';
import UserProfile from './UserProfile';
import AdmissionsPage from './AdmissionsPage';

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
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <Header onLoginClick={() => setLoginVisible(true)} />
            <main>
              <NewsSlider />
              {isLoginVisible && (
                <div className="modal-overlay" onClick={() => setLoginVisible(false)}>
                  <Login onClose={() => setLoginVisible(false)} />
                </div>
              )}
            </main>
          </div>
        }/>
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/AdmissionsPage" element={<AdmissionsPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
