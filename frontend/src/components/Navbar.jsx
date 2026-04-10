import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, ShoppingBag, LogOut, LayoutDashboard, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Utensils size={28} />
        Gourmet
      </Link>
      
      {user && (
        <div className="navbar-nav">
          {user.role === 'ADMIN' ? (
            <>
              <Link to="/admin/dashboard" className="nav-link flex items-center gap-2">
                <LayoutDashboard size={20} /> Dashboard
              </Link>
              <Link to="/admin/menu" className="nav-link flex items-center gap-2">
                <Menu size={20} /> Manage Menu
              </Link>
              <Link to="/admin/orders" className="nav-link flex items-center gap-2">
                <ShoppingBag size={20} /> Orders
              </Link>
            </>
          ) : (
            <>
              <Link to="/menu" className="nav-link flex items-center gap-2">
                <Menu size={20} /> Our Menu
              </Link>
              <Link to="/orders" className="nav-link flex items-center gap-2">
                <ShoppingBag size={20} /> My Orders
              </Link>
            </>
          )}
          
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
      {!user && (
        <div className="navbar-nav">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
