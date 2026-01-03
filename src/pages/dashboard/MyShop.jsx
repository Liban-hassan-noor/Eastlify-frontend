import { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Save, Image as ImageIcon } from 'lucide-react';
import { MOCK_STREETS, MOCK_CATEGORIES } from '../../data/mockData';

export default function MyShop() {
  const { currentUser, updateShop } = useShop();
  const [formData, setFormData] = useState(currentUser || {});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({ ...currentUser });
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateShop(formData);
    setMsg('Shop updated successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl">
       <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Shop Profile</h2>
          {msg && <span className="text-green-600 text-sm font-bold animate-pulse">{msg}</span>}
       </div>
       
       <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Shop Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Street</label>
              <select
                value={formData.street || ''}
                onChange={e => setFormData({...formData, street: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none transition"
              >
                {MOCK_STREETS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
             <div className="flex gap-2">
               <div className="relative flex-1">
                 <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <input
                   type="text"
                   value={formData.image || ''}
                   onChange={e => setFormData({...formData, image: e.target.value})}
                   className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none transition text-sm text-gray-600"
                 />
               </div>
             </div>
             {formData.image && (
               <img src={formData.image} alt="Preview" className="h-20 w-full object-cover rounded-xl mt-2 border border-gray-100" />
             )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              rows="4"
              value={formData.description || ''}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none transition"
            />
          </div>

          <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition shadow-lg shadow-amber-600/20 active:scale-95">
             <Save className="w-5 h-5" /> Save Changes
          </button>
       </form>
    </div>
  );
}
