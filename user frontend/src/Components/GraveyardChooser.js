import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorModal from "./ErrorModal";

// Haversine formula to calculate distance between two lat/lon points
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const GraveyardChooser = ({ onNext }) => {
  const [graveyards, setGraveyards] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [filteredGraveyards, setFilteredGraveyards] = useState([]);
  const [selectedGraveyard, setSelectedGraveyard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch graveyards from API
    const fetchGraveyards = async () => {
      try {
        const response = await fetch("http://localhost:5004/api/graveyards");
        const data = await response.json();
        setGraveyards(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching graveyards:", error);
        setLoading(false);
      }
    };

    // Get user's current location
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    fetchGraveyards();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation && graveyards.length > 0) {
      const sortedGraveyards = graveyards
        .map((graveyard) => {
          const distance = haversineDistance(
            userLocation.lat,
            userLocation.lng,
            graveyard.sourcePin.lat,
            graveyard.sourcePin.lng
          );
          return { ...graveyard, distance };
        })
        .sort((a, b) => a.distance - b.distance);
      setFilteredGraveyards(sortedGraveyards);
    } else {
      setFilteredGraveyards(graveyards);
    }
  }, [userLocation, graveyards]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = graveyards.filter((graveyard) =>
      graveyard.name.toLowerCase().includes(query)
    );
    setFilteredGraveyards(filtered);
  };

  const handleGraveyardClick = (graveyard) => {
    setSelectedGraveyard(graveyard.id);
  };

  const handleNext = () => {
    if (!selectedGraveyard) {
      setErrorMessage("Please select a graveyard before proceeding.");
      setIsModalOpen(true);
    } else {
      onNext(selectedGraveyard);
    }
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg grave-book-card"
        style={{
          width: "70vw",
          height: "80vh",
          overflow: "auto",
          padding: "30px",
          borderRadius: "20px", // Rounded borders
          position: "relative", // For positioning buttons at the bottom
        }}
      >
        <h3 className="text-center" style={{ fontWeight: "bold" }}>
          Choose a Graveyard
        </h3>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search for a graveyard..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div
          className="list-group"
          style={{
            maxHeight: "40vh", // Set a fixed height for the list
            overflowY: "auto", // Enable scrolling
          }}
        >
          {loading ? (
            <div>Loading...</div> // Loader message when fetching data
          ) : (
            filteredGraveyards.map((graveyard) => (
              <button
                key={graveyard.id}
                className={`list-group-item list-group-item-action ${
                  selectedGraveyard === graveyard.id ? "active" : ""
                }`}
                onClick={() => handleGraveyardClick(graveyard)}
              >
                <h5 className="mb-1">{graveyard.name}</h5>
                <p className="mb-1">{graveyard.description}</p>
                <small>
                  Distance:{" "}
                  {graveyard.distance
                    ? graveyard.distance.toFixed(2) + " km"
                    : "N/A"}
                </small>
              </button>
            ))
          )}
        </div>
        <div
          className="d-flex justify-content-between"
          style={{
            position: "absolute", // Fix buttons at the bottom
            bottom: "20px", // Add some space from the bottom
            width: "calc(70vw - 50px)", // Adjust width according to card
          }}
        >
          <button className="btn map-button" onClick={handleExit}>
            Cancel
          </button>
          <button className="btn map-button" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ErrorModal message={errorMessage} onClose={closeModal} />
      )}
    </div>
  );
};

export default GraveyardChooser;
