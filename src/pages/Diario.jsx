// src/pages/Diario.jsx
import { motion } from 'framer-motion';
import { PenTool, Lock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Diario() {
  return (
    <div 
      className="min-h-screen pt-32 pb-12 px-6 flex flex-col items-center relative bg-cover bg-center" 
      style={{ backgroundImage: "url('/src/imagens/imagens/fundoplanta.png')" }}
    >
      {/* Camada de desfoque sutil sobre o fundo de plantas */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Título Principal */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl text-center mb-10"
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-gray-800 font-light leading-relaxed">
          Registre sua caminhada e veja o que <br className="hidden md:block"/> Deus está fazendo em sua vida.
        </h1>
      </motion.div>

      {/* Cartão Principal com Efeito Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 w-full max-w-5xl bg-[#EBE7E0]/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 flex flex-col md:flex-row items-center gap-12"
      >
        {/* Lado Esquerdo - Imagem da Bíblia/Diário */}
        <motion.div 
          whileHover={{ y: -10 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <img 
            src="/src/imagens/imagens/bibliadiario.png" 
            alt="Bíblia Diário" 
            className="w-full max-w-[350px] object-contain drop-shadow-2xl"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x400?text=Bíblia+Diário' }}
          />
        </motion.div>

        {/* Lado Direito - Textos Informativos e Ações */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
            Escreva. Reflita. Cresça
          </h2>
          <div className="w-16 h-1.5 bg-[#3B429F] rounded-full mb-6"></div>

          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            Este é o seu espaço pessoal com Deus. Anote suas orações, aprendizados, desafios e vitórias.
          </p>

          {/* Bloco Estilizado com o Versículo do Dia */}
          <div className="bg-[#B5B9E0]/30 border-l-4 border-[#3B429F] p-5 rounded-r-xl w-full mb-8 shadow-inner">
            <p className="text-[#3B429F] italic font-medium text-lg mb-2">
              "Lembre-se das coisas que o Senhor fez por você."
            </p>
            <p className="text-[#3B429F]/80 text-sm font-semibold">
              — 1 Samuel 12:24
            </p>
          </div>

          {/* BLOCO DE BOTÕES DE NAVEGAÇÃO */}
          <div className="w-full flex flex-col gap-4">
            {/* Link de Navegação para a Tela de Escrita */}
            <Link to="/escrever-no-diario" className="w-full">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#313785" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 bg-[#3B429F] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all w-full justify-center"
              >
                <PenTool className="w-5 h-5" />
                Escrever no diário
              </motion.button>
            </Link>

            {/* NOVO: Link de Navegação para o Histórico de Anotações */}
            <Link to="/historico-diario" className="w-full">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 66, 159, 0.08)" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 bg-transparent text-[#3B429F] border-2 border-[#3B429F]/30 px-8 py-3.5 rounded-xl font-semibold text-base transition-all w-full justify-center"
              >
                <BookOpen className="w-4 h-4" />
                Ver histórico de reflexões
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Rodapé de Privacidade */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-8 flex items-center gap-2 text-gray-500 text-sm font-medium"
      >
        <Lock className="w-4 h-4" />
        Suas anotações são privadas e protegidas
      </motion.div>
    </div>
  );
}