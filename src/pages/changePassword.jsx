import './changePassword.css';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { CHANGE_PASSWORD } from '../api/api.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: ""
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { oldPassword, newPassword } = formData;
      if (oldPassword === newPassword) {
        toast.error("choose different password")
      }

      const res = await axios.put(CHANGE_PASSWORD, formData, {
        withCredentials: true
      })

      toast.success(res.data.message);

      setFormData({
        oldPassword: "",
        newPassword: ""
      });

      navigate("/")
    } catch (error) {
      toast.error("failed to change password");
      setFormData({
        oldPassword: "",
        newPassword: ""
      });
    }
  };

  return (
    <main className="change-password-container">
      <section className="form-section">
        <h2 className="title">Change Password</h2>
        <form className="change-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <div className="input-wrapper">
              <input
                type={showCurrent ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                required
              />
              <span
                className="eye-toggle"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                required
              />
              <span
                className="eye-toggle"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <button className="btn" type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ChangePassword;
