// src/pages/Streak.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Flame, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Streak() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(0);
  const [isLitToday, setIsLitToday] = useState(false);
  const [updating, setUpdating] = useState(false);

  // ID de usuário padrão para testes locais
  const userId = localStorage.getItem('user_id') || 'usuario_teste_devocional';

  // Função auxiliar para gerar strings de data idênticas e seguras
  const getCleanDateString = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const checkStreak = async () => {
      try {
        const streakRef = doc(db, 'user_streaks', userId);
        const streakDoc = await getDoc(streakRef);

        if (streakDoc.exists()) {
          const data = streakDoc.data();
          
          const todayStr = getCleanDateString(new Date());
          const ontem = new Date();
          ontem.setDate(ontem.getDate() - 1);
          const ontemStr = getCleanDateString(ontem);

          if (data.lastActiveDate === todayStr) {
            // Já acessou hoje, mantém a sequência salva
            setStreakCount(data.currentStreak || 0);
            setIsLitToday(true);
          } else if (data.lastActiveDate === ontemStr) {
            // Acessou ontem, mas ainda não hoje. Mantém a contagem esperando o clique
            setStreakCount(data.currentStreak || 0);
            setIsLitToday(false);
          } else {
            // Passou mais de um dia sem acessar, a sequência quebrou
            setStreakCount(0);
            setIsLitToday(false);
            
            // Opcional: Atualiza o banco indicando que resetou
            await updateDoc(streakRef, { currentStreak: 0 });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados da sequência:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStreak();
  }, [userId]);

  const handleAcenderSequencia = async () => {
    setUpdating(true);
    try {
      const todayStr = getCleanDateString(new Date());
      const streakRef = doc(db, 'user_streaks', userId);
      const streakDoc = await getDoc(streakRef);

      let newCount = 1;

      if (streakDoc.exists()) {
        const data = streakDoc.data();
        
        if (data.lastActiveDate === todayStr) {
          setIsLitToday(true);
          setUpdating(false);
          return;
        }

        const ontem = new Date();
        ontem.setDate(ontem.getDate() - 1);
        const ontemStr = getCleanDateString(ontem);

        // Se o último dia ativo foi ontem, soma +1. Caso contrário, recomeça de 1
        if (data.lastActiveDate === ontemStr) {
          newCount = (data.currentStreak || 0) + 1;
        } else {
          newCount = 1;
        }

        await updateDoc(streakRef, {
          currentStreak: newCount,
          lastActiveDate: todayStr
        });
      } else {
        // Se o documento não existe na coleção, cria o primeiro dia
        await setDoc(streakRef, {
          currentStreak: 1,
          lastActiveDate: todayStr
        });
      }

      setStreakCount(newCount);
      setIsLitToday(true);
    } catch (error) {
      console.error("Erro ao atualizar a sequência:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#F4F9FF] to-[#FFFFFF]">
        <Loader2 className="w-8 h-8 text-[#3B429F] animate-spin mb-4" />
        <p className="text-gray-500 font-light text-sm">Carregando sua constância...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 bg-gradient-to-tr from-[#E6F0FA] via-[#F4F9FF] to-[#FFFFFF] flex flex-col items-center justify-center">
      
      <div className="w-full max-w-xl flex flex-col">
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center text-gray-500 hover:text-[#3B429F] mb-8 transition-colors group self-start text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar ao início
        </button>

        <div className="w-full bg-white border border-gray-100 p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 bg-white border border-gray-100 px-4 py-1.5 rounded-full shadow-sm mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#3B429F]" />
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Sua Constância</span>
          </div>

          <div className="flex justify-center">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border transition-all duration-300 ${
              isLitToday 
                ? 'bg-orange-50 border-orange-100 text-orange-500 shadow-sm' 
                : 'bg-gray-50 border-gray-100 text-gray-300'
            }`}>
              <Flame className={`w-12 h-12 ${isLitToday ? 'fill-orange-500/10' : ''}`} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-serif font-black text-gray-900 tracking-tight">
              {streakCount} {streakCount === 1 ? 'Dia' : 'Dias'} de Sequência
            </h1>
            <p className="text-gray-400 text-base font-light max-w-sm mx-auto leading-relaxed">
              {isLitToday 
                ? 'Excelente! Sua chama de devoção está acesa hoje.' 
                : 'Marque sua presença diária para manter sua chama de conexão ativa.'}
            </p>
          </div>

          <div className="w-24 h-1 bg-[#3B429F]/10 rounded-full mx-auto" />

          <div className="max-w-xs mx-auto pt-2">
            <motion.button
              disabled={isLitToday || updating}
              onClick={handleAcenderSequencia}
              whileHover={!isLitToday && !updating ? { scale: 1.03, backgroundColor: '#313785' } : {}}
              whileTap={!isLitToday && !updating ? { scale: 0.97 } : {}}
              className={`w-full group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
                isLitToday 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none cursor-default' 
                  : 'bg-[#3B429F] text-white shadow-xl shadow-[#3B429F]/10 hover:shadow-2xl'
              }`}
            >
              {updating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Confirmando...</span>
                </>
              ) : isLitToday ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Presença Confirmada</span>
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5" />
                  <span>Acender Sequência</span>
                </>
              )}
            </motion.button>
          </div>

        </div>
      </div>

    </div>
  );
}