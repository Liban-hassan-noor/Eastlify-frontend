import { useState, useEffect } from 'react';
import { useShop } from '../../../context/ShopContext';
import { X, Save, Image as ImageIcon, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../../data/mockData';

const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Brown', 'Navy', 'Grey'];
const COLOR_SWATCHES = {
  'Black': '#000000', 'White': '#FFFFFF', 'Red': '#EF4444', 
  'Blue': '#3B82F6', 'Green': '#10B981', 'Yellow': '#F59E0B', 
  'Pink': '#EC4899', 'Brown': '#78350F', 'Navy': '#1E3A8A', 'Grey': '#6B7280'
};
const ALPHA_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const NUMERIC_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

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
    images: [],
    hasSizes: true,
    hasColors: true,
    variants: []
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
         images: listing.images || [],
         hasSizes: listing.hasSizes || false,
         hasColors: listing.hasColors || false,
         variants: listing.variants || []
      });
    }
  }, [listing]);

  // Sync attributes with category defaults
  useEffect(() => {
    if (!listing) { // Only sync for new listings or if manual override isn't set
      const categoryData = MOCK_CATEGORIES.find(c => c.name === formData.category);
      if (categoryData?.attributes) {
        setFormData(prev => ({
          ...prev,
          hasSizes: categoryData.attributes.hasSizes,
          hasColors: categoryData.attributes.hasColors,
          // Reset variants if attributes are disabled
          variants: prev.variants.filter(v => 
            (categoryData.attributes.hasSizes ? true : !v.size) &&
            (categoryData.attributes.hasColors ? true : !v.color)
          )
        }));
      }
    }
  }, [formData.category, listing]);

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
      images: formData.images.filter(img => typeof img === 'string' && img.trim() !== ''),
      variants: formData.variants,
      hasSizes: formData.hasSizes,
      hasColors: formData.hasColors
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

  const toggleQuickColor = (color) => {
    const currentColors = [...new Set(formData.variants.map(v => v.color))];
    if (currentColors.includes(color)) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter(v => v.color !== color)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { color, size: '', stock: 0, inStock: true }]
      }));
    }
  };

  const toggleQuickSize = (size) => {
    const currentSizes = [...new Set(formData.variants.map(v => v.size))];
    if (currentSizes.includes(size)) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter(v => v.size !== size)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { size, color: '', stock: 0, inStock: true }]
      }));
    }
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

          {/* Attributes Toggles */}
          {(formData.hasSizes || formData.hasColors || true) && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <div>
                      <div className="text-sm font-bold text-gray-700">Enable Sizes</div>
                      <div className="text-[10px] text-gray-400">e.g. S, M, XL or 38, 40</div>
                   </div>
                   <button
                      type="button"
                      disabled={loading}
                      onClick={() => setFormData(prev => ({ ...prev, hasSizes: !prev.hasSizes, variants: [] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.hasSizes ? 'bg-amber-600' : 'bg-gray-200'}`}
                   >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.hasSizes ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <div>
                      <div className="text-sm font-bold text-gray-700">Enable Colors</div>
                      <div className="text-[10px] text-gray-400">e.g. Black, White, Red</div>
                   </div>
                   <button
                      type="button"
                      disabled={loading}
                      onClick={() => setFormData(prev => ({ ...prev, hasColors: !prev.hasColors, variants: [] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.hasColors ? 'bg-amber-600' : 'bg-gray-200'}`}
                   >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.hasColors ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                </div>
             </div>
          )}

          {/* Simple Tap Variant Selection */}
          {(formData.hasSizes || formData.hasColors) && (
             <div className="space-y-6 pt-4">
                {/* Quick Select Section */}
                <div className="bg-white p-6 rounded-3xl border-2 border-amber-100 shadow-sm space-y-6">
                   <div className="flex items-center gap-2 mb-2">
                     <Sparkles className="w-5 h-5 text-amber-500" />
                     <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Quick Tap Selection</h3>
                   </div>

                   {formData.hasColors && (
                     <div className="space-y-3">
                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Select Colors</label>
                       <div className="flex flex-wrap gap-3">
                         {COLORS.map(color => {
                           const isSelected = [...new Set(formData.variants.map(v => v.color))].includes(color);
                           const swatchColor = COLOR_SWATCHES[color] || '#CCC';
                           return (
                             <button
                               key={color}
                               type="button"
                               onClick={() => toggleQuickColor(color)}
                               className={`group relative flex flex-col items-center gap-2 p-2 rounded-2xl border-2 transition-all ${
                                 isSelected ? 'border-amber-500 bg-amber-50' : 'border-gray-100 hover:border-amber-200 bg-gray-50'
                               }`}
                             >
                               <div 
                                 className="w-10 h-10 rounded-xl shadow-inner border border-black/5 group-active:scale-95 transition-transform"
                                 style={{ backgroundColor: swatchColor }}
                               />
                               <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-700' : 'text-gray-500'}`}>{color}</span>
                               {isSelected && (
                                 <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-md">
                                   <Save className="w-3 h-3" />
                                 </div>
                               )}
                             </button>
                           );
                         })}
                         {/* Custom Color Input */}
                         <div className="flex flex-col gap-2 p-2 text-center">
                            <input 
                               type="text" 
                               placeholder="Other..."
                               onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                     e.preventDefault();
                                     if (e.target.value) {
                                        toggleQuickColor(e.target.value);
                                        e.target.value = '';
                                     }
                                  }
                               }}
                               className="w-20 h-10 px-2 text-[10px] font-bold border-2 border-dashed border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:bg-amber-50"
                            />
                            <span className="text-[10px] font-black text-gray-300 uppercase">Add New</span>
                         </div>
                       </div>
                     </div>
                   )}

                   {formData.hasSizes && (
                     <div className="space-y-3 pt-4 border-t border-gray-100">
                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Select Sizes</label>
                       <div className="flex flex-wrap gap-2">
                         {(MOCK_CATEGORIES.find(c => c.name === formData.category)?.attributes?.sizeType === 'numeric' ? NUMERIC_SIZES : ALPHA_SIZES).map(size => {
                           const isSelected = [...new Set(formData.variants.map(v => v.size))].includes(size);
                           return (
                             <button
                               key={size}
                               type="button"
                               onClick={() => toggleQuickSize(size)}
                               className={`px-5 py-2.5 rounded-2xl text-xs font-black border-2 transition-all ${
                                 isSelected ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105 z-10' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-amber-200'
                               }`}
                             >
                               {size}
                             </button>
                           );
                         })}
                          {/* Custom Size Input */}
                          <input 
                               type="text" 
                               placeholder="Custom"
                               onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                     e.preventDefault();
                                     if (e.target.value) {
                                        toggleQuickSize(e.target.value);
                                        e.target.value = '';
                                     }
                                  }
                               }}
                               className="w-20 h-10 px-4 text-xs font-black border-2 border-dashed border-gray-200 rounded-2xl outline-none focus:border-amber-400 focus:bg-amber-50"
                            />
                       </div>
                     </div>
                   )}
                </div>

                {/* Stock Management Table */}
                {formData.variants.length > 0 && (
                   <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                      <div className="flex items-center justify-between">
                         <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Set Stock Quantities</h3>
                         <p className="text-[10px] font-bold text-gray-400 italic">Tapping colors/sizes above automatically adds rows here</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {formData.variants.map((variant, index) => (
                            <div key={index} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all group ${
                               variant.inStock ? 'bg-white border-transparent shadow-sm' : 'bg-gray-100 border-gray-100 opacity-60'
                            }`}>
                               <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                     {variant.color && (
                                        <div 
                                           className="w-3 h-3 rounded-full border border-black/5" 
                                           style={{ backgroundColor: COLOR_SWATCHES[variant.color] || '#CCC' }} 
                                        />
                                     )}
                                     <span className="text-sm font-black text-gray-900">
                                        {[variant.color, variant.size].filter(Boolean).join(' / ')}
                                     </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                     <div className="flex items-center bg-gray-50 rounded-xl px-3 border border-gray-100 focus-within:border-amber-300 transition-colors">
                                        <span className="text-[10px] font-black text-gray-400 uppercase mr-2">Qty</span>
                                        <input 
                                           type="number"
                                           value={variant.stock}
                                           disabled={!variant.inStock}
                                           onChange={e => {
                                              const newVariants = [...formData.variants];
                                              newVariants[index].stock = Number(e.target.value);
                                              setFormData({ ...formData, variants: newVariants });
                                           }}
                                           className="w-12 py-2 bg-transparent text-sm font-black text-gray-700 outline-none"
                                        />
                                     </div>
                                     <button
                                        type="button"
                                        onClick={() => {
                                           const newVariants = [...formData.variants];
                                           newVariants[index].inStock = !newVariants[index].inStock;
                                           setFormData({ ...formData, variants: newVariants });
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition ${
                                           variant.inStock 
                                              ? 'bg-green-50 text-green-700 border border-green-100' 
                                              : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}
                                     >
                                        {variant.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${variant.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                                     </button>
                                  </div>
                               </div>
                               <button
                                  type="button"
                                  onClick={() => {
                                     const newVariants = formData.variants.filter((_, i) => i !== index);
                                     setFormData({ ...formData, variants: newVariants });
                                  }}
                                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                               >
                                  <X className="w-5 h-5" />
                               </button>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
             </div>
          )}

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
