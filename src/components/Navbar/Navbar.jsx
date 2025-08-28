import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Menu, X, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import SettingsDropdown from "../SettingsDropdown/Settings";

const Navbar = ({ verifyToken }) => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  // Decode token when available
  useEffect(() => {
    if (!verifyToken) return;
    try {
      setUser(jwtDecode(verifyToken));
    } catch {
      toast.error("Invalid token");
    }
  }, [verifyToken]);

  // Close mobile menu on link click
  const handleCloseMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand" onClick={handleCloseMenu}>
          <Calendar className="navbar-icon" />
          <span>Gatherly</span>
        </Link>

        {/* Hamburger Button */}
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation */}
        <div className={`navbar-nav ${isOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link" onClick={handleCloseMenu}>
            Home
          </Link>
          <Link to="/events" className="nav-link" onClick={handleCloseMenu}>
            Events
          </Link>
          <Link to="/about" className="nav-link" onClick={handleCloseMenu}>
            About
          </Link>
          <Link to="/contact" className="nav-link" onClick={handleCloseMenu}>
            Contact
          </Link>

          {/* Admin only */}
          {user?.role === "admin" && (
            <Link
              to="/create-event"
              className="nav-link"
              onClick={handleCloseMenu}
            >
              Create Event
            </Link>
          )}

          {/* Auth section */}
          {user ? (
            <div className="auth-box">
              <div className="user-chip">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
              <SettingsDropdown />
            </div>
          ) : (
            <>
              <Link
                to="/signup"
                className="auth-button signup-btn"
                onClick={handleCloseMenu}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="auth-button login-btn"
                onClick={handleCloseMenu}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
