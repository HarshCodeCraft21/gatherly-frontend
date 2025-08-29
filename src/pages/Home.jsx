import Slider from '../components/Slider/Slider';
import Events from '../components/Events/Events';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Slider />
      <div className="events-page-header">
        <h1 className="page-title">Fetured Events</h1>
        <p className="page-subtitle">Discover amazing events happening near you</p>
      </div>
      <Events />
    </div>
  );
};

export default Home;