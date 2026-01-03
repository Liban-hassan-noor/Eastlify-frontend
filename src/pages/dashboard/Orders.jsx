import { MOCK_ORDERS } from '../../data/mockData';

export default function Orders() {
  return (
    <div className="space-y-6">
       <h2 className="text-xl font-bold text-gray-900">Recent Requests & Orders</h2>
       
       <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                   <tr>
                      <th className="px-6 py-4 font-bold text-gray-700">Customer</th>
                      <th className="px-6 py-4 font-bold text-gray-700">Product</th>
                      <th className="px-6 py-4 font-bold text-gray-700">Date</th>
                      <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {MOCK_ORDERS.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition">
                         <td className="px-6 py-4 font-medium text-gray-900">{order.customer}</td>
                         <td className="px-6 py-4 text-gray-600">{order.product}</td>
                         <td className="px-6 py-4 text-gray-500">{order.date}</td>
                         <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                               order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                               {order.status}
                            </span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
