// src/pages/DiaryHistory.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar as CalendarIcon, BookOpen, Search, Flame, Edit2, Trash2, Check, X, Smile, Loader2 } from 'lucide-react';

// Importações do Firebase
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

const moodConfig = {
  "proximo de deus": { emoji: "🔥", label: "Proximo de Deus", color: "bg-green-50 text-green-700 border-green-200" },
  "distante": { emoji: "☁️", label: "Distante", color: "bg-gray-50 text-gray-600 border-gray-200" },
  "reconexao": { emoji: "🌱", label: "Reconexão", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  "preciso de ajuda": { emoji: "🙏", label: "Preciso de ajuda", color: "bg-amber-50 text-amber-700 border-amber-200" },
};

export default function DiaryHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [globalLoading, setGlobalLoading] = useState(true); 
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedMood, setSelectedMood] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
      setGlobalLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchAllDiaries = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Busca garantida pelo userId logado
      const q = query(
        collection(db, "diary_records"),
        where("userId", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedRecords = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedRecords.push({ id: doc.id, ...data });
      });
      
      // Ordenando da mais recente para a mais antiga de forma segura
      fetchedRecords.sort((a, b) => {
        const dateA = a.dateKey || "";
        const dateB = b.dateKey || "";
        return dateB.localeCompare(dateA);
      });
      
      setRecords(fetchedRecords);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDiaries();
  }, [user]);

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const docRef = doc(db, "diary_records", id);
      await updateDoc(docRef, { diary: editText });
      
      setRecords(records.map(record => 
        record.id === id ? { ...record, diary: editText } : record
      ));
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("Erro ao atualizar o diário:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja apagar esta reflexão permanentemente?");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "diary_records", id));
      setRecords(records.filter(record => record.id !== id));
    } catch (error) {
      console.error("Erro ao deletar o diário:", error);
    }
  };

  const startEditing = (record) => {
    setEditingId(record.id);
    setEditText(record.diary);
  };

  const formatDateString = (dateStr) => {
    if (!dateStr) return "Data não registrada";
    try {
      const [year, month, day] = dateStr.split("-");
      const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      return `${parseInt(day)} de ${months[parseInt(month) - 1]}, ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const normalizeString = (str) => {
    if (!str) return "";
    return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.diary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.verse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMood = !selectedMood || normalizeString(record.mood) === normalizeString(selectedMood);

    return matchesSearch && matchesMood;
  });

  if (globalLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#3B429F] animate-spin mb-4" />
        <p className="text-gray-500 font-light text-sm">Carregando seu histórico...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100/60 pt-24 pb-12 px-4 md:px-8 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#3B429F] uppercase">Meu Aprendizado</span>
              <h1 className="text-2xl font-serif font-bold text-gray-900">Histórico de Reflexões</h1>
            </div>
          </div>

          <button onClick={() => navigate('/calendario')} className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B429F] bg-indigo-50 hover:bg-indigo-100/80 px-4 py-2.5 rounded-xl transition-colors">
            <CalendarIcon className="w-4 h-4" /> Ver no Calendário
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Pesquisar em suas anotações ou versículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3B429F] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white/50 p-2 rounded-2xl border border-gray-200/60">
            <span className="text-xs font-bold text-gray-500 ml-2 mr-1 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5" /> Filtrar por:
            </span>
            
            <button onClick={() => setSelectedMood(null)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${!selectedMood ? 'bg-[#3B429F] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              Todos
            </button>

            {Object.entries(moodConfig).map(([key, config]) => (
              <button key={key} onClick={() => setSelectedMood(selectedMood === key ? null : key)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${selectedMood === key ? 'bg-[#3B429F] text-white border-[#3B429F] shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                <span>{config.emoji}</span>
                <span>{config.label}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3B429F] mb-4"></div>
            <p className="text-sm">Carregando suas memórias espirituais...</p>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="relative border-l-2 border-[#3B429F]/10 ml-4 md:ml-6 pl-6 md:pl-8 space-y-8">
            {filteredRecords.map((record, index) => {
              const moodKey = record.mood ? normalizeString(record.mood) : null;
              const currentMood = moodConfig[moodKey];

              return (
                <motion.div key={record.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="relative bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-start group">
                  <div className="absolute -left-[31px] md:-left-[39px] top-9 w-4 h-4 rounded-full bg-[#3B429F] border-4 border-gray-100 z-10 hidden sm:block" />

                  <div className="md:col-span-3 flex md:flex-col items-start gap-3 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4 w-full">
                    <div className="flex md:flex-col items-center md:items-start gap-2 w-full">
                      <div className="p-2 bg-indigo-50 text-[#3B429F] rounded-xl hidden md:block">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-gray-800 leading-tight">
                        {formatDateString(record.dateKey)}
                      </p>
                    </div>
                    {currentMood && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${currentMood.color}`}>
                        <span>{currentMood.emoji}</span><span>{currentMood.label}</span>
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-9 space-y-4 w-full relative">
                    {editingId !== record.id && (
                      <div className="absolute top-0 right-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                        <button onClick={() => startEditing(record)} className="p-1.5 text-gray-400 hover:text-[#3B429F] hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(record.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">MINHA REFLEXÃO</span>
                      {editingId === record.id ? (
                        <div className="space-y-2 mt-2">
                          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3B429F] text-gray-700 text-sm leading-relaxed font-light italic resize-y" rows={4} />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingId(null)} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                              <X className="w-3.5 h-3.5" /> Cancelar
                            </button>
                            <button onClick={() => handleSaveEdit(record.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-[#3B429F] hover:bg-[#2D3380] px-3 py-1.5 rounded-lg transition-colors">
                              <Check className="w-3.5 h-3.5" /> Salvar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-light italic pr-12">
                          "{record.diary}"
                        </p>
                      )}
                    </div>

                    {(record.verse || record.reference) && (
                      <div className="bg-[#EFEBE4]/50 border border-[#E6E0D5] rounded-2xl p-4">
                        <span className="text-[10px] font-bold text-orange-600 block mb-1">PALAVRA ESTUDADA</span>
                        <p className="text-gray-800 font-medium text-sm md:text-base leading-relaxed">{record.verse}</p>
                        <span className="text-xs text-gray-500 font-bold block mt-1 text-right">— {record.reference || "Sem referência"}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100 shadow-sm">
            <Flame className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">Nenhum registro encontrado</h3>
            <p className="text-gray-400 font-light text-sm max-w-sm mx-auto">
              Não encontramos nenhuma anotação correspondente nesta conta ou nos filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}