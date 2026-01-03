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
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={e => setFormData({...formData, email: e.target.value})}
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
             <label className="block text-sm font-bold text-gray-700 mb-2">Categories</label>
             <div className="flex flex-wrap gap-2">
                {MOCK_CATEGORIES.map(c => {
                  const isSelected = formData.categories?.includes(c.name);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => {
                          const currentCats = prev.categories || [];
                          const newCategories = isSelected
                            ? currentCats.filter(cat => cat !== c.name)
                            : [...currentCats, c.name];
                          return { ...prev, categories: newCategories };
                        });
                      }}
                       className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                        isSelected 
                          ? 'bg-amber-600 text-white border-amber-600' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Shop Profile Image</label>
             <div className="space-y-3">
               {formData.image && (
                 <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-gray-100 group">
                    <img src={formData.image} alt="Shop Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                       <span className="text-white font-bold text-sm">Change Image</span>
                    </div>
                 </div>
               )}
               
               <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition group">
                  <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-amber-600" />
                  <span className="text-gray-600 font-medium text-sm group-hover:text-amber-700">
                    {formData.image ? 'Replace Image' : 'Upload Shop Image'}
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                       const file = e.target.files[0];
                       if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                             setFormData({...formData, image: reader.result});
                          };
                          reader.readAsDataURL(file);
                       }
                    }}
                  />
               </label>
               <p className="text-xs text-gray-400 text-center">Tap to upload from gallery (Saved locally)</p>
             </div>
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
