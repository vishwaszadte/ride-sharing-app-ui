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
  faCar,
} from "@fortawesome/free-solid-svg-icons";

// load google map api js
function loadAsyncScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    Object.assign(script, {
      type: "text/javascript",
      async: true,
      src,
    });
    script.addEventListener("load", () => resolve(script));
    document.head.appendChild(script);
  });
}

const RiderHome = () => {
  const [rider, setRider] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [destination, setDestination] = useState({});
  const navigateTo = useNavigate();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapApiJs = "https://maps.googleapis.com/maps/api/js";
  const [coords, setCoords] = useState({});

  const searchInput = useRef(null);

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

  // Autocomplete
  // init gmap script
  const initMapScript = () => {
    // if script already loaded
    if (window.google) {
      return Promise.resolve();
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places`;
    return loadAsyncScript(src);
  };

  // do something on address change
  const onChangeAddress = (autocomplete) => {
    const place = autocomplete.getPlace();
    setDestination(extractAddress(place));
  };

  // init autocomplete
  const initAutocomplete = () => {
    if (!searchInput.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      searchInput.current
    );
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () =>
      onChangeAddress(autocomplete)
    );
  };

  // load map script after mounted
  useEffect(() => {
    initMapScript().then(() => initAutocomplete());
  }, []);

  const handleLogout = (e) => {
    localStorage.removeItem("rider");
    navigateTo("/");
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
      <input
        style={{ margin: "10px", width: "85%" }}
        ref={searchInput}
        type="text"
        placeholder="Search location...."
      />

      <div
        style={{
          width: "300px",
          height: "300px",
          marginBottom: "20px",
        }}
      >
        <MapContainer />
      </div>
      {drivers && (
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

              <button className="request-ride-btn" id={driver._id}>
                <FontAwesomeIcon icon={faCar} /> Request ride
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RiderHome;
