"use client";

import { useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { useState } from "react";
import type { Shelter } from "@/types";

interface MapProps {
  center?: { lat: number; lng: number };
  userLocation?: [number, number];
  shelters?: Shelter[];
  zoom?: number;
  height?: string;
  interactive?: boolean;
}

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

export default function Map({
  center = { lat: 27.601, lng: 89.865 },
  userLocation,
  shelters = [],
  zoom = 13,
  height = "h-[200px]",
  interactive = true,
}: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedShelter, setSelectedShelter] = useState<string | null>(null);

  // Update map center when user location changes
  useEffect(() => {
    if (isLoaded && mapRef.current && userLocation) {
      mapRef.current.panTo({
        lat: userLocation[0],
        lng: userLocation[1],
      });
    }
  }, [userLocation, isLoaded]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`${height} w-full rounded-xl overflow-hidden border border-border flex items-center justify-center bg-card`}>
        <div className="text-center">
          <p className="font-cond text-sm text-text2 mb-1">Map not available</p>
          <p className="font-mono text-xs text-text3">
            Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`${height} w-full rounded-xl overflow-hidden border border-border flex items-center justify-center bg-card`}>
        <div className="text-center">
          <p className="font-cond text-sm text-danger">Map failed to load</p>
          <p className="font-mono text-xs text-text3">Check API key</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${height} w-full rounded-xl overflow-hidden border border-border`}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation ? { lat: userLocation[0], lng: userLocation[1] } : center}
          zoom={zoom}
          onLoad={(map: google.maps.Map) => {
            mapRef.current = map;
          }}
          options={{
            styles: [
              {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ color: "#1c2130" }],
              },
              {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{ color: "#8892a4" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#0f1419" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#2a323e" }],
              },
            ] as google.maps.MapTypeStyle[],
            disableDefaultUI: !interactive,
            zoomControl: interactive,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
          }}
        >
          {/* User location marker */}
          {userLocation && (
            <MarkerF
              position={{ lat: userLocation[0], lng: userLocation[1] }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#3b82f6",
                fillOpacity: 1,
                strokeColor: "#93c5fd",
                strokeWeight: 2,
              }}
              title="Your Location"
            />
          )}

          {/* Shelter markers */}
          {shelters.map((shelter, i) => (
            <MarkerF
              key={shelter.id}
              position={{ lat: shelter.lat, lng: shelter.lng }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: i === 0 ? 8 : 6,
                fillColor: "#22c55e",
                fillOpacity: 1,
                strokeColor: "#4ade80",
                strokeWeight: 2,
              }}
              title={shelter.name}
              onClick={() => setSelectedShelter(shelter.id)}
            >
              {selectedShelter === shelter.id && (
                <InfoWindowF
                  onCloseClick={() => setSelectedShelter(null)}
                  options={{
                    pixelOffset: new google.maps.Size(0, -40),
                  }}
                >
                  <div className="bg-card border border-border rounded p-2 text-sm">
                    <p className="font-cond font-semibold text-text">{shelter.name}</p>
                    <p className="text-xs text-text2 mt-1">
                      {shelter.distanceKm}km · Cap: {shelter.capacity}
                      {shelter.hasMedical && " · Medical"}
                    </p>
                  </div>
                </InfoWindowF>
              )}
            </MarkerF>
          ))}
        </GoogleMap>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-card">
          <p className="font-mono text-xs text-text3">Loading map...</p>
        </div>
      )}
    </div>
  );
}
