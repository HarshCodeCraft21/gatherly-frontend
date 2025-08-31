import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowLeft, Clock, IndianRupee } from "lucide-react";
import techConference from "../assets/tech-conference.jpg";
import "./EventDetails.css";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { CREATE_BOOKING, FIND_EVENT_BY_ID, VERIFY_PAYMENT, CHECKISREGISTER, USER_LIST } from "../api/api.js";
import axios from "axios";
import { MultiUserCard } from "../components/MultiUserCard";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("JwtToken"));
  const [registerBtn, setRegisterBtn] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [users, setUsers] = useState([]);

  const checkUserRegister = useCallback(async (Token) => {
    try {
      const res = await axios.get(`${CHECKISREGISTER}/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${Token}` },
      });
      setRegisterBtn(res.data.registered);
    } catch {
      setRegisterBtn(false);
    }
  }, [id]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${USER_LIST}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUsers(res.data.userDetails || []);
    } catch {
      toast.error("Failed to fetch registered users");
    }
  }, [id, token]);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${FIND_EVENT_BY_ID}/${id}`, { withCredentials: true });
      const eventData = res.data;
      setEvent(eventData);

      const eventDateTime = new Date(`${eventData.date}T${eventData.time}:00`);
      setIsExpired(eventDateTime <= new Date());
      if (eventDateTime <= new Date()) toast.error("Event Expired");

      await checkUserRegister(token);
      await fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [id, token, checkUserRegister, fetchUsers]);

  useEffect(() => {
    if (!token) {
      toast.error("Token is missing, please login again!");
      navigate("/login");
      return;
    }
    fetchEvent();
  }, [fetchEvent, token, navigate]);

  const getAvailabilityStatus = (available, total) => {
    if (!total) return "low";
    const percentage = (available / total) * 100;
    if (percentage > 50) return "high";
    if (percentage > 20) return "medium";
    return "low";
  };

  const handlePayment = async () => {
    if (isExpired) return toast.error("This event has already expired!");

    try {
      const { data } = await axios.post(`${CREATE_BOOKING}/${event._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const { order, key, bookingId } = data;
      if (!order?.id) return toast.error("Order creation failed!");

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: event.title,
        description: "Event Ticket Purchase",
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post(`${VERIFY_PAYMENT}/${id}`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            }, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });

            await checkUserRegister(token);
            toast.success("Payment successful!");
            navigate("/");
          } catch {
            toast.error("Payment verification failed");
          }
        },
      };
      new window.Razorpay(options).open();
    } catch {
      toast.error("Payment failed");
    }
  };

  if (loading) return <div className="event-details-page"><h2>Loading event details...</h2></div>;
  if (!event) return (
    <div className="event-details-page">
      <h1>Event not found</h1>
      <button onClick={() => navigate("/events")} className="back-btn"><ArrowLeft size={20} /> Back to Events</button>
    </div>
  );

  return (
    <div className="event-details-page">
      <button onClick={() => navigate("/events")} className="back-btn"><ArrowLeft size={20} /> Back to Events</button>

      <div className="event-details-hero">
        <img src={event.banner || techConference} alt={event.title} className="event-hero-image"/>
        <div className="event-hero-category">{event.category || "General"}</div>

        <div className="event-hero-content">
          <h1>{event.title}</h1>
          <div className="event-details-meta">
            <MetaItem Icon={Calendar} value={new Date(event.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })} />
            <MetaItem Icon={Clock} value={new Date(`1970-01-01T${event.time}`).toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit",hour12:true})} />
            <MetaItem Icon={MapPin} value={event.venue} />
            <MetaItem Icon={IndianRupee} value={`${event.price}/-`} />
            <MetaItem Icon={Users} value={`${event.availableSeats} / ${event.totalSeats || "?"} seats available`} />
          </div>
        </div>
      </div>

      <div className="event-details-content">
        <section className="event-description-section">
          <h2>About This Event</h2>
          <p>{event.description}</p>
        </section>

        <MultiUserCard users={users} />

        <div className={`event-booking-section ${isExpired ? "expired-event" : ""}`}>
          <div className="availability-section">
            <h3>Seat Availability</h3>
            <div className={`availability-indicator ${getAvailabilityStatus(event.availableSeats, event.totalSeats || 1)}`}>
              <span>{event.availableSeats} seats available</span>
              <div className="availability-bar">
                <div className="availability-fill" style={{ width: `${(event.availableSeats / (event.totalSeats || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="pricing-section">
            <div className="price-display">
              <span>Ticket Price</span>
              <span>₹{event.price}</span>
            </div>

            <button
              className={isExpired ? "expired-btn" : registerBtn ? "disable-btn" : "register-btn"}
              disabled={isExpired || registerBtn}
              onClick={handlePayment}
            >
              {isExpired ? "Event Expired" : registerBtn ? "Already Registered" : "Register Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// MetaItem Component for cleaner meta rendering
const MetaItem = ({ Icon, value }) => (
  <div className="event-meta-item">
    <Icon className="meta-icon" />
    <span>{value}</span>
  </div>
);

export default EventDetails;
