import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  console.log("Server URL = ", import.meta.env.VITE_SERVER_URL);

  return (
    <div className="home-container">
      <h1>I'm a ____</h1>
      <Link to="/driver/login">
        <button>Driver</button>
      </Link>
      <Link to="/rider/login">
        <button>Rider</button>
      </Link>
    </div>
  );
};

export default Home;
