// src/pages/Streak.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase'; // Importado o auth para pegar o usuário real
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Monitor em tempo real
import { ArrowLeft, Flame, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Streak() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Estado para o usuário autenticado
  const [loading, setLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(0);
  const [isLitToday, setIsLitToday] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Função auxiliar para gerar strings de data idênticas e seguras
  const getCleanDateString = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Etapa 1: Monitorar qual usuário está logado atualmente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Se de alguma forma cair aqui deslogado, manda para o login
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Etapa 2: Buscar a sequência do banco de dados baseando-se estritamente no UID do usuário logado
  useEffect(() => {
    if (!user) return; // Espera o usuário carregar primeiro

    const checkStreak = async () => {
      setLoading(true); // Garante o carregamento visual ao trocar de conta
      try {
        const streakRef = doc(db, 'user_streaks', user.uid); // Alterado para usar o user.uid real
        const streakDoc = await getDoc(streakRef);

        if (streakDoc.exists()) {
          const data = streakDoc.data();
          
          const todayStr = getCleanDateString(new Date());
          const ontem = new Date();
          ontem.setDate(ontem.getDate() - 1);
          const ontemStr = getCleanDateString(ontem);

          if (data.lastActiveDate === todayStr) {
            setStreakCount(data.currentStreak || 0);
            setIsLitToday(true);
          } else if (data.lastActiveDate === ontemStr) {
            setStreakCount(data.currentStreak || 0);
            setIsLitToday(false);
          } else {
            setStreakCount(0);
            setIsLitToday(false);
            await updateDoc(streakRef, { currentStreak: 0 });
          }
        } else {
          // Se o usuário é novo e não tem registro, zera o estado visual
          setStreakCount(0);
          setIsLitToday(false);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da sequência:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStreak();
  }, [user]); // Dispara toda vez que o objeto 'user' mudar (troca de conta)

  const handleAcenderSequencia = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const todayStr = getCleanDateString(new Date());
      const streakRef = doc(db, 'user_streaks', user.uid); // Alterado para usar o user.uid real
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

  if (loading || !user) {
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