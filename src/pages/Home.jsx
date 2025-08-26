import Slider from '../components/Slider/Slider';
import Events from '../components/Events/Events';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Slider />
      <Events />
    </div>
  );
};

export default Home;