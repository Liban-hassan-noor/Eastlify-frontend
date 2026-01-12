import { useState, useEffect } from 'react';
import { useShop } from '../../../context/ShopContext';
import { Plus, Edit, Trash2, Tag, Search, AlertCircle, Loader2 } from 'lucide-react';
import ListingForm from './ListingForm';

export default function Listings() {
  const { currentUser, myListings, listings, listingsLoading, fetchMyListings, deleteListing } = useShop();
  const [isEditing, setIsEditing] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  
  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  if (!currentUser) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
      <p className="text-gray-500">Loading your shop...</p>
    </div>
  );

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      const result = await deleteListing(id);
      if (!result.success) {
        alert('Failed to delete: ' + result.message);
      }
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

      {listingsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
          <p className="text-gray-500">Updating inventory...</p>
        </div>
      ) : myListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {myListings.map((listing, index) => (
             <div key={listing._id || index} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group">
                <div className="relative h-48 bg-gray-50">
                  <img src={listing.images?.[0] || 'https://images.unsplash.com/photo-1581417478175-a9ef18f210c1?auto=format&fit=crop&q=80&w=800'} alt={listing.name} className="w-full h-full object-cover" />
                  {listing.compareAtPrice > listing.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                      OFFER
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold shadow-sm ${
                     listing.inStock ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {listing.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
                
                <div className="p-4">
                   <h3 className="font-bold text-gray-900 mb-1 truncate">{listing.name}</h3>
                   <div className="flex items-center gap-2 mb-3">
                      <span className="text-amber-600 font-bold">
                        KES {listing.price?.toLocaleString()}
                      </span>
                      {listing.compareAtPrice > listing.price && (
                        <span className="text-gray-400 text-sm line-through decoration-red-500/50">
                          {listing.compareAtPrice?.toLocaleString()}
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
                         onClick={() => handleDelete(listing._id)}
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
