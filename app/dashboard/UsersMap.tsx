"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type MapTool = {
  id: number;
  name: string;
  ownerName: string | null;
  neighborhood: string | null;
  zipcode: string | null;
  lat: number;
  lng: number;
};

type Props = {
  tools: MapTool[];
};

const markerIcon = L.divIcon({
  html: `
    <div style="
      width: 36px;
      height: 36px;
      border-radius: 9999px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      font-size: 20px;
    ">
      🛠️
    </div>
  `,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

export default function UsersMap({ tools }: Props) {
  const center: [number, number] =
    tools.length > 0 ? [tools[0].lat, tools[0].lng] : [39.9526, -75.1652];

  return (
    <div className="h-[70vh] min-h-[500px] w-full overflow-hidden rounded-xl border">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {tools.map((tool) => (
          <Marker
            key={tool.id}
            position={[tool.lat, tool.lng]}
            icon={markerIcon}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{tool.name}</p>
                <p>Owner: {tool.ownerName || "Neighbor"}</p>
                <p>{tool.neighborhood || "Unknown neighborhood"}</p>
                <p>{tool.zipcode || "No ZIP"}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
