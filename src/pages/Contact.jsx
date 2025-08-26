import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import './Contact.css';

const Contact = ({token}) => {
  const [ user , setUser ] = useState("");
  useEffect(()=>{
    if(!token){
      return ;
    }
    const user = jwtDecode(token)
    setUser()
  },[token])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Contact form submitted:', formData);
      setIsLoading(false);
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Mail />,
      title: "Email Us",
      content: "hello@gatherly.com",
      description: "Send us an email anytime"
    },
    {
      icon: <Phone />,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: <MapPin />,
      title: "Visit Us",
      content: "123 Event Street",
      description: "City, State 12345"
    },
    {
      icon: <Clock />,
      title: "Business Hours",
      content: "Mon-Fri: 9AM-6PM",
      description: "Weekend: 10AM-4PM"
    }
  ];

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-subtitle">
            Have questions about our events or need help with your booking? 
            We're here to help you create amazing experiences.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info-section">
            <h2 className="section-title">Contact Information</h2>
            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-info-card">
                  <div className="contact-info-icon">
                    {info.icon}
                  </div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">{info.title}</h3>
                    <p className="contact-info-text">{info.content}</p>
                    <p className="contact-info-description">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-section">
            <h2 className="section-title">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
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
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
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
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  className="form-textarea"
                  rows="6"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className={`submit-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                <Send className="button-icon" />
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="contact-faq">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">How do I book an event?</h3>
              <p className="faq-answer">
                Simply browse our events, select the one you're interested in, 
                and click "Register Now". You'll be guided through the booking process.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Can I cancel my booking?</h3>
              <p className="faq-answer">
                Yes, you can cancel your booking up to 24 hours before the event 
                for a full refund. Check our refund policy for more details.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How do I become an event organizer?</h3>
              <p className="faq-answer">
                Contact us to learn about our event organizer program. We'll help 
                you set up your profile and start hosting amazing events.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do you offer group discounts?</h3>
              <p className="faq-answer">
                Yes! We offer special rates for groups of 10 or more. Contact us 
                for a custom quote based on your group size and event selection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;