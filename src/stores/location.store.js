// src/stores/location.store.js

import { makeAutoObservable } from "mobx";

class locationStore {
  locations = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  addLocation(location) {
    let addLocation = { location };
    this.locations.push(addLocation);
  }
}

export default locationStore;
