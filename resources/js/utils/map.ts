import type { Scooter } from "@/types";

export function getScooterMarkerColor(status: string): string {
  const colors: Record<string, string> = {
    available: "#22c55e",
    in_use: "#3b82f6",
    maintenance: "#f97316",
    offline: "#ef4444",
  };
  return colors[status] || "#6b7280";
}

export function createScooterIcon(scooter: Scooter) {
  if (typeof window === "undefined") return undefined;

  const L = require("leaflet");
  const color = getScooterMarkerColor(scooter.status);

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
    ">${scooter.battery_level}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}
