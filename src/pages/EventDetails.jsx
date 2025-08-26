import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, ArrowLeft } from 'lucide-react';
import techConference from '../assets/tech-conference.jpg';
import './EventDetails.css';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FIND_EVENT_BY_ID } from '../utils/api.js';
import axios from 'axios';

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${FIND_EVENT_BY_ID}/${id}`, {
          withCredentials: true
        });
        setEvent(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const getAvailabilityStatus = (available, capacity) => {
    const percentage = (available / capacity) * 100;
    if (percentage > 50) return 'high';
    if (percentage > 20) return 'medium';
    return 'low';
  };

  const formatDateTime = (dateStr, timeStr) => {
    const dateObj = new Date(`${dateStr}T${timeStr}`);
    return dateObj.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="event-details-page">
        <div className="event-details-container">
          <h2>Loading event details...</h2>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-page">
        <div className="event-details-container">
          <h1>Event not found</h1>
          <button onClick={() => navigate('/events')} className="back-btn">
            <ArrowLeft size={20} />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <div className="event-details-container">
        <button onClick={() => navigate('/events')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Events
        </button>

        <div className="event-details-hero">
          <div className="event-hero-image">
            <img
              src={event.image || techConference}
              alt={event.title}
            />
            <div className="event-hero-category">
              {event.category || 'Marketing'}
            </div>
          </div>

          <div className="event-hero-content">
            <h1 className="event-details-title">{event.title}</h1>

            <div className="event-details-meta">
              <div className="event-meta-item">
                <Calendar className="meta-icon" />
                <span>{formatDateTime(event.date, event.time)}</span>
              </div>

              <div className="event-meta-item">
                <MapPin className="meta-icon" />
                <span>{event.venue}</span>
              </div>

              <div className="event-meta-item">
                <DollarSign className="meta-icon" />
                <span>${event.price}</span>
              </div>

              <div className="event-meta-item">
                <Users className="meta-icon" />
                <span>{event.capacity} capacity</span>
              </div>
            </div>
          </div>
        </div>

        <div className="event-details-content">
          <div className="event-description-section">
            <h2 className="section-title">About This Event</h2>
            <p className="event-description">{event.description}</p>
          </div>

          <div className="event-agenda-section">
            <h2 className="section-title">Event Agenda</h2>
            {event.agenda && event.agenda.length > 0 ? (
              <div className="agenda-list">
                {event.agenda.map((item, index) => {
                  const [time, activity] = item.includes(" - ")
                    ? item.split(" - ")
                    : [null, item];
                  return (
                    <div key={index} className="agenda-item">
                      {time && <div className="agenda-time">{time}</div>}
                      <div className="agenda-activity">{activity}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-agenda-text">Agenda will be updated soon.</p>
            )}
          </div>

          <div className="event-booking-section">
            <div className="availability-section">
              <h3 className="availability-title">Seat Availability</h3>
              <div className={`availability-indicator ${getAvailabilityStatus(event.availableSeats, event.capacity)}`}>
                <span className="seats-available">{event.availableSeats} seats available</span>
                <div className="availability-bar">
                  <div
                    className="availability-fill"
                    style={{ width: `${(event.availableSeats / event.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pricing-section">
              <div className="price-display">
                <span className="price-label">Ticket Price</span>
                <span className="price-amount">${event.price}</span>
              </div>

              <button
                className="register-btn"
                disabled={event.availableSeats === 0}
              >
                {event.availableSeats === 0 ? "Sold Out" : "Register for Event"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
