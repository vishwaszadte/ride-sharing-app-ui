import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RiderSignup.css";

const RiderSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const navigateTo = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsPending(true);

    axios
      .post(
        "https://nice-gray-agouti-wig.cyclic.app/rider/signup",
        {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.statusText !== "OK") {
          throw Error(response.data);
        } else {
          console.log(response);
          alert("Account created successfully");
          navigateTo("/rider/login");
        }
        setIsPending(false);
      })
      .catch((err) => {
        setError("Something went wrong");
        console.log(err);
        setIsPending(false);
      });
  };

  return (
    <body>
      <div className="rider-signup-container">
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
            id="riderEmail"
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
          {!isPending && (
            <button className="rider-signup-btn" type="submit">
              Sign Up
            </button>
          )}
          {isPending && <button disabled>Signing up...</button>}
        </form>
        <p>
          Account already exists? <Link to="/rider/login">Login</Link>
        </p>
      </div>
      <div>{error && <h2>{`${error}`}</h2>}</div>
    </body>
  );
};

export default RiderSignup;
