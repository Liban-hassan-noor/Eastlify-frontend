import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_SHOPS, MOCK_LISTINGS } from '../data/mockData';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // Initialize from localStorage or mock data
  const [shops, setShops] = useState(() => {
    const saved = localStorage.getItem('eastlify_shops');
    return saved ? JSON.parse(saved) : MOCK_SHOPS;
  });

  // Initialize session from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('eastlify_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist shops
  useEffect(() => {
    localStorage.setItem('eastlify_shops', JSON.stringify(shops));
  }, [shops]);

  // Persist session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eastlify_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eastlify_user');
    }
  }, [currentUser]);

  // Listings logic
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('eastlify_listings');
    return saved ? JSON.parse(saved) : MOCK_LISTINGS;
  });

  useEffect(() => {
    localStorage.setItem('eastlify_listings', JSON.stringify(listings));
  }, [listings]);

  const addListing = (newListing) => {
    const listingWithId = {
      ...newListing,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setListings(prev => [listingWithId, ...prev]);
  };

  const updateListing = (id, updates) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteListing = (id) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const getShopListings = (shopId) => {
    return listings.filter(l => l.shopId === shopId);
  };

  // Favorites logic
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('eastlify_favorites');
    try {
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('eastlify_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (shopId) => {
    setFavorites(prev => {
      if (prev.includes(shopId)) {
        return prev.filter(id => id !== shopId);
      }
      return [...prev, shopId];
    });
  };

  const isFavorite = (shopId) => favorites.includes(shopId);

  const login = (phone) => {
    const foundShop = shops.find(s => s.phone === phone);
    if (foundShop) {
      setCurrentUser(foundShop);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerShop = (newShop) => {
    const shopWithId = { 
      ...newShop, 
      id: Date.now().toString(), 
      totalCalls: 0, 
      orders: 0, 
      sales: 0,
       // Default image if none provided
      image: newShop.image || "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800"
    };
    
    setShops(prev => [...prev, shopWithId]);
    setCurrentUser(shopWithId);
    return shopWithId;
  };

  const updateShop = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setShops(prev => prev.map(s => s.id === currentUser.id ? updated : s));
    setCurrentUser(updated);
  };

  return (
    <ShopContext.Provider value={{ 
      shops, currentUser, login, logout, registerShop, updateShop, 
      favorites, toggleFavorite, isFavorite,
      listings, addListing, updateListing, deleteListing, getShopListings 
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
