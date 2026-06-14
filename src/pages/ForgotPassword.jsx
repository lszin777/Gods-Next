import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

// Integração com Firebase
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('Não encontramos nenhuma conta com este e-mail.');
      } else if (err.code === 'auth/invalid-email') {
        setError('O formato do e-mail digitado é inválido.');
      } else {
        setError('Ocorreu um erro ao processar seu pedido. Tente novamente.');
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50"
      >
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#3B429F] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Login
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
                  Recuperar Senha
                </h1>
                <p className="text-gray-600 font-light text-sm">
                  Digite o e-mail cadastrado e enviaremos um link para você redefinir sua senha.
                </p>
              </div>

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-xl mb-4 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">E-mail</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      disabled={loading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B429F] focus:bg-white transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={!loading ? { scale: 1.02, backgroundColor: "#313785" } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#3B429F] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  {loading ? 'ENVIANDO...' : 'ENVIAR LINK'}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">E-mail Enviado!</h2>
              <p className="text-gray-600 mb-8">
                Enviamos as instruções de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e a pasta de spam.
              </p>
              <motion.button
                onClick={() => setIsSubmitted(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#3B429F] font-semibold hover:underline"
              >
                Tentar outro e-mail
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}