import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import "./App.css";
import RiderLogin from "./components/Rider/RiderLogin/RiderLogin";
import RiderHome from "./components/Rider/RiderHome/RiderHome";
import RiderDriverDetail from "./components/Rider/RiderDriverDetail/RiderDriverDetail";
import { useEffect } from "react";
import RiderSignup from "./components/Rider/RiderSignup/RiderSignup";
import DriverLogin from "./components/Driver/DriverLogin/DriverLogin";
import DriverSignup from "./components/Driver/DriverSignup/DriverSignup";
import DriverHome from "./components/Driver/DriverHome/DriverHome";

function App() {
  useEffect(() => {
    document.title = "Ride-Sharing App";
  }, []);
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/rider/login" element={<RiderLogin />}></Route>
            <Route exact path="/rider/home" element={<RiderHome />}></Route>
            <Route exact path="/rider/signup" element={<RiderSignup />}></Route>
            <Route
              exact
              path="/rider/driver-detail/:id"
              element={<RiderDriverDetail />}
            ></Route>
            <Route exact path="/driver/login" element={<DriverLogin />}></Route>
            <Route
              exact
              path="/driver/signup"
              element={<DriverSignup />}
            ></Route>
            <Route exact path="driver/home" element={<DriverHome />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
