import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import "./DriverHome.css";
import AvailableRides from "./AvailableRides/AvailableRides";

const DriverHome = () => {
  const [coords, setCoords] = useState({});
  const [driver, setDriver] = useState({});
  const [riders, setRiders] = useState([]);
  const navigateTo = useNavigate();

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
              import.meta.env.VITE_SERVER_URL + "/driver/update-location",
              {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("driver")}`,
                },
              }
            )
            .then((response) => {
              console.log(response);
              setDriver(response.data.driver);
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
    }
  }, []);

  const handleLogout = (e) => {
    localStorage.removeItem("driver");
    navigateTo("/");
  };

  const handleGoHome = (e) => {
    navigateTo("/driver/home");
  };

  return (
    <div className="driver-home-container">
      <div className="driver-home-nav">
        <FontAwesomeIcon
          onClick={handleGoHome}
          className="driver-logout-btn"
          icon={faHouse}
        />
        <FontAwesomeIcon
          onClick={handleLogout}
          className="driver-logout-btn"
          icon={faArrowRightFromBracket}
        />
      </div>
      <div className="driver-home-main">
        <span>The following riders have requested a ride from you</span>
        <AvailableRides />
        {riders.length > 0 && (
          <ul className="driver-home-rider-list">
            <li className="driver-home-rider-card">
              <button>Accept</button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default DriverHome;
