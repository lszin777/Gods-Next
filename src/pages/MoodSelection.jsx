// src/pages/MoodSelection.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Shield, Heart, Compass, HelpCircle } from 'lucide-react';

export default function MoodSelection() {
  const navigate = useNavigate();

  const options = [
    {
      id: 'proximo',
      title: 'Próximo de Deus',
      description: 'Você sente que sua fé está forte, que existe uma conexão viva entre você e Ele.',
      icon: <Shield className="w-5 h-5 text-emerald-600" />,
      bgIcon: 'bg-emerald-50'
    },
    {
      id: 'distante',
      title: 'Distante',
      description: 'Pouca ou nenhuma conexão com Deus. Pode haver dúvidas, vazio ou até falta de interesse.',
      icon: <Compass className="w-5 h-5 text-blue-600" />,
      bgIcon: 'bg-blue-50'
    },
    {
      id: 'reconexao',
      title: 'Reconexão',
      description: 'Você reconhece que deseja voltar a se aproximar de Deus e restaurar sua caminhada.',
      icon: <Heart className="w-5 h-5 text-amber-600" />,
      bgIcon: 'bg-amber-50'
    },
    {
      id: 'ajuda',
      title: 'Preciso de ajuda',
      description: 'Não consegue caminhar sozinho nesse momento. Pode estar passando por dificuldades.',
      icon: <HelpCircle className="w-5 h-5 text-purple-600" />,
      bgIcon: 'bg-purple-50'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const handleSelect = (moodId) => {
    // 1. Guarda o humor escolhido no navegador
    localStorage.setItem('user_mood', moodId);
    
    // 2. Vai para a tela onde o diário/versículo será exibido
    navigate('/escrever-diario'); 
  };

  return (
    <div 
      className="min-h-screen pt-28 pb-12 px-6 flex flex-col items-center relative bg-cover bg-center" 
      style={{ backgroundImage: "url('/src/imagens/imagens/fundoplanta.png')" }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col">
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center text-gray-600 hover:text-[#3B429F] mb-12 transition-colors group self-start text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar ao início
        </button>

        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-100 px-4 py-1 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#3B429F]" />
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Sondagem de Coração</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-gray-900 tracking-tight">
            Como está sua conexão<br />com Deus?
          </h1>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {options.map((option) => (
            <motion.div
              key={option.id}
              variants={itemVariants}
              whileHover={{ y: -4, backgroundColor: '#ffffff', borderColor: 'rgba(59, 66, 159, 0.3)' }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelect(option.id)}
              className="bg-white/90 backdrop-blur-sm border border-gray-100 p-6 md:p-8 rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] cursor-pointer transition-all flex items-start gap-5 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${option.bgIcon} flex items-center justify-center shrink-0 border border-white/50 shadow-sm`}>
                {option.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-serif font-bold text-gray-800 group-hover:text-[#3B429F] transition-colors">
                  {option.title}
                </h3>
                <p className="text-gray-500 font-light text-sm leading-relaxed">
                  {option.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}