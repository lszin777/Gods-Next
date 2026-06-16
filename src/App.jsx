// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Info from './pages/Info';
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
import DiaryWriting from './pages/DiaryWriting'; 
import DiaryHistory from './pages/DiaryHistory';
import Profile from './pages/Profile';

// COMPONENTE DE PROTEÇÃO DE ROTA
// Se o usuário não estiver logado, ele é mandado para o Login.
// O 'key={user?.uid}' força o React a destruir e recriar a página do zero ao mudar de conta!
function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium animate-pulse">Carregando...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Passando o uid como chave força a reconstrução completa dos dados específicos daquele usuário
  return <div key={user.uid}>{children}</div>;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitora o estado global do usuário no Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        <Navbar />
        <Routes>
          {/* Rotas Públicas (Qualquer um acessa) */}
          <Route path="/info" element={<Info />} />
          <Route path="/informacoes" element={<Info />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/esqueci-senha" element={<ForgotPassword />} />

          {/* Rotas Protegidas (SÓ ACESSA SE FIZER LOGIN) */}
          <Route path="/diario" element={
            <ProtectedRoute user={user} loading={loading}>
              <Diario />
            </ProtectedRoute>
          } />
          <Route path="/escrever-no-diario" element={
            <ProtectedRoute user={user} loading={loading}>
              <DiaryWriting />
            </ProtectedRoute>
          } />
          <Route path="/escrever-diario" element={
            <ProtectedRoute user={user} loading={loading}>
              <DiaryWriting />
            </ProtectedRoute>
          } />
          <Route path="/historico-diario" element={
            <ProtectedRoute user={user} loading={loading}>
              <DiaryHistory />
            </ProtectedRoute>
          } />
          <Route path="/sequencia" element={
            <ProtectedRoute user={user} loading={loading}>
              <Streak />
            </ProtectedRoute>
          } />
          <Route path="/calendario" element={
            <ProtectedRoute user={user} loading={loading}>
              <Calendar />
            </ProtectedRoute>
          } />
          <Route path="/como-voce-esta" element={
            <ProtectedRoute user={user} loading={loading}>
              <MoodSelection />
            </ProtectedRoute>
          } />
          <Route path="/verso/:mood" element={
            <ProtectedRoute user={user} loading={loading}>
              <VerseDisplay />
            </ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute user={user} loading={loading}>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;