import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Phone, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useShop();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(phone)) {
      navigate('/dashboard');
    } else {
      setError('Shop not found. Please register first.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
       <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              🏪
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Owner Login</h1>
            <p className="text-gray-500">Enter your phone number to access your dashboard.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition text-lg bg-gray-50 focus:bg-white"
                  placeholder="07..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition flex items-center justify-center gap-2"
            >
              Enter Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 mb-3">New to Eastlify?</p>
            <Link 
              to="/register" 
              className="block w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:border-amber-600 hover:text-amber-600 transition"
            >
              Register your Shop
            </Link>
          </div>
       </div>
       
       <div className="text-center mt-8 space-y-2 text-sm text-gray-400">
          <p>Mock Login: Use <span className="font-mono text-gray-600">+254700000001</span></p>
          <p>No password needed for MVP demo.</p>
       </div>
    </div>
  );
}
