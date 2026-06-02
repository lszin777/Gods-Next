import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MoodSelection from './pages/MoodSelection';
import VerseDisplay from './pages/VerseDisplay';
import Streak from './pages/Streak';
import Calendar from './pages/Calendar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/como-voce-esta" element={<MoodSelection />} />
          <Route path="/verso/:mood" element={<VerseDisplay />} />
          <Route path="/sequencia" element={<Streak />} />
          <Route path="/calendario" element={<Calendar />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;