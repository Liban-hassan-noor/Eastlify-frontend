import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Overview from './Overview';
import MyShop from './MyShop';
import Orders from './Orders';
import Sales from './Sales';
import { LayoutDashboard, Store, ShoppingBag, BarChart3 } from 'lucide-react';

export default function DashboardLayout() {
  const { pathname } = useLocation();

  const tabs = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/dashboard/shop', label: 'My Shop', icon: Store },
    { path: '/dashboard/orders', label: 'Requests', icon: ShoppingBag },
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
         <div className="text-sm text-gray-400">Welcome back</div>
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
          <Route path="/shop" element={<MyShop />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </div>
    </div>
  );
}
