import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CurrentRide.css";

const CurrentRide = () => {
  const { rideID } = useParams();
  const [ride, setRide] = useState(null);
  const [rider, setRider] = useState(null);
  const [rideStatus, setRideStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/driver/get-ride/${rideID}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("driver"),
            },
          }
        );
        setRide(res.data.ride);
        setRideStatus(res.data.ride.status);
        setRider(res.data.rider);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [rideID]);

  const handleUpdateRide = async (status) => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_SERVER_URL + "/driver/update-ride/" + rideID,
        {
          status: status,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("driver"),
          },
        }
      );
      console.log(response);
      setRideStatus(response.data.ride.status);
      navigateTo("/driver/current-ride/" + rideID);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="current-ride-container">
      {ride && (
        <>
          <h1>Current Ride</h1>
          <p>
            <span>
              <b>Rider:</b>
            </span>
            {rider.name}
          </p>
          <p>
            <span>
              <b>From:</b>
            </span>{" "}
            {ride.source}
          </p>
          <p>
            <span>
              <b>To:</b>
            </span>{" "}
            {ride.destination}
          </p>
          {rideStatus === "accepted" && (
            <button
              className="start-ride-btn"
              onClick={() => handleUpdateRide("started")}
            >
              START
            </button>
          )}
          {rideStatus === "started" && (
            <button
              className="end-ride-btn"
              onClick={() => handleUpdateRide("completed")}
            >
              END
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CurrentRide;
