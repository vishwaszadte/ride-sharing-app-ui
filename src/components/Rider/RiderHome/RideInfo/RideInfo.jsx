// import "./RideInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";

const RideInfo = ({ rideStatus, handleRideStatus }) => {
  const [driver, setDriver] = useState(null);
  const handleReload = async () => {
    try {
      const token = localStorage.getItem("rider");
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/rider/get-ride-info",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      const { ride, driver } = response.data;
      if (ride.status !== "requested" || ride.status !== "declined") {
        setDriver(driver);
      }
      handleRideStatus(ride.status);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  return (
    <div className="ride-info-container">
      <button className="reload-btn" onClick={handleReload}>
        <FontAwesomeIcon icon={faRotateRight} />
      </button>
      {/* {driver && (
        <div className="driver-info">
          <img src={driver.photo} alt="Driver Photo" />
          <h2>
            Name <span>{driver.name}</span>
          </h2>
          <h3>
            Vehicle Type <span>{driver.vehicleType}</span>
          </h3>
          <h3>
            Vehicla number <span>{driver.vehicleNumber}</span>
          </h3>
          <h3>
            Phone <span>{driver.phoneNumber}</span>
          </h3>
        </div>
      )} */}

      {driver && (
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            sx={{ height: 200, width: 200, borderRadius: 100, margin: "auto" }}
            image={driver.photo}
            alt="driver photo"
            title="driver photo"
          />
          <CardContent sx={{ margin: "auto" }}>
            <Typography variant="h3" color="text.primary">
              {driver.name}
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {driver.vehicleType} - {driver.vehicleName} -{" "}
              {driver.vehicleNumber}
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {driver.phoneNumber}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RideInfo;
