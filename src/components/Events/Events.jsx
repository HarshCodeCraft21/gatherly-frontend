import { useEffect, useState } from 'react';
import axios from 'axios';
import { ALL_EVENT } from '../../api/api.js';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import techConference from '../../assets/tech-conference.jpg'; // fallback image
import './Events.css';

const Events = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAvailabilityStatus = (available, capacity) => {
    const percentage = (available / capacity) * 100;
    if (percentage > 50) return 'high';
    if (percentage > 20) return 'medium';
    return 'low';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(ALL_EVENT);
        setEvent(res.data.eventData);
      } catch (error) {
        toast.error("Failed to load events");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="events-section">Loading events...</div>;
  return (
    <div className="events-section">
      <div className="events-container">
        <div className="events-header">
          <h2 className="events-title">Featured Events</h2>
          <p className="events-subtitle">Discover amazing events happening near you</p>
        </div>

        <div className="events-grid">
          {event.map((e) => (
            <div
              key={e._id}
              className="event-card"
              onClick={() => navigate(`/events/${e._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="event-image">
                <img src={techConference} alt={e.title} />
                <div className="event-category">{e.category || "General"}</div>
              </div>

              <div className="event-content">
                <h3 className="event-title">{e.title}</h3>

                <div className="event-details">
                  <div className="event-detail">
                    <Calendar className="detail-icon" />
                    <span>{new Date(e.date).toDateString()}</span>
                  </div>

                  <div className="event-detail">
                    <MapPin className="detail-icon" />
                    <span>{e.venue}</span>
                  </div>

                  <div className="event-detail">
                    <DollarSign className="detail-icon" />
                    <span>${e.price}</span>
                  </div>

                  <div className="event-detail">
                    <Users className="detail-icon" />
                    <span>{e.capacity} capacity</span>
                  </div>
                </div>

                <div className="event-availability">
                  <div
                    className={`availability-indicator ${getAvailabilityStatus(
                      e.availableSeats,
                      e.capacity
                    )}`}
                  >
                    <span className="seats-available">{e.availableSeats} seats available</span>
                    <div className="availability-bar">
                      <div
                        className="availability-fill"
                        style={{ width: `${(e.availableSeats / e.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button className="register-btn" >Register Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
