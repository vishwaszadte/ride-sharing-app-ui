import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DriverLogin.css";
import axios from "axios";

const DriverLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const navigateTo = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsPending(true);

    axios
      .post(
        import.meta.env.VITE_SERVER_URL + "/driver/login",
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
        console.log(response);
        if (response.statusText !== "OK" && response.status !== 200) {
          throw Error(response.data);
        } else {
          console.log(response);
          localStorage.setItem("driver", response.data.token);
          navigateTo("/driver/home");
        }
        setIsPending(false);
      })
      .catch((err) => {
        setError(err);
        console.log(err);
        setIsPending(false);
      });
  };

  useEffect(() => {
    const driverToken = localStorage.getItem("driver");

    if (driverToken && driverToken !== "") {
      navigateTo("/driver/home");
    }
  }, []);

  return (
    <div className="driver-login-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          value={email}
          placeholder="Email"
          type="email"
          name="email"
          id="driverEmail"
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
        New here? <Link to="/driver/signup">Register</Link>
      </p>
      <p>
        Not a driver? <Link to="/rider/login">Rider login</Link>
      </p>
      <div>{error && <h2>{`${error}`}</h2>}</div>
    </div>
  );
};

export default DriverLogin;
