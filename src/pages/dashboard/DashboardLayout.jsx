import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Overview from './Overview';
import MyShop from './MyShop';
import Sales from './Sales';
import Listings from './listings/Listings';
import { LayoutDashboard, Store, ShoppingBag, BarChart3, Tag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { currentUser } = useShop();

  const tabs = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/dashboard/listings', label: 'My Listings', icon: Tag },
    { path: '/dashboard/shop', label: 'My Shop', icon: Store },
    { path: '/dashboard/sales', label: 'Sales', icon: BarChart3 },
  ];

  // Helper to handle exact match for root dashboard path
  const isActiveTab = (path) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="text-sm text-gray-500 font-medium">
            Welcome back, <span className="text-gray-900 font-bold">{currentUser?.name}</span>
            {currentUser?.shop?.shopName && (
              <span className="text-gray-400"> • {currentUser.shop.shopName}</span>
            )}
          </div>
      </div>

      {/* Tab Nav */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-gray-100 no-scrollbar">
         {tabs.map(tab => {
           const active = isActiveTab(tab.path);
           return (
             <Link
               key={tab.path}
               to={tab.path}
               className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition ${
                 active 
                   ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10' 
                   : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
               }`}
             >
               <tab.icon className="w-4 h-4" />
               {tab.label}
             </Link>
           );
         })}
      </div>

      <div className="min-h-[400px]">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/shop" element={<MyShop />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </div>
    </div>
  );
}
