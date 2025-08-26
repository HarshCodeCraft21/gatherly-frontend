import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import heroImage from '../../assets/hero-banner.jpg';
import './Slider.css';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: heroImage,
      title: "Discover Amazing Events",
      subtitle: "Join thousands of people at incredible events",
      buttonText: "Explore Events"
    },
    {
      id: 2,
      image: heroImage,
      title: "Connect with Like-minded People",
      subtitle: "Network and build lasting relationships",
      buttonText: "Join Community"
    },
    {
      id: 3,
      image: heroImage,
      title: "Create Unforgettable Memories",
      subtitle: "Experience moments that last a lifetime",
      buttonText: "Book Now"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="slider">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <button className="slide-button">
                <Calendar className="button-icon" />
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="slider-nav prev" onClick={prevSlide}>
        <ChevronLeft />
      </button>
      <button className="slider-nav next" onClick={nextSlide}>
        <ChevronRight />
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;