import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { REGISTER } from '../api/api.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill required fields!");
        return;
      }

      const res = await axios.post(REGISTER, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true
      });

      toast.success(res.data.message);
      setFormData({ name: '', email: '', password: '' });

      setTimeout(() => navigate('/login'), 1000);

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };


  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1 className="signup-title">Join Gatherly</h1>
            <p className="signup-subtitle">Create your account to start discovering amazing events</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <div className="input-wrapper">
                {/* <User className="input-icon" /> */}
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-wrapper">
                {/* <Mail className="input-icon" /> */}
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                {/* <Lock className="input-icon" /> */}
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className='signup-button'
            >
              Create Account
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Login in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;