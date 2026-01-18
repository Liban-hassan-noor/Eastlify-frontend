import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth';
import * as shopsApi from '../api/shops';
import * as productsApi from '../api/products';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [shops, setShops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [shopsError, setShopsError] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('eastlify_token'));

  // listings, favorites, etc.
  const [listings, setListings] = useState([]); // Used for public shop view
  const [myListings, setMyListings] = useState([]); // Used for owner dashboard
  const [listingsLoading, setListingsLoading] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('eastlify_favorites');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch shops from API
  const fetchShops = useCallback(async (filters = {}) => {
    setShopsLoading(true);
    try {
      const data = await shopsApi.getShops(filters);
      setShops(data.shops);
      setShopsError(null);
    } catch (error) {
      console.error('Failed to fetch shops:', error);
      setShopsError(error.response?.data?.message || error.message);
    } finally {
      setShopsLoading(false);
    }
  }, []);

  // Initial shops fetch
  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  // Verify token and fetch profile on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const user = await authApi.getProfile(token);
          setCurrentUser(user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('eastlify_token');
          setToken(null);
        }
      }
      setAuthLoading(false);
    };

    initAuth();
  }, [token]);

  // Fetch my listings (for dashboard)
  const fetchMyListings = useCallback(async () => {
    if (!token) return;
    setListingsLoading(true);
    try {
      const data = await productsApi.getMyProducts(token);
      setMyListings(data);
    } catch (error) {
      console.error('Failed to fetch my listings:', error);
    } finally {
      setListingsLoading(false);
    }
  }, [token]);

  // Fetch full details of my shop
  const fetchMyShop = useCallback(async () => {
    if (!token) return;
    try {
      const data = await shopsApi.getMyShop(token);
      setCurrentUser(prev => ({ ...prev, shop: data }));
      return data;
    } catch (error) {
      console.error('Failed to fetch my shop:', error);
    }
  }, [token]);

  // Fetch listings for a specific shop (for customer view)
  const fetchShopListings = useCallback(async (shopId) => {
    setListingsLoading(true);
    try {
      const data = await productsApi.getProducts({ shop: shopId });
      setListings(data.products);
    } catch (error) {
      console.error('Failed to fetch shop listings:', error);
    } finally {
      setListingsLoading(false);
    }
  }, []);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('eastlify_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem('eastlify_token', data.token);
      setToken(data.token);
      setCurrentUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('eastlify_token');
    setToken(null);
    setCurrentUser(null);
  };

  const registerShop = async (regData) => {
    try {
      const data = await authApi.register(regData);
      localStorage.setItem('eastlify_token', data.token);
      setToken(data.token);
      setCurrentUser(data);
      // Refresh shops list after registration
      fetchShops();
      // Pre-emptively fetch listings and activities if needed
      if (data.shop?._id) {
        productsApi.getMyProducts(data.token).then(setMyListings);
        shopsApi.fetchActivities(data.shop._id, data.token).then(setActivities);
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authApi.updateProfile(userData, token);
      setCurrentUser(prev => ({ ...prev, ...updatedUser }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  // Fetch activities for the current shop
  const fetchActivities = useCallback(async () => {
    const shopId = currentUser?.shop?._id;
    if (!shopId || !token) return { success: false, message: 'Not authenticated or no shop' };
    
    try {
      const data = await shopsApi.fetchActivities(shopId, token);
      setActivities(data);
      return { success: true };
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }, [currentUser?.shop?._id, token]);

  const recordActivity = useCallback(async (activityData, shopId = null) => {
    const targetShopId = shopId || currentUser?.shop?._id;
    if (!targetShopId) return { success: false, message: 'Shop ID required' };
    
    try {
      const data = await shopsApi.recordActivity(targetShopId, activityData);
      // If it's the owner's shop, we can update the stats locally
      if (currentUser?.shop?._id === targetShopId) {
        setCurrentUser(prev => ({
          ...prev,
          shop: { ...prev.shop, ...data.shop }
        }));
        // Update activities feed
        setActivities(prev => [data.activity, ...prev].slice(0, 10));
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }, [currentUser?.shop?._id]);

  const recordSale = useCallback(async (saleData) => {
    if (!currentUser?.shop?._id || !token) return { success: false, message: 'Not authenticated' };
    
    try {
      const data = await shopsApi.recordSale(currentUser.shop._id, saleData, token);
      setCurrentUser(prev => ({
        ...prev,
        shop: { ...prev.shop, ...data.shop }
      }));
      setActivities(prev => [data.activity, ...prev].slice(0, 10));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }, [currentUser?.shop?._id, token]);

  const updateShop = async (updates) => {
    if (!currentUser || !currentUser.shop?._id) return { success: false, message: 'No shop associated' };
    
    try {
      const updatedShop = await shopsApi.updateShop(currentUser.shop._id, updates, token);
      
      const updatedUser = { 
        ...currentUser, 
        shop: updatedShop
      };
      setCurrentUser(updatedUser);
      
      // Update in the local shops list too
      setShops(prev => prev.map(s => s._id === updatedShop._id ? updatedShop : s));
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };



  const deleteShop = async (id) => {
    if (!token) return { success: false, message: 'No token' };
    try {
      await shopsApi.deleteShop(id, token);
      // Remove from local list
      setShops(prev => prev.filter(s => s._id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  // Other utility functions (listing logic, favorites logic)
  const addListing = async (newListing) => {
    try {
      const savedListing = await productsApi.createProduct(newListing, token);
      setMyListings(prev => [savedListing, ...prev]);
      return { success: true, listing: savedListing };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const updateListing = async (id, updates) => {
    try {
      const updatedListing = await productsApi.updateProduct(id, updates, token);
      setMyListings(prev => prev.map(l => l._id === id ? updatedListing : l));
      return { success: true, listing: updatedListing };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const deleteListing = async (id) => {
    try {
      await productsApi.deleteProduct(id, token);
      setMyListings(prev => prev.filter(l => l._id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const getShopListings = (shopId) => {
    // If it's my shop, return myListings, otherwise return public listings
    if (currentUser?.shop?._id === shopId) return myListings;
    return listings;
  };

  const toggleFavorite = (shopId) => {
    setFavorites(prev => {
      if (prev.includes(shopId)) {
        return prev.filter(id => id !== shopId);
      }
      return [...prev, shopId];
    });
  };

  const isFavorite = (shopId) => favorites.includes(shopId);

  return (
    <ShopContext.Provider value={{ 
      shops, shopsLoading, shopsError, fetchShops, currentUser, authLoading, login, logout, registerShop, updateShop, deleteShop,
      favorites, toggleFavorite, isFavorite,
      listings, myListings, listingsLoading, addListing, updateListing, deleteListing, getShopListings, fetchMyListings, fetchShopListings, fetchMyShop,
      updateProfile,
      activities, recordActivity, recordSale, fetchActivities
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
