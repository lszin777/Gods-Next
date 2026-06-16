// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, Sparkles, Bell } from 'lucide-react';

// IMPORTAÇÃO CORRETA: Entra na pasta utils e ativa a função
import { seedDatabase } from '../utils/seedDatabase';

export default function Home() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  // Sistema de Notificação Inteligente para os dias de Culto
  useEffect(() => {
    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0 = Domingo, 1 = Segunda... 6 = Sábado

    const rotinaCultos = {
      3: { mensagem: "Hoje temos Culto de Oração!", horario: "15:00h" },
      4: { mensagem: "Hoje temos Culto de Ensino!", horario: "19:30h" },
      6: { mensagem: "Hoje é dia de Culto nas Casas! Procure seu Pequeno Grupo.", horario: "Noite" },
      0: { mensagem: "Hoje temos nossa Celebração de Domingo!", horario: "10:00h" }
    };

    if (rotinaCultos[diaSemana]) {
      setNotification(rotinaCultos[diaSemana]);
    }
  }, []);

  // Variantes de animação premium
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-tr from-[#E6F0FA] via-[#F4F9FF] to-[#FFFFFF] pt-20 px-6 md:px-12 lg:px-24">
      
      {/* Luzes de fundo */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#3B429F]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-100/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-4 items-center">
        
        {/* TEXTOS E NOTIFICAÇÃO */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-10"
        >
          {/* BANNER DE NOTIFICAÇÃO DE CULTO DINÂMICO */}
          <AnimatePresence>
            {notification && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-xl"
              >
                <div className="bg-gradient-to-r from-[#3B429F] to-[#2D3380] text-white p-4 rounded-2xl shadow-xl shadow-[#3B429F]/10 flex items-center justify-between border border-indigo-400/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl">
                      <Bell className="w-5 h-5 text-amber-300 fill-amber-300/20" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-indigo-200 uppercase">Aviso da Igreja</p>
                      <h4 className="text-sm font-medium font-serif text-white">{notification.mensagem}</h4>
                    </div>
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                    ⏰ {notification.horario}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#3B429F]" />
            <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Experiência Devocional</span>
          </motion.div>

          <div className="space-y-6">
            <motion.h1 
              variants={itemVariants}
              className="text-6xl md:text-7xl lg:text-8xl font-serif font-black text-gray-900 leading-none tracking-tight"
            >
              God's <span className="text-[#3B429F]">Next</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-400 font-light max-w-lg leading-relaxed"
            >
              O caminho mais calmo para a sua aproximação com o Criador.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="w-24 h-1 bg-[#3B429F]/10 rounded-full" />

          {/* CARD INTERATIVO */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/30 backdrop-blur-xl border border-white/60 p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] max-w-xl space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-gray-800">
                Como você está se sentindo hoje?
              </h2>
              <p className="text-gray-500 font-light text-base leading-relaxed">
                Escolha a opção que mais representa o seu momento. Estamos aqui para caminhar com você.
              </p>
            </div>

            <motion.button
              onClick={() => navigate('/como-voce-esta')}
              whileHover={{ scale: 1.03, backgroundColor: '#313785' }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center justify-center gap-4 bg-[#3B429F] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-[#3B429F]/20 hover:shadow-2xl transition-all"
            >
              <Heart className="w-5 h-5 fill-white/20 group-hover:fill-white/40 transition-all" />
              <span>Começar agora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ILUSTRAÇÃO */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#3B429F]/10 blur-[80px] rounded-full scale-75"></div>
            <img 
              src="/logoigreja.png" 
              alt="Jesus" 
              className="relative z-10 w-full max-w-[500px] h-auto object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.1)]"
            />
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}