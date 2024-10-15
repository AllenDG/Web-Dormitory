import { useCallback } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 16.0459,
  lng: 120.3455,
};

export default function Map({ filteredListings, onMarkerClick }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds();

    bounds.extend(center);

    filteredListings.forEach((listing) => {
      bounds.extend(new window.google.maps.LatLng(listing.latitude, listing.longitude));
    });

    map.fitBounds(bounds);

    const zoomLevel = map.getZoom() - 1;
    map.setZoom(zoomLevel);
  }, [filteredListings]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      zoom={12}
      mapContainerStyle={mapContainerStyle}
      center={center}
      onLoad={onLoad}
    >
      {filteredListings.map((listing) => (
        <MarkerF
          key={listing.id}
          position={{
            lat: listing.latitude,
            lng: listing.longitude,
          }}
          onClick={() => onMarkerClick(listing.id)}
          title={listing.title}
        />
      ))}
    </GoogleMap>
  );
}
