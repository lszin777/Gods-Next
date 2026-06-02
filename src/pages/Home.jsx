import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-blue pt-24 px-6 flex flex-col md:flex-row items-center justify-center relative overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl z-10 text-center md:text-left flex flex-col items-center md:items-start"
      >
        <h1 className="font-serif text-6xl md:text-8xl text-[#1A202C] tracking-tight mb-4">
          God's Next
        </h1>
        <p className="text-xl text-gray-800 mb-8 font-light">
          O caminho mais rápido para a aproximação com Deus
        </p>

        <div className="flex items-center w-full my-6 opacity-60">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="mx-4 text-2xl font-serif">+</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        <h2 className="text-2xl font-medium text-gray-900 mb-2">
          Como você está se sentindo hoje?
        </h2>
        <p className="text-gray-600 mb-8 max-w-sm text-center md:text-left">
          Escolha a opção que mais representa o seu momento atual. Estamos aqui para caminhar com você.
        </p>

        <Link to="/como-voce-esta">
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#4F46E5" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-[#3B429F] text-white px-8 py-4 rounded-full text-lg shadow-[0_10px_25px_-5px_rgba(59,66,159,0.5)] transition-all"
          >
            <Heart className="w-5 h-5" />
            Começar agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-12 md:mt-0 md:ml-12 z-10"
      >
        <img 
          src="/src/imagens/imagens/capajesus.png" 
          alt="Face of Jesus" 
          className="w-full max-w-md object-contain drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
}