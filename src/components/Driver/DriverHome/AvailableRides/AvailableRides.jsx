import { useEffect, useState } from "react";
import axios from "axios";
import "./AvailableRides.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

const AvailableRides = () => {
  const [rides, setRides] = useState([]);

  const getRides = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/driver/get-rides",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("driver"),
          },
        }
      );
      setRides(response.data.rides);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptRide = async (rideID) => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_SERVER_URL + "/driver/update-ride/" + rideID,
        {
          status: "accepted",
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("driver"),
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRides();
  }, []);

  return (
    <div className="available-rides-container">
      <button className="reload-btn" onClick={getRides}>
        <FontAwesomeIcon icon={faRotateRight} />
      </button>
      {rides.length > 0 ? (
        <div className="rides-list">
          {rides.map((ride) => (
            <div className="ride-card" key={ride.ride._id}>
              <div className="ride-details">
                <div className="ride-location">
                  <div className="location-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="rider-details">
                    <div className="rider-name">{ride.rider.name}</div>
                    <div className="rider-phone">{ride.rider.phoneNumber}</div>
                  </div>
                  <div className="location-details">
                    <div>
                      <span>
                        <b>From: </b>
                      </span>
                      {ride.ride.source}
                    </div>
                    <div>
                      <span>
                        <b>From: </b>
                      </span>
                      {ride.ride.destination}
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="accept-ride-btn"
                onClick={() => {
                  handleAcceptRide(ride.ride._id);
                }}
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-rides-message">No available rides</div>
      )}
    </div>
  );
};

export default AvailableRides;
