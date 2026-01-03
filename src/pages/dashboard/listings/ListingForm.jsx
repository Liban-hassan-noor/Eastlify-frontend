import { useState, useEffect } from 'react';
import { useShop } from '../../../context/ShopContext';
import { X, Save, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../../data/mockData';

export default function ListingForm({ listing, onClose }) {
  const { currentUser, addListing, updateListing } = useShop();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    isOnOffer: false,
    offerPrice: '',
    availability: 'In Stock',
    category: 'Textiles',
    images: [''],
    shopId: currentUser.id
  });

  useEffect(() => {
    if (listing) {
      setFormData({
         ...listing,
         // Ensure single image in array is handled for simple form
         images: listing.images.length > 0 ? listing.images : ['']
      });
    }
  }, [listing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      price: Number(formData.price),
      offerPrice: formData.isOnOffer ? Number(formData.offerPrice) : null,
      // Filter out empty image strings
      images: formData.images.filter(img => img.trim() !== '')
    };

    if (listing) {
      updateListing(listing.id, dataToSave);
    } else {
      addListing(dataToSave);
    }
    onClose();
  };

  const handleImageChange = (value) => {
    setFormData(prev => ({ ...prev, images: [value] }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {listing ? 'Edit Listing' : 'Add New Listing'}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
             <input
               required
               type="text"
               value={formData.title}
               onChange={e => setFormData({...formData, title: e.target.value})}
               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition"
               placeholder="e.g. Silk Dirac Set"
             />
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
             <select
               value={formData.category}
               onChange={e => setFormData({...formData, category: e.target.value})}
               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none transition bg-white"
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
             />
           </div>

           <div>
              <div className="flex items-center justify-between mb-2">
                 <label className="text-sm font-bold text-gray-700">On Offer?</label>
                 <button
                   type="button"
                   onClick={() => setFormData(prev => ({ ...prev, isOnOffer: !prev.isOnOffer }))}
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isOnOffer ? 'bg-amber-600' : 'bg-gray-200'}`}
                 >
                   <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.isOnOffer ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
              </div>
              <input
                 type="number"
                 disabled={!formData.isOnOffer}
                 value={formData.offerPrice || ''}
                 onChange={e => setFormData({...formData, offerPrice: e.target.value})}
                 className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition ${formData.isOnOffer ? 'bg-white border-amber-500' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                 placeholder={formData.isOnOffer ? "Offer Price" : "Enable offer first"}
              />
           </div>
        </div>

        {/* Availability & Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Availability</label>
              <select
                 value={formData.availability}
                 onChange={e => setFormData({...formData, availability: e.target.value})}
                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none transition bg-white"
              >
                 <option>In Stock</option>
                 <option>Limited</option>
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
                   <label className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition text-gray-400 hover:text-amber-600">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs font-bold">Add Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
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
              <p className="text-xs text-gray-400">Tap to upload from gallery. Images are saved locally for demo.</p>
           </div>
        </div>

        <button
           type="submit"
           className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10 active:scale-95"
        >
           <Save className="w-5 h-5" />
           {listing ? 'Update Listing' : 'Save Listing'}
        </button>
      </form>
    </div>
  );
}
