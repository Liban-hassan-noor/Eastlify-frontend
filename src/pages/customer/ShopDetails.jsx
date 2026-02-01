import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Phone, MapPin, Star, Share2, ArrowLeft, Package, MessageCircle, Loader2, X, Store } from 'lucide-react';
import * as shopsApi from '../../api/shops';
import ImageCarousel from '../../components/ImageCarousel';
import ReviewStats from '../../components/ReviewStats';
import ReviewForm from '../../components/ReviewForm';
import ReviewList from '../../components/ReviewList';

export default function ShopDetails() {
  const { id } = useParams();
  const { listings, listingsLoading, fetchShopListings, recordActivity } = useShop();
  
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSuccess = () => {
    console.log('Review submitted successfully, triggering refresh...');
    setRefreshTrigger(prev => prev + 1);
    // Refresh shop data too for header rating
    shopsApi.getShopById(id).then(data => {
      console.log('Updated shop data:', data);
      setShop(data);
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await shopsApi.getShopById(id);
        setShop(data);
        await fetchShopListings(id);
      } catch (err) {
        console.error('Failed to load shop details:', err);
        setError('Shop not found or connection failed.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, fetchShopListings]);

  const handleContact = async (type) => {
    if (!shop) return;
    await recordActivity({
      type,
      detail: shop.phone,
    }, shop._id);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
      <p className="text-gray-500 font-bold">Visiting Boutique...</p>
    </div>
  );

  if (error || !shop) return (
    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mx-auto max-w-lg mt-10">
       <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
       <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop not found</h2>
       <p className="text-gray-500 mb-6">{error || "This shop might have moved or closed."}</p>
       <Link to="/browse" className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-amber-700 transition">
         <ArrowLeft className="w-5 h-5" /> Back to Browse
       </Link>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <Link to="/browse" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 transition font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Boutiques
      </Link>

      {/* Header Image Section */}
      <div className="relative h-72 sm:h-96 lg:h-[32rem] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-2xl border border-gray-100 group/header">
         {shop.profileImage || shop.coverImage ? (
           <ImageCarousel 
             images={[shop.profileImage, shop.coverImage].filter(Boolean)} 
             aspectRatio="w-full h-full"
             autoSlide={true}
             autoSlideInterval={6000}
           />
         ) : (
           <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
              <Store className="w-24 h-24 opacity-10" />
           </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none flex items-end p-8 sm:p-12">
            <div className="text-white w-full">
               <div className="flex items-end justify-between gap-6 flex-wrap">
                  <div className="space-y-4">
                     <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-2 drop-shadow-2xl tracking-tight">{shop.shopName}</h1>
                     <div className="flex items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-6 py-2.5 rounded-2xl text-sm font-black border border-white/20 shadow-xl">
                           <MapPin className="w-5 h-5 text-amber-500" />
                           {shop.street}
                        </div>
                        <div className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-xl">
                           <Star className="w-5 h-5 fill-white" />
                           {shop.rating > 0 ? shop.rating.toFixed(1) : 'New'} {shop.totalReviews > 0 && `(${shop.totalReviews})`}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start mt-12">
          <div className="lg:col-span-8 space-y-10">
            <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm leading-relaxed relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Store className="w-7 h-7 text-amber-600" />
                About the Boutique
              </h2>
              <p className="text-gray-600 text-xl font-medium leading-[1.8]">{shop.description || 'Welcome to our boutique in Eastleigh. We pride ourselves on quality and service.'}</p>
              
              <div className="mt-8 flex flex-wrap gap-3">
                {(shop.categories || []).map(cat => (
                   <span key={cat} className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest border border-gray-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-100 transition-colors">
                      {cat}
                   </span>
                ))}
              </div>
            </section>
            
            <section className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Package className="w-7 h-7 text-amber-600" />
                    Shop Window
                  </h2>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg">
                    {listings.length} Items Listed
                  </div>
               </div>
               
               {listingsLoading ? (
                  <div className="text-center py-20">
                     <Loader2 className="w-10 h-10 text-amber-600 animate-spin mx-auto mb-4" />
                     <p className="text-gray-500 font-bold">Polishing items...</p>
                  </div>
               ) : listings.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                       {listings.map((item, index) => (
                         <div key={item._id || index} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 group overflow-hidden flex flex-col">
                           <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden">
                              <ImageCarousel 
                                images={item.images} 
                                aspectRatio="h-full w-full"
                                autoSlide={true}
                              />
                               {(item.compareAtPrice && item.compareAtPrice > item.price) && (
                                 <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-10 uppercase tracking-wider">
                                   Special Offer
                                 </div>
                               )}
                               {!item.inStock && (
                                 <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] flex items-center justify-center p-4 z-20">
                                    <span className="text-white text-base font-black uppercase tracking-widest text-center border-2 border-white/30 px-6 py-2 rounded-full backdrop-blur-md">Sold Out</span>
                                 </div>
                               )}
                           </div>
                           
                           <div className="p-5 flex flex-col flex-1">
                              <div className="font-black text-gray-900 mb-1 text-xl group-hover:text-amber-600 transition-colors line-clamp-1">{item.name}</div>
                              <p className="text-gray-500 text-sm line-clamp-2 mb-4 font-medium leading-snug">
                                {item.description}
                              </p>
                              <div className="mt-auto space-y-4">
                                  {/* Variant Availability Display */}
                                  {(item.hasSizes || item.hasColors) && (
                                    <div className="space-y-3 pt-3 border-t border-gray-50">
                                      {item.hasSizes && (
                                        <div className="space-y-2">
                                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Sizes</span>
                                          <div className="flex flex-wrap gap-2">
                                            {[...new Set((item.variants || []).map(v => v.size).filter(Boolean))].map(size => {
                                              const isAvailable = item.variants.some(v => v.size === size && (v.stock > 0 || v.inStock));
                                              return (
                                                <span 
                                                  key={size} 
                                                  className={`px-4 py-1.5 rounded-xl text-sm font-bold border transition-all duration-300 ${
                                                    isAvailable 
                                                      ? 'bg-amber-50 border-amber-100 text-amber-700' 
                                                      : 'bg-gray-50 border-gray-50 text-gray-300 opacity-60'
                                                  }`}
                                                >
                                                  {size}
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                      {item.hasColors && (
                                        <div className="space-y-2">
                                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Colors</span>
                                          <div className="flex flex-wrap gap-2">
                                            {[...new Set((item.variants || []).map(v => v.color).filter(Boolean))].map(color => {
                                              const isAvailable = item.variants.some(v => v.color === color && (v.stock > 0 || v.inStock));
                                              return (
                                                <span 
                                                  key={color} 
                                                  className={`px-4 py-1.5 rounded-xl text-sm font-bold border transition-all duration-300 ${
                                                    isAvailable 
                                                      ? 'bg-amber-50 border-amber-100 text-amber-700' 
                                                      : 'bg-gray-50 border-gray-50 text-gray-300 opacity-60'
                                                  }`}
                                                >
                                                  {color}
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                   <div className="flex items-end justify-between py-1">
                                      <div className="space-y-0.5">
                                         <div className="text-amber-600 font-black text-2xl tracking-tight">
                                           <span className="text-xs mr-1 opacity-70">KES</span>
                                           {item.price?.toLocaleString()}
                                         </div>
                                         {(item.compareAtPrice && item.compareAtPrice > item.price) && (
                                           <div className="text-xs text-gray-400 line-through font-bold opacity-60">KES {item.compareAtPrice?.toLocaleString()}</div>
                                         )}
                                      </div>
                                   </div>
         
                                   <a 
                                     href={`https://wa.me/${shop.phone?.replace('+', '')}?text=Hi, I am interested in ${item.name} at ${shop.shopName}`}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     onClick={() => handleContact('whatsapp')}
                                     className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95 group-hover:bg-amber-600"
                                   >
                                     <MessageCircle className="w-5 h-5" />
                                     Chat with Seller
                                   </a>
                                 </div>
                           </div>
                         </div>
                       ))}
                   </div>
               ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                     <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                     <p className="text-gray-500 font-bold">This boutique hasn't listed any items today.</p>
                  </div>
               )}
            </section>

             {/* Reviews Section */}
             <section className="space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                     <MessageCircle className="w-7 h-7 text-amber-600" />
                     What Eastleigh Shoppers Say
                   </h2>
                </div>
                
                <ReviewList shopId={id} refreshKey={refreshTrigger} />
             </section>
          </div>

          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
             {/* Review Stats */}
             <ReviewStats shopId={id} refreshKey={refreshTrigger} />

             <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-100 transition-colors"></div>
                
                <div className="relative z-10 space-y-8">
                   <div className="text-center">
                     <div className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Direct Boutique Line</div>
                     <div className="text-2xl font-black text-gray-900 tracking-widest font-mono group-hover:text-amber-600 transition-colors">{shop.phone}</div>
                   </div>
                   
                   <div className="space-y-3">
                      <a 
                        href={`tel:${shop.phone}`}
                        onClick={() => handleContact('call')}
                        className="flex items-center justify-center gap-3 w-full py-4 bg-green-600 text-white rounded-2xl font-extrabold text-lg hover:bg-green-700 transition shadow-lg shadow-green-600/30 active:scale-95 transform group-hover:scale-[1.02]"
                      >
                        <Phone className="w-6 h-6 fill-current animate-bounce" />
                        Call Boutique
                      </a>

                      <a 
                        href={`https://wa.me/${shop.phone?.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleContact('whatsapp')}
                        className="flex items-center justify-center gap-3 w-full py-4 bg-gray-900 text-white rounded-2xl font-extrabold hover:bg-black transition shadow-lg active:scale-95"
                      >
                        <MessageCircle className="w-6 h-6" />
                        WhatsApp Now
                      </a>

                      <button 
                        onClick={() => setShowReviewForm(true)}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-amber-600 text-white rounded-2xl font-extrabold hover:bg-amber-700 transition shadow-lg shadow-amber-600/30 active:scale-95"
                      >
                        <Star className="w-5 h-5 fill-white" />
                        Rate this Shop
                      </button>
                   </div>
                   
                   <button className="flex items-center justify-center gap-2 w-full py-3 bg-white text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition border border-gray-100 text-sm">
                     <Share2 className="w-4 h-4" />
                     Share Boutique
                   </button>

                   <div className="pt-6 border-t border-gray-100 text-center">
                     <p className="text-[10px] font-black uppercase tracking-widest text-amber-600/60 mb-1">Authenticated Boutique</p>
                     <p className="text-gray-400 text-[10px] font-medium leading-relaxed">Verified Eastlify Seller since {shop?.createdAt ? new Date(shop.createdAt).getFullYear() : '2025'}</p>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Review Form Modal */}
       {showReviewForm && (
         <ReviewForm
           shopId={id}
           shopName={shop.shopName}
           onClose={() => setShowReviewForm(false)}
           onSuccess={handleReviewSuccess}
         />
       )}
    </div>
  );
}
