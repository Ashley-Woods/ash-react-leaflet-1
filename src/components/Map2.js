import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useObserver } from "mobx-react-lite";
import { useStores } from "../stores/index";
import L from "leaflet";
import "../styles/Map.css";

const Map2 = () => {
  const mapRef = useRef(null)
  const tileRef = useRef(null)
  const controlRef = useRef(null)
  const layerRef = useRef(null)
  const { mapStore } = useStores();

  // Base tile for the map:
  tileRef.current = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Options for our map instance:
  const mapParams = {
    center: mapStore.center,
    zoom: mapStore.zoom,
    closePopupOnClick: false,
    layers: [tileRef.current] // Start with just the base layer
  };
  
  // Map creation:
  useEffect(() => {
    mapRef.current = L.map("map", mapParams);
  }, []);

  // Controls:
  useEffect(() => {
      // Add the base layer to the control:
      controlRef.current = L.control.layers({ 
        OpenStreetMap: tileRef.current 
      }).addTo(mapRef.current);
      
      // Add zoomControl:
      L.control.zoom({ 
        position: "topright" 
      }).addTo(mapRef.current);
  }, [])

  // Map events:
  useEffect(() => {
    mapRef.current.on("zoomstart", () => {
      console.log('zoom ' + mapRef.current.getZoom());
      mapStore.zoom = mapRef.current.getZoom();
    });
  }, [])

  // Create the layerGroup:
  useEffect(() => {
    layerRef.current = L.layerGroup().addTo(mapRef.current);
    controlRef.current.addOverlay(layerRef.current, 'Locations');
    controlRef.current.addOverlay(layerRef.current, 'Links');
  
  }, [])

  return (
    <>
      <div id="map" 
        className="Map"/>
    </>
  )
}

export default Map2