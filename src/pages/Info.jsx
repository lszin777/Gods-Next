// src/pages/Info.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Calendar, Clock, Link2, Video, Users } from "lucide-react"; 

export default function Info() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6 md:px-12 pb-12">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#3B429F] font-medium transition-colors mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Voltar
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner/Header da Página */}
        <div className="bg-[#3B429F] p-8 md:p-12 text-white">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
          >
            Informações Gerais
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif font-bold mt-4"
          >
            God's Next
          </motion.h1>
          <p className="text-white/80 mt-2 text-sm md:text-base">
            Conectando você aos propósitos, agendas e atividades da nossa comunidade.
          </p>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Coluna da Esquerda: Detalhes e Horários */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Sobre o Projeto</h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                O God's Next é uma plataforma desenvolvida para auxiliar no acompanhamento diário, 
                organização de cronogramas e engajamento da Igreja Batista Remanescente Fiel. Aqui você pode gerenciar seu diário espiritual, 
                ficar por dentro dos próximos eventos e manter sua sequência de atividades em dia.
              </p>
            </div>

            <hr className="border-gray-100" />

            {/* Informações de Local e Horários */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-[#3B429F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Localização</h4>
                  <p className="text-sm">Rua Cortegaça, 678, Pq Independência, São Paulo - SP</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-[#3B429F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Dias de Culto</h4>
                  <p className="text-sm">Quarta-feira - 15h /Quinta-feira - 19:30 </p> 
                  <p className="text-sm">Sábado - Culto nas casas /Domingo - 10h </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Redes Sociais e Comunidade */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit space-y-6">
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#3B429F]" />
                Comunidade
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Siga nossas redes sociais oficiais para receber avisos, transmissões ao vivo e conteúdos diários.
              </p>
            </div>

            {/* Links das Redes Sociais */}
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/igrejabatista_remanescentefiel?igsh=a3F5eGgzdDh5N2cx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white hover:bg-indigo-50 border border-gray-100 rounded-xl text-gray-700 hover:text-[#3B429F] transition-all font-medium text-sm"
              >
                <Link2 className="w-5 h-5 text-[#3B429F]" />
                Instagram Oficial
              </a>

              <a
                href="https://youtube.com/@ibrfieltv8201?si=zo6CP9xxnf9edh9t"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white hover:bg-red-50 border border-gray-100 rounded-xl text-gray-700 hover:text-red-600 transition-all font-medium text-sm"
              >
                <Video className="w-5 h-5 text-red-500" />
                Canal no YouTube
              </a>

              {/* ALTERAÇÃO: Ícone alterado para MapPin e cores ajustadas para azul/indigo */}
              <a
                href="https://maps.app.goo.gl/Loc1qJTRZ8wnFUrM7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white hover:bg-indigo-50 border border-gray-100 rounded-xl text-gray-700 hover:text-[#3B429F] transition-all font-medium text-sm"
              >
                <MapPin className="w-5 h-5 text-[#3B429F]" />
                Localização
              </a>

            </div>

            <div className="pt-2 text-center">
              <span className="text-[10px] font-bold text-gray-400 bg-gray-200/50 px-2 py-1 rounded uppercase tracking-wider">
                God's Next 1.0
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}