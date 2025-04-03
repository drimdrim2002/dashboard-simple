<template>
  <div>
    <dashboard-stats />
    <div class="container">
      <driver-list :style="{ width: driverListWidth + 'px' }" />
      <div class="resize-handle" @mousedown="startResize"></div>
      <map-view :style="{ width: mapViewWidth + 'px' }" />
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

      // 전역 이벤트 리스너 추가
      document.addEventListener("mousemove", this.onResize);
      document.addEventListener("mouseup", this.stopResize);
    },
    onResize(e) {
      if (!this.isResizing) return;

      const delta = e.clientX - this.startX;
      const newWidth = this.startWidth + delta;

      // 최소 너비 제한
      if (newWidth >= 200 && newWidth <= window.innerWidth - 200) {
        this.driverListWidth = newWidth;
        this.$nextTick(() => {
          this.$emit("map-resize");
        });
      }
    },
    stopResize() {
      this.isResizing = false;
      document.body.style.cursor = "default";

      // 전역 이벤트 리스너 제거
      document.removeEventListener("mousemove", this.onResize);
      document.removeEventListener("mouseup", this.stopResize);
    },
  },
  beforeDestroy() {
    // 컴포넌트가 제거될 때 이벤트 리스너 정리
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
  height: 700px;
  width: 100%;
}

.resize-handle {
  width: 8px;
  background-color: #ddd;
  cursor: ew-resize;
  transition: background-color 0.2s;
  user-select: none;
}

.resize-handle:hover {
  background-color: #999;
}

.resize-handle:active {
  background-color: #666;
}
</style>
