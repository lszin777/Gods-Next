import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: 'Olá! Eu sou o assistente virtual do God\'s Next. Estou aqui para te ouvir, orar com você ou compartilhar uma palavra de conforto. Como você está se sentindo hoje?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const systemPrompt = `Você é um conselheiro espiritual cristão muito empático e amigável do aplicativo God's Next. 
      Responda de forma curta, acolhedora e use linguagem acessível. 
      Se o usuário estiver triste, ofereça conforto e um versículo bíblico curto. 
      Nunca dê respostas genéricas de robô.
      A mensagem do usuário é: "${userMessage}"`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.candidates[0].content.parts[0].text;

      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);

    } catch (error) {
      console.error("Erro na IA:", error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Desculpe, minha conexão falhou agora. Pode tentar de novo?' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-20 pb-12 px-4 md:px-8 flex justify-center items-center font-sans">
      <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col h-[80vh] overflow-hidden transition-all duration-300">
        
        {/* Cabeçalho do Chat */}
        <div className="bg-gradient-to-r from-[#3B429F] to-[#5058B5] p-6 text-white flex items-center gap-5 shadow-sm z-10">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 shadow-inner">
            <Sparkles className="w-6 h-6 text-indigo-100" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif tracking-wide">Conselheiro Virtual</h2>
            <p className="text-indigo-100 text-sm font-medium opacity-90 mt-0.5">Sempre aqui para ouvir e apoiar</p>
          </div>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAFA] scroll-smooth">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Ícone do Avatar */}
                <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center mt-auto shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-50 text-[#3B429F] border border-indigo-100' 
                    : 'bg-gradient-to-br from-[#3B429F] to-[#5058B5] text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Balão de Mensagem */}
                <div className={`px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-[#3B429F] to-[#4A52A8] text-white rounded-3xl rounded-br-sm' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-3xl rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          
          {/* Indicador de Carregamento */}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="flex gap-3 flex-row max-w-[80%]">
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#3B429F] to-[#5058B5] text-white flex items-center justify-center mt-auto shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="px-5 py-4 bg-white border border-gray-100 rounded-3xl rounded-bl-sm shadow-sm flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-[#3B429F] animate-spin" />
                  <span className="text-sm text-gray-500 font-medium">Buscando a melhor resposta...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input de Texto */}
        <div className="p-5 bg-white border-t border-gray-100">
          <div className="flex items-end gap-3 bg-[#F4F4F5] p-2 rounded-3xl border border-transparent focus-within:border-[#3B429F]/30 focus-within:bg-white focus-within:shadow-md transition-all duration-300">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escreva sua mensagem ou desabafo..."
              className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-700 placeholder-gray-400 text-[15px] resize-none max-h-32 min-h-[48px]"
              rows="1"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 mb-1 mr-1 bg-[#3B429F] text-white rounded-full hover:bg-[#2D3380] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5 transform duration-200"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3 font-light">
            O conselheiro virtual pode cometer erros. Considere buscar apoio da sua liderança pastoral.
          </p>
        </div>

      </div>
    </div>
  );
}