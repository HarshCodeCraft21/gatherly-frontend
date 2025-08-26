import Events from '../components/Events/Events';
import './EventsPage.css';

const EventsPage = () => {
  return (
    <div className="events-page">
      <div className="events-page-header">
        <h1 className="page-title">All Events</h1>
        <p className="page-subtitle">Discover amazing events happening near you</p>
      </div>
      <Events />
    </div>
  );
};

export default EventsPage;