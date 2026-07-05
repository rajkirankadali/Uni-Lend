import { useState, useEffect, useContext } from 'react';
import { apiFetch } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, refreshProfile } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topupAmount, setTopupAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsData, txData] = await Promise.all([
        apiFetch('/bookings/my-bookings'),
        apiFetch('/payments/transactions')
      ]);
      setBookings(bookingsData);
      setTransactions(txData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/payments/mock-topup', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(topupAmount) })
      });
      setTopupAmount('');
      refreshProfile();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await apiFetch(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      fetchData();
      refreshProfile();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-4">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Profile & Wallet Card */}
        <div className="card flex-1">
          <h2 className="text-2xl font-bold text-clay-800 mb-6">My Profile</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between border-b border-clay-200 pb-2">
              <span className="text-clay-600">Name</span>
              <span className="font-bold text-clay-800">{user.name}</span>
            </div>
            <div className="flex justify-between border-b border-clay-200 pb-2">
              <span className="text-clay-600">Email</span>
              <span className="font-bold text-clay-800">{user.email}</span>
            </div>
            <div className="flex justify-between border-b border-clay-200 pb-2">
              <span className="text-clay-600">Wallet Balance</span>
              <span className="font-black text-2xl text-clay-700">₹{user.walletBalance}</span>
            </div>
          </div>

          <h3 className="font-bold text-clay-700 mb-2">Mock Top-up</h3>
          <form onSubmit={handleTopup} className="flex gap-2">
            <input 
              type="number" 
              required 
              min="1"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              className="input-field"
              placeholder="Amount"
            />
            <button type="submit" className="btn-secondary whitespace-nowrap">Add Funds</button>
          </form>
        </div>

        {/* Recent Transactions */}
        <div className="card flex-1 flex flex-col h-96">
          <h2 className="text-2xl font-bold text-clay-800 mb-4">Transaction History</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {transactions.length === 0 ? (
              <p className="text-clay-500 text-center py-4">No transactions yet.</p>
            ) : (
              transactions.map(tx => (
                <div key={tx._id} className="bg-clay-50 p-3 rounded-xl border border-clay-200 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-clay-500 block mb-1">{new Date(tx.createdAt).toLocaleDateString()}</span>
                    <span className="font-semibold text-clay-700">{tx.type}</span>
                  </div>
                  <span className={`font-black ${tx.type === 'CHARGE' || tx.type === 'ESCROW_HOLD' ? 'text-red-500' : 'text-green-600'}`}>
                    {tx.type === 'CHARGE' || tx.type === 'ESCROW_HOLD' ? '-' : '+'}₹{tx.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Bookings Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-clay-800 mb-6">My Bookings</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-clay-300 text-clay-700">
                <th className="p-3">Item</th>
                <th className="p-3">Role</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-6 text-clay-500">No bookings found.</td></tr>
              ) : (
                bookings.map(b => {
                  const isOwner = b.owner._id === user._id;
                  return (
                    <tr key={b._id} className="border-b border-clay-200 hover:bg-clay-50 transition-colors">
                      <td className="p-3 font-medium text-clay-800">
                        <Link to={`/items/${b.item._id}`} className="hover:underline">{b.item.title}</Link>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded-lg ${isOwner ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {isOwner ? 'Lender' : 'Borrower'}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-clay-600">
                        {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-semibold">₹{b.totalFee}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded-lg shadow-sm border
                          ${b.status === 'REQUESTED' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                          ${b.status === 'APPROVED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}
                          ${b.status === 'ACTIVE' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${b.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${b.status === 'CANCELLED' || b.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        `}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        {isOwner && b.status === 'REQUESTED' && (
                          <>
                            <button onClick={() => updateBookingStatus(b._id, 'APPROVED')} className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600">Approve</button>
                            <button onClick={() => updateBookingStatus(b._id, 'REJECTED')} className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600">Reject</button>
                          </>
                        )}
                        {b.status === 'APPROVED' && (
                          <button onClick={() => updateBookingStatus(b._id, 'ACTIVE')} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600">Start Active</button>
                        )}
                        {isOwner && b.status === 'ACTIVE' && (
                          <button onClick={() => updateBookingStatus(b._id, 'RETURNED')} className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-xs font-bold hover:bg-indigo-600">Confirm Return</button>
                        )}
                        {(b.status === 'REQUESTED' || b.status === 'APPROVED') && !isOwner && (
                           <button onClick={() => updateBookingStatus(b._id, 'CANCELLED')} className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs font-bold hover:bg-gray-600">Cancel</button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
