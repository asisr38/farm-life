"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default markers in Next.js
const icon = new Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Kathmandu Valley center
const KATHMANDU_VALLEY = [27.7172, 85.324];

interface Plot {
  id: string;
  name: string;
  sizeM2?: number | null;
  cropsCount: number;
  totalYield: number;
  location?: { lat: number; lng: number } | null;
}

export interface NepalMapProps {
  plots: Plot[];
  onPlotSelect?: (_plotId: string) => void;
  selectedPlotId?: string;
}

export default function NepalMapInner({ plots, onPlotSelect }: NepalMapProps) {
  // Generate sample locations for plots if they don't have coordinates
  const plotsWithLocations = plots.map((plot, index) => {
    if (plot.location) {
      return plot;
    }
    // Generate locations around Kathmandu Valley
    const angle = (index * 137.5) % 360; // Golden angle for good distribution
    const radius = 0.02 + (index * 0.005); // Varying distances from center
    const lat = KATHMANDU_VALLEY[0] + radius * Math.cos(angle * Math.PI / 180);
    const lng = KATHMANDU_VALLEY[1] + radius * Math.sin(angle * Math.PI / 180);

    return {
      ...plot,
      location: { lat, lng },
    };
  });

  return (
    <div className="h-96 w-full rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-700">Farm Locations</h3>
        <p className="mb-4 text-sm text-gray-600">
          Click on markers to view plot details
        </p>
      </div>
      <MapContainer
        center={KATHMANDU_VALLEY as [number, number]}
        zoom={10}
        style={{ height: "300px", width: "100%" }}
        className="rounded-b-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {plotsWithLocations.map((plot) => (
          <Marker
            key={plot.id}
            position={[plot.location!.lat, plot.location!.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onPlotSelect?.(plot.id),
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">{plot.name}</h3>
                <p className="text-sm text-gray-600">
                  Size: {plot.sizeM2 ?? "N/A"} m²
                </p>
                <p className="text-sm text-gray-600">
                  Crops: {plot.cropsCount}
                </p>
                <p className="text-sm text-gray-600">
                  Yield: {plot.totalYield.toFixed(2)} kg
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
