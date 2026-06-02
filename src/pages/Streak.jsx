import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Streak() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="min-h-screen bg-brand-blue pt-24 px-6 flex flex-col md:flex-row items-center justify-center gap-12">
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#968C87] rounded-[40px] p-10 flex flex-col items-center w-full max-w-sm shadow-2xl relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {confirmed && (
             <motion.div 
               initial={{ opacity: 0, y: -20 }} 
               animate={{ opacity: 1, y: 0 }} 
               className="absolute top-6 right-8 text-white font-bold text-2xl tracking-widest"
             >
               DIA 1
             </motion.div>
          )}
        </AnimatePresence>

        <motion.img 
          animate={confirmed ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.5 }}
          src="/src/imagens/imagens/foguinho.png" 
          alt="Chama" 
          className="w-48 h-48 object-contain mb-10 mt-6 drop-shadow-[0_0_30px_rgba(255,165,0,0.6)]" 
        />

        <motion.button
          onClick={() => setConfirmed(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-4 rounded-2xl font-bold text-xl text-white transition-all shadow-lg ${
            confirmed ? 'bg-[#3B429F]' : 'bg-[#4F46E5] hover:bg-[#3B429F]'
          }`}
        >
          {confirmed ? 'Confirmado!' : 'Confirmar hoje'}
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-xs"
      >
        <img 
          src={confirmed ? "/src/imagens/imagens/jesusfeliz.png" : "/src/imagens/imagens/jesuscoracao.png"} 
          alt="Jesus Animation" 
          className="w-full h-auto drop-shadow-xl transition-all duration-500"
        />
      </motion.div>

    </div>
  );
}