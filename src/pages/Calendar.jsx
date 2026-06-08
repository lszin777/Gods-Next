import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarDays, Flame, CheckCircle2, BookOpen } from 'lucide-react';

export default function Calendar() {
  // Inicializa o calendário com a data atual (Ano e Mês dinâmicos)
  const [currentDate, setCurrentDate] = useState(new Date());
  // Guarda o dia selecionado pelo usuário (começa no dia atual)
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // --- CONTROLE DE DADOS REAIS (Inicie vazio ou integre com sua API/LocalStorage) ---
  // Exemplo de estrutura: { "AAAA-MM-DD": { verse: "...", reference: "...", diary: "..." } }
  const [userRecords, setUserRecords] = useState({
    // Se quiser testar o comportamento com uma anotação sua hoje, remova o comentário abaixo:
    // [`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`]: {
    //   verse: "O Senhor é meu pastor, nada me faltará.",
    //   reference: "Salmos 23:1",
    //   diary: "Minha primeira anotação real no diário!"
    // }
  });

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // --- LÓGICA DE CÁLCULO DO CALENDÁRIO ---
  // Descobre quantos dias tem o mês atual
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Descobre o dia da semana em que o dia 1 começa (0 = Domingo, 1 = Segunda, etc.)
  const startOffset = new Date(currentYear, currentMonth, 1).getDay();

  // Navegação para o mês anterior
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDay(1); // Reseta para o dia 1 do novo mês selecionado
  };

  // Navegação para o próximo mês
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDay(1); // Reseta para o dia 1 do novo mês selecionado
  };

  // Chave única para buscar os dados de um dia específico no formato "ANO-MES-DIA"
  const getSelectedDateKey = () => `${currentYear}-${currentMonth}-${selectedDay}`;
  const currentDayData = userRecords[getSelectedDateKey()];

  return (
    <div 
      className="min-h-screen pt-32 pb-12 px-6 flex flex-col items-center relative bg-cover bg-center" 
      style={{ backgroundImage: "url('/src/imagens/imagens/fundoplanta.png')" }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* LADO ESQUERDO: O Calendário Dinâmico */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50 flex flex-col"
        >
          {/* Cabeçalho de Navegação dos Meses */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3B429F]/10 rounded-xl flex items-center justify-center text-[#3B429F]">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                {months[currentMonth]} <span className="font-sans font-light text-gray-500">{currentYear}</span>
              </h2>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handlePrevMonth} 
                className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-[#3B429F] hover:border-[#3B429F]/30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNextMonth} 
                className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-[#3B429F] hover:border-[#3B429F]/30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dias da Semana (Headers) */}
          <div className="grid grid-cols-7 gap-2 mb-4 text-center">
            {daysOfWeek.map((day, index) => (
              <span key={index} className="text-xs font-bold text-gray-400 uppercase tracking-wider py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Grid de Dias Dinâmico */}
          <div className="grid grid-cols-7 gap-2 flex-grow">
            {/* Espaços vazios para alinhar o início da semana corretamente */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}

            {/* Renderização automática baseada no mês correto */}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const dayNumber = i + 1;
              const dateKey = `${currentYear}-${currentMonth}-${dayNumber}`;
              const isCompleted = !!userRecords[dateKey]; // Só fica ativo se você tiver salvo dados nele
              const isSelected = selectedDay === dayNumber;

              return (
                <motion.button
                  key={dayNumber}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(dayNumber)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-between p-2 relative border transition-all ${
                    isSelected 
                      ? 'bg-[#3B429F] border-[#3B429F] text-white shadow-lg shadow-[#3B429F]/30 z-10' 
                      : 'bg-white/50 border-gray-100 text-gray-800 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                    {dayNumber}
                  </span>

                  {/* A chama só aparece nos dias que contêm anotações reais suas */}
                  {isCompleted && (
                    <Flame className={`w-4 h-4 ${isSelected ? 'text-orange-300 fill-orange-300' : 'text-orange-500 fill-orange-400'}`} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* LADO DIREITO: Painel Detalhado */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#EBE7E0]/90 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50 flex flex-col justify-between"
        >
          <div>
            <div className="border-b border-gray-300/50 pb-4 mb-6">
              <span className="text-xs font-bold text-[#3B429F] uppercase tracking-widest">Resumo Diário</span>
              <h3 className="font-serif text-2xl text-gray-900 mt-1">Dia {selectedDay} de {months[currentMonth]}</h3>
            </div>

            <AnimatePresence mode="wait">
              {currentDayData ? (
                <motion.div
                  key={selectedDay}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Versículo Lido
                    </div>
                    <p className="text-gray-800 italic font-medium">"{currentDayData.verse}"</p>
                    <p className="text-[#3B429F] text-xs font-bold">— {currentDayData.reference}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-[#3B429F]" /> Sua Anotação
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed font-light bg-white/40 p-4 rounded-xl border border-white/60 shadow-inner">
                      {currentDayData.diary}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-gray-400 font-light flex flex-col items-center gap-3"
                >
                  <Flame className="w-12 h-12 text-gray-300" />
                  <p className="text-sm">Nenhum registro devocional encontrado para este dia.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-300/40 text-center text-xs text-gray-500 font-medium">
            God's Next • Sua constância com o Criador
          </div>
        </motion.div>
      </div>
    </div>
  );
}