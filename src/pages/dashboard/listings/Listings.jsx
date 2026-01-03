import { useState } from 'react';
import { useShop } from '../../../context/ShopContext';
import { Plus, Edit, Trash2, Tag, Search, AlertCircle } from 'lucide-react';
import ListingForm from './ListingForm';

export default function Listings() {
  const { currentUser, getShopListings, deleteListing } = useShop();
  const [isEditing, setIsEditing] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  
  if (!currentUser) return <div>Loading...</div>;

  const listings = getShopListings(currentUser.id);

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      deleteListing(id);
    }
  };

  const handleAddNew = () => {
    setEditingListing(null);
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setEditingListing(null);
  };

  if (isEditing) {
    return <ListingForm listing={editingListing} onClose={handleCloseForm} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
           <p className="text-gray-500 text-sm">Manage your shop window</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition shadow-sm active:scale-95"
        >
           <Plus className="w-5 h-5" /> Add New
        </button>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {listings.map(listing => (
             <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group">
                <div className="relative h-48 bg-gray-50">
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                  {listing.isOnOffer && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                      OFFER
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold shadow-sm ${
                     listing.availability === 'In Stock' ? 'bg-green-100 text-green-700' : 
                     listing.availability === 'Limited' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {listing.availability}
                  </div>
                </div>
                
                <div className="p-4">
                   <h3 className="font-bold text-gray-900 mb-1 truncate">{listing.title}</h3>
                   <div className="flex items-center gap-2 mb-3">
                      <span className="text-amber-600 font-bold">
                        KES {listing.isOnOffer ? listing.offerPrice.toLocaleString() : listing.price.toLocaleString()}
                      </span>
                      {listing.isOnOffer && (
                        <span className="text-gray-400 text-sm line-through decoration-red-500/50">
                          {listing.price.toLocaleString()}
                        </span>
                      )}
                   </div>
                   
                   <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button 
                        onClick={() => handleEdit(listing)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200"
                      >
                         <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button 
                         onClick={() => handleDelete(listing.id)}
                         className="px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-300" />
           </div>
           <h3 className="text-lg font-bold text-gray-900 mb-1">No listings yet</h3>
           <p className="text-gray-500 mb-6">Start adding items to your shop window.</p>
           <button 
              onClick={handleAddNew}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition"
           >
              Add Your First Item
           </button>
        </div>
      )}
    </div>
  );
}
