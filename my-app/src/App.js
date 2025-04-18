import './App.css';
import Header from './Header';
import NewsSlider from './NewsSlider';
import Login from './login';
import { useState } from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfile from './UserProfile';
import AdmissionsPage from './AdmissionsPage';
import Footer from './Footer';
import MTC from './MTC'
import Portfolio from './Portfolio';
import Schedule from './Shedule';
import AdminPanel from './AdminPanel';
import Analytics from './Analytics';

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
              {/* <NewsSlider /> */}
              {isLoginVisible && (
                <div className="modal-overlay_login" onClick={() => setLoginVisible(false)}>
                  <Login onClose={() => setLoginVisible(false)} />
                </div>
              )}
            </main>
            <Footer/>
          </div>
        }/>
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/AdmissionsPage" element={<AdmissionsPage/>} />
        <Route path='/MilitaryCenter' element={<MTC/>}/>
        <Route path='/shedule' element={<Schedule/>}/>
        <Route path='/admin' element={<AdminPanel/>}/>
        <Route path='/analiticksStudent' element={<Analytics user={{ role: 'student' }}/>}/>
        <Route path='/analiticksTeacher' element={<Analytics user={{ role: 'teacher' }}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
