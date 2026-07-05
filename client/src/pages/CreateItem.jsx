import { useState } from 'react';
import { apiFetch } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    campus: 'MANIT',
    rentalFeePerDay: '',
    depositAmount: '',
    imageUrl: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        rentalFeePerDay: Number(formData.rentalFeePerDay),
        depositAmount: Number(formData.depositAmount),
        images: formData.imageUrl ? [formData.imageUrl] : []
      };
      
      const res = await apiFetch('/items', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      navigate(`/items/${res._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card">
        <h2 className="text-3xl font-bold text-clay-800 mb-6">List an Item</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-clay-700 mb-1 font-medium">Title</label>
            <input 
              type="text" 
              required 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="input-field"
              placeholder="e.g. Scientific Calculator"
            />
          </div>
          
          <div>
            <label className="block text-clay-700 mb-1 font-medium">Description</label>
            <textarea 
              required 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input-field min-h-[100px]"
              placeholder="Describe the condition, what's included, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-clay-700 mb-1 font-medium">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="input-field bg-white"
              >
                <option value="electronics">Electronics</option>
                <option value="textbooks">Textbooks</option>
                <option value="lab-equipment">Lab Equipment</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-clay-700 mb-1 font-medium">Campus</label>
              <input 
                type="text" 
                disabled
                value={formData.campus}
                className="input-field bg-clay-100 text-clay-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-clay-700 mb-1 font-medium">Rental Fee per Day (₹)</label>
              <input 
                type="number" 
                required 
                min="0"
                value={formData.rentalFeePerDay}
                onChange={(e) => setFormData({...formData, rentalFeePerDay: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-clay-700 mb-1 font-medium">Security Deposit (₹)</label>
              <input 
                type="number" 
                required 
                min="0"
                value={formData.depositAmount}
                onChange={(e) => setFormData({...formData, depositAmount: e.target.value})}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-clay-700 mb-1 font-medium">Image URL (Optional)</label>
            <input 
              type="url" 
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg font-bold mt-4">
            {loading ? 'Listing...' : 'List Item'}
          </button>
        </form>
      </div>
    </div>
  );
}
