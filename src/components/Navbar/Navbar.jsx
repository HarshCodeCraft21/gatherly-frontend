import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, LogOutIcon, Menu, X , Mail} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import Cookie from 'js-cookie';

const Navbar = ({ verifyToken }) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!verifyToken) {
      return;
    }
    try {
      const decode = jwtDecode(verifyToken);
      setUser(decode);
    } catch (error) {
      toast.error("Invalid token", error);
    }
  }, [verifyToken]);

  const clearToken = () => {
    if (confirm("Are you sure you want to Logout?")) {
      Cookie.remove("JwtToken");
      localStorage.clear();
      setLoading(false);
      toast.success("You logged out successfully");
      window.location.reload();
    } else {
      setLoading(true);
    }
  };

  return (
    <>
      {loading && <h1>Loading...</h1>}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <Calendar className="navbar-icon" />
            <span>Gatherly</span>
          </Link>

          {/* Hamburger Button */}
          <button
            className="menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation + Auth combined */}
          <div className={`navbar-nav ${isOpen ? "active" : ""}`}>
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/events" className="nav-link" onClick={() => setIsOpen(false)}>Events</Link>
            <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</Link>

            {/* Admin link */}
            {verifyToken && user.role === "admin" && (
              <Link
                to="/create-event"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Create Event
              </Link>
            )}

            {/* Auth section inside nav */}
            {verifyToken ? (
              <div className="auth-box">
                <div className="user-chip">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <button className="logout-btn" onClick={clearToken}>
                  <LogOutIcon size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/signup" className="auth-button signup-btn" onClick={() => setIsOpen(false)}>Sign Up</Link>
                <Link to="/login" className="auth-button login-btn" onClick={() => setIsOpen(false)}>Login</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
