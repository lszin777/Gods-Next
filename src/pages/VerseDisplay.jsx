import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const verseData = {
  proximo: {
    title: "Próximo de Deus",
    text: "“Permaneçam em mim, e eu permanecerei em vocês. Nenhum ramo pode dar fruto por si mesmo, se não permanecer na videira. Vocês também não podem dar fruto, se não permanecerem em mim.”",
    ref: "— João 15:4"
  },
  distante: {
    title: "Distante",
    text: "“Por que você está abatida, ó minha alma? Por que se perturba dentro de mim? Ponha a sua esperança em Deus! Pois ainda o louvarei; ele é o meu Salvador e o meu Deus.”",
    ref: "— Salmos 42:11"
  },
  reconectar: {
    title: "Tentando se reconectar",
    text: "“Desde a época dos seus antepassados vocês se desviaram dos meus decretos e não os obedeceram. Voltem para mim, e eu voltarei para vocês”, diz o Senhor dos Exércitos.",
    ref: "— Malaquias 3:7"
  },
  ajuda: {
    title: "Preciso de ajuda",
    text: "“Deus é o nosso refúgio e a nossa fortaleza, auxílio sempre presente na adversidade. Por isso não temeremos, ainda que a terra trema e os montes afundem no coração do mar.”",
    ref: "— Salmos 46:1-2"
  }
};

export default function VerseDisplay() {
  const { mood } = useParams();
  const data = verseData[mood] || verseData['proximo'];

  return (
    <div className="min-h-screen pt-24 px-6 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/src/imagens/imagens/fundoplanta.png')" }}>
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-4xl flex items-start">
        <Link to="/como-voce-esta">
          <motion.div whileHover={{ x: -5 }} className="mr-8 mt-2 cursor-pointer bg-white/50 p-2 rounded-full shadow hover:bg-white transition-colors">
            <ChevronLeft className="w-8 h-8 text-gray-700" />
          </motion.div>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-10 text-center md:text-left">
            {data.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-light mb-6">
            {data.text}
          </p>
          <p className="text-lg text-gray-600 font-medium md:text-left text-center">
            {data.ref}
          </p>
        </motion.div>
      </div>
    </div>
  );
}