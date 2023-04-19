import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./RiderHome.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MapContainer from "./MapContainer/MapContainer";
import {
  faArrowRightFromBracket,
  faUser,
  faCircleInfo,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import Autocomplete from "react-google-autocomplete";
import RideInfo from "./RideInfo/RideInfo";

const RiderHome = () => {
  const [rider, setRider] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [destination, setDestination] = useState({});
  const navigateTo = useNavigate();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapApiJs = "https://maps.googleapis.com/maps/api/js";
  const [coords, setCoords] = useState({});
  const [rideStatus, setRideStatus] = useState("none");
  const token = localStorage.getItem("rider");

  useEffect(() => {
    const token = localStorage.getItem("rider");
    if (!token || token === "") {
      navigateTo("/");
    } else {
      axios
        .get(import.meta.env.VITE_SERVER_URL + "/rider/home", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("rider")}`,
          },
        })
        .then((response) => {
          console.log(response);
          setDrivers(response.data.drivers);
          setRider(response.data.rider);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  // Get ride status
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER_URL + "/rider/get-ride-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRideStatus(response.data.status);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Get rider's location and update it every 1 minute
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            lon: position.coords.longitude,
          });
          axios
            .post(
              import.meta.env.VITE_SERVER_URL + "/rider/update-location",
              {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("rider")}`,
                },
              }
            )
            .then((response) => {
              setRider(response.data.rider);
            })
            .catch((err) => {
              console.error(err);
            });
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
      const intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              latitude: position.coords.latitude,
              lon: position.coords.longitude,
            });
            axios
              .post(
                import.meta.env.VITE_SERVER_URL + "/rider/update-location",
                {
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("rider")}`,
                  },
                }
              )
              .then((response) => {
                setRider(response.data.rider);
              })
              .catch((err) => {
                console.error(err);
              });
          },
          (error) => {
            console.error(error);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      }, 120000); // Update location every 2 minutes
      return () => clearInterval(intervalId);
    }
  }, []);

  const handleLogout = (e) => {
    localStorage.removeItem("rider");
    navigateTo("/");
  };

  // Function to handle click on request ride buton
  const handleRequestRide = (e) => {
    if (!destination) {
      return;
    }
    const token = localStorage.getItem("rider");
    if (!token || token === "") {
      navigateTo("/");
    } else {
      axios
        .post(
          import.meta.env.VITE_SERVER_URL + "/rider/request-ride",
          {
            source: rider.location.formattedAddress,
            destination: destination.formatted_address,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("rider")}`,
            },
          }
        )
        .then((response) => {
          setRideStatus("requested");
          e.target.disabled = true;
          console.log(response);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div className="rider-home-container">
      <nav className="rider-home-navbar">
        <button className="rider-profile-btn">
          <FontAwesomeIcon icon={faUser} style={{ color: "#364154" }} />
        </button>
        <FontAwesomeIcon
          onClick={handleLogout}
          className="rider-logout-btn"
          icon={faArrowRightFromBracket}
        />
      </nav>
      {rider.location && (
        <div className="rider-location">
          <h2>Your location is</h2>
          <h3>
            Address: <span>{rider.location.formattedAddress}</span>
          </h3>
          <h3>
            Pincode: <span>{rider.location.pincode}</span>
          </h3>
        </div>
      )}
      <Autocomplete
        apiKey={apiKey}
        style={{ width: "90%" }}
        onPlaceSelected={(place) => {
          setDestination(place);
        }}
        options={{
          types: ["(regions)"],
          componentRestrictions: { country: "IN" },
        }}
        placeholder="Enter your destination"
        aria-disabled={rideStatus !== "none"}
      />
      ;
      <button
        disabled={rideStatus !== "none"}
        className="request-ride-btn"
        onClick={(e) => {
          handleRequestRide(e);
        }}
      >
        Request Ride <FontAwesomeIcon icon={faTaxi} />
      </button>
      {rideStatus !== "none" && (
        <RideInfo rideStatus={rideStatus} handleRideStatus={setRideStatus} />
      )}
      {rideStatus === "none" && (
        <div
          style={{
            width: "300px",
            height: "300px",
            marginBottom: "20px",
          }}
        >
          <MapContainer />
        </div>
      )}
      {rideStatus === "none" && drivers && (
        <div>
          <h1>Drivers in your area : </h1>
          <ul className="drivers-container">
            {drivers.map((driver) => (
              <li className="driver-card" key={driver._id}>
                {driver.photo ? (
                  <img src={driver.photo} alt="Driver Photo" />
                ) : (
                  <img
                    src="https://previews.123rf.com/images/puruan/puruan1702/puruan170208984/72742803-driver-avatar-icon-in-colors.jpg"
                    alt="Driver Photo"
                  />
                )}
                <h2>{driver.name}</h2>
                <h3>Vehicle Type: {driver.vehicleType}</h3>

                <Link to={"..//rider/driver-detail/" + driver._id}>
                  <button>
                    {" "}
                    <FontAwesomeIcon icon={faCircleInfo} /> More Details
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RiderHome;
