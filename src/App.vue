<template>
  <div class="app-container">
    <div
      class="dashboard-container"
      ref="dashboardContainer"
      :style="{ height: dashboardHeight + 'px' }"
    >
      <dashboard-stats />
    </div>
    <div
      class="horizontal-resize-handle"
      @mousedown="startDashboardResize"
    ></div>
    <div class="main-container" :style="{ height: mainContainerHeight + 'px' }">
      <div
        class="top-section"
        ref="topSection"
        :style="{ height: topSectionHeight + 'px' }"
      >
        <div
          class="driver-list-container"
          ref="driverList"
          :style="{ width: driverListWidth + 'px' }"
        >
          <driver-list />
        </div>
        <div class="resize-handle" @mousedown="startHorizontalResize"></div>
        <div
          class="map-view-container"
          ref="mapView"
          :style="{ width: mapViewWidth + 'px' }"
        >
          <map-view />
        </div>
      </div>
      <div
        class="horizontal-resize-handle"
        @mousedown="startTopSectionResize"
      ></div>
      <div
        class="bottom-section"
        ref="bottomSection"
        :style="{ height: bottomSectionHeight + 'px' }"
      >
        <div class="bottom-content">
          <h3>하단 섹션</h3>
          <p>이곳에 추가 컨텐츠를 배치할 수 있습니다.</p>
        </div>
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
      dashboardHeight: 200, // 대시보드 초기 높이
      topSectionHeight: 400, // 상단 섹션 초기 높이
      isHorizontalResizing: false,
      isDashboardResizing: false,
      isTopSectionResizing: false,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startDashboardHeight: 0,
      startTopSectionHeight: 0,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    };
  },
  mounted() {
    // 창 크기 변경 감지
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("mousemove", this.onHorizontalResize);
    document.removeEventListener("mouseup", this.stopHorizontalResize);
    document.removeEventListener("mousemove", this.onDashboardResize);
    document.removeEventListener("mouseup", this.stopDashboardResize);
    document.removeEventListener("mousemove", this.onTopSectionResize);
    document.removeEventListener("mouseup", this.stopTopSectionResize);
  },
  computed: {
    mapViewWidth() {
      return this.windowWidth - this.driverListWidth - 16;
    },
    mainContainerHeight() {
      return this.windowHeight - this.dashboardHeight - 16;
    },
    bottomSectionHeight() {
      return (
        this.windowHeight - this.dashboardHeight - this.topSectionHeight - 32
      );
    },
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    },
    startHorizontalResize(e) {
      this.isHorizontalResizing = true;
      this.startX = e.clientX;
      this.startWidth = this.driverListWidth;
      document.body.style.cursor = "ew-resize";

      document.addEventListener("mousemove", this.onHorizontalResize);
      document.addEventListener("mouseup", this.stopHorizontalResize);
    },
    onHorizontalResize(e) {
      if (!this.isHorizontalResizing) return;

      const delta = e.clientX - this.startX;
      const newWidth = this.startWidth + delta;

      if (newWidth >= 200 && newWidth <= this.windowWidth - 200) {
        this.$refs.driverList.style.width = `${newWidth}px`;
        this.$refs.mapView.style.width = `${this.windowWidth - newWidth - 8}px`;

        this.driverListWidth = newWidth;

        this.$nextTick(() => {
          this.$emit("map-resize");
        });
      }
    },
    stopHorizontalResize() {
      this.isHorizontalResizing = false;
      document.body.style.cursor = "default";

      document.removeEventListener("mousemove", this.onHorizontalResize);
      document.removeEventListener("mouseup", this.stopHorizontalResize);
    },
    startDashboardResize(e) {
      this.isDashboardResizing = true;
      this.startY = e.clientY;
      this.startDashboardHeight = this.dashboardHeight;
      document.body.style.cursor = "ns-resize";

      document.addEventListener("mousemove", this.onDashboardResize);
      document.addEventListener("mouseup", this.stopDashboardResize);
    },
    onDashboardResize(e) {
      if (!this.isDashboardResizing) return;

      const delta = e.clientY - this.startY;
      const newHeight = this.startDashboardHeight + delta;

      if (newHeight >= 100 && newHeight <= this.windowHeight - 200) {
        this.$refs.dashboardContainer.style.height = `${newHeight}px`;
        this.dashboardHeight = newHeight;

        this.$nextTick(() => {
          this.$emit("map-resize");
        });
      }
    },
    stopDashboardResize() {
      this.isDashboardResizing = false;
      document.body.style.cursor = "default";

      document.removeEventListener("mousemove", this.onDashboardResize);
      document.removeEventListener("mouseup", this.stopDashboardResize);
    },
    startTopSectionResize(e) {
      this.isTopSectionResizing = true;
      this.startY = e.clientY;
      this.startTopSectionHeight = this.topSectionHeight;
      document.body.style.cursor = "ns-resize";

      document.addEventListener("mousemove", this.onTopSectionResize);
      document.addEventListener("mouseup", this.stopTopSectionResize);
    },
    onTopSectionResize(e) {
      if (!this.isTopSectionResizing) return;

      const delta = e.clientY - this.startY;
      const newHeight = this.startTopSectionHeight + delta;
      const maxHeight = this.windowHeight - this.dashboardHeight - 100 - 16; // 하단 섹션 최소 100px 보장, 리사이즈 핸들 16px

      if (newHeight >= 200 && newHeight <= maxHeight) {
        this.$refs.topSection.style.height = `${newHeight}px`;
        this.$refs.bottomSection.style.height = `${
          this.windowHeight - this.dashboardHeight - newHeight - 16
        }px`;

        this.topSectionHeight = newHeight;

        this.$nextTick(() => {
          this.$emit("map-resize");
        });
      }
    },
    stopTopSectionResize() {
      this.isTopSectionResizing = false;
      document.body.style.cursor = "default";

      document.removeEventListener("mousemove", this.onTopSectionResize);
      document.removeEventListener("mouseup", this.stopTopSectionResize);
    },
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

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

.dashboard-container {
  width: 100%;
  overflow: hidden;
}

.main-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.top-section {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.bottom-section {
  width: 100%;
  background-color: #f5f5f5;
  overflow: auto;
}

.bottom-content {
  padding: 20px;
}

.horizontal-resize-handle {
  width: 100%;
  height: 16px;
  background-color: #e0e0e0;
  cursor: ns-resize;
  transition: background-color 0.2s;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.horizontal-resize-handle::after {
  content: "";
  width: 40px;
  height: 4px;
  background-color: #bdbdbd;
  border-radius: 2px;
}

.horizontal-resize-handle:hover {
  background-color: #d0d0d0;
}

.horizontal-resize-handle:hover::after {
  background-color: #9e9e9e;
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
  width: 16px;
  background-color: #e0e0e0;
  cursor: ew-resize;
  transition: background-color 0.2s;
  user-select: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-handle::after {
  content: "";
  width: 4px;
  height: 40px;
  background-color: #bdbdbd;
  border-radius: 2px;
}

.resize-handle:hover {
  background-color: #d0d0d0;
}

.resize-handle:hover::after {
  background-color: #9e9e9e;
}
</style>
