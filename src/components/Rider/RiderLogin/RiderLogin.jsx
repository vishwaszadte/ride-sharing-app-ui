import { useState } from "react";
import { Link } from "react-router-dom";
import "./RiderLogin.css";
import axios from "axios";

const RiderLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsPending(true);

    axios
      .post(
        import.meta.env.VITE_SERVER_URL + "/rider/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.statusText !== "OK") {
          throw Error(
            "The username or password is invalid or the user does not exist"
          );
        } else {
          console.log(response);
        }
        setIsPending(false);
      })
      .catch((err) => {
        setError(err);
        console.log(err);
        setIsPending(false);
      });
  };

  return (
    <div className="rider-login-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          value={email}
          placeholder="Email"
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          value={password}
          placeholder="Password"
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isPending && <button type="submit">Log in</button>}
        {isPending && <button disabled>Logging in...</button>}
      </form>
      <p>
        New here? <Link to="/rider/signup">Register</Link>
      </p>
      <p>
        Not a rider? <Link to="/driver/login">Driver login</Link>
      </p>
      <div>{error && <h2>{error}</h2>}</div>
    </div>
  );
};

export default RiderLogin;
