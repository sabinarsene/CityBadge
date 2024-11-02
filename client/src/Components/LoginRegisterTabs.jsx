import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, EyeOff, Eye } from 'lucide-react';
import './LoginRegisterTabs.css';

const LoginRegisterTabs = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Bine ai revenit!' : 'Creează cont nou'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLogin 
                ? 'Conectează-te pentru a continua aventura' 
                : 'Începe să explorezi orașul într-un mod nou'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Numele tău complet"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Adresa de email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Parola"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-blue-600 hover:underline">
                  Ai uitat parola?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group"
            >
              <span>{isLogin ? 'Conectare' : 'Crează cont'}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">sau</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img src="/api/placeholder/24/24" alt="Google" className="w-6 h-6" />
                <span className="text-gray-600">
                  {isLogin ? 'Conectare cu Google' : 'Înregistrare cu Google'}
                </span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 bg-gray-50 text-center">
            <p className="text-gray-600">
              {isLogin ? 'Nu ai cont?' : 'Ai deja cont?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-blue-600 hover:underline font-medium"
              >
                {isLogin ? 'Înregistrează-te' : 'Conectează-te'}
              </button>
            </p>
          </div>
        </div>

        {/* Terms and Privacy */}
        <p className="mt-8 text-center text-sm text-white/80">
          Continuând, ești de acord cu{' '}
          <a href="#" className="text-white hover:underline">
            Termenii și Condițiile
          </a>{' '}
          și{' '}
          <a href="#" className="text-white hover:underline">
            Politica de Confidențialitate
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginRegisterTabs;