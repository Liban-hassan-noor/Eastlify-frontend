import { useMemo, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import ShopCard from '../../components/ShopCard';
import { Search, SlidersHorizontal, X, Heart, Loader2, MapPin, Tag } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../data/mockData';

export default function BrowseShops() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { shops, shopsLoading, shopsError, fetchShops, favorites } = useShop();
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');

  const hasFetched = useRef(false);

  const categoryParam = searchParams.get('category');
  const streetParam = searchParams.get('street');
  const searchParam = searchParams.get('search') || '';
  const showFavorites = searchParams.get('filter') === 'favorites';

  useEffect(() => {
    setLocalSearch(searchParam);
  }, [searchParam]);

  // ✅ FETCH ONLY ONCE
  useEffect(() => {
    if (!hasFetched.current) {
      fetchShops();
      hasFetched.current = true;
    }
  }, [fetchShops]);

  // ✅ FAST LOCAL FILTERING
  const filteredShops = useMemo(() => {
    let result = shops;

    if (categoryParam) {
      result = result.filter(s => 
        (s.categories && s.categories.includes(categoryParam)) || 
        s.category === categoryParam
      );
    }

    if (streetParam) {
      result = result.filter(s => s.street === streetParam);
    }

    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter(s => {
        const nameMatch = (s.shopName || s.name || '').toLowerCase().includes(q);
        const descMatch = (s.description || '').toLowerCase().includes(q);
        const streetMatch = (s.street || '').toLowerCase().includes(q);
        const catMatch = (s.categories || []).some(c => c.toLowerCase().includes(q)) || 
                         (s.category || '').toLowerCase().includes(q);
        return nameMatch || descMatch || streetMatch || catMatch;
      });
    }

    if (showFavorites) {
      result = result.filter(s => favorites.includes(s._id || s.id));
    }

    return result;
  }, [
    shops,
    categoryParam,
    streetParam,
    searchParam,
    showFavorites,
    favorites
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      newParams.set('search', localSearch);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const setCategory = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (!cat || categoryParam === cat) {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalSearch('');
  };

  const toggleFavoritesFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    showFavorites
      ? newParams.delete('filter')
      : newParams.set('filter', 'favorites');
    setSearchParams(newParams);
  };

  // ✅ Loader ONLY for first load
  if (shopsLoading && shops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
        <p className="text-gray-500 font-bold">Connecting to Eastleigh...</p>
      </div>
    );
  }

  if (shopsError) {
    return (
      <div className="bg-red-50 p-10 rounded-3xl border border-red-100 text-center">
        <p className="text-red-600">{shopsError}</p>
        <button
          onClick={fetchShops}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <input
            type="text"
            placeholder="Search for shops or products..."
            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-amber-500 transition-colors" />
        </form>

        {/* CATEGORY PILLS */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !categoryParam ? 'bg-amber-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {MOCK_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                categoryParam === cat.name ? 'bg-amber-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {showFavorites
              ? 'My Favorite Shops'
              : categoryParam
              ? `${categoryParam} Shops`
              : (searchParam || streetParam)
              ? 'Filtered Results'
              : 'Browse All Shops'}
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>Showing {filteredShops.length} shops</span>
            {streetParam && (
              <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-100">
                <MapPin className="w-3 h-3" /> {streetParam}
              </span>
            )}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 flex-wrap h-fit">
          {(categoryParam || streetParam || searchParam || showFavorites) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-bold transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}

          <button
            onClick={toggleFavoritesFilter}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${
              showFavorites
                ? 'bg-red-50 text-red-600 border-red-200 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
            Favorites
          </button>
        </div>
      </div>

      {/* SHOPS GRID */}
      {filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map(shop => (
            <ShopCard key={shop._id || shop.id} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-white">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-xl font-bold text-gray-900">No shops found</p>
          <p className="text-gray-500 mt-1 mb-6">Try adjusting your filters or searching for something else</p>
          <button 
            onClick={clearFilters}
            className="px-6 py-2 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

