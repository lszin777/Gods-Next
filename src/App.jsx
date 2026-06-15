import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MoodSelection from './pages/MoodSelection';
import VerseDisplay from './pages/VerseDisplay';
import Streak from './pages/Streak';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Diario from './pages/Diario';
import DiaryWriting from './pages/DiaryWriting'; // <-- Importe aqui
import DiaryHistory from './pages/DiaryHistory';



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
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/esqueci-senha" element={<ForgotPassword />} />
          <Route path="/diario" element={<Diario />} />
          <Route path="/escrever-no-diario" element={<DiaryWriting />} /> {/* <-- Nova Rota */}
          <Route path="/escrever-diario" element={<DiaryWriting />} />
          <Route path="/historico-diario" element={<DiaryHistory />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
