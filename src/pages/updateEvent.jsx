import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, FileText, Clock, UploadIcon, IndianRupee } from 'lucide-react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import { CREATE_EVENT } from '../api/api.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import './CreateEvent.css'

const UpdateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    price: 0,
    capacity: 0,
    date: '',
    time: '',
    category: '',
    banner: null,
  });
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!Cookies.get("JwtToken")) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = type === "number" ? (value === "" ? 0 : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleTimeChange = (value) => setFormData(prev => ({ ...prev, time: value }));

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG and PNG images are allowed");
        e.target.value = null;
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Image size must be less than 3MB");
        e.target.value = null;
        return;
      }
      setFormData(prev => ({ ...prev, banner: file }));
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  // Convert 12-hour to 24-hour format for backend
  const formatTime24 = (time) => {
    if (!time) return '';
    const [h, m, period] = time.split(/[: ]/);
    let hour = Number(h);
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2,'0')}:${m}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("JwtToken");
    const payload = new FormData();

    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '' && formData[key] !== undefined) {
        if (key === "time") {
          payload.append(key, formatTime24(formData[key]));
        } else {
          payload.append(key, formData[key]);
        }
      }
    }

    console.log("FormData entries:", [...payload]); // Debug log

    try {
      const res = await axios.post(CREATE_EVENT, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      toast.success(res.data.message || "Event created successfully!");
      navigate('/user-profile');
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong, try again later");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "title", label: "Event Title", icon: <FileText className="label-icon" />, type: "text", placeholder: "Enter event title" },
    { name: "description", label: "Description", icon: <FileText className="label-icon" />, type: "textarea", placeholder: "Describe your event in detail", rows: 4 },
    { name: "date", label: "Event Date", icon: <Calendar className="label-icon" />, type: "date" },
    { name: "category", label: "Category", icon: <FileText className="label-icon" />, type: "select", options: ["Technology", "Business", "Education", "Health & Fitness", "Arts & Culture", "Sports", "Entertainment", "Finance", "Lifestyle"] },
    { name: "venue", label: "Venue", icon: <MapPin className="label-icon" />, type: "text", placeholder: "Enter venue location" },
    { name: "price", label: "Ticket Price (₹)", icon: <IndianRupee className="label-icon" />, type: "number", placeholder: "0", min: 0, step: 0.01 },
    { name: "capacity", label: "Total Capacity", icon: <Users className="label-icon" />, type: "number", placeholder: "0", min: 1 },
    { name: "banner", label: "Upload Banner", icon: <UploadIcon className='label-icon' />, type: "file" }
  ];

  const renderField = (field) => {
    switch (field.type) {
      case "textarea":
        return <textarea name={field.name} value={formData[field.name]} onChange={handleChange} placeholder={field.placeholder} rows={field.rows} className="form-textarea" required />;
      case "select":
        return (
          <select name={field.name} value={formData[field.name]} onChange={handleChange} className="form-select" required>
            <option value="">Select a category</option>
            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      case "file":
        return (
          <>
            <input
              type="file"
              name={field.name}
              onChange={handleBannerChange}
              accept="image/jpeg,image/png"
              className="form-input"
              required
            />
            {bannerPreview && <img src={bannerPreview} alt="Banner Preview" className="banner-preview" />}
          </>
        );
      default:
        return <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange} placeholder={field.placeholder} min={field.min} step={field.step} className="form-input" required />;
    }
  };

  return (
    <div className="create-event-page">
      <div className="create-event-container">
        <div className="create-event-header">
          <h1 className="create-event-title">Update Event</h1>
          <p className="create-event-subtitle">Fill in the details to update an amazing event</p>
        </div>

        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-grid">
            {fields.map(field => (
              <div key={field.name} className="form-group">
                <label className="form-label">{field.icon}{field.label}</label>
                {renderField(field)}
              </div>
            ))}

            <div className="form-group">
              <label className="form-label"><Clock className="label-icon" /> Event Time</label>
              <TimePicker
                onChange={handleTimeChange}
                value={formData.time}
                disableClock
                format="hh:mm a"
                clearIcon={null}
                clockIcon={<Clock size={20} />}
                className="time-picker-input"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/events')} className="cancel-btn">Cancel</button>
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEvent;
