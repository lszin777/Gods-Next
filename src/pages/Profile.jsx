// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Flame, Calendar, BookOpen, ChevronLeft, Shield, Target, Star } from 'lucide-react';

// Importações do Firebase
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);

  const userId = localStorage.getItem('user_id') || 'O7bDCY0Y4wXBBEuQzttKLblerco2';

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 1. Busca todos os diários guardados para fazer a contagem e o cálculo de segurança
        const q = query(
          collection(db, "diary_records"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        setTotalRecords(querySnapshot.size);

        // Mapeia todas as datas que possuem registro escrito (formato YYYY-MM-DD)
        const writtenDates = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().dateKey) {
            writtenDates.push(doc.data().dateKey);
          }
        });

        // 2. Tenta buscar a sequência salva na coleção 'user_streaks'
        const streakRef = doc(db, 'user_streaks', userId);
        const streakDoc = await getDoc(streakRef);
        
        if (streakDoc.exists()) {
          const data = streakDoc.data();
          setCurrentStreak(data.currentStreak || data.streak || 0);
          setHighestStreak(data.highestStreak || data.maxStreak || data.currentStreak || 0);
        } else if (writtenDates.length > 0) {
          // 3. FALLBACK: Se o documento não existir, calcula a sequência baseado nas datas reais
          // Ordena as datas de forma decrescente (mais recente primeiro)
          const uniqueDates = [...new Set(writtenDates)].sort().reverse();
          
          const todayStr = new Date().toISOString().split('T')[0];
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let streakCount = 0;
          let checkDateStr = uniqueDates[0];

          // Só valida sequência se o registro mais recente for hoje ou ontem
          if (checkDateStr === todayStr || checkDateStr === yesterdayStr) {
            streakCount = 1;
            for (let i = 1; i < uniqueDates.length; i++) {
              const currentCheck = new Date(uniqueDates[i - 1]);
              const nextCheck = new Date(uniqueDates[i]);
              const diffTime = Math.abs(currentCheck - nextCheck);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays === 1) {
                streakCount++;
              } else if (diffDays > 1) {
                break; // Sequência quebrada
              }
            }
          }

          setCurrentStreak(streakCount);
          setHighestStreak(streakCount > 0 ? streakCount : 1);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  // Configuração das Medalhas / Insígnias
  const badges = [
    {
      id: 'primeiro_passo',
      title: "Primeiro Passo",
      description: "Escreveu sua primeira reflexão no diário",
      icon: Star,
      color: "from-blue-400 to-indigo-500",
      unlocked: totalRecords >= 1
    },
    {
      id: 'firme_rocha',
      title: "Firme na Rocha",
      description: "Alcançou a marca de 7 dias de constância",
      icon: Shield,
      color: "from-green-400 to-emerald-600",
      unlocked: currentStreak >= 7 || highestStreak >= 7
    },
    {
      id: 'disciplina_espirito',
      title: "Disciplina no Espírito",
      description: "Completou 15 reflexões guardadas",
      icon: Target,
      color: "from-purple-400 to-purple-600",
      unlocked: totalRecords >= 15
    },
    {
      id: 'amigo_deus',
      title: "Amigo de Deus",
      description: "Alcançou a marca incrível de 30 dias de constância",
      icon: Award,
      color: "from-amber-400 to-orange-500",
      unlocked: currentStreak >= 30 || highestStreak >= 30
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100/60">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3B429F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100/60 pt-24 pb-12 px-4 md:px-8 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* CABEÇALHO */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-gray-100">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#3B429F] uppercase">Minha Jornada</span>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Perfil e Conquistas</h1>
          </div>
        </div>

        {/* CARDS DE ESTATÍSTICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 block">Sequência Atual</span>
              <span className="text-2xl font-bold text-gray-800">{currentStreak} {currentStreak === 1 ? 'dia' : 'dias'}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-[#3B429F] rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 block">Total de Reflexões</span>
              <span className="text-2xl font-bold text-gray-800">{totalRecords}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 block">Melhor Sequência</span>
              <span className="text-2xl font-bold text-gray-800">{highestStreak} {highestStreak === 1 ? 'dia' : 'dias'}</span>
            </div>
          </div>
        </div>

        {/* SEÇÃO DE MEDALHAS */}
        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900">Insígnias de Fé</h2>
            <p className="text-sm text-gray-400 font-light">Sua constância gera marcos na sua caminhada com o Criador.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${
                    badge.unlocked 
                      ? 'bg-white border-gray-100 shadow-sm' 
                      : 'bg-gray-50/50 border-gray-200/60 opacity-60 select-none'
                  }`}
                >
                  <div className={`p-3.5 rounded-xl text-white shadow-md ${
                    badge.unlocked 
                      ? `bg-gradient-to-br ${badge.color}` 
                      : 'bg-gray-300 shadow-none'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold text-sm md:text-base ${badge.unlocked ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                        {badge.title}
                      </h4>
                      {badge.unlocked && (
                        <span className="text-[10px] bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-full border border-green-200">
                          Conquistada
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-light mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}