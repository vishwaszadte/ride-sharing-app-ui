import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { useState, useEffect } from "react";

const MapContainer = ({ google }) => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <Map
      google={google}
      zoom={14}
      center={currentLocation}
      style={{ width: 300, height: 300, position: "absolute" }}
    >
      <Marker position={currentLocation} />
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
})(MapContainer);
