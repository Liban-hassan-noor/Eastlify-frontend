import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Shirt, Smartphone, Sparkles, Footprints, Moon, Box, ShoppingBag } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_STREETS } from '../../data/mockData';

// Map icon strings to Lucide components
const ICON_MAP = {
  Shirt,
  Smartphone,
  Sparkles,
  Footprints,
  Moon,
  Box
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm)}`);
    } else {
       navigate('/browse');
    }
  };

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 sm:pt-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Find it in <span className="text-amber-600 relative inline-block">
            Eastleigh
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-amber-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          The Direct Connection. Browse thousands of shops and call them directly. <br className="hidden sm:block"/> No middlemen. Just business.
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
          <input
            type="text"
            placeholder="Search shops, electronics, fabrics..."
            className="w-full h-14 pl-12 pr-32 rounded-2xl border-2 border-gray-200 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-lg shadow-sm group-hover:shadow-md outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-amber-500 transition-colors" />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-amber-600 text-white px-6 rounded-xl font-bold hover:bg-amber-700 transition active:scale-95"
          >
            Search
          </button>
        </form>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            Shop by Category
          </h2>
          <button onClick={() => navigate('/browse')} className="text-amber-600 text-sm font-bold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {MOCK_CATEGORIES.map((cat) => {
             const IconComponent = ICON_MAP[cat.icon] || Box;
             return (
               <button 
                 key={cat.id}
                 onClick={() => navigate(`/browse?category=${cat.name}`)}
                 className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-200 hover:bg-amber-50/50 hover:-translate-y-1 transition-all group h-full"
               >
                 <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                 </div>
                 <span className="font-semibold text-gray-700 group-hover:text-gray-900">{cat.name}</span>
               </button>
             );
          })}
        </div>
      </section>

       {/* Popular Streets */}
       <section>
         <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 px-1">
           <MapPin className="w-5 h-5 text-amber-600" />
           Popular Streets
         </h2>
         <div className="flex flex-wrap gap-3">
           {MOCK_STREETS.map((street) => (
             <button
               key={street}
               onClick={() => navigate(`/browse?street=${street}`)}
               className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-gray-700 font-medium hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50 transition shadow-sm active:scale-95"
             >
               <MapPin className="w-4 h-4 text-gray-400" />
               {street}
             </button>
           ))}
         </div>
       </section>
    </div>
  );
}
