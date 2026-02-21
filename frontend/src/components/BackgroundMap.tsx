import { useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in Vite/bundler
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { duration: 1.2 });
  }, [map, lat, lng]);
  return null;
}

type Props = { lat: number; lng: number; interactive?: boolean; showMarker?: boolean; markerLabel?: string };

export function BackgroundMap({ lat, lng, interactive = false, showMarker = true, markerLabel }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={12}
        style={{ height: "100%", width: "100%", background: "#0d1117" }}
        zoomControl={interactive}
        dragging={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution=""
        />
        <MapUpdater lat={lat} lng={lng} />
        {showMarker && (
          <Marker position={[lat, lng]}>
            {markerLabel && <Popup>{markerLabel}</Popup>}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
