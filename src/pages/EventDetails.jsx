import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Clock,
  IndianRupee,
} from "lucide-react";
import techConference from "../assets/tech-conference.jpg";
import "./EventDetails.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CREATE_BOOKING,
  FIND_EVENT_BY_ID,
  VERIFY_PAYMENT,
  CHECKISREGISTER,
} from "../api/api.js";
import axios from "axios";

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [registerBtn, setRegisterBtn] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Check if user already registered
  const checkUserRegisterOrFail = async (Token) => {
    try {
      const res = await axios.get(`${CHECKISREGISTER}/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${Token}` },
      });

      if (res.data.registered) {
        setRegisterBtn(true);
      } else {
        setRegisterBtn(false);
      }
    } catch (error) {
      console.error("Register check failed:", error.response?.data || error.message);
      setRegisterBtn(false);
    }
  };

  // ✅ Fetch event & check register
  useEffect(() => {
    const Token = localStorage.getItem("JwtToken");
    if (!Token) {
      toast.error("Token is missing, please login again!");
      navigate("/login");
      return;
    }
    setToken(Token);

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${FIND_EVENT_BY_ID}/${id}`, {
          withCredentials: true,
        });
        setEvent(res.data);
        await checkUserRegisterOrFail(Token); // ✅ check after event fetch
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  // ✅ Availability logic
  const getAvailabilityStatus = (available, total) => {
    if (!total) return "low";
    const percentage = (available / total) * 100;
    if (percentage > 50) return "high";
    if (percentage > 20) return "medium";
    return "low";
  };

  // ✅ Payment Handler
  const handlePayment = async () => {
    try {
      const res = await axios.post(
        `${CREATE_BOOKING}/${event._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const { order, key, bookingId } = res.data;

      if (!order?.id) {
        toast.error("Order creation failed!");
        return;
      }

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: event.title,
        description: "Event Ticket Purchase",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${VERIFY_PAYMENT}/${id}`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              }
            );
            await checkUserRegisterOrFail(token); // ✅ refresh register status
            toast.success("Payment successful!");
            navigate("/");
          } catch (err) {
            console.error("Verify Error:", err.response?.data || err.message);
            toast.error("Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div className="event-details-page">
        <div className="event-details-container">
          <h2>Loading event details...</h2>
        </div>
      </div>
    );
  }

  // ✅ Not Found
  if (!event) {
    return (
      <div className="event-details-page">
        <div className="event-details-container">
          <h1>Event not found</h1>
          <button onClick={() => navigate("/events")} className="back-btn">
            <ArrowLeft size={20} /> Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <div className="event-details-container">
        <button onClick={() => navigate("/events")} className="back-btn">
          <ArrowLeft size={20} /> Back to Events
        </button>

        {/* Hero Section */}
        <div className="event-details-hero">
          <div className="event-hero-image">
            <img src={event.image || techConference} alt={event.title} />
            <div className="event-hero-category">
              {event.category || "General"}
            </div>
          </div>

          <div className="event-hero-content">
            <h1 className="event-details-title">{event.title}</h1>

            <div className="event-details-meta">
              <div className="event-meta-item">
                <Calendar className="meta-icon" />
                <span>
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="event-meta-item">
                <Clock className="meta-icon" />
                <span>
                  {new Date(`1970-01-01T${event.time}`).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </span>
              </div>

              <div className="event-meta-item">
                <MapPin className="meta-icon" />
                <span>{event.venue}</span>
              </div>

              <div className="event-meta-item">
                <IndianRupee className="meta-icon" />
                <span>{event.price}/-</span>
              </div>

              <div className="event-meta-item">
                <Users className="meta-icon" />
                <span>
                  {event.availableSeats} / {event.totalSeats || "?"} seats
                  available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Content */}
        <div className="event-details-content">
          <div className="event-description-section">
            <h2 className="section-title">About This Event</h2>
            <p className="event-description">{event.description}</p>
          </div>

          {/* Booking Section */}
          <div className="event-booking-section">
            <div className="availability-section">
              <h3 className="availability-title">Seat Availability</h3>
              <div
                className={`availability-indicator ${getAvailabilityStatus(
                  event.availableSeats,
                  event.totalSeats || 1
                )}`}
              >
                <span className="seats-available">
                  {event.availableSeats} seats available
                </span>
                <div className="availability-bar">
                  <div
                    className="availability-fill"
                    style={{
                      width: `${
                        (event.availableSeats / (event.totalSeats || 1)) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pricing-section">
              <div className="price-display">
                <span className="price-label">Ticket Price</span>
                <span className="price-amount">₹{event.price}</span>
              </div>

              <button
                className={registerBtn ? "disable-btn" : "register-btn"}
                disabled={registerBtn}
                onClick={handlePayment}
              >
                {registerBtn ? "Already Registered" : "Register Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
