import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Store, User, LogOut, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useShop();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-amber-600 flex items-center gap-2">
          <Store className="w-7 h-7" />
          <span className="tracking-tight hidden sm:block">Eastlify</span>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/browse" className="text-gray-600 hover:text-amber-600 font-medium flex items-center gap-1">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm sm:text-base">Browse</span>
          </Link>
          
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-amber-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <User className="w-4 h-4" />
                <span className="hidden sm:block line-clamp-1 max-w-[100px]">{currentUser.name}</span>
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
               <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link to="/register" className="bg-amber-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition shadow-sm whitespace-nowrap">
                Register Shop
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
