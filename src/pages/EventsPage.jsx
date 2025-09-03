import { Search } from "lucide-react";
import Events from "../components/Events/Events";
import "./EventsPage.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const EventsPage = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputData, setInputData] = useState("");
  const location = useLocation();

  // jab bhi location change ho (footer link click se), category set karo
  useEffect(() => {
    if (location.state?.category) {
      setInputData(location.state.category);
    }
  }, [location]);

  return (
    <div className="events-page">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "500px", // keeps it nice on desktop
          }}
        >
          <input
            type="text"
            style={{
              border: "1px solid black",
              width: "100%",
              height: "40px",
              padding: "0 40px 0 16px", // space for search icon
              borderRadius: "25px",
              fontSize: "16px",
            }}
            placeholder="Search here..."
            value={inputData}   // <-- important
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setInputData(e.target.value)}
          />
          {!isFocused && (
            <Search
              style={{
                color: "grey",
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            />
          )}
        </div>
      </div>

      <div className="events-page-header">
        <h1 className="page-title">All Events</h1>
        <p className="page-subtitle">
          Discover amazing events happening near you
        </p>
      </div>

      <Events inputData={inputData} />
    </div>
  );
};

export default EventsPage;
