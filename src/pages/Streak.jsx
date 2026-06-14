import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Calendar, ArrowLeft, Award, Sparkles } from 'lucide-react';

// Importações do Firebase para calcular a sequência
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Streak() {
  const [streakCount, setStreakCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Função para formatar a data no padrão AAAA-MM-DD local
  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    const calculateStreak = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 1. Busca todos os registros de diário do usuário logado
        const q = query(
          collection(db, "diary_records"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        // 2. Guarda todas as datas preenchidas em um Set (para busca rápida)
        const savedDates = new Set();
        querySnapshot.forEach((doc) => {
          if (doc.data().dateKey) {
            savedDates.add(doc.data().dateKey);
          }
        });

        // 3. Lógica do Streak: Começa a checar a partir de hoje para trás
        let currentCheckDate = new Date();
        let currentStreak = 0;

        // Formato de hoje
        const todayStr = formatDateKey(currentCheckDate);
        
        // Formato de ontem (caso o usuário ainda não tenha escrito hoje, mas escreveu ontem)
        const yesterdayCheck = new Date();
        yesterdayCheck.setDate(yesterdayCheck.getDate() - 1);
        const yesterdayStr = formatDateKey(yesterdayCheck);

        // Se não escreveu nem hoje nem ontem, o streak quebrou (é 0)
        if (!savedDates.has(todayStr) && !savedDates.has(yesterdayStr)) {
          setStreakCount(0);
          setLoading(false);
          return;
        }

        // Se escreveu ontem mas ainda não hoje, começa a contar a partir de ontem
        if (!savedDates.has(todayStr) && savedDates.has(yesterdayStr)) {
          currentCheckDate = yesterdayCheck;
        }

        // Loop que vai voltando dia por dia para ver até onde vai a sequência ininterrupta
        while (true) {
          const dateStr = formatDateKey(currentCheckDate);
          
          if (savedDates.has(dateStr)) {
            currentStreak++;
            // Volta 1 dia no calendário
            currentCheckDate.setDate(currentCheckDate.getDate() - 1);
          } else {
            // No primeiro dia que ele falhou, o loop para
            break;
          }
        }

        setStreakCount(currentStreak);
      } catch (error) {
        console.error("Erro ao calcular a sequência:", error);
      } finally {
        setLoading(false);
      }
    };

    calculateStreak();
  }, []);

  return (
    <div 
      className="min-h-screen pt-28 pb-12 px-6 flex flex-col items-center relative bg-cover bg-center" 
      style={{ backgroundImage: "url('/src/imagens/imagens/fundoplanta.png')" }}
    >
      {/* Camada de desfoque sutil sobre o fundo */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
        
        {/* Link para Voltar */}
        <div className="w-full text-left mb-6">
          <Link to="/diario" className="inline-flex items-center text-gray-600 hover:text-[#3B429F] transition-colors group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar ao diário
          </Link>
        </div>

        {/* Card Principal da Sequência */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-white/80 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/50 text-center flex flex-col items-center gap-6"
        >
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
              <p>Calculando sua constância...</p>
            </div>
          ) : (
            <>
              <div className="relative">
                {/* Efeito de brilho atrás da chama se o streak for maior que 0 */}
                {streakCount > 0 && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-orange-400/30 blur-3xl rounded-full"
                  ></motion.div>
                )}
                
                {/* Ícone Dinâmico da Chama */}
                <motion.div
                  animate={streakCount > 0 ? { y: [0, -8, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <Flame 
                    className={`w-32 h-32 ${streakCount > 0 ? 'text-orange-500 drop-shadow-[0_10px_20px_rgba(249,115,22,0.4)]' : 'text-gray-300'}`} 
                  />
                </motion.div>
              </div>

              {/* Contador de Dias */}
              <div className="space-y-1">
                <h1 className="text-6xl md:text-7xl font-serif font-bold text-gray-900">
                  {streakCount} {streakCount === 1 ? 'Dia' : 'Dias'}
                </h1>
                <p className="text-gray-500 text-lg font-light tracking-wide">
                  {streakCount > 0 ? 'de conexão diária e intimidade com Deus!' : 'Comece sua sequência hoje!'}
                </p>
              </div>

              <div className="h-px bg-gray-200 w-full my-2"></div>

              {/* Mensagem Motivacional Baseada nos Dias */}
              <div className="flex items-center gap-3 bg-white/50 border border-white/80 p-4 rounded-2xl shadow-inner max-w-md">
                {streakCount >= 7 ? (
                  <Award className="w-6 h-6 text-yellow-500 shrink-0" />
                ) : (
                  <Sparkles className="w-6 h-6 text-orange-400 shrink-0" />
                )}
                <p className="text-sm text-gray-700 text-left leading-relaxed font-medium">
                  {streakCount === 0 && "O primeiro passo é o mais importante. Que tal abrir o diário e conversar com o Criador agora mesmo?"}
                  {streakCount > 0 && streakCount < 3 && "Excelente começo! A constância é construída um dia de cada vez. Continue firme."}
                  {streakCount >= 3 && streakCount < 7 && "Você está criando um hábito poderoso! Sinta a presença de Deus guiando os seus dias."}
                  {streakCount >= 7 && "Incrível! Uma semana inteira dedicada a lembrar-se das obras do Senhor. Você é uma inspiração!"}
                </p>
              </div>

              {/* Ações Rápidas */}
              <div className="flex flex-col sm:flex-row gap-4 w-full mt-4 justify-center">
                <Link 
                  to="/escrever-no-diario"
                  className="inline-flex items-center justify-center gap-2 bg-[#3B429F] hover:bg-[#2D3380] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-md"
                >
                  Escrever no Diário
                </Link>
                <Link 
                  to="/calendario"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-bold transition-all shadow-sm"
                >
                  <Calendar className="w-5 h-5 text-gray-400" />
                  Ver Calendário
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}