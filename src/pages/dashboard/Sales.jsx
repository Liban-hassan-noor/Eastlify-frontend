import { MOCK_ORDERS } from '../../data/mockData';

export default function Sales() {
  // Filter for completed orders
  const sales = MOCK_ORDERS.filter(o => o.status === 'Completed');
  const total = sales.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-gray-900">Sales Report</h2>
         <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold">
            Total: KSh {total.toLocaleString()}
         </div>
       </div>
       
       <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                   <tr>
                      <th className="px-6 py-4 font-bold text-gray-700">Date</th>
                      <th className="px-6 py-4 font-bold text-gray-700">Item</th>
                      <th className="px-6 py-4 font-bold text-gray-700 text-right">Amount (KSh)</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {sales.map(sale => (
                      <tr key={sale.id} className="hover:bg-gray-50/50 transition">
                         <td className="px-6 py-4 text-gray-500">{sale.date}</td>
                         <td className="px-6 py-4 font-medium text-gray-900">{sale.product}</td>
                         <td className="px-6 py-4 text-right font-bold text-gray-900">{sale.amount.toLocaleString()}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
