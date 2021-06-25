import React from "react";
import { Component, useState } from "react";
import { useObserver } from "mobx-react-lite";
import { useStores } from "../stores/index";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Circle,
  GeoJSON
} from "react-leaflet";
import testData from "../data/data.json";
import "../styles/Map.css";

function MapEventHander() {
  const { mapStore } = useStores();
  const [zoomLevel, setZoomLevel] = useState(mapStore.zoom);
  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
      mapStore.zoom = zoomLevel;
    }
  });
  return null;
}

export default function Map() {
  const { mapStore } = useStores();

  return useObserver(() => (
    <div className="Map">
      <MapContainer
        center={mapStore.center}
        zoom={mapStore.zoom}
        dragging={true}
        doubleclickZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright"  >OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Circle
          center={mapStore.center}
          radius={50}
          color={"#ff0000"}
          weight={6}
          fill={true}
          fillOpacity={0.5}
          fillColor={"#00ff00"}
        />

        <GeoJSON data={testData} />

        <MapEventHander />
      </MapContainer>
    </div>
  ));
}
