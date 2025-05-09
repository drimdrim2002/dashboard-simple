<template>
  <div class="map-container">
    <div class="header">
      <h1>Map</h1>
    </div>
    <div class="content">
      <div id="map" ref="mapContainer" @wheel="handleWheel"></div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

export default {
  name: "MapView",
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = new Map({
        target: this.$refs.mapContainer,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([126.978, 37.5665]), // Seoul coordinates
          zoom: 13,
        }),
      });

      // 기본 마우스 휠 동작 비활성화
      this.map.getViewport().style.pointerEvents = "none";
      this.map.getViewport().style.cursor = "default";
    },
    handleWheel(event) {
      // Ctrl 키가 눌린 상태에서만 줌 동작 실행
      if (event.ctrlKey) {
        event.preventDefault();
        const view = this.map.getView();
        const delta = event.deltaY;
        const zoom = view.getZoom();
        view.animate({
          zoom: zoom + (delta > 0 ? -0.5 : 0.5),
          duration: 100,
        });
      }
    },
  },
  beforeDestroy() {
    if (this.map) {
      this.map.setTarget(null);
      this.map = null;
    }
  },
};
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #ddd;
}

.content {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

#map {
  height: 100%;
  width: 100%;
}

/* OpenLayers specific styles */
:global(.ol-control) {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  padding: 2px;
}

:global(.ol-zoom) {
  top: 0.5em;
  left: 0.5em;
}
</style>
