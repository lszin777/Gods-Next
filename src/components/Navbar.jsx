// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Flame, Calendar, BookOpen } from 'lucide-react';

// Importações do Firebase para verificar o estado do login
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Monitora em tempo real se o usuário está logado ou não
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Limpa o monitor ao desmontar o componente
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-6 md:px-12 flex items-center justify-between">
      
      {/* LOGO DO PROJETO */}
      <Link to="/" className="flex items-center gap-2 font-serif font-bold text-xl text-gray-800 tracking-wide">
        <span className="text-[#3B429F]">God's</span> Next
      </Link>

      {/* LINKS CENTRALIZADOS */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link to="/diario" className="hover:text-[#3B429F] transition-colors flex items-center gap-1">
          <BookOpen className="w-4 h-4" /> Diário
        </Link>
        <Link to="/calendario" className="hover:text-[#3B429F] transition-colors flex items-center gap-1">
          <Calendar className="w-4 h-4" /> Calendário
        </Link>
        <Link to="/sequencia" className="hover:text-[#3B429F] transition-colors flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-500" /> Sequência
        </Link>
        {/* ADICIONADO: Link direto para o perfil na barra principal (opcional) */}
        <Link to="/perfil" className="hover:text-[#3B429F] transition-colors flex items-center gap-1">
          <User className="w-4 h-4 text-indigo-500" /> Perfil
        </Link>
      </div>

      {/* ÁREA DINÂMICA DA DIREITA: LOGIN OU FOTO DE USUÁRIO */}
      <div className="relative flex items-center gap-4">
        {user ? (
          /* USUÁRIO LOGADO: Exibe o Círculo com o Logo da Igreja */
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-11 h-11 rounded-full border-2 border-[#3B429F]/30 p-0.5 overflow-hidden shadow-sm hover:border-[#3B429F] transition-all bg-white flex items-center justify-center"
            >
              <img 
                src="/src/imagens/imagens/logoigreja.png" 
                alt="Foto do Usuário" 
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Fallback caso o caminho da imagem mude ou falhe
                  e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";
                }}
              />
            </motion.button>

            {/* Menu Dropdown de Opções ao Clicar na Foto */}
            <AnimatePresence>
              {menuOpen && (
                <>
                  {/* Overlay invisível para fechar ao clicar fora */}
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)}></div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20"
                  >
                    <div className="px-4 py-2 border-b border-gray-50 text-xs font-bold text-gray-400 truncate">
                      {user.email}
                    </div>
                    
                    {/* ADICIONADO: Opção "Meu Perfil" dentro do Menu Dropdown */}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/perfil');
                      }}
                      className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 flex items-center gap-2 font-medium transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-[#3B429F]" />
                      Meu Perfil
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da conta
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* USUÁRIO DESLOGADO: Exibe o botão de Entrar */
          <Link 
            to="/login" 
            className="bg-[#3B429F] hover:bg-[#2D3380] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-md shadow-[#3B429F]/10"
          >
            Entrar
          </Link>
        )}
      </div>

    </nav>
  );
}