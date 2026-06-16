// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Flame, Calendar, BookOpen, Menu, X, Info, Bot } from 'lucide-react'; // Ícone Bot adicionado aqui

// Importações do Firebase para verificar o estado do login
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
      setMobileOpen(false);
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

      {/* LINKS CENTRALIZADOS (DESKTOP) */}
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
        {/* NOVO LINK DO CONSELHEIRO VIRTUAL (DESKTOP) */}
        <Link to="/conselheiro" className="hover:text-[#3B429F] transition-colors flex items-center gap-1">
          <Bot className="w-4 h-4 text-[#3B429F]" /> Conselheiro
        </Link>
        <Link to="/perfil" className="hover:text-[#3B429F] transition-colors flex items-center gap-1">
          <User className="w-4 h-4 text-indigo-500" /> Perfil
        </Link>
        <Link to="/info" className="hover:text-[#3B429F] transition-colors flex items-center gap-1">
          <Info className="w-4 h-4 text-teal-500" /> Informações
        </Link>
      </div>

      {/* ÁREA DINÂMICA DA DIREITA: LOGIN OU FOTO DE USUÁRIO */}
      <div className="relative flex items-center gap-4">
        {user ? (
          /* USUÁRIO LOGADO: Exibe o Círculo com o Logo da Igreja */
          <div className="relative flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-11 h-11 rounded-full border-2 border-[#3B429F]/30 p-0.5 overflow-hidden shadow-sm hover:border-[#3B429F] transition-all bg-white flex items-center justify-center"
            >
              <img
                src="/src/imagens/logoigreja.png"
                alt="Foto do Usuário"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";
                }}
              />
            </motion.button>

            {/* Menu Dropdown de Opções (Desktop) */}
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)}></div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20"
                  >
                    <div className="px-4 py-2 border-b border-gray-50 text-xs font-bold text-gray-400 truncate">
                      {user.email}
                    </div>
                    
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
            className="hidden md:block bg-[#3B429F] hover:bg-[#2D3380] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-md shadow-[#3B429F]/10"
          >
            Entrar
          </Link>
        )}

        {/* ETAPA 2: BOTÃO HAMBÚRGUER (MOBILE) */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-600 hover:text-[#3B429F] md:hidden focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ETAPA 2: MENU LATERAL RESPONSIVO (MOBILE) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Background escurecido ao abrir o menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Painel do Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 p-6 shadow-2xl flex flex-col justify-between md:hidden"
            >
              <div className="flex flex-col gap-6 mt-16">
                {user && (
                  <div className="pb-4 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-400">Logado como:</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
                  </div>
                )}

                <Link
                  to="/diario"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-gray-600 font-medium text-lg hover:text-[#3B429F]"
                >
                  <BookOpen className="w-5 h-5 text-[#3B429F]" /> Diário
                </Link>
                <Link
                  to="/calendario"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-gray-600 font-medium text-lg hover:text-[#3B429F]"
                >
                  <Calendar className="w-5 h-5 text-[#3B429F]" /> Calendário
                </Link>
                <Link
                  to="/sequencia"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-gray-600 font-medium text-lg hover:text-[#3B429F]"
                >
                  <Flame className="w-5 h-5 text-orange-500" /> Sequência
                </Link>
                {/* NOVO LINK DO CONSELHEIRO VIRTUAL (MOBILE) */}
                <Link
                  to="/conselheiro"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-gray-600 font-medium text-lg hover:text-[#3B429F]"
                >
                  <Bot className="w-5 h-5 text-[#3B429F]" /> Conselheiro
                </Link>
                <Link
                  to="/perfil"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-gray-600 font-medium text-lg hover:text-[#3B429F]"
                >
                  <User className="w-5 h-5 text-indigo-500" /> Perfil
                </Link>
                <Link
                  to="/info"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-gray-600 font-medium text-lg hover:text-[#3B429F]"
                >
                  <Info className="w-5 h-5 text-teal-500" /> Informações
                </Link>
              </div>

              {/* Botão de Sair/Entrar no rodapé do menu mobile */}
              <div className="mt-auto pt-6 border-t border-gray-100">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Sair da Conta
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full bg-[#3B429F] hover:bg-[#2D3380] text-white text-center font-bold py-3 px-4 rounded-xl block transition-colors"
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </nav>
  );
}