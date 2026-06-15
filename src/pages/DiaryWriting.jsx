// src/pages/DiaryWriting.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { ArrowLeft, BookOpen, Loader2, CheckCircle } from 'lucide-react';

export default function DiaryWriting() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [diaryText, setDiaryText] = useState('');

  const userId = localStorage.getItem('user_id') || 'usuario_teste_devocional';

  const getCleanDateString = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const savedMood = localStorage.getItem('user_mood') || 'proximo';
        const versesRef = collection(db, 'verses_pool');
        const q = query(versesRef, where('mood', '==', savedMood));
        const querySnapshot = await getDocs(q);

        const versesList = [];
        querySnapshot.forEach((doc) => {
          versesList.push(doc.data());
        });

        if (versesList.length > 0) {
          const randomIndex = Math.floor(Math.random() * versesList.length);
          setSelectedVerse(versesList[randomIndex]);
        } else {
          setSelectedVerse({
            verse: "O Senhor guiará você sempre; satisfará as suas necessidades.",
            reference: "Isaías 58:11"
          });
        }
      } catch (error) {
        console.error("Erro ao carregar versículo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, []);

  const handleSalvarDevocional = async () => {
    if (!diaryText.trim()) {
      alert("Por favor, escreva algo antes de guardar o seu registro.");
      return;
    }

    setSaving(true);
    try {
      const todayStr = getCleanDateString(new Date());
      // Salva em uma coleção unificada de registros diários por ID único de data
      const docId = `${userId}_${todayStr}`;
      const diaryRef = doc(db, 'user_diaries', docId);

      await setDoc(diaryRef, {
        userId,
        date: todayStr,
        text: diaryText,
        verse: selectedVerse?.verse || "",
        reference: selectedVerse?.reference || "",
        timestamp: new Date()
      });

      alert("Devocional guardado com sucesso!");
      navigate('/calendario'); // Redireciona para o calendário para ver o registro
    } catch (error) {
      console.error("Erro ao guardar devocional:", error);
      alert("Houve um erro ao salvar na nuvem.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#F4F9FF] to-[#FFFFFF]">
        <Loader2 className="w-8 h-8 text-[#3B429F] animate-spin mb-4" />
        <p className="text-gray-500 font-light text-sm">Preparando um versículo para o seu coração...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 bg-gradient-to-b from-[#F4F9FF] to-[#FFFFFF] flex justify-center">
      <div className="w-full max-w-3xl flex flex-col space-y-8">
        
        <button onClick={() => navigate('/como-voce-esta')} className="inline-flex items-center text-gray-500 hover:text-gray-800 self-start text-sm transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Alterar sentimento
        </button>

        <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-xl shadow-gray-100/50 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#3B429F]"></div>
          <div className="flex items-center gap-2 text-[#3B429F]">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Palavra de Conforto</span>
          </div>
          <blockquote className="text-xl md:text-2xl font-serif text-gray-800 italic leading-relaxed">
            "{selectedVerse?.verse}"
          </blockquote>
          <p className="text-right text-sm font-semibold text-[#3B429F]">
            — {selectedVerse?.reference}
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-lg font-serif font-bold text-gray-800">
            Escreva o que está no seu coração hoje:
          </label>
          <textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            placeholder="Comece a digitar sua reflexão, oração ou desabafo..."
            className="w-full h-64 p-6 bg-white border border-gray-200 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B429F]/20 focus:border-[#3B429F] transition-all resize-none text-gray-700 font-light placeholder-gray-400"
          />
        </div>

        <button 
          onClick={handleSalvarDevocional}
          disabled={saving}
          className="w-full sm:w-auto self-end bg-[#3B429F] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#2D3380] transition-colors shadow-lg shadow-[#3B429F]/10 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
          <span>{saving ? 'Guardando...' : 'Guardar Registro Diário'}</span>
        </button>

      </div>
    </div>
  );
}





{/*
  
  rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /diary_records/{document} {
      allow read, write: if request.auth != null;
    }
  }
} 
  */}




