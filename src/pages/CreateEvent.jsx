import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, FileText, Clock } from 'lucide-react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import './CreateEvent.css';
import { CREATE_EVENT } from '../api/api.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    price: 0 || null,
    capacity: 0 || null,
    date: '',
    time: '',
    category: ''
  });

  useEffect(() => {
    if (!Cookies.get("JwtToken")) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = type === "number" ? (value === "" ? 0 : Number(value)) : value;
    setFormData(prev => {
      const newState = { ...prev, [name]: val };
      // Sync availableSeats with capacity
      if (name === "capacity") newState.availableSeats = val;
      return newState;
    });
  };

  const handleTimeChange = (value) => setFormData(prev => ({ ...prev, time: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("JwtToken");

    // Ensure numeric fields are numbers
    const payload = {
      ...formData,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      availableSeats: Number(formData.availableSeats)
    };

    try {
      const res = await axios.post(CREATE_EVENT, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      toast.success(res.data.message || "Event created successfully!");
      navigate('/events');
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong, try again later");
    }
  };

  const fields = [
    { name: "title", label: "Event Title", icon: <FileText className="label-icon" />, type: "text", placeholder: "Enter event title" },
    { name: "description", label: "Description", icon: <FileText className="label-icon" />, type: "textarea", placeholder: "Describe your event in detail", rows: 4 },
    { name: "date", label: "Event Date", icon: <Calendar className="label-icon" />, type: "date" },
    { name: "category", label: "Category", icon: <FileText className="label-icon" />, type: "select", options: ["Technology","Business","Education","Health & Fitness","Arts & Culture","Sports","Entertainment","Finance","Lifestyle"] },
    { name: "venue", label: "Venue", icon: <MapPin className="label-icon" />, type: "text", placeholder: "Enter venue location" },
    { name: "price", label: "Ticket Price ($)", icon: <DollarSign className="label-icon" />, type: "number", placeholder: "0", min: 0, step: 0.01 },
    { name: "capacity", label: "Total Capacity", icon: <Users className="label-icon" />, type: "number", placeholder: "0", min: 1 }
  ];

  const renderField = (field) => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            rows={field.rows}
            className="form-textarea"
            required
          />
        );
      case "select":
        return (
          <select
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select a category</option>
            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            min={field.min}
            step={field.step}
            className="form-input"
            required
          />
        );
    }
  };

  return (
    <div className="create-event-page">
      <div className="create-event-container">
        <div className="create-event-header">
          <h1 className="create-event-title">Create New Event</h1>
          <p className="create-event-subtitle">Fill in the details to create an amazing event</p>
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
            <button type="submit" className="create-btn">Create Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
