import { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Plus, Tag, Loader2, CheckCircle2 } from 'lucide-react';

export default function Sales() {
  const { activities, fetchActivities, recordSale, currentUser } = useShop();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    item: ''
  });

  useEffect(() => {
    if (currentUser?.shop?._id) {
      fetchActivities();
    }
  }, [fetchActivities, currentUser?.shop?._id]);

  const sales = (activities || []).filter(a => a.type === 'sale');
  const total = (currentUser?.shop?.sales || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.item) return;
    
    setLoading(true);
    const result = await recordSale({
      amount: Number(formData.amount),
      item: formData.item,
      detail: `KES ${Number(formData.amount).toLocaleString()}`
    });
    
    if (result.success) {
      setSuccess(true);
      setFormData({ amount: '', item: '' });
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
            <h2 className="text-xl font-bold text-gray-900">Sales Report</h2>
            <p className="text-sm text-gray-500">Track and log your boutique sales</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-700 px-4 py-2.5 rounded-2xl font-black text-sm shadow-sm border border-green-100">
               Total: KSh {total.toLocaleString()}
            </div>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-black transition shadow-lg active:scale-95"
            >
              <Plus className={`w-5 h-5 transition-transform ${showForm ? 'rotate-45' : ''}`} />
            </button>
         </div>
       </div>

       {showForm && (
         <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
               <Tag className="w-5 h-5 text-amber-600" />
               Record a Private Sale
            </h3>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-4">
               <input 
                 type="text"
                 required
                 placeholder="What was sold? (e.g. Silk Dirac)"
                 className="px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition font-medium"
                 value={formData.item}
                 onChange={e => setFormData({...formData, item: e.target.value})}
               />
               <input 
                 type="number"
                 required
                 placeholder="Sale Amount (KES)"
                 className="px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition font-bold"
                 value={formData.amount}
                 onChange={e => setFormData({...formData, amount: e.target.value})}
               />
               <button 
                 type="submit"
                 disabled={loading || success}
                 className={`py-3 rounded-2xl font-black transition flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                   success ? 'bg-green-600 text-white' : 'bg-amber-600 text-white hover:bg-amber-700'
                 }`}
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                  success ? <><CheckCircle2 className="w-5 h-5" /> Saved!</> : 
                  'Record Sale'}
               </button>
            </form>
         </div>
       )}
       
       <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                   <tr>
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Date</th>
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Item Name</th>
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {sales.length > 0 ? sales.map(sale => (
                      <tr key={sale._id} className="group hover:bg-gray-50/50 transition">
                         <td className="px-8 py-6">
                            <div className="text-sm font-bold text-gray-900">{new Date(sale.createdAt).toLocaleDateString()}</div>
                            <div className="text-[10px] text-gray-400 uppercase font-black">{new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold border border-amber-100 group-hover:bg-amber-100 transition">
                              <Tag className="w-3 h-3" />
                              {sale.item}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right font-black text-gray-900 text-lg group-hover:text-amber-600 transition">
                            <span className="text-xs text-gray-400 font-bold mr-1">KES</span>
                            {sale.amount.toLocaleString()}
                         </td>
                      </tr>
                   )) : (
                     <tr>
                        <td colSpan="3" className="px-8 py-20 text-center">
                           <Tag className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                           <p className="text-gray-400 font-bold text-sm">No sales recorded yet.</p>
                           <button onClick={() => setShowForm(true)} className="text-amber-600 text-xs font-black uppercase tracking-widest mt-2 hover:underline">Log a Transaction</button>
                        </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}

