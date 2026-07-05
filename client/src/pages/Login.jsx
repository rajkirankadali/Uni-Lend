import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card">
        <h2 className="text-3xl font-bold text-center text-clay-800 mb-6">Welcome Back</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-clay-700 mb-1 font-medium">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@stu.manit.ac.in"
            />
          </div>
          <div>
            <label className="block text-clay-700 mb-1 font-medium">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3 mt-4 text-lg">Login</button>
        </form>
        <p className="text-center mt-6 text-clay-600">
          Don't have an account? <Link to="/register" className="text-clay-800 font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
