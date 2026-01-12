import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Camera, Loader2, Save, MapPin, Phone, Mail, User, Building2, MessageSquare, Trash2, X, Store, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { MOCK_STREETS, MOCK_CATEGORIES } from '../../data/mockData';

export default function MyShop() {
  const { currentUser, updateShop, deleteShop, logout, fetchMyShop } = useShop();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    const loadShop = async () => {
      setInitialLoading(true);
      await fetchMyShop();
      setInitialLoading(false);
    };
    loadShop();
  }, [fetchMyShop]);

  useEffect(() => {
    if (currentUser?.shop) {
      setFormData(currentUser.shop);
    }
  }, [currentUser?.shop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    // Remove transient UI fields if they exist before sending to API
    const dataToSend = { ...formData };
    
    const result = await updateShop(dataToSend);
    
    if (result.success) {
      setStatus({ type: 'success', message: 'Shop profile updated successfully!' });
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
    } else {
      setStatus({ type: 'error', message: result.message || 'Failed to update shop profile' });
    }
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (categoryName) => {
    setFormData(prev => {
      const currentCats = prev.categories || [];
      const newCategories = currentCats.includes(categoryName)
        ? currentCats.filter(cat => cat !== categoryName)
        : [...currentCats, categoryName];
      return { ...prev, categories: newCategories };
    });
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
         setStatus({ type: 'error', message: 'Image size must be less than 5MB' });
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    setFormData(prev => ({ ...prev, [type]: '' }));
  };

  const handleDeleteShop = async () => {
    if (!currentUser?.shop?._id) return;
    setLoading(true);
    const result = await deleteShop(currentUser.shop._id);
    if (result.success) {
      // Re-fetch profile or logout if shop is deleted?
      // For now, let's just go home.
      logout();
      navigate('/');
    } else {
      setStatus({ type: 'error', message: result.message || 'Failed to remove shop' });
      setShowDeleteConfirm(false);
    }
    setLoading(false);
  };

  if (initialLoading || !currentUser) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
      <p className="text-gray-500 font-medium font-outfit">Loading your professional dashboard...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* STATUS NOTIFICATION */}
      {status.message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold">{status.message}</span>
          <button onClick={() => setStatus({ type: '', message: '' })} className="ml-auto opacity-50 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER WITH IMAGES */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 bg-gray-100 group/cover">
          {formData.coverImage ? (
            <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
               <Store className="w-16 h-16 text-amber-200" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/10 transition-colors" />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition active:scale-95 flex items-center gap-2 text-sm font-bold text-gray-700"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Change Cover</span>
            </button>
            {formData.coverImage && (
              <button 
                onClick={() => removeImage('coverImage')}
                className="p-2.5 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverImage')} />
        </div>

        {/* Profile Info Row */}
        <div className="px-8 pb-8 -mt-12 relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="relative group/profile">
            <div className="w-32 h-32 rounded-[2rem] bg-white p-1.5 shadow-xl border border-gray-100 overflow-hidden">
              <div className="w-full h-full rounded-[1.8rem] bg-gray-50 overflow-hidden">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-600">
                    <User className="w-12 h-12 opacity-50" />
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-2 bg-amber-600 text-white rounded-xl shadow-lg hover:bg-amber-700 transition active:scale-95 border-2 border-white"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profileImage')} />
          </div>

          <div className="flex-1 text-center sm:text-left pt-2 pb-2">
             <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{formData.shopName || 'Market Shop'}</h1>
             <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full text-sm">
                  <MapPin className="w-4 h-4" /> {formData.street || 'Set location'}
                </span>
                <span className="flex items-center gap-1.5 text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full text-sm">
                  <User className="w-4 h-4" /> {formData.ownerName || 'Set owner'}
                </span>
             </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* GENERAL INFO SECTION */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-600" />
              General Information
            </h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Shop Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Al-Amin Textiles"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition font-medium text-gray-900"
                  value={formData.shopName || ''}
                  onChange={e => handleInputChange('shopName', e.target.value)}
                />
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Owner Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Abdullahi Mohammed"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition font-medium text-gray-900"
                  value={formData.ownerName || ''}
                  onChange={e => handleInputChange('ownerName', e.target.value)}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Shop Categories (Select all that apply)</label>
              <div className="p-4 bg-gray-50 rounded-[2rem] border border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {MOCK_CATEGORIES.map(cat => (
                    <button
                      key={cat.id || cat.name}
                      type="button"
                      onClick={() => toggleCategory(cat.name)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        (formData.categories || []).includes(cat.name)
                          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20 active:scale-95'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-400'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">About Your Shop</label>
              <textarea
                rows="4"
                placeholder="Share your story, your products, and what makes your shop unique..."
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-[2rem] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition font-medium text-gray-900 resize-none"
                value={formData.description || ''}
                onChange={e => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* CONTACT & LOCATION SECTION */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              Contact & Location
            </h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Primary Phone</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+254 700 000 000"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition font-medium text-gray-900"
                  value={formData.phone || ''}
                  onChange={e => handleInputChange('phone', e.target.value)}
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">WhatsApp Business (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+254 700 000 000"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition font-medium text-gray-900"
                  value={formData.whatsapp || ''}
                  onChange={e => handleInputChange('whatsapp', e.target.value)}
                />
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Public Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="contact@yourshop.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition font-medium text-gray-900"
                  value={formData.email || ''}
                  onChange={e => handleInputChange('email', e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Street Location</label>
              <div className="relative">
                <select 
                  required
                  className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition font-bold text-gray-900 appearance-none cursor-pointer"
                  value={formData.street || ''}
                  onChange={e => handleInputChange('street', e.target.value)}
                >
                  <option value="">Select a street</option>
                  {MOCK_STREETS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Building & Floor Details</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Amal Plaza, 2nd Floor, Room 14"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition font-medium text-gray-900"
                  value={formData.buildingFloor || ''}
                  onChange={e => handleInputChange('buildingFloor', e.target.value)}
                />
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </section>

        {/* SAVE BUTTON */}
        <div className="flex justify-center sm:justify-end py-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-12 py-4 bg-gray-900 text-white rounded-[2rem] font-extrabold text-lg hover:bg-black transition-all shadow-xl shadow-gray-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Updating Profile...
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                Save New Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* DANGER ZONE */}
      <section className="bg-red-50/30 rounded-[2.5rem] border border-red-100/50 p-8 space-y-4">
        <div className="flex items-center gap-3 text-red-600">
           <AlertTriangle className="w-6 h-6" />
           <h3 className="text-lg font-extrabold">Danger Zone</h3>
        </div>
        <p className="text-gray-600 text-sm max-w-2xl">
          Once you delete your shop, all your listings, orders, and sales history will be permanently removed. This action cannot be undone.
        </p>
        
        {!showDeleteConfirm ? (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-50 transition"
          >
            Remove My Shop
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="text-red-700 font-bold text-sm">Are you absolutely sure?</span>
            <button 
              onClick={handleDeleteShop}
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-600/20 transition active:scale-95"
            >
              Yes, Delete Permanent
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
