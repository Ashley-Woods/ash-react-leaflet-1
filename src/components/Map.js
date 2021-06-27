import React, { useEffect, useRef } from "react";
//import { useState } from "react";
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

  // base map tile providers 
  const openstreetMap = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
  );

  const fastlyTerrain = L.tileLayer("https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", {
    attribution: '&copy; <a href="https://http://maps.stamen.com/copyright">Staman Design</a> contributors'}
  );

  // create an object to hold base layer names, to appear in the basemap switcher list
  const baseLayers = {
    "Streets": openstreetMap,
    "Terrain": fastlyTerrain
  }

// tile overlay providers -- TO DO
const OpenWeatherMap_Clouds = L.tileLayer('http://{s}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid={apiKey}', {
  attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
  apiKey: '<insert your api key here>',
  opacity: 0.5
});

// layer groups to hold our overlay feactures
var locations = L.layerGroup([]); 
var links = L.layerGroup([]);
var topologies = L.layerGroup([]);

// create an object to hold feacture layer names, to appear in the switcher list
  const feactureLayers = {
    "Locations" : locations,
    "Links" : links,
    "Topologies" : topologies
  };

  // inital base tile for the map:
tileRef.current = openstreetMap;
//  tileRef.current = fastlyTerrain;
 
  // Options for our map instance:
  const mapParams = {
    center: mapStore.center,
    zoom: mapStore.zoom,
    zoomControl: false,
    closePopupOnClick: false,
    layers: [tileRef.current] // deafult base #### may add more later #####
  };
  

  useEffect(() => {
    
    // Map creation:
    mapRef.current = L.map("map", mapParams);

    // add our map controls
    L.control.layers(baseLayers, feactureLayers, {position: 'topleft'}).addTo(mapRef.current);

    // Add zoomControl:
    L.control.zoom({ 
      position: "topleft" 
    }).addTo(mapRef.current);

    // Add scale
    L.control.scale().addTo(mapRef.current);

    // Map events:
    mapRef.current.on("zoomstart", () => {
        mapStore.zoom = mapRef.current.getZoom();
    });
    
  }, [])

  return useObserver (() => (
    <>
      <div id="map" 
        className="Map"/>
    </>
  ))
}

export default Map