import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshProfile } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await apiFetch(`/items/${id}`);
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingError('');
    setBookingSuccess('');
    try {
      await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          item: id,
          startDate,
          endDate
        })
      });
      setBookingSuccess('Booking requested successfully!');
      refreshProfile();
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setBookingError(err.message);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!item) return <div className="text-center py-20">Item not found</div>;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
      {/* Image & Details */}
      <div>
        <div className="w-full h-80 bg-clay-200 rounded-3xl shadow-clay-inset mb-6 flex items-center justify-center overflow-hidden">
          {item.images && item.images.length > 0 ? (
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-clay-400 font-medium text-lg">No Image Available</span>
          )}
        </div>
        <h1 className="text-4xl font-bold text-clay-800 mb-2">{item.title}</h1>
        <p className="text-clay-500 font-medium mb-6">{item.category} • Listed by {item.owner?.name}</p>
        
        <h3 className="text-xl font-bold text-clay-700 mb-2">Description</h3>
        <p className="text-clay-600 leading-relaxed mb-6">{item.description}</p>
        
        <div className="card bg-clay-50">
          <h3 className="font-bold text-clay-700 mb-2">Pricing Details</h3>
          <div className="flex justify-between py-2 border-b border-clay-200">
            <span className="text-clay-600">Rental Fee</span>
            <span className="font-bold text-clay-800">₹{item.rentalFeePerDay} / day</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-clay-600">Security Deposit (Refundable)</span>
            <span className="font-bold text-clay-800">₹{item.depositAmount}</span>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div>
        <div className="card sticky top-24">
          <h2 className="text-2xl font-bold text-clay-800 mb-6">Request Booking</h2>
          
          {!item.isAvailable ? (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl font-medium">This item is currently not available.</div>
          ) : user && user._id === item.owner._id ? (
            <div className="bg-blue-100 text-blue-800 p-4 rounded-xl font-medium">This is your item.</div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              {bookingError && <div className="bg-red-100 text-red-700 p-3 rounded-xl">{bookingError}</div>}
              {bookingSuccess && <div className="bg-green-100 text-green-700 p-3 rounded-xl">{bookingSuccess}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-clay-700 mb-1 font-medium">Start Date</label>
                  <input 
                    type="date" 
                    required 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-clay-700 mb-1 font-medium">End Date</label>
                  <input 
                    type="date" 
                    required 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {startDate && endDate && (
                <div className="mt-4 p-4 bg-clay-50 rounded-xl shadow-clay-inset border border-clay-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-clay-600">Days</span>
                    <span className="font-medium">{Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-clay-200">
                    <span className="text-clay-800">Total (incl. deposit)</span>
                    <span className="text-clay-800">
                      ₹{(Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))) * item.rentalFeePerDay) + item.depositAmount}
                    </span>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary w-full py-4 text-lg font-bold mt-4">
                {user ? 'Request Booking' : 'Login to Book'}
              </button>
              
              <p className="text-xs text-clay-500 text-center mt-4">
                You won't be charged until the owner approves. Funds will be held in secure mock escrow.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
