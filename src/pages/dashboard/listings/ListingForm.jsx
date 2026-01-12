import { useState, useEffect } from 'react';
import { useShop } from '../../../context/ShopContext';
import { X, Save, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../../data/mockData';

export default function ListingForm({ listing, onClose }) {
  const { currentUser, updateListing, addListing, token } = useShop();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    inStock: true,
    category: 'Textiles',
    images: []
  });

  useEffect(() => {
    if (listing) {
      setFormData({
         name: listing.name || '',
         description: listing.description || '',
         price: listing.price || '',
         compareAtPrice: listing.compareAtPrice || '',
         inStock: listing.inStock !== undefined ? listing.inStock : true,
         category: listing.category || 'Textiles',
         images: listing.images || []
      });
    }
  }, [listing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const priceNum = Number(formData.price);
    const comparePriceNum = formData.compareAtPrice ? Number(formData.compareAtPrice) : null;

    if (isNaN(priceNum)) {
      setError('Please enter a valid price');
      setLoading(false);
      return;
    }

    const dataToSave = {
      ...formData,
      price: priceNum,
      compareAtPrice: comparePriceNum,
      images: formData.images.filter(img => typeof img === 'string' && img.trim() !== '')
    };

    let result;
    try {
      if (listing) {
        result = await updateListing(listing._id, dataToSave);
      } else {
        result = await addListing(dataToSave);
      }

      if (result.success) {
        onClose();
      } else {
        setError(result.message || 'Operation failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (value) => {
    setFormData(prev => ({ ...prev, images: [...prev.images, value] }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {listing ? 'Edit Listing' : 'Add New Listing'}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition" disabled={loading}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
             <input
               required
               type="text"
               value={formData.name}
               onChange={e => setFormData({...formData, name: e.target.value})}
               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition"
               placeholder="e.g. Silk Dirac Set"
               disabled={loading}
             />
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
             <select
               value={formData.category}
               onChange={e => setFormData({...formData, category: e.target.value})}
               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none transition bg-white"
               disabled={loading}
             >
               {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
             </select>
           </div>
           
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
             <textarea
               required
               rows="3"
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none transition"
               placeholder="Describe the item details..."
               disabled={loading}
             />
           </div>
        </div>

        {/* Price & Offer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Price (KES)</label>
             <input
               required
               type="number"
               min="0"
               value={formData.price}
               onChange={e => setFormData({...formData, price: e.target.value})}
               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none transition bg-white"
               disabled={loading}
             />
           </div>

           <div>
              <div className="flex items-center justify-between mb-2">
                 <label className="text-sm font-bold text-gray-700">On Offer?</label>
                 <button
                   type="button"
                   disabled={loading}
                   onClick={() => {
                        const isCurrentlyOffer = formData.compareAtPrice !== '';
                        setFormData(prev => ({ 
                            ...prev, 
                            compareAtPrice: isCurrentlyOffer ? '' : prev.price 
                        }));
                   }}
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.compareAtPrice ? 'bg-amber-600' : 'bg-gray-200'}`}
                 >
                   <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.compareAtPrice ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
              </div>
              <input
                 type="number"
                 disabled={!formData.compareAtPrice || loading}
                 value={formData.compareAtPrice || ''}
                 onChange={e => setFormData({...formData, compareAtPrice: e.target.value})}
                 className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition ${formData.compareAtPrice ? 'bg-white border-amber-500' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                 placeholder={formData.compareAtPrice ? "Original Price" : "Enable offer first"}
              />
           </div>
        </div>

        {/* Availability & Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Availability</label>
              <select
                 value={formData.inStock ? 'In Stock' : 'Out of Stock'}
                 onChange={e => setFormData({...formData, inStock: e.target.value === 'In Stock'})}
                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none transition bg-white"
                 disabled={loading}
              >
                 <option>In Stock</option>
                 <option>Out of Stock</option>
              </select>
           </div>

           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Item Images (Max 5)</label>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                 {formData.images.map((img, index) => (
                    img && (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                         <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                         <button
                           type="button"
                           disabled={loading}
                           onClick={() => setFormData(prev => ({
                             ...prev,
                             images: prev.images.filter((_, i) => i !== index)
                           }))}
                           className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition"
                         >
                           <X className="w-3 h-3" />
                         </button>
                      </div>
                    )
                 ))}
                 
                 {formData.images.length < 5 && (
                   <label className={`aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition text-gray-400 hover:text-amber-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs font-bold">Add Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        disabled={loading}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                             const reader = new FileReader();
                             reader.onloadend = () => {
                                handleImageChange(reader.result);
                             };
                             reader.readAsDataURL(file);
                          }
                        }}
                      />
                   </label>
                 )}
              </div>
              <p className="text-xs text-gray-400">Tap to upload photos. They will be stored in the cloud.</p>
           </div>
        </div>

        <button
           type="submit"
           disabled={loading}
           className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10 active:scale-95 disabled:opacity-50"
        >
           {loading ? (
             <>
               <Loader2 className="w-5 h-5 animate-spin" />
               {listing ? 'Updating...' : 'Saving...'}
             </>
           ) : (
             <>
               <Save className="w-5 h-5" />
               {listing ? 'Update Listing' : 'Save Listing'}
             </>
           )}
        </button>
      </form>
    </div>
  );
}
