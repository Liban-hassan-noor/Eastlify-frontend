import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-12 text-center text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-2">&copy; {new Date().getFullYear()} Eastlify.</p>
          <p>Connecting Eastleigh to everyone.</p>
        </div>
      </footer>
    </div>
  );
}
