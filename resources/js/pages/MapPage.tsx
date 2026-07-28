import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useScooters } from "@/hooks";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, getMarkerColor } from "@/utils";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function createIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function MapPage() {
  const { data: scootersData, isLoading } = useScooters({ per_page: 100 });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Map</h1>

      <div className="h-[600px] overflow-hidden rounded-lg border bg-white shadow">
        <MapContainer
          center={[55.7558, 37.6173]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {scootersData?.data.map((scooter) => (
            <Marker
              key={scooter.id}
              position={[scooter.latitude, scooter.longitude]}
              icon={createIcon(getMarkerColor(scooter.status))}
            >
              <Popup>
                <div className="min-w-[200px] p-2">
                  <h3 className="font-semibold">{scooter.number}</h3>
                  <p className="text-sm text-gray-600">{scooter.model}</p>
                  <div className="mt-2">
                    <StatusBadge status={scooter.status} label={scooter.status_label} />
                  </div>
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Battery:</span> {scooter.battery_level}%
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Updated:</span>{" "}
                    {formatDate(scooter.last_updated_at)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
