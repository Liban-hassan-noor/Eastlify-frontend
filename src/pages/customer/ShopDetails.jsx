import { useParams, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Phone, MapPin, Star, Share2, ArrowLeft, Package, MessageCircle } from 'lucide-react';

export default function ShopDetails() {
  const { id } = useParams();
  const { shops, getShopListings } = useShop();
  const shop = shops.find(s => s.id === id);
  const listings = getShopListings(id);

  if (!shop) return (
    <div className="text-center py-20">
       <h2 className="text-xl font-bold text-gray-900">Shop not found</h2>
       <Link to="/browse" className="text-amber-600 hover:underline mt-2 inline-block">Back to Browse</Link>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <Link to="/browse" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 transition">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Header Image */}
      <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
         <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-8">
            <div className="text-white w-full">
               <div className="flex items-start justify-between gap-4">
                 <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{shop.name}</h1>
                    <div className="flex items-center gap-3 text-white/90 text-sm sm:text-base">
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                         <MapPin className="w-4 h-4" />
                         {shop.street}
                      </div>
                      <div className="flex items-center gap-1">
                         <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                         {shop.rating}
                      </div>
                    </div>
                 </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About the Shop</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{shop.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {shop.categories.map(cat => (
                   <span key={cat} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-100">
                      {cat}
                   </span>
                ))}
              </div>
            </section>
            
            <section>
               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Package className="w-5 h-5 text-amber-600" />
                 Shop Window
               </h2>
               
               {listings.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {listings.map(item => (
                        <div key={item.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                          <div className="aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden relative">
                              <img 
                                src={item.images[0]} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              {item.isOnOffer && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                                  OFFER
                                </div>
                              )}
                              {item.availability !== 'In Stock' && (
                                <div className="absolute bottom-2 left-2 right-2 text-center bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                  {item.availability}
                                </div>
                              )}
                          </div>
                          <div className="font-bold text-gray-900 truncate mb-1">{item.title}</div>
                          
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                             <div className="text-amber-600 font-bold">KES {item.isOnOffer ? item.offerPrice.toLocaleString() : item.price.toLocaleString()}</div>
                             {item.isOnOffer && (
                               <div className="text-xs text-gray-400 line-through">{item.price.toLocaleString()}</div>
                             )}
                          </div>

                          <a 
                            href={`https://wa.me/${shop.phone.replace('+', '')}?text=Hi, I am interested in ${item.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-2 bg-gray-900 text-white text-xs font-bold rounded-lg text-center hover:bg-black transition"
                          >
                            I'm Interested
                          </a>
                        </div>
                      ))}
                  </div>
               ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                     <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                     <p className="text-gray-500">No items listed yet.</p>
                  </div>
               )}
            </section>
         </div>

         <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md sticky top-24">
               <div className="text-center mb-6">
                 <div className="text-gray-500 font-medium mb-1">Direct Line</div>
                 <div className="text-2xl font-bold text-gray-900 tracking-wider font-mono">{shop.phone}</div>
               </div>
               
               <a 
                 href={`tel:${shop.phone}`}
                 className="flex items-center justify-center gap-2 w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-600/20 active:scale-95 animate-pulse"
                 style={{ animationIterationCount: 1 }}
               >
                 <Phone className="w-5 h-5 fill-current" />
                 Call Shop
               </a>

               <a 
                 href={`https://wa.me/${shop.phone.replace('+', '')}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center justify-center gap-2 w-full py-3 mt-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition"
               >
                 <MessageCircle className="w-5 h-5" />
                 WhatsApp Shop
               </a>
               
               <button className="flex items-center justify-center gap-2 w-full py-3 mt-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition border-2 border-gray-200">
                 <Share2 className="w-4 h-4" />
                 Share
               </button>

               <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
                 Trusted Local Seller
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
