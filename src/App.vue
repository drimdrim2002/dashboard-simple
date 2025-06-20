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
          <!-- 좌우 분할 레이아웃 -->
          <div class="split-layout">
            <!-- 좌측: Selected Vehicles -->
            <div
              class="left-panel"
              ref="leftPanel"
              :style="{ width: leftPanelWidth + 'px' }"
            >
              <div class="panel-header">
                <h4 class="panel-title">
                  <i class="bi bi-truck"></i>
                  Selected Vehicles ({{ selectedVehicles.length }})
                </h4>
              </div>
              <div class="panel-content">
                <vehicle-detail-list
                  ref="vehicleDetailList"
                  :selected-vehicles="selectedVehicles"
                  :is-saving="isSavingVehicles"
                  @update:selected-vehicles="selectedVehicles = $event"
                  @save-requested="handleSaveVehicles"
                  @reset-requested="handleResetVehicles"
                />
              </div>
            </div>

            <!-- 가운데: 리사이즈 핸들 -->
            <div
              class="vertical-resize-handle"
              @mousedown="startVerticalResize"
            >
              <div class="resize-grip"></div>
            </div>

            <!-- 우측: JSON Data Information -->
            <div
              class="right-panel"
              ref="rightPanel"
              :style="{ width: rightPanelWidth + 'px' }"
            >
              <div class="panel-header">
                <h4 class="panel-title">
                  <i class="bi bi-file-earmark-code"></i>
                  JSON Data Information
                </h4>
              </div>
              <div class="panel-content">
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
            </div>
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
import VehicleDetailList from "./components/VehicleDetailList.vue";

export default {
  name: "App",
  components: {
    DashboardStats,
    DriverList,
    MapView,
    VehicleDetailList,
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
      // 좌우 분할 레이아웃 관련
      leftPanelWidth: 0, // 동적으로 계산됨
      isVerticalResizing: false,
      verticalStartX: 0,
      verticalStartWidth: 0,
    };
  },
  created() {
    this.loadJsonData();
  },
  mounted() {
    // Window size change detection
    window.addEventListener("resize", this.handleResize);

    // 초기 좌측 패널 너비 설정 (전체 너비의 60%)
    this.leftPanelWidth = Math.floor(this.bottomSectionWidth * 0.6);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("mousemove", this.onHorizontalResize);
    document.removeEventListener("mouseup", this.stopHorizontalResize);
    document.removeEventListener("mousemove", this.onVerticalResize);
    document.removeEventListener("mouseup", this.stopVerticalResize);
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
    rightPanelWidth() {
      return this.bottomSectionWidth - this.leftPanelWidth - 8; // 리사이즈 핸들 너비(8px) 제외
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
        detailList: route.detailList || [],
        colorCode: route.colorCode || "#000000",
      }));
    },
  },
  methods: {
    handleResize() {
      const oldWidth = this.windowWidth;
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;

      // 창 크기 변경 시 좌측 패널 너비 비율 유지
      if (oldWidth > 0 && this.leftPanelWidth > 0) {
        const ratio = this.leftPanelWidth / (oldWidth - 40);
        this.leftPanelWidth = Math.floor(this.bottomSectionWidth * ratio);

        // 최소/최대 너비 제한
        const minWidth = 300;
        const maxWidth = this.bottomSectionWidth - 300 - 8;
        this.leftPanelWidth = Math.max(
          minWidth,
          Math.min(maxWidth, this.leftPanelWidth)
        );
      }
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

    // 수직 리사이즈 (좌우 분할) 관련 메서드들
    startVerticalResize(e) {
      this.isVerticalResizing = true;
      this.verticalStartX = e.clientX;
      this.verticalStartWidth = this.leftPanelWidth;
      document.body.style.cursor = "ew-resize";

      document.addEventListener("mousemove", this.onVerticalResize);
      document.addEventListener("mouseup", this.stopVerticalResize);
    },

    onVerticalResize(e) {
      if (!this.isVerticalResizing) return;

      const delta = e.clientX - this.verticalStartX;
      const newWidth = this.verticalStartWidth + delta;

      // 최소/최대 너비 제한
      const minWidth = 300;
      const maxWidth = this.bottomSectionWidth - 300 - 8; // 우측 패널 최소 300px + 핸들 8px

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        this.leftPanelWidth = newWidth;
      }
    },

    stopVerticalResize() {
      this.isVerticalResizing = false;
      document.body.style.cursor = "default";

      document.removeEventListener("mousemove", this.onVerticalResize);
      document.removeEventListener("mouseup", this.stopVerticalResize);
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
          payload.data.length,
          "개 차량"
        );

        // 실제 API 호출이나 로컬스토리지 저장 로직
        // 예시: await this.$api.saveVehicleData(payload.data);

        // 변경된 차량 데이터 상세 정보 출력
        payload.data.forEach((vehicle) => {
          console.log(
            `📋 차량 ID: ${vehicle.vhclId || vehicle.vhclId} 상세정보:`
          );
          console.log(`  - 상세 목록 수: ${vehicle.detailList?.length || 0}개`);

          if (vehicle.detailList?.length > 0) {
            console.log("  - 상세 목록:");
            vehicle.detailList.forEach((detail, idx) => {
              console.log(
                `    ${idx + 1}. ${detail.orderId || detail.locId} (${
                  detail.locTcd
                })`
              );
            });
          }
        });
        // 시뮬레이션용 딜레이
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("✅ App.vue에서 차량 데이터 저장 완료");

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

      // 원본 데이터로 복원
      this.selectedVehicles = JSON.parse(JSON.stringify(payload.originalData));

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

/* 좌우 분할 레이아웃 스타일 */
.split-layout {
  display: flex;
  height: 100%;
  gap: 0;
}

.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.left-panel {
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.right-panel {
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.panel-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 12px 16px;
  flex-shrink: 0;
}

.panel-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-title i {
  font-size: 18px;
  color: #6c757d;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* 좌측 패널은 padding 없음 (VehicleDetailList가 자체 패딩 가짐) */
.left-panel .panel-content {
  padding: 0;
}

/* 우측 패널은 패딩 추가 */
.right-panel .panel-content {
  padding: 16px;
}

/* 수직 리사이즈 핸들 */
.vertical-resize-handle {
  width: 8px;
  background-color: #e9ecef;
  cursor: ew-resize;
  transition: background-color 0.2s;
  user-select: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.vertical-resize-handle:hover {
  background-color: #ced4da;
}

.resize-grip {
  width: 3px;
  height: 40px;
  background-color: #adb5bd;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.vertical-resize-handle:hover .resize-grip {
  background-color: #6c757d;
}

/* JSON 정보 섹션 스타일 조정 */
.right-panel .json-info h5 {
  color: #495057;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
}

.right-panel .keys-container {
  max-height: none; /* 높이 제한 제거 */
  gap: 8px;
  grid-template-columns: 1fr; /* 단일 컬럼으로 변경 */
}

.right-panel .key-item {
  padding: 6px 10px;
  font-size: 13px;
}

.right-panel .key-name {
  font-size: 13px;
}

.right-panel .key-type {
  font-size: 11px;
}
</style>
