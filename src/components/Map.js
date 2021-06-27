import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useObserver } from "mobx-react-lite";
import { useStores } from "../stores/index";
import L from "leaflet";
import "../styles/Map.css";
import testData from "../data/data.json";

const Map = () => {
  const mapRef = useRef(null)
  const tileRef = useRef(null)
  const controlRef = useRef(null)
  const layerRef = useRef(null)
  const { mapStore } = useStores();

  // Base tile for the map:
  tileRef.current = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // L.TileLayer("http://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=owmkeyhere"));

  // Options for our map instance:
  const mapParams = {
    center: mapStore.center,
    zoom: mapStore.zoom,
    zoomControl: false,
    closePopupOnClick: false,
    layers: [tileRef.current] // Start with just the base layer
  };
  
  useEffect(() => {
    // Map creation:
    mapRef.current = L.map("map", mapParams);

    // Add the base layer to the control:
    controlRef.current = L.control.layers({ 
      OpenStreetMap: tileRef.current 
    }).addTo(mapRef.current);
      
    // Add zoomControl:
    L.control.zoom({ 
      position: "topright" 
    }).addTo(mapRef.current);

    // Add scale
    L.control.scale().addTo(mapRef.current);

    // Map events:
    mapRef.current.on("zoomstart", () => {
        console.log('zoom ' + mapRef.current.getZoom());
        mapStore.zoom = mapRef.current.getZoom();
      });

    // Create the layerGroup:
    layerRef.current = L.layerGroup().addTo(mapRef.current);
    //controlRef.current.addOverlay(layerRef.current, 'Locations');
    //controlRef.current.addOverlay(layerRef.current, 'Links');

  }, [])

  return useObserver (() => (
    <>
      <div id="map" 
        className="Map"/>
    </>
  ))
}

export default Map