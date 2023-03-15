import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import "./App.css";
import RiderLogin from "./components/Rider/RiderLogin/RiderLogin";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/rider/login" element={<RiderLogin />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
