import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DriverSignup.css";

const DriverSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [photo, setPhoto] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const navigateTo = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("password", password);
    formData.append("vehicleName", vehicleName);
    formData.append("vehicleNumber", vehicleNumber);
    formData.append("vehicleType", vehicleType);
    formData.append("photo", photo);

    axios
      .post(import.meta.env.VITE_SERVER_URL + "/driver/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        if (response.statusText !== "OK") {
          throw Error(response.data);
        } else {
          console.log(response);
          alert("Account created successfully");
          navigateTo("/driver/login");
        }
        setIsPending(false);
      })
      .catch((err) => {
        setError("Something went wrong");
        console.log(err);
        setIsPending(false);
      });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <div className="driver-signup-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          placeholder="John Doe"
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          placeholder="example@example.com"
          type="email"
          name="email"
          id="driverEmail"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="phoneNumber">Phone No.</label>
        <input
          placeholder="9999999999"
          type="number"
          name="phoneNumber"
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          placeholder="Password"
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="vehicleName">Vehicle Name</label>
        <input
          placeholder="Honda City"
          type="text"
          name="vehicleName"
          onChange={(e) => setVehicleName(e.target.value)}
          required
        />
        <label htmlFor="vehicleNumber">Vehicle Number</label>
        <input
          placeholder="MH14GQ1420"
          type="text"
          name="vehicleNumber"
          onChange={(e) => setVehicleNumber(e.target.value)}
          required
        />
        <label htmlFor="vehicleType">Vehicle Type</label>
        <select
          value={vehicleType}
          onChange={(e) => vehicleType(e.target.value)}
          required
        >
          <option value="Car">Car</option>
          <option value="Auto">Auto</option>
          <option value="Bike">Bike</option>
        </select>
        <label htmlFor="photo">Photo</label>
        <input
          type="file"
          name="photo"
          onChange={handlePhotoChange}
          accept=".jpg,.jpeg,.png"
          required
        />
        {!isPending && (
          <button className="driver-signup-btn" type="submit">
            Sign Up
          </button>
        )}
        {isPending && <button disabled>Signing up...</button>}
      </form>
      <p>
        Already have an account? <Link to="/driver/login">Login</Link>
      </p>
      <div>{error && <h2>{`${error}`}</h2>}</div>
    </div>
  );
};

export default DriverSignup;
