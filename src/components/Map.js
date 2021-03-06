import React, { useEffect, useRef } from 'react';
//import { useState } from "react";
import { useObserver } from 'mobx-react-lite';
import { useStores } from '../stores/index';
import L from 'leaflet';
import '../styles/Map.css';
import mapData from '../data/data.json';

const Map = () => {
  const mapRef = useRef(null);
  const tileRef = useRef(null);
  const controlRef = useRef(null);
  const layerRef = useRef(null);
  const { mapStore } = useStores();

  // base map tile providers
  const openstreetMap = L.tileLayer(
    `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  );

  const fastlyTerrain = L.tileLayer(
    'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
    {
      attribution:
        '&copy; <a href="https://http://maps.stamen.com/copyright">Staman Design</a>'
    }
  );

  // create object to hold base layer names, to appear in the basemap switcher list
  const baseLayers = {
    Streets: openstreetMap,
    Terrain: fastlyTerrain
  };

  // tile overlay providers - see https://openweathermap.org/api/weathermaps
  const OpenWeatherMapPrecipitation = L.tileLayer(
    'https://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid={apiKey}',
    {
      attribution:
        '&copy; | <a href="http://openweathermap.org">OpenWeatherMap</a>',
      apiKey: '4121a0a991bfa0be264252d3242c32f6',
      opacity: 0.8
    }
  );

  // const OpenWeatherMapRadar = L.tileLayer('https://{s}.tile.openweathermap.org/map/2.0/radar/{z}/{x}/{y}.png?appid={apiKey}&tm={time}', {
  //   attribution: '&copy; | <a href="http://openweathermap.org">OpenWeatherMap</a>',
  //   apiKey: '4121a0a991bfa0be264252d3242c32f6',
  //   time: Date.now(),
  //   opacity: .8
  // });

  const Stamen_TonerLines = L.tileLayer(
    'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}{r}.{ext}',
    {
      attribution: '&copy; | <a href="http://stamen.com">Stamen Design</a>',
      subdomains: 'abcd',
      ext: 'png'
    }
  );

  // layer groups to hold our overlay feactures
  var locations = L.layerGroup([]);
  var links = L.layerGroup([]);
  var topologies = L.layerGroup([]);

  // create object to hold overlay layer names, to appear in the basemap switcher list
  const overlayLayers = {
    Precipitation: OpenWeatherMapPrecipitation,
    Regions: Stamen_TonerLines,
    //  "Radar" : OpenWeatherMapRadar,
    Locations: locations,
    Links: links,
    Topologies: topologies
  };

  // inital base tile for the map:
  tileRef.current = openstreetMap;

  // Options for our map instance:
  const mapParams = {
    center: mapStore.center,
    zoom: mapStore.zoom,
    zoomControl: false,
    closePopupOnClick: false,
    layers: [tileRef.current, topologies, links, locations] // deafult base
  };

  // add our mapData Feactures to map
  //console.log(mapData);

  // parse mapData for Locations, and add to repsective overlay
  var loc = L.geoJSON(mapData, {
    filter: function(feacture) {
      return feacture.properties.shape == 'CircleMarker';
    },
    pointToLayer: function(feature, latlng) {
      const siColor = feature.properties.si == '1' ? '#ff0000' : '#000000';
      const rcColor = feature.properties.rc == '1' ? '#ff0000' : '#00ff00';
      return new L.CircleMarker(latlng, {
        radius: 4,
        color: siColor,
        weight: 1,
        fill: true,
        fillOpacity: 1,
        fillColor: rcColor,
      }).on('mouseover', function() {
        this.bindPopup(feature.properties.name).openPopup();
      });
    }
  });
  loc.addTo(locations);

// #######  BELOW NOT 100% Lines & Polygons colors not picked up

    // parse mapData for links (Lines), and add to repsective overlay
  var lines = L.geoJSON(mapData, {
    filter: function(feacture) {
      return feacture.properties.shape == 'Line';
    },
    pointToLayer: function(feature, latlng) {
      console.log(feature.properties); // not called, but somehow feacture added?
      const rcColor = feature.properties.rc == '1' ? '#ff0000' : '#00ff00';
      return new L.polyline(latlng, {
        color: rcColor
      }).on('mouseover', function() {
        this.bindPopup(feature.properties.name).openPopup();
      });
    }
  });
  lines.addTo(links);

  // parse mapData for topologies (Lines), and add to repsective overlay
  var topology = L.geoJSON(mapData, {
    filter: function(feacture) {
      return feacture.properties.shape == 'Polygon';
    },
    pointToLayer: function(feature, latlng) {
      console.log(feature.properties); // not called, but somehow feacture added?
      const siColor = feature.properties.rc == '1' ? '#ff0000' : '#00ff0';
            return new L.polygon(latlng, {
        color: '#ffffff',
        fillColor: '#123456',
        opacity: 0.5,
        smoothFactor: 5,
        weight: 1
      }).on('mouseover', function() {
        this.bindPopup(feature.properties.name).openPopup();
      });
    }
  });
  topology.addTo(topologies);

  //mapRef.fitBounds(locations.getBounds(), {
  //    padding: [50, 50]
  //  });

  // handle map controls and events
  useEffect(() => {
    // map creation:
    mapRef.current = L.map('map', mapParams);

    // add our map controls
    L.control
      .layers(baseLayers, overlayLayers, { position: 'topleft' })
      .addTo(mapRef.current);

    // add zoomControl:
    L.control
      .zoom({
        position: 'topleft'
      })
      .addTo(mapRef.current);

    // add scale
    L.control.scale().addTo(mapRef.current);

    // map events:
    mapRef.current.on('zoomstart', () => {
      mapStore.zoom = mapRef.current.getZoom();
    });
  }, []);

  return useObserver(() => (
    <>
      <div id="map" className="Map" />
    </>
  ));
};

export default Map;
