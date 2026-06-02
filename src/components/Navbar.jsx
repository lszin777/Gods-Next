import { Link } from 'react-router-dom';
import { Cross, Calendar, Flame, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/10 border-b border-white/20"
    >
      <Link to="/" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
        <Cross className="w-5 h-5" />
        Home
      </Link>

      <div className="hidden md:flex gap-4">
        <NavButton to="/calendario" icon={<Calendar className="w-4 h-4" />} text="Calendário" />
        <NavButton to="/sequencia" icon={<Flame className="w-4 h-4" />} text="Sequência" />
        <NavButton to="/diario" icon={<BookOpen className="w-4 h-4" />} text="Diário" />
      </div>
    </motion.nav>
  );
}

const NavButton = ({ to, icon, text }) => (
  <Link to={to}>
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 bg-[#3B429F] text-white rounded-full text-sm shadow-lg hover:bg-[#4F46E5] transition-colors"
    >
      {icon} {text}
    </motion.button>
  </Link>
);