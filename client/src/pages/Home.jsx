import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [search, category]);

  const fetchItems = async () => {
    try {
      let query = '?';
      if (search) query += `search=${search}&`;
      if (category) query += `category=${category}&`;
      const data = await apiFetch(`/items${query}`);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10 text-center space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold text-clay-800 tracking-tight">Rent whatever you need on Campus</h1>
        <p className="text-xl text-clay-600 max-w-2xl mx-auto">Borrow electronics, textbooks, and more from your fellow students at MANIT.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-3 text-clay-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12 py-3 text-lg"
          />
        </div>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="input-field md:w-64 py-3 text-lg bg-white"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="textbooks">Textbooks</option>
          <option value="lab-equipment">Lab Equipment</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-clay-500 py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <Link to={`/items/${item._id}`} key={item._id} className="card hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full cursor-pointer">
              <div className="w-full h-48 bg-clay-200 rounded-xl mb-4 overflow-hidden shadow-clay-inset flex items-center justify-center">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-clay-400 font-medium">No Image</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-clay-800 mb-1 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-clay-500 mb-4">{item.category} • {item.owner?.name}</p>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-clay-200">
                <div>
                  <span className="text-2xl font-black text-clay-700">₹{item.rentalFeePerDay}</span>
                  <span className="text-sm text-clay-500">/day</span>
                </div>
                <div className="bg-clay-100 px-3 py-1 rounded-lg shadow-clay text-xs font-semibold text-clay-600">
                  Dep: ₹{item.depositAmount}
                </div>
              </div>
            </Link>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center text-clay-500 py-20 text-lg">
              No items found. Try a different search!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
