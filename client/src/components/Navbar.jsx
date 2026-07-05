import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Wallet } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-clay-100 shadow-clay-inset sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-clay-800 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-clay-600 shadow-clay flex items-center justify-center text-white">U</div>
          UniLend
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/create-item" className="btn-secondary hidden sm:block">List Item</Link>
              <div className="flex items-center gap-2 bg-clay-50 px-3 py-1.5 rounded-xl shadow-clay-inset">
                <Wallet className="w-4 h-4 text-clay-600" />
                <span className="font-semibold text-clay-800">₹{user.walletBalance}</span>
              </div>
              <Link to="/dashboard" className="p-2 rounded-xl text-clay-700 hover:bg-clay-200 transition-colors shadow-clay">
                <User className="w-5 h-5" />
              </Link>
              <button onClick={logout} className="p-2 rounded-xl text-red-700 hover:bg-red-100 transition-colors shadow-clay">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
