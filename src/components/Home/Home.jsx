import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  console.log("Server URL = https://nice-gray-agouti-wig.cyclic.app");

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
