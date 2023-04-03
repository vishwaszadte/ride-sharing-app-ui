import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./RiderDriverDetail.css";

const RiderDriverDetail = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState({});
  const url = import.meta.env.VITE_SERVER_URL + "/rider/driver-detail/" + id;

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setDriver(response.data.driver);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="rider-driver-detail-container">
      {driver && (
        <div className="driver-info">
          <img src={driver.photo} alt="" />
          <h1>{driver.name}</h1>
          <h2>{driver.phoneNumber}</h2>
          <h2>
            {driver.vehicleName} <span>({driver.vehicleType})</span>
          </h2>
          {driver.location && <h3>{driver.location.pincode}</h3>}
        </div>
      )}
    </div>
  );
};

export default RiderDriverDetail;
