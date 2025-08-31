import { useEffect, useState } from 'react';
import axios from 'axios';
import { ALL_EVENT } from '../../api/api.js';
import { Calendar, MapPin, Users, IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import techConference from '../../assets/tech-conference.jpg'; // fallback image
import './Events.css';
import { ScrollBar } from '../scrollbar/scrollbar.jsx';

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="events-section spinner-container">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="events-section">
      <div className="events-container">
        {
          event.length === 0 ? (
            <div className='event-header'>
              <h1 className='event-title'>No Event yet</h1>
            </div>
          ) : (
            <div className="events-grid">
              {event.map((e) => (
                <div
                  key={e._id}
                  className="event-card"
                  onClick={() => navigate(`/events/${e._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="event-image">
                    <img src={e.banner ? e.banner : techConference} alt={e.title} />
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
                        <IndianRupee className="detail-icon" />
                        <span>{e.price}/-</span>
                      </div>

                      <div className="event-detail">
                        <Users className="detail-icon" />
                        <span>{e.capacity} capacity</span>
                      </div>
                    </div>
                    <button className="register-btn" >More Details</button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Events;
