import { Phone, MapPin, Star, Heart, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ImageCarousel from './ImageCarousel';

export default function ShopCard({ shop }) {
  const { isFavorite, toggleFavorite } = useShop();
  const shopId = shop._id || shop.id;
  const favorite = isFavorite(shopId);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(shopId);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group relative">
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        {shop.profileImage ? (
          <ImageCarousel 
            images={[shop.profileImage, shop.coverImage].filter(Boolean)} 
            aspectRatio="w-full h-full"
            autoSlide={true}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50 text-amber-600">
             <Store className="w-12 h-12 mb-2 opacity-50" />
             <span className="text-xs font-bold uppercase tracking-wider">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
           <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-gray-800 shadow-sm">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            {shop.rating || 'New'}
          </div>
        </div>
        
        <button 
            onClick={handleFavorite}
            className="absolute top-2 left-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition active:scale-95 group/heart"
        >
            <Heart 
              className={`w-5 h-5 transition-colors ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/heart:text-red-500'}`} 
            />
        </button>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-4">
           <div className="flex items-start justify-between gap-2">
              <Link to={`/shop/${shopId}`} className="font-bold text-lg text-gray-900 leading-snug hover:text-amber-600 line-clamp-1">
                {shop.shopName || shop.name}
              </Link>
           </div>
           
           <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
             <MapPin className="w-3.5 h-3.5 shrink-0" />
             <span className="truncate">{shop.street}</span>
           </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {(shop.categories || []).slice(0, 3).map(cat => (
             <span key={cat} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
               {cat}
             </span>
          ))}
          {(shop.categories || []).length > 3 && (
             <span className="text-xs text-gray-400 py-1 font-bold">+ {(shop.categories || []).length - 3}</span>
          )}
        </div>
        
        <div className="mt-auto grid grid-cols-2 gap-2">
           <Link 
             to={`/shop/${shopId}`}
             className="flex items-center justify-center px-4 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition border border-gray-100"
           >
             Details
           </Link>
           <a 
             href={`tel:${shop.phone}`}
             className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition shadow-sm active:scale-95"
           >
             <Phone className="w-4 h-4" />
             Call
           </a>
        </div>
      </div>
    </div>
  );
}
