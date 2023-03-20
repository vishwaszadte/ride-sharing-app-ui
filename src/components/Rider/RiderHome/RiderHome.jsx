import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./RiderHome.css";

const RiderHome = () => {
  const [rider, setRider] = useState({});
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    axios
      .get("https://nice-gray-agouti-wig.cyclic.app/rider/home", {
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
  }, []);

  // Get rider's location and update it every 1 minute
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          axios
            .post(
              "https://nice-gray-agouti-wig.cyclic.app/rider/update-location",
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
            axios
              .post(
                "https://nice-gray-agouti-wig.cyclic.app/rider/update-location",
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
      }, 60000); // Update location every 1 minute
      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <div className="rider-home-container">
      <nav className="rider-home-navbar">
        <button className="rider-profile-btn">Your Profile</button>
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

              <Link to={"rider/driver-detail" + driver._id}>
                <button>More Details</button>
              </Link>

              {/* <form action={`/rider/driver-detail/${driver._id}`} method="GET">
                <input
                  type="submit"
                  className="driverDetailsBtn"
                  value="More details"
                />
              </form> */}
              {/* <button action className="driverDetailsBtn" id={driver._id}>
            More details
          </button> */}
              <button className="request-ride-btn" id={driver._id}>
                Request ride
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RiderHome;
