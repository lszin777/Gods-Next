import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function MoodSelection() {
  const options = [
    { id: 'proximo', title: 'Próximo de Deus', desc: 'Você sente que sua fé está forte, que existe uma conexão viva entre você e Ele.', icon: '/src/imagens/imagens/plantinha.png' },
    { id: 'distante', title: 'Distante', desc: 'Pouca ou nenhuma conexão com Deus. Pode haver dúvidas, vazio ou até falta de interesse.', icon: '/src/imagens/imagens/montanha.png' },
    { id: 'reconectar', title: 'Reconexão', desc: 'Você reconhece que deseja voltar a se aproximar de Deus.', icon: '/src/imagens/imagens/caminhodosol.png' },
    { id: 'ajuda', title: 'Preciso de ajuda', desc: 'Não consegue caminhar sozinho nesse momento. Pode estar passando por dificuldades.', icon: '/src/imagens/imagens/maocoração.png' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: "url('/src/imagens/imagens/fundoplanta.png')" }}>
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl"
      >
        <h1 className="font-serif text-4xl md:text-6xl text-center text-gray-900 mb-12 drop-shadow-sm">
          Como está sua conexão <br className="hidden md:block"/> com Deus?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((opt, i) => (
            <Link key={opt.id} to={`/verso/${opt.id}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(150, 140, 135, 0.95)' }}
                className="bg-[#968C87]/90 backdrop-blur-md rounded-3xl p-6 flex items-center gap-6 cursor-pointer shadow-xl border border-white/20 transition-colors group"
              >
                <div className="bg-[#F5F2E6] p-4 rounded-full flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                   <img src={opt.icon} alt={opt.title} className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-white mb-2">{opt.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{opt.desc}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}