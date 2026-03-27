import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BusFront, User, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <BusFront className="icon" />
          <span>GoBus</span>
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              {user.role === 'ROLE_ADMIN' && (
                 <Link to="/admin" className="nav-link" style={{ color: '#d93025', fontWeight: 'bold' }}>
                   <Settings size={18} />
                   <span>Admin</span>
                 </Link>
              )}
              <Link to="/profile" className="nav-link">
                <User size={18} />
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline nav-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary nav-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
