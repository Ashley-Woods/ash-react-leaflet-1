// src/stores/index.js

import React from "react";
import MapStore from "./map.store";
import LocationStore from "./location.store";

class RootStore {
  constructor() {
    this.mapStore = new MapStore(this);
    this.locationStore = new LocationStore(this);
  }
}

export const StoresContext = React.createContext(new RootStore());

export const useStores = () => React.useContext(StoresContext);
