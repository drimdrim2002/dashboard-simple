<template>
  <div>
    <dashboard-stats />
    <div class="container">
      <div
        class="driver-list-container"
        ref="driverList"
        :style="{ width: driverListWidth + 'px' }"
      >
        <driver-list />
      </div>
      <div class="resize-handle" @mousedown="startResize"></div>
      <div
        class="map-view-container"
        ref="mapView"
        :style="{ width: mapViewWidth + 'px' }"
      >
        <map-view />
      </div>
    </div>
  </div>
</template>

<script>
import DashboardStats from "./components/Dashboard/DashboardStats.vue";
import DriverList from "./components/DriverList/DriverList.vue";
import MapView from "./components/Map/MapView.vue";

export default {
  name: "App",
  components: {
    DashboardStats,
    DriverList,
    MapView,
  },
  data() {
    return {
      driverListWidth: 400,
      isResizing: false,
      startX: 0,
      startWidth: 0,
    };
  },
  computed: {
    mapViewWidth() {
      return window.innerWidth - this.driverListWidth - 8;
    },
  },
  methods: {
    startResize(e) {
      this.isResizing = true;
      this.startX = e.clientX;
      this.startWidth = this.driverListWidth;
      document.body.style.cursor = "ew-resize";

      document.addEventListener("mousemove", this.onResize);
      document.addEventListener("mouseup", this.stopResize);
    },
    onResize(e) {
      if (!this.isResizing) return;

      const delta = e.clientX - this.startX;
      const newWidth = this.startWidth + delta;

      if (newWidth >= 200 && newWidth <= window.innerWidth - 200) {
        // 직접 DOM 요소의 스타일을 변경하여 즉각적인 반응 구현
        this.$refs.driverList.style.width = `${newWidth}px`;
        this.$refs.mapView.style.width = `${
          window.innerWidth - newWidth - 8
        }px`;

        // Vue의 반응성 시스템 업데이트
        this.driverListWidth = newWidth;

        // 맵 리사이즈 이벤트 발생
        this.$nextTick(() => {
          this.$emit("map-resize");
        });
      }
    },
    stopResize() {
      this.isResizing = false;
      document.body.style.cursor = "default";

      document.removeEventListener("mousemove", this.onResize);
      document.removeEventListener("mouseup", this.stopResize);
    },
  },
  beforeDestroy() {
    document.removeEventListener("mousemove", this.onResize);
    document.removeEventListener("mouseup", this.stopResize);
  },
};
</script>

<style>
body,
html {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #f0f0f0;
}

.container {
  position: relative;
  display: flex;
  height: calc(100vh - 300px); /* dashboard-stats의 높이를 뺀 나머지 높이 */
  width: 100%;
}

.driver-list-container,
.map-view-container {
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.driver-list-container > *,
.map-view-container > * {
  flex: 1;
  width: 100%;
  height: 100%;
}

.resize-handle {
  width: 8px;
  background-color: #ddd;
  cursor: ew-resize;
  transition: background-color 0.2s;
  user-select: none;
  flex-shrink: 0;
}

.resize-handle:hover {
  background-color: #999;
}

.resize-handle:active {
  background-color: #666;
}
</style>
