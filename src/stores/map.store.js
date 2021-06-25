// src/stores/map.store.js

import { makeAutoObservable } from "mobx";

class mapStore {
  center = [51.396, -2.315];
  zoom = 10;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setZoom = (zoom) => {
    this.zoom = zoom;
  };
}

export default mapStore;
