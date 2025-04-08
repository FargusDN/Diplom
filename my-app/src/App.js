import logo from './logo.svg';
import './App.css';
import Header from './Header';
import NewsSlider from './NewsSlider';
import './main.css'

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <NewsSlider />
        {/* Остальные секции */}
      </main>
    </div>
  );
}

export default App;
