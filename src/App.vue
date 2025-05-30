<template>
  <div class="app-container">
    <div
      class="dashboard-container"
      ref="dashboardContainer"
      :style="{ height: dashboardHeight + 'px' }"
    >
      <dashboard-stats :plan-data="planData" />
    </div>
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
          <driver-list :route-list="totalRouteList" />
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

      <!-- Toggle button for bottom section -->
      <div class="bottom-toggle-container">
        <button
          class="bottom-toggle-btn"
          @click="toggleBottomSection"
          :class="{ active: isBottomSectionVisible }"
        >
          <i
            :class="
              isBottomSectionVisible ? 'bi bi-chevron-down' : 'bi bi-chevron-up'
            "
          ></i>
          {{ isBottomSectionVisible ? "Hide JSON Data" : "Show JSON Data" }}
        </button>
      </div>

      <div
        v-if="isBottomSectionVisible"
        class="bottom-section"
        ref="bottomSection"
        :style="{ height: bottomSectionHeight + 'px' }"
      >
        <div class="bottom-content">
          <h3>JSON Data Information</h3>

          <!-- Loading status -->
          <div v-if="isLoading" class="loading">
            <p>Loading JSON file...</p>
          </div>

          <!-- Error status -->
          <div v-else-if="error" class="error">
            <p>Error: {{ error }}</p>
          </div>

          <!-- JSON keys list -->
          <div v-else-if="jsonKeys.length > 0" class="json-info">
            <h4>JSON File Keys ({{ jsonKeys.length }} items):</h4>
            <div class="keys-container">
              <div
                v-for="(key, index) in jsonKeys"
                :key="index"
                class="key-item"
              >
                <span class="key-name">{{ key }}</span>
                <span v-if="jsonData && jsonData[key]" class="key-type">
                  {{ getDataType(jsonData[key]) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Initial state -->
          <div v-else>
            <p>Failed to load JSON data.</p>
          </div>
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
      driverListWidth: window.innerWidth / 2,
      dashboardHeight: 130, // Initial dashboard height
      topSectionHeight: 680, // Initial top section height
      isHorizontalResizing: false,
      startX: 0,
      startWidth: 0,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      // JSON data related additions
      jsonData: null,
      jsonKeys: [],
      isLoading: false,
      error: null,
      // Bottom section visibility
      isBottomSectionVisible: false,
    };
  },
  created() {
    this.loadJsonData();
  },
  mounted() {
    // Window size change detection
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("mousemove", this.onHorizontalResize);
    document.removeEventListener("mouseup", this.stopHorizontalResize);
  },
  computed: {
    mapViewWidth() {
      return this.windowWidth - this.driverListWidth - 16;
    },
    mainContainerHeight() {
      return this.windowHeight - this.dashboardHeight - 16;
    },
    bottomSectionHeight() {
      if (!this.isBottomSectionVisible) {
        return 0;
      }
      return (
        this.windowHeight - this.dashboardHeight - this.topSectionHeight - 82
      );
    },
    planData() {
      if (!this.jsonData || !this.jsonData.planVo) {
        return null;
      }

      const planVo = this.jsonData.planVo;
      return {
        planId: planVo.planId || "",
        lssId: planVo.lssId || "",
        tnntId: planVo.tnntId || "",
        statDate: planVo.statDate || "",
        endDate: planVo.endDate || "",
        exeScd: planVo.exeScd || "",
        totCostAmt: planVo.totCostAmt || 0,
        totOrderCnt: planVo.totOrderCnt || 0,
        alocOrderCnt: planVo.alocOrderCnt || 0,
        totVhclCnt: planVo.totVhclCnt || 0,
        alocVhclCnt: planVo.alocVhclCnt || 0,
      };
    },
    totalRouteList() {
      if (!this.jsonData || !this.jsonData.totalRouteList) {
        return [];
      }

      return this.jsonData.totalRouteList.map((route) => ({
        zoneId: route.zoneId || "",
        vhclId: route.vhclId || "",
        vhclTcd: route.vhclTcd || "",
        stopRcnt: route.stopRcnt || 0,
        totCostAmt: route.totCostAmt || 0,
        totLoadWt: route.totLoadWt || 0,
        totLoadWtRatio: route.totLoadWtRatio || 0,
        totLoadCbm: route.totLoadCbm || 0,
        totLoadCbmRatio: route.totLoadCbmRatio || 0,
        totDistcVal: route.totDistcVal || 0,
        totTrvlPeridVal: route.totTrvlPeridVal || 0,
      }));
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
    async loadJsonData() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch("/simple_input.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.jsonData = data;
        this.jsonKeys = Object.keys(data);

        console.log("JSON keys list:", this.jsonKeys);
        console.log(
          "Total JSON data size:",
          JSON.stringify(data).length,
          "characters"
        );
      } catch (err) {
        this.error = err.message;
        console.error("JSON load error:", err);
      } finally {
        this.isLoading = false;
      }
    },
    getDataType(value) {
      if (Array.isArray(value)) {
        return `Array (${value.length} items)`;
      } else if (value === null) {
        return "null";
      } else if (typeof value === "object") {
        const keys = Object.keys(value);
        return `Object (${keys.length} properties)`;
      } else {
        return typeof value;
      }
    },
    toggleBottomSection() {
      this.isBottomSectionVisible = !this.isBottomSectionVisible;
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

/* JSON data display styles */
.loading {
  text-align: center;
  color: #666;
  font-style: italic;
}

.error {
  color: #e53e3e;
  background-color: #fed7d7;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #feb2b2;
}

.json-info h4 {
  color: #2d3748;
  margin-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
}

.keys-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.key-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.key-item:hover {
  background-color: #edf2f7;
}

.key-name {
  font-weight: 600;
  color: #2d3748;
  flex: 1;
}

.key-type {
  font-size: 0.85em;
  color: #718096;
  background-color: #e2e8f0;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 10px;
}

.bottom-toggle-container {
  width: 100%;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-toggle-btn {
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 13px;
  color: #495057;
  cursor: pointer;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.bottom-toggle-btn:hover {
  background-color: #f8f9fa;
  border-color: #ced4da;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bottom-toggle-btn.active {
  background-color: #e7f5ff;
  border-color: #74c0fc;
  color: #1c7ed6;
}

.bottom-toggle-btn i {
  font-size: 12px;
}
</style>
