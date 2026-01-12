import { useShop } from '../../context/ShopContext';
import { Phone, ShoppingBag, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function Overview() {
  const { currentUser } = useShop();

  if (!currentUser) return <div>Loading...</div>;

  const stats = [
    { label: 'Total Calls', value: currentUser.shop?.totalCalls || 0, icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Orders (Est)', value: currentUser.shop?.orders || 0, icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Sales (Est)', value: `KSh ${(currentUser.shop?.sales || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                   <div className="text-gray-500 text-sm font-medium mb-1">{stat.label}</div>
                   <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                   <stat.icon className="w-6 h-6" />
                </div>
             </div>
          ))}
       </div>

       <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Recent Activity</h3>
                <button className="text-amber-600 text-sm font-bold">View All</button>
             </div>
             <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                           <Phone className="w-4 h-4" />
                        </div>
                        <div>
                           <div className="font-bold text-gray-900">Incoming Call</div>
                           <div className="text-xs text-gray-400">2 hours ago</div>
                        </div>
                     </div>
                     <div className="text-sm font-medium text-gray-600">
                        +254 7XX...
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-lg text-white">
             <h3 className="font-bold text-lg mb-2">Boost your Shop</h3>
             <p className="text-gray-400 text-sm mb-6">Get more calls by featuring your shop on the homepage.</p>
             <button className="w-full py-3 bg-amber-600 rounded-xl font-bold hover:bg-amber-700 transition flex items-center justify-center gap-2">
                Start Campaign <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
       </div>
    </div>
  );
}
