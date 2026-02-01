import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

// Customer Pages
import Home from './pages/customer/Home';
import BrowseShops from './pages/customer/BrowseShops';
import ShopDetails from './pages/customer/ShopDetails';

// Shop Pages
import Register from './pages/shop/Register'; 
import Login from './pages/shop/Login';
import DashboardLayout from './pages/dashboard/DashboardLayout';

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseShops />} />
            <Route path="/shop/:id" element={<ShopDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<DashboardLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShopProvider>
  );
}
