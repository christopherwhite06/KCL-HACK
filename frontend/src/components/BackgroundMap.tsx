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

type Props = {
  lat: number;
  lng: number;
  interactive?: boolean;
  showMarker?: boolean;
  markerLabel?: string;
  /** When false, use light map tiles and light background; when true, dark tiles. */
  isDark?: boolean;
};

const DARK_MAP_BG = "#0d1117";
const LIGHT_MAP_BG = "#f0f4f8";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

export function BackgroundMap({
  lat,
  lng,
  interactive = false,
  showMarker = true,
  markerLabel,
  isDark = true,
}: Props) {
  const mapBg = isDark ? DARK_MAP_BG : LIGHT_MAP_BG;
  const tileUrl = isDark ? DARK_TILES : LIGHT_TILES;

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
        style={{ height: "100%", width: "100%", background: mapBg }}
        zoomControl={interactive}
        dragging={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        attributionControl={false}
      >
        <TileLayer url={tileUrl} attribution="" />
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
