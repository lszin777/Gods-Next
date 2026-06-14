import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

// Integração com Firebase
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Salva o Nome Completo no perfil do Firebase
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      alert('Conta criada com sucesso! Seja bem-vindo(a).');
      navigate('/diario');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está sendo utilizado por outra conta.');
      } else if (err.code === 'auth/invalid-email') {
        setError('O formato do e-mail inserido é inválido.');
      } else {
        setError('Ocorreu um erro ao criar a conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center relative bg-cover bg-center" 
      style={{ backgroundImage: "url('/src/imagens/imagens/fundoplanta.png')" }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
            Crie sua conta
          </h1>
          <p className="text-gray-600 font-light">
            Comece sua jornada de aproximação com Deus.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-xl mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nome Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                disabled={loading}
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B429F] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Campo de Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                disabled={loading}
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B429F] focus:bg-white transition-all"
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
                disabled={loading}
                value={formData.password}
                onChange={handleChange}
                placeholder="Crie uma senha"
                className="w-full pl-11 pr-12 py-3 bg-white/50 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B429F] focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#3B429F]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Confirmar Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ShieldCheck className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                disabled={loading}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repita a senha"
                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B429F] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={!loading ? { scale: 1.02, backgroundColor: "#313785" } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#3B429F] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </motion.button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Já possui uma conta?{' '}
            <Link to="/login" className="text-[#3B429F] font-semibold hover:underline">
              Fazer Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}