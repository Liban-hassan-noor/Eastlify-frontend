import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import ShopCard from '../../components/ShopCard';
import { Search, SlidersHorizontal, X, Heart } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_STREETS } from '../../data/mockData';

export default function BrowseShops() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { shops, favorites } = useShop();
  
  const categoryParam = searchParams.get('category');
  const streetParam = searchParams.get('street');
  const searchParam = searchParams.get('search') || '';
  const showFavorites = searchParams.get('filter') === 'favorites';

  const filteredShops = useMemo(() => {
     return shops.filter(shop => {
       const matchCategory = !categoryParam || categoryParam === 'All' || shop.categories.includes(categoryParam);
       const matchStreet = !streetParam || shop.street === streetParam;
       const matchSearch = !searchParam || 
          shop.name.toLowerCase().includes(searchParam.toLowerCase()) || 
          shop.categories.some(c => c.toLowerCase().includes(searchParam.toLowerCase())) ||
          shop.street.toLowerCase().includes(searchParam.toLowerCase());
       
       const matchFavorite = !showFavorites || favorites.includes(shop.id);
       
       return matchCategory && matchStreet && matchSearch && matchFavorite;
     });
  }, [shops, categoryParam, streetParam, searchParam, showFavorites, favorites]);

  const clearFilters = () => {
    setSearchParams({});
  };

  const toggleFavoritesFilter = () => {
     const newParams = new URLSearchParams(searchParams);
     if (showFavorites) {
        newParams.delete('filter');
     } else {
        newParams.set('filter', 'favorites');
     }
     setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showFavorites ? 'My Favorite Shops' : (searchParam ? `Results for "${searchParam}"` : 'Browse Shops')}
          </h1>
          <p className="text-gray-500 text-sm">
             Showing {filteredShops.length} shops
             {(categoryParam || streetParam) && (
               <span> in <span className="font-medium text-gray-900">{categoryParam || streetParam}</span></span>
             )}
          </p>
        </div>
        
        {/* Simple Filter Pills */}
        <div className="flex flex-wrap gap-2">
           {(categoryParam || streetParam || searchParam || showFavorites) && (
              <button 
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
           )}
           
           <button 
             onClick={toggleFavoritesFilter}
             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                showFavorites 
                  ? 'bg-red-50 text-red-600 border-red-200' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:text-red-600'
             }`}
           >
              <Heart className={`w-3.5 h-3.5 ${showFavorites ? 'fill-current' : ''}`} />
              Favorites
           </button>

           
           <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:border-amber-500 hover:text-amber-600 transition">
                 <SlidersHorizontal className="w-3.5 h-3.5" />
                 Filter
              </button>
              {/* Dropdown could go here but skipping for MVP simple UI */}
           </div>
        </div>
      </div>

      {filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map(shop => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
           <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
           <h3 className="text-lg font-bold text-gray-900 mb-1">No boutiques found</h3>
           <p className="text-gray-500">Try adjusting your search or filters.</p>
           <button 
             onClick={clearFilters}
             className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition"
           >
             View All Shops
           </button>
        </div>
      )}
    </div>
  );
}
