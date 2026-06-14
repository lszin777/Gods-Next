import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

// Importações necessárias para buscar dados do Firebase
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Calendar() {
  const navigate = useNavigate();
  
  // Estados para controle de data do Calendário
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 8)); // Inicializado em Junho de 2026 com base na sua imagem
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 8));
  
  // Estados para armazenar os dados vindos do Firestore
  const [diaryRecord, setDiaryRecord] = useState(null);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [savedDates, setSavedDates] = useState([]); // Guarda os dias que têm registro para acender a chama

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  // Função auxiliar para formatar a data no padrão 'AAAA-MM-DD' idêntico ao DiaryWriting
  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 1. Busca todos os registros do mês atual para saber quais dias acendem a chama (Streak)
  useEffect(() => {
    const fetchMonthRecords = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "diary_records"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const datesWithRecords = [];
        
        querySnapshot.forEach((doc) => {
          if (doc.data().dateKey) {
            datesWithRecords.push(doc.data().dateKey);
          }
        });
        
        setSavedDates(datesWithRecords);
      } catch (error) {
        console.error("Erro ao buscar registros do mês:", error);
      }
    };

    fetchMonthRecords();
  }, [currentDate]);

  // 2. Busca o texto do diário específico do dia selecionado
  useEffect(() => {
    const fetchDayRecord = async () => {
      const user = auth.currentUser;
      if (!user) {
        setDiaryRecord(null);
        return;
      }

      setLoadingRecord(true);
      const dateKey = formatDateKey(selectedDate);

      try {
        // Aponta para o documento único estruturado por UID_DATA
        const docRef = doc(db, "diary_records", `${user.uid}_${dateKey}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDiaryRecord(docSnap.data());
        } else {
          setDiaryRecord(null); // Nenhum registro encontrado para este dia
        }
      } catch (error) {
        console.error("Erro ao buscar registro do dia:", error);
        setDiaryRecord(null);
      } finally {
        setLoadingRecord(false);
      }
    };

    fetchDayRecord();
  }, [selectedDate]);

  // Funções de geração dos dias do calendário
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
            {/* Cabeçalho do Calendário */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-[#3B429F] rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="export m1 8h16M1 4h16m-16 8h16m-16 4h16M5 2v2m14-2v2" />
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

            {/* Dias da Semana */}
            <div className="grid grid-cols-7 gap-2 mb-4 text-center">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-xs font-bold text-gray-400 tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Grade de Dias */}
            <div className="grid grid-cols-7 gap-2">
              {daysArray.map((dateItem, index) => {
                if (!dateItem) return <div key={`empty-${index}`} />;

                const isSelected = selectedDate && 
                                   dateItem.getDate() === selectedDate.getDate() && 
                                   dateItem.getMonth() === selectedDate.getMonth() && 
                                   dateItem.getFullYear() === selectedDate.getFullYear();

                const dateKeyStr = formatDateKey(dateItem);
                const hasStreak = savedDates.includes(dateKeyStr);

                return (
                  <button
                    key={`day-${dateItem.getDate()}`}
                    onClick={() => setSelectedDate(dateItem)}
                    className={`
                      aspect-square rounded-2xl flex flex-col items-center justify-center relative font-medium transition-all text-base md:text-lg
                      ${isSelected 
                        ? 'bg-[#3B429F] text-white shadow-lg shadow-[#3B429F]/30 scale-105' 
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <span>{dateItem.getDate()}</span>
                    
                    {/* Pequena chama indicadora abaixo do número se houver registro salvo */}
                    {hasStreak && (
                      <Flame 
                        className={`w-4 h-4 absolute bottom-1.5 ${isSelected ? 'text-orange-300' : 'text-orange-500 animate-pulse'}`} 
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BLOCO DIREITO: PAINEL DE LEITURA DO DIÁRIO */}
        <div className="w-full lg:w-[400px] bg-[#EFEBE4] rounded-[32px] p-8 shadow-sm flex flex-col justify-between border border-[#E6E0D5]">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#3B429F] uppercase">
              Resumo Diário
            </span>
            <h3 className="text-2xl font-semibold text-gray-800 mt-1 mb-6">
              Dia {selectedDate.getDate()} de {months[selectedDate.getMonth()]}
            </h3>

            <div className="h-px bg-gray-300/60 w-full mb-8"></div>

            {/* Conteúdo Dinâmico Baseado no Firestore */}
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
                {/* O Texto Digitado pelo Usuário */}
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap font-light italic bg-white/40 p-4 rounded-2xl border border-white/60">
                  "{diaryRecord.diary}"
                </p>

                {/* Bloco Dinâmico do Versículo */}
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
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <Flame className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-light leading-relaxed">
                  Nenhum registro devocional encontrado para este dia.
                </p>
                <button 
                  onClick={() => navigate('/escrever-diario')} // Substitua pela rota correta de escrita se for diferente
                  className="mt-6 text-sm font-semibold text-[#3B429F] hover:underline"
                >
                  Escrever agora
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