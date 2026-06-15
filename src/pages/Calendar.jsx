// src/pages/Calendar.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

// Importações necessárias para buscar dados do Firebase
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function Calendar() {
  const navigate = useNavigate();
  
  // CORREÇÃO: Inicializa com a data real do sistema (Hoje)
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today); 
  const [selectedDate, setSelectedDate] = useState(today);
  
  // Estados para armazenar os dados vindos do Firestore
  const [diaryRecord, setDiaryRecord] = useState(null);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [savedDates, setSavedDates] = useState([]); // Guarda os dias que têm chamas/registros ativos

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  const userId = localStorage.getItem('user_id') || 'usuario_teste_devocional';

  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 1. Busca os registros de chamas (Diários E Botão de Sequência)
  useEffect(() => {
    const fetchAllMonthChamas = async () => {
      try {
        const datesWithChamas = new Set();

        const diaryQuery = query(
          collection(db, "user_diaries"),
          where("userId", "==", userId)
        );
        const diarySnapshot = await getDocs(diaryQuery);
        diarySnapshot.forEach((doc) => {
          if (doc.data().date) {
            datesWithChamas.add(doc.data().date);
          }
        });

        const streakRef = doc(db, 'user_streaks', userId);
        const streakDoc = await getDoc(streakRef);
        if (streakDoc.exists()) {
          const streakData = streakDoc.data();
          if (streakData.lastActiveDate) {
            datesWithChamas.add(streakData.lastActiveDate);
          }
        }
        
        setSavedDates(Array.from(datesWithChamas));
      } catch (error) {
        console.error("Erro ao buscar as chamas ativas do mês:", error);
      }
    };

    fetchAllMonthChamas();
  }, [currentDate, userId]);

  // 2. Busca o texto do diário específico do dia selecionado
  useEffect(() => {
    const fetchDayRecord = async () => {
      setLoadingRecord(true);
      const dateKey = formatDateKey(selectedDate);

      try {
        const docRef = doc(db, "user_diaries", `${userId}_${dateKey}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDiaryRecord(docSnap.data());
        } else {
          setDiaryRecord(null);
        }
      } catch (error) {
        console.error("Erro ao buscar registro do dia:", error);
        setDiaryRecord(null);
      } finally {
        setLoadingRecord(false);
      }
    };

    fetchDayRecord();
  }, [selectedDate, userId]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    daysArray.push(new Date(year, month, i));
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="min-h-screen bg-gray-100/60 pt-24 pb-12 px-4 md:px-8 flex justify-center items-center">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* BLOCO ESQUERDO: O CALENDÁRIO */}
        <div className="flex-1 bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-[#3B429F] rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {months[month]} <span className="text-gray-400 font-light">{year}</span>
                </h2>
              </div>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4 text-center">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-xs font-bold text-gray-400 tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {daysArray.map((dateItem, index) => {
                if (!dateItem) return <div key={`empty-${index}`} />;

                // Verifica se este dia da lista é o dia selecionado pelo clique
                const isSelected = selectedDate && 
                                   dateItem.getDate() === selectedDate.getDate() && 
                                   dateItem.getMonth() === selectedDate.getMonth() && 
                                   dateItem.getFullYear() === selectedDate.getFullYear();

                // CORREÇÃO AUXILIAR: Verifica se este item corresponde estritamente ao dia de HOJE real
                const isRealToday = dateItem.getDate() === today.getDate() && 
                                    dateItem.getMonth() === today.getMonth() && 
                                    dateItem.getFullYear() === today.getFullYear();

                const dateKeyStr = formatDateKey(dateItem);
                const hasStreak = savedDates.includes(dateKeyStr);
                
                const isCultoDay = [0, 3, 4, 6].includes(dateItem.getDay());

                return (
                  <button
                    key={`day-${dateItem.getDate()}`}
                    onClick={() => setSelectedDate(dateItem)}
                    className={`
                      aspect-square rounded-2xl flex flex-col items-center justify-center relative font-medium transition-all text-base md:text-lg
                      ${isSelected 
                        ? 'bg-[#3B429F] text-white shadow-lg shadow-[#3B429F]/30 scale-105' 
                        : isRealToday
                          ? 'bg-indigo-50 text-[#3B429F] border-2 border-[#3B429F]/30 font-bold' // Destaque sutil para o dia de hoje quando não selecionado
                          : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <span>{dateItem.getDate()}</span>
                    
                    {/* Chama de devocional */}
                    {hasStreak && (
                      <Flame 
                        className={`w-4 h-4 absolute bottom-1.5 ${isSelected ? 'text-orange-300' : 'text-orange-500'}`} 
                      />
                    )}

                    {/* Indicador azul discreto para marcar dia de culto fixo da igreja */}
                    {!isSelected && isCultoDay && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#3B429F] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BLOCO DIREITO: RESUMO DIÁRIO E AGENDA */}
        <div className="w-full lg:w-[400px] bg-[#EFEBE4] rounded-[32px] p-8 shadow-sm flex flex-col justify-between border border-[#E6E0D5]">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#3B429F] uppercase">
              Resumo Diário
            </span>
            <h3 className="text-2xl font-semibold text-gray-800 mt-1 mb-6">
              Dia {selectedDate.getDate()} de {months[selectedDate.getMonth()]}
            </h3>

            <div className="h-px bg-gray-300/60 w-full mb-8"></div>

            {loadingRecord ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B429F] mb-4"></div>
                <p className="text-sm">Buscando suas anotações...</p>
              </div>
            ) : diaryRecord ? (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap font-light italic bg-white/40 p-4 rounded-2xl border border-white/60">
                  "{diaryRecord.text}"
                </p>

                <div className="mt-4 bg-white/60 rounded-2xl p-5 border border-white/80 shadow-inner">
                  <span className="text-xs font-semibold text-orange-600 block mb-1">VERSÍCULO DO DIA</span>
                  <p className="text-gray-800 font-medium text-base leading-relaxed">
                    {diaryRecord.verse || "Lembre-se das coisas que o Senhor fez por você."}
                  </p>
                  <span className="text-xs text-gray-500 font-bold block mt-2 text-right">
                    — {diaryRecord.reference || "1 Samuel 12:24"}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center px-2 space-y-6">
                {[0, 3, 4, 6].includes(selectedDate.getDay()) ? (
                  <div className="bg-white/80 p-5 rounded-2xl border border-dashed border-[#3B429F]/30 w-full space-y-3 shadow-sm">
                    <span className="text-[10px] font-bold text-[#3B429F] uppercase tracking-widest block">⛪ Agenda da Igreja</span>
                    <h4 className="font-serif font-bold text-gray-800 text-lg leading-snug">
                      {selectedDate.getDay() === 0 && "Celebração da Família — 10h"}
                      {selectedDate.getDay() === 3 && "Culto de Oração — 15h"}
                      {selectedDate.getDay() === 4 && "Culto de Doutrina e Ensino — 19h30"}
                      {selectedDate.getDay() === 6 && "Culto nos Lares (Pequenos Grupos)"}
                    </h4>
                    <p className="text-xs text-gray-400 font-light">Participe conosco em comunhão!</p>
                  </div>
                ) : (
                  <div>
                    <Flame className="w-12 h-12 text-gray-300 mb-4 mx-auto" />
                    <p className="text-gray-500 font-light leading-relaxed">
                      Nenhum registro devocional ou atividade da igreja neste dia.
                    </p>
                  </div>
                )}

                <button 
                  onClick={() => navigate('/como-voce-esta')}
                  className="text-sm font-semibold text-[#3B429F] hover:underline pt-2"
                >
                  Escrever meu diário agora
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-xs font-medium text-gray-400 border-t border-gray-300/40 pt-4">
            God's Next • Sua constância com o Criador
          </div>
        </div>

      </div>
    </div>
  );
}