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
          <driver-list
            :route-list="totalRouteList"
            @vehicles-selected="handleVehiclesSelected"
          />
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
          <!-- SplitLayout 컴포넌트 사용 -->
          <split-layout
            :container-width="bottomSectionWidth"
            left-title="Selected Vehicles"
            left-icon="bi bi-truck"
            :left-badge="selectedVehicles.length"
            right-title="JSON Data Information"
            right-icon="bi bi-file-earmark-code"
            :right-badge="jsonKeys.length"
            @resize-start="onSplitResizeStart"
            @resizing="onSplitResizing"
            @resize-end="onSplitResizeEnd"
          >
            <!-- 좌측 슬롯: Selected Vehicles -->
            <template #left>
              <vehicle-detail-list
                ref="vehicleDetailList"
                :selected-vehicles="selectedVehicles"
                :is-saving="isSavingVehicles"
                @update:selected-vehicles="selectedVehicles = $event"
                @save-requested="handleSaveVehicles"
                @reset-requested="handleResetVehicles"
              />
            </template>

            <!-- 우측 슬롯: JSON Data Information -->
            <template #right>
              <div class="json-data-content">
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
                  <h5>JSON File Keys ({{ jsonKeys.length }} items):</h5>
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
            </template>
          </split-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardStats from "./components/Dashboard/DashboardStats.vue";
import DriverList from "./components/DriverList/DriverList.vue";
import MapView from "./components/Map/MapView.vue";
import VehicleDetailList from "./components/VehicleDetailList.vue";
import SplitLayout from "./components/SplitLayout.vue";

export default {
  name: "App",
  components: {
    DashboardStats,
    DriverList,
    MapView,
    VehicleDetailList,
    SplitLayout,
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
      // Selected vehicles management
      selectedVehicles: [],
      isSavingVehicles: false,
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
    bottomSectionWidth() {
      return this.windowWidth - 40; // padding 고려
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
        maxWt: route.maxWt || 0,
        maxVol: route.maxVol || 0,
        maxStopRcnt: route.maxStopRcnt || 0,
        detailList: route.detailList || [],
        colorCode: route.colorCode || "#000000",
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

    // SplitLayout 이벤트 핸들러들
    onSplitResizeStart() {
      console.log("Split layout resize started");
    },

    onSplitResizing(event) {
      console.log("Split layout resizing:", event);
    },

    onSplitResizeEnd(event) {
      console.log("Split layout resize ended:", event);
    },

    async loadJsonData() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch("/merged_simple_input_modified.json");
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
    handleVehiclesSelected(selectedVehicles) {
      // Update selected vehicles in the main component
      this.selectedVehicles = selectedVehicles;

      console.log("Selected vehicles count:", selectedVehicles.length);
      console.log("Selected vehicles details:", selectedVehicles);

      // You can add additional logic here to handle the selected vehicles
      // For example: update dashboard stats, send to map component, etc.
    },
    async handleSaveVehicles(payload) {
      this.isSavingVehicles = true;

      try {
        console.log(
          "🏢 App.vue에서 차량 데이터 저장 시작:",
          `전체 ${payload.totalCount || payload.data.length}개 중 ${
            payload.changedCount || payload.data.length
          }개 변경됨`
        );

        // 변경된 차량 정보만 로깅 (changedVehicles가 있으면 사용, 없으면 전체 데이터 사용)
        const vehiclesToSave = payload.changedVehicles || payload.data;

        if (vehiclesToSave && vehiclesToSave.length > 0) {
          console.log("🔄 저장할 차량 목록:");
          vehiclesToSave.forEach((vehicle, index) => {
            console.log(
              `📋 ${index + 1}. 차량 ID: ${vehicle.vhclId} 상세정보:`
            );
            console.log(
              `  - 상세 목록 수: ${vehicle.detailList?.length || 0}개`
            );

            if (vehicle.detailList?.length > 0) {
              console.log("  - 상세 목록:");
              vehicle.detailList.forEach((detail, idx) => {
                console.log(
                  `    ${idx + 1}. ${detail.orderId || detail.locId} (seq: ${
                    detail.stopSeqNo
                  }, type: ${detail.locTcd})`
                );
              });
            }
          });
        }

        // 실제 저장 로직에서는 변경된 차량만 서버에 전송
        // 예:
        // const saveData = {
        //   changedVehicles: vehiclesToSave,
        //   timestamp: new Date().toISOString()
        // };
        // await api.saveVehicleChanges(saveData);

        // 시뮬레이션용 딜레이
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("✅ App.vue에서 차량 데이터 저장 완료");
        console.log(
          `📊 저장 요약: ${vehiclesToSave.length}개 차량의 변경사항이 저장됨`
        );

        // VehicleDetailList 컴포넌트에 저장 성공 알림
        this.$refs.vehicleDetailList?.onSaveSuccess();
      } catch (error) {
        console.error("❌ App.vue에서 차량 데이터 저장 실패:", error);

        // VehicleDetailList 컴포넌트에 저장 실패 알림
        this.$refs.vehicleDetailList?.onSaveError(error);
      } finally {
        this.isSavingVehicles = false;
      }
    },
    handleResetVehicles(payload) {
      if (!payload.originalData) {
        console.warn("⚠️ 원본 데이터가 없어서 리셋할 수 없습니다.");
        return;
      }

      console.log(
        "🔄 App.vue에서 차량 데이터 리셋:",
        payload.originalData.length,
        "개 차량"
      );

      this.selectedVehicles.forEach((selectedVehicle) => {
        const vhclId = selectedVehicle.vhclId;
        ``;
        const originalVehicle = payload.originalData.find(
          (vehicle) => vehicle.vhclId === vhclId
        );

        if (originalVehicle) {
          selectedVehicle.detailList = originalVehicle.detailList;
        }
      });

      // 원본 데이터로 복원
      // this.selectedVehicles = JSON.parse(JSON.stringify(payload.originalData));

      // VehicleDetailList 컴포넌트에 리셋 성공 알림
      this.$refs.vehicleDetailList?.onResetSuccess();

      console.log("✅ App.vue에서 차량 데이터 리셋 완료");
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

/* Tab Navigation Styles */
.nav-tabs {
  border-bottom: 1px solid #dee2e6;
}

.nav-tabs .nav-item {
  margin-bottom: -1px;
}

.nav-tabs .nav-link {
  border: 1px solid transparent;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  padding: 0.5rem 1rem;
  color: #495057;
  background: none;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out;
}

.nav-tabs .nav-link:hover {
  border-color: #e9ecef #e9ecef #dee2e6;
  isolation: isolate;
}

.nav-tabs .nav-link.active {
  color: #495057;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
}

.nav-tabs .nav-link i {
  margin-right: 0.5rem;
}

.tab-content {
  height: calc(100% - 60px);
}

.tab-pane {
  height: 100%;
}

.tab-pane.active {
  display: block;
}

/* JSON 데이터 콘텐츠 스타일 */
.json-data-content {
  padding: 16px;
}

.json-data-content .json-info h5 {
  color: #495057;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
}

.json-data-content .keys-container {
  max-height: none; /* 높이 제한 제거 */
  gap: 8px;
  grid-template-columns: 1fr; /* 단일 컬럼으로 변경 */
}

.json-data-content .key-item {
  padding: 6px 10px;
  font-size: 13px;
}

.json-data-content .key-name {
  font-size: 13px;
}

.json-data-content .key-type {
  font-size: 11px;
}
</style>
