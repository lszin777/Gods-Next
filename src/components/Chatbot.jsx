import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Trash2 } from 'lucide-react';

export default function Chatbot({ user }) {
  // O Firebase garante se o usuário está logado através do App.jsx
  const isUserLoggedIn = !!user;

  // Guarda o histórico exclusivo usando o ID do usuário logado (evita mistura de dados)
  const [messages, setMessages] = useState(() => {
    if (!user) return [];
    const mensagensSalvas = localStorage.getItem(`chatbot_messages_${user.uid}`);
    if (mensagensSalvas) return JSON.parse(mensagensSalvas);
    return [
      { 
        role: 'bot', 
        text: `Olá! Eu sou o conselheiro virtual do God's Next. Estou aqui para te ouvir, orar com você ou compartilhar uma palavra. Como você está se sentindo hoje?` 
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isUserLoggedIn) scrollToBottom();
  }, [messages, isUserLoggedIn]);

  // Salva no localStorage usando o ID único do usuário
  useEffect(() => {
    if (isUserLoggedIn && user?.uid) {
      localStorage.setItem(`chatbot_messages_${user.uid}`, JSON.stringify(messages));
    }
  }, [messages, isUserLoggedIn, user]);

  const limparConversa = () => {
    if (window.confirm("Deseja apagar o histórico desta conversa?")) {
      const inicial = [{ role: 'bot', text: 'Olá! Como posso te ajudar agora?' }];
      setMessages(inicial);
      localStorage.setItem(`chatbot_messages_${user.uid}`, JSON.stringify(inicial));
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Você é um conselheiro espiritual cristão empático e amigável do aplicativo God's Next. Responda de forma curta, acolhedora e use linguagem acessível. Se o usuário estiver triste ou passando por crises (como ansiedade), ofereça conforto e um versículo bíblico curto. Nunca dê respostas genéricas de robô. Usuário disse: ${userMessage}` }] }]
        })
      });

      if (!response.ok) throw new Error("Erro na API");

      const data = await response.json();
      const botReply = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Desculpe, minha conexão falhou agora. Pode tentar de novo?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Segurança extra: Se por algum motivo tentar renderizar sem usuário, não mostra nada
  if (!isUserLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-12 px-4 md:px-8 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col h-[78vh] overflow-hidden transition-all">
        
        {/* Cabeçalho do Chat */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white z-10 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3B429F] rounded-2xl flex items-center justify-center shadow-lg shadow-[#3B429F]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Conselheiro Virtual</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Online agora</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={limparConversa} 
            title="Limpar histórico da conversa"
            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F9FAFB]/50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar do Balão */}
                <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center shadow-sm ${
                  msg.role === 'user' ? 'bg-gray-100 text-[#3B429F]' : 'bg-[#3B429F] text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Balão de Mensagem */}
                <div className={`relative px-6 py-4 text-[15px] leading-relaxed transition-all ${
                  msg.role === 'user' 
                    ? 'bg-[#3B429F] text-white rounded-[22px] rounded-tr-none shadow-md shadow-[#3B429F]/10' 
                    : 'bg-white text-gray-700 rounded-[22px] rounded-tl-none border border-gray-100 shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          
          {/* Indicador de Digitação */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-4 items-center bg-white/80 px-6 py-4 rounded-[22px] border border-gray-50 shadow-sm">
                <Loader2 className="w-4 h-4 text-[#3B429F] animate-spin" />
                <span className="text-sm text-gray-400 font-medium">O conselheiro está escrevendo...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de Texto */}
        <div className="p-6 bg-white border-t border-gray-50">
          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-[24px] border border-gray-100 focus-within:border-[#3B429F]/40 focus-within:bg-white transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Desabafe aqui ou peça uma oração..."
              className="flex-1 bg-transparent px-5 py-3 outline-none text-gray-700 placeholder-gray-400 text-base"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 flex items-center justify-center bg-[#3B429F] text-white rounded-full hover:bg-[#2D3380] transition-all disabled:opacity-30 shadow-lg shadow-[#3B429F]/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-medium">
            God's Next • Conselheiro Espiritual Virtual
          </p>
        </div>
      </div>
    </div>
  );
}