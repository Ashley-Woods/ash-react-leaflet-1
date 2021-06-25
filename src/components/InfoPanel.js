import React from "react";
import { useObserver } from "mobx-react-lite";
import { useStores } from "../stores/index";

export default function InfoPanel() {
  const { mapStore } = useStores();

  return useObserver(() => (
    <div>
      <h4> Map Info </h4>
      Zoom = {mapStore.zoom}
    </div>
  ));
}
