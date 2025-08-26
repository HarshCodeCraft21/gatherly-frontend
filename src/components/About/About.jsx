import { Users, Target, Heart, Award } from 'lucide-react';
import aboutTeam from '../../assets/about-team.jpg';
import './About.css';

const About = () => {
  const values = [
    {
      icon: <Users />,
      title: "Community First",
      description: "We believe in bringing people together and creating meaningful connections through shared experiences."
    },
    {
      icon: <Target />,
      title: "Quality Events",
      description: "We carefully curate events to ensure every experience meets our high standards of excellence."
    },
    {
      icon: <Heart />,
      title: "Passion Driven",
      description: "Our team is passionate about creating unforgettable moments and fostering community spirit."
    },
    {
      icon: <Award />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our platform and customer experience."
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Users" },
    { number: "2K+", label: "Events Hosted" },
    { number: "100+", label: "Cities" },
    { number: "5★", label: "Average Rating" }
  ];

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-hero">
          <div className="about-content">
            <h1 className="about-title">About Gatherly</h1>
            <p className="about-subtitle">
              Connecting communities through extraordinary events and meaningful experiences
            </p>
            <p className="about-description">
              Founded in 2020, Gatherly has grown from a simple idea to revolutionize 
              how people discover and attend events. We're dedicated to building a platform 
              that brings people together, creates lasting memories, and strengthens communities 
              worldwide.
            </p>
          </div>
          <div className="about-image">
            <img src={aboutTeam} alt="Gatherly Team" />
          </div>
        </div>

        <div className="about-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="about-mission">
          <h2 className="section-title">Our Mission</h2>
          <p className="mission-text">
            To create a world where everyone can easily discover, connect, and participate 
            in events that inspire, educate, and bring joy. We believe that shared experiences 
            are the foundation of strong communities and lasting relationships.
          </p>
        </div>

        <div className="about-values">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  {value.icon}
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-story">
          <h2 className="section-title">Our Story</h2>
          <div className="story-content">
            <p>
              Gatherly was born from the simple observation that finding and attending 
              great events shouldn't be complicated. Our founders, passionate event-goers 
              themselves, noticed the gap between amazing events happening everywhere and 
              people's ability to discover them.
            </p>
            <p>
              What started as a weekend project quickly grew into a mission to democratize 
              event discovery. Today, we're proud to serve thousands of event organizers 
              and hundreds of thousands of attendees across the globe.
            </p>
            <p>
              Looking forward, we're committed to continuously innovating and improving 
              our platform to make event discovery even more personalized, accessible, 
              and enjoyable for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;