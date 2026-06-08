import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, Lock } from 'lucide-react';

export default function DiaryWriting() {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleFinish = () => {
    if (text.trim().length < 10) {
      alert("Que tal escrever um pouco mais sobre o seu dia?");
      return;
    }
    // Aqui no futuro salvaríamos no banco de dados
    console.log("Relato salvo:", text);
    alert("Sua caminhada de hoje foi registrada com sucesso!");
    navigate('/diario');
  };

  return (
    <div 
      className="min-h-screen pt-28 pb-12 px-6 flex flex-col items-center relative bg-cover bg-center" 
      style={{ backgroundImage: "url('/src/imagens/imagens/fundoplanta.png')" }}
    >
      {/* Overlay para facilitar a leitura */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-6xl">
        
        {/* Botão Voltar Sutil */}
        <Link to="/diario" className="inline-flex items-center text-gray-600 hover:text-[#3B429F] mb-6 transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar ao menu do diário
        </Link>

        {/* Cabeçalho de Instrução */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl md:text-3xl text-gray-700 font-light max-w-3xl mx-auto leading-relaxed">
            Conte seu dia como se fosse para Deus, escreva suas histórias diárias, atitudes boas e no que você deve melhorar.
          </h1>
        </motion.div>

        {/* Container Principal de Escrita */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/40 backdrop-blur-md rounded-[40px] p-6 md:p-10 shadow-2xl border border-white/40 flex flex-col lg:flex-row items-center lg:items-stretch gap-10 min-h-[500px]"
        >
          
          {/* Imagem Lateral (Bíblia) */}
          <div className="w-full lg:w-1/3 flex items-center justify-center">
            <motion.img 
              initial={{ rotate: -5 }}
              animate={{ rotate: 0 }}
              src="/src/imagens/imagens/bibliadiario.png" 
              alt="Bíblia Diário" 
              className="w-full max-w-[320px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            />
          </div>

          {/* Área do Editor */}
          <div className="w-full lg:w-2/3 flex flex-col relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite aqui o que está no seu coração hoje..."
              className="w-full h-full min-h-[350px] bg-white/50 border-2 border-transparent focus:border-[#3B429F]/30 rounded-3xl p-8 text-xl text-gray-800 placeholder-gray-400 outline-none transition-all shadow-inner resize-none font-light"
            ></textarea>

            {/* Botão Concluir Posicionado no Canto */}
            <div className="absolute bottom-6 right-6">
              <motion.button
                onClick={handleFinish}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-[#3B429F] text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-[#2D3380] transition-all"
              >
                <Check className="w-5 h-5" />
                Concluir
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Rodapé de Privacidade */}
        <div className="flex justify-center items-center gap-2 mt-8 text-gray-500 text-sm">
          <Lock className="w-4 h-4" />
          Sua anotações são privadas e protegidas
        </div>
      </div>
    </div>
  );
}