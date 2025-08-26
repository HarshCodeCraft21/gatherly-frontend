import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, FileText } from 'lucide-react';
import './CreateEvent.css';
import { CREATE_EVENT } from '../utils/api.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    price: '',
    capacity: '',
    availableSeats: '',
    date: '',
    category: '',
  });

  // ✅ Page load होते ही role check
  useEffect(() => {
    const token = Cookies.get("JwtToken");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        toast.error("You are not authorized to access this page!");
        navigate("/events");
      }
    } catch (err) {
      toast.error("Invalid token");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get("JwtToken");
    let role = null;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        role = decoded.role;
      } catch (error) {
        toast.error("Invalid token");
        return;
      }
    }

    if (role !== "admin") {
      toast.error("You are not authorized to create events!");
      navigate("/events");
      return;
    }

    try {
      const res = await axios.post(CREATE_EVENT, formData, {
        withCredentials: true,
      });
      toast.success(res.data.message || "Event created successfully!");
      navigate('/events');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Config for reusable form fields
  const fields = [
    {
      name: "title",
      label: "Event Title",
      icon: <FileText className="label-icon" />,
      type: "text",
      placeholder: "Enter event title",
    },
    {
      name: "description",
      label: "Description",
      icon: <FileText className="label-icon" />,
      type: "textarea",
      placeholder: "Describe your event in detail",
      rows: 4,
    },
    {
      name: "date",
      label: "Event Date",
      icon: <Calendar className="label-icon" />,
      type: "date",
    },
    {
      name: "category",
      label: "Category",
      icon: <FileText className="label-icon" />,
      type: "select",
      options: ["Technology", "Music", "Art", "Business", "Food", "Sports", "Education"],
    },
    {
      name: "venue",
      label: "Venue",
      icon: <MapPin className="label-icon" />,
      type: "text",
      placeholder: "Enter venue location",
    },
    {
      name: "price",
      label: "Ticket Price ($)",
      icon: <DollarSign className="label-icon" />,
      type: "number",
      placeholder: "0",
      min: 0,
      step: 0.01,
    },
    {
      name: "capacity",
      label: "Total Capacity",
      icon: <Users className="label-icon" />,
      type: "number",
      placeholder: "0",
      min: 1,
    },
    {
      name: "availableSeats",
      label: "Available Seats",
      icon: <Users className="label-icon" />,
      type: "number",
      placeholder: "0",
      min: 0,
      max: formData.capacity || undefined,
    },
  ];

  return (
    <div className="create-event-page">
      <div className="create-event-container">
        <div className="create-event-header">
          <h1 className="create-event-title">Create New Event</h1>
          <p className="create-event-subtitle">Fill in the details to create an amazing event</p>
        </div>

        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-grid">
            {fields.map((field) => (
              <div key={field.name} className="form-group">
                <label className="form-label">
                  {field.icon}
                  {field.label}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    rows={field.rows}
                    className="form-textarea"
                    required
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select a category</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className="form-input"
                    required
                  />
                )}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="create-btn">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
