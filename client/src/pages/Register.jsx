import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', campus: 'MANIT' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.campus);
      setMsg('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card">
        <h2 className="text-3xl font-bold text-center text-clay-800 mb-6">Join UniLend</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">{error}</div>}
        {msg && <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-clay-700 mb-1 font-medium">Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="input-field"
              placeholder="Your Full Name"
            />
          </div>
          <div>
            <label className="block text-clay-700 mb-1 font-medium">Email</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="input-field"
              placeholder="you@stu.manit.ac.in"
            />
          </div>
          <div>
            <label className="block text-clay-700 mb-1 font-medium">Password</label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3 mt-4 text-lg">Create Account</button>
        </form>
        <p className="text-center mt-6 text-clay-600">
          Already have an account? <Link to="/login" className="text-clay-800 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
