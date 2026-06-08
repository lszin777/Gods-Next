import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui no futuro entrará a lógica de conectar com o banco de dados
    console.log('Tentativa de login:', formData);
  };

  return (
    <div 
      className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center relative bg-cover bg-center" 
      style={{ backgroundImage: "url('/src/imagens/imagens/fundoplanta.png')" }}
    >
      {/* Camada de desfoque e correntes sobre o fundo */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
            Acesse a sua conta
          </h1>
          <p className="text-gray-600 font-light">
            Que bom ter você de volta!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B429F] focus:bg-white transition-all shadow-sm"
                required
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 bg-white/50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B429F] focus:bg-white transition-all shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#3B429F] transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Esqueceu a senha */}
            <div className="flex justify-end mt-2">
              <Link to="/esqueci-senha" className="text-sm text-[#3B429F] hover:underline font-medium">
                Esqueceu a sua senha?
              </Link>
            </div>
          </div>

          {/* Botão de Entrar */}
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#313785" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#3B429F] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            ENTRAR
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>

        {/* Link para Criar Conta */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Ainda não tem conta?{' '}
            <Link to="/cadastro" className="text-[#3B429F] font-semibold hover:underline">
              Crie uma agora
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}