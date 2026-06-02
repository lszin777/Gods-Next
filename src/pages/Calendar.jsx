import { motion } from 'framer-motion';

export default function Calendar() {
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen bg-[#D9EAFD] pt-32 px-6 flex flex-col items-center">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-[#C8C8C8] rounded-3xl p-8 md:p-10 shadow-lg border border-gray-300/50"
      >
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0 border-4 border-white">
            <img 
              src="/src/imagens/imagens/logoigreja.png" 
              alt="Logo Igreja" 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
            />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide uppercase">
            Igreja Batista Remanescente Fiel
          </h2>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          2026, MAIO:
        </h3>

        <div className="flex flex-wrap gap-4 mb-10">
          {days.map((day, i) => (
            <motion.div
              key={day}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1, backgroundColor: '#E2E8F0' }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#E5E5E5] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),_0_4px_6px_rgba(0,0,0,0.1)] flex items-center justify-center text-2xl font-black text-white cursor-pointer transition-colors"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
            >
              {day}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg md:text-xl text-gray-900 font-medium mb-10">
          <div className="flex flex-col gap-2">
            <p>Quarta-feira: 15h</p>
            <p>Quinta-feira: 19:30</p>
          </div>
          <div className="flex flex-col gap-2">
            <p>Sábado: Culto nas casas</p>
            <p>Domingo: 10h</p>
          </div>
        </div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-xl text-gray-800 font-medium text-center"
      >
        LOCAL: Rua Cortegaça 678, Parque Independência
      </motion.p>

    </div>
  );
}