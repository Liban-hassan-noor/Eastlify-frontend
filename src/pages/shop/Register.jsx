import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Store, MapPin, Phone, User, Tag } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_STREETS } from '../../data/mockData';

export default function Register() {
  const navigate = useNavigate();
  const { registerShop } = useShop();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: MOCK_STREETS[0],
    category: MOCK_CATEGORIES[0].name,
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, validation here
    registerShop({
      ...formData,
      categories: [formData.category] // Simplified to single category for MVP registration
    });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Shop</h1>
        <p className="text-gray-600">Join thousands of Eastleigh businesses online.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition"
                placeholder="e.g. Al-Amin Textiles"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition"
                placeholder="e.g. 0712345678"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street / Mall</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.street}
                  onChange={e => setFormData({...formData, street: e.target.value})}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition appearance-none bg-white"
                >
                  {MOCK_STREETS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
               <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition appearance-none bg-white"
                >
                  {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea
              required
              rows="3"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition resize-none"
              placeholder="What do you sell?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition shadow-lg shadow-amber-600/20 active:scale-95"
          >
            Create Shop
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have a shop?{' '}
          <Link to="/login" className="text-amber-600 font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
