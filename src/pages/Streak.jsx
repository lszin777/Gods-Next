import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Award, CheckCircle2, Trophy } from 'lucide-react';

export default function Streak() {
  // --- CONTROLE DE DADOS REAIS ---
  // O contador de dias seguidos agora começa em 0 (totalmente real)
  const [streakCount, setStreakCount] = useState(0);
  
  // Guarda o histórico real de dias concluídos no formato { "ANO-MES-DIA": true }
  const [completedDates, setCompletedDates] = useState({});

  // 1. LÓGICA PARA CALCULAR A SEMANA ATUAL DINAMICAMENTE
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  
  // Calcula a distância em dias para a Segunda-feira da semana atual
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  
  const mondayOfCurrentWeek = new Date(today);
  mondayOfCurrentWeek.setDate(today.getDate() + distanceToMonday);

  const daysName = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  // Monta a lista dos 7 dias da semana atual com base na data real
  const weekDays = daysName.map((name, index) => {
    const d = new Date(mondayOfCurrentWeek);
    d.setDate(mondayOfCurrentWeek.getDate() + index);
    
    const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const isToday = d.getDate() === today.getDate() && 
                    d.getMonth() === today.getMonth() && 
                    d.getFullYear() === today.getFullYear();
                    
    return {
      name,
      dateKey,
      isToday,
      completed: !!completedDates[dateKey] // Fica true apenas se estiver no estado real
    };
  });

  // Chave única para o dia de hoje
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  // A chama principal só fica acesa se o dia de hoje já tiver sido concluído
  const isLit = !!completedDates[todayKey];

  // Ação de acender a fogueira
  const handleLightFlame = () => {
    if (!isLit) {
      // Regista o dia de hoje no histórico real
      setCompletedDates(prev => ({
        ...prev,
        [todayKey]: true
      }));
      // Sobe 1 dia na sequência do utilizador
      setStreakCount(prev => prev + 1);
    }
  };

  return (
    <div 
      className="min-h-screen pt-32 pb-12 px-6 flex flex-col items-center relative bg-cover bg-center" 
      style={{ backgroundImage: "url('/src/imagens/imagens/fundoplanta.png')" }}
    >
      {/* Camada de desfoque sobre o fundo */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* LADO ESQUERDO: Painel Principal da Fogueira */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Brilho dinâmico atrás da chama */}
          <div className={`absolute w-72 h-72 rounded-full blur-[80px] transition-all duration-1000 -z-10 ${isLit ? 'bg-orange-400/30' : 'bg-gray-300/10'}`}></div>

          <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-2">Chama Devocional</h2>
          <p className="text-gray-600 text-sm max-w-sm mb-10">Mantenha seu coração aquecido pela palavra de Deus todos os dias.</p>

          {/* Animação da Chama */}
          <div className="relative cursor-pointer mb-10" onClick={handleLightFlame}>
            <motion.div
              animate={isLit ? {
                scale: [1, 1.08, 1],
                y: [0, -8, 0],
                filter: ["drop-shadow(0 0 15px rgba(249,115,22,0.6))", "drop-shadow(0 0 35px rgba(239,68,68,0.8))", "drop-shadow(0 0 15px rgba(249,115,22,0.6))"]
              } : {
                scale: 1,
                filter: "drop-shadow(0 0 0px rgba(0,0,0,0))"
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Flame 
                className={`w-40 h-40 transition-colors duration-700 ${isLit ? 'text-orange-500 fill-orange-400' : 'text-gray-300'}`} 
              />
            </motion.div>
          </div>

          {/* Botão de Ação */}
          <motion.button
            whileHover={!isLit ? { scale: 1.03 } : {}}
            whileTap={!isLit ? { scale: 0.97 } : {}}
            onClick={handleLightFlame}
            disabled={isLit}
            className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
              isLit 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20 cursor-default' 
                : 'bg-[#3B429F] text-white hover:bg-[#313785] shadow-[#3B429F]/20'
            }`}
          >
            {isLit ? 'Chama de Hoje Acesa!' : 'Acender Chama de Hoje'}
          </motion.button>
        </motion.div>

        {/* LADO DIREITO: Estatísticas Reais */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* Card de Dias Seguidos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 flex items-center gap-5"
          >
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <div className="text-4xl font-extrabold text-gray-900 leading-none">{streakCount}</div>
              <div className="text-gray-500 text-sm font-medium mt-1">Dias Seguidos</div>
            </div>
          </motion.div>

          {/* Card de Conquista */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 flex items-center gap-5"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm text-gray-500 font-medium">Próxima Conquista</div>
              <div className="text-gray-900 font-bold text-base mt-0.5">
                {streakCount >= 7 ? '15 Dias de Fé' : '7 Dias Resilientes'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SEÇÃO INFERIOR: Progresso Semanal Dinâmico */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 w-full max-w-4xl bg-[#EBE7E0]/90 backdrop-blur-md rounded-3xl p-8 mt-8 shadow-2xl border border-white/50"
      >
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-[#3B429F]" />
          <h3 className="font-serif text-xl text-gray-900">Progresso Semanal</h3>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
          {weekDays.map((day, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                day.isToday 
                  ? 'bg-white border-[#3B429F] shadow-md ring-2 ring-[#3B429F]/20' 
                  : 'bg-white/40 border-transparent'
              }`}
            >
              <span className={`text-xs font-semibold mb-2 ${day.isToday ? 'text-[#3B429F] font-bold' : 'text-gray-500'}`}>
                {day.name} {day.isToday && '(Hoje)'}
              </span>
              
              {day.completed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100" />
              ) : (
                <div className={`w-6 h-6 rounded-full border-2 ${day.isToday ? 'border-[#3B429F]/40 border-dashed animate-pulse' : 'border-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}