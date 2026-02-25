"use client";
import { useMemo, useState } from "react";
import type { LeafletEvent, Marker as LeafletMarker } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Image from "next/image";
import { useI18n } from "./I18nProvider";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  posix: [number, number];
  zoom?: number;
}

const Map = ({ posix, zoom = 13 }: MapProps) => {
  const { t } = useI18n();
  const [position, setPosition] = useState<[number, number]>(posix);

  const markerHandlers = useMemo(
    () => ({
      dragend: (event: LeafletEvent) => {
        const marker = event.target as LeafletMarker;
        const { lat, lng } = marker.getLatLng();
        setPosition([lat, lng]);
      },
    }),
    []
  );

  return (
    <MapContainer center={position} zoom={zoom} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} draggable eventHandlers={markerHandlers}>
        <Popup>
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/apple-touch-icon.png"
              alt="Prodavnica logo"
              width={48}
              height={48}
            />
            <div className="text-center">
              {t('common', 'my_shop')}<br />
              {position[0].toFixed(5)}, {position[1].toFixed(5)}
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
