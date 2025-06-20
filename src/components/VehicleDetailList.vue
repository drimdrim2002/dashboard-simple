<template>
  <div class="vehicle-detail-list">
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-0">
              <i class="bi bi-list-ul"></i>
              Vehicle Detail Information
              <span v-if="totalDetailCount > 0" class="badge bg-primary ms-2">
                {{ totalDetailCount }} items
              </span>
              <span v-if="hasUnsavedChanges" class="badge bg-warning ms-2">
                <i class="bi bi-exclamation-triangle"></i>
                Unsaved Changes
              </span>
            </h5>
          </div>
          <div class="d-flex gap-2">
            <button
              v-if="hasUnsavedChanges"
              @click="resetChanges"
              class="btn btn-outline-secondary btn-sm"
              :disabled="isSaving"
            >
              <i class="bi bi-arrow-clockwise"></i>
              Reset
            </button>
            <button
              @click="saveChanges"
              class="btn btn-success btn-sm"
              :disabled="!hasUnsavedChanges || isSaving"
              :class="{ 'btn-outline-success': !hasUnsavedChanges }"
            >
              <span
                v-if="isSaving"
                class="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
              <i v-else class="bi bi-check-circle"></i>
              {{ isSaving ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div
          v-if="selectedVehicles.length === 0"
          class="text-center text-muted py-4"
        >
          <i class="bi bi-inbox display-4"></i>
          <p class="mt-3">No selected vehicle</p>
        </div>

        <div v-else>
          <ZoneSection
            v-for="(zoneData, zoneId) in vehiclesByZone"
            :key="zoneId"
            :zone-id="zoneId"
            :zone-data="zoneData"
            :is-expanded="isZoneExpanded(zoneId)"
            :is-dragging="isDragging"
            :is-vehicle-expanded="isVehicleExpanded"
            @toggle-zone-details="toggleZoneDetails"
            @toggle-vehicle-details="toggleVehicleDetails"
            @update-vehicle-summary="handleVehicleSummaryUpdate"
            @data-changed="markAsChanged"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ZoneSection from "./VehicleDetailList/zone/ZoneSection.vue";
import { formatWeight, formatVolume } from "@/utils/formatUtils";
import { DEFAULT_CONFIG } from "./VehicleDetailList/shared/utils/constants";

import { notificationMixin } from "./VehicleDetailList/shared/mixins/notificationMixin";
import { dragMixin } from "./VehicleDetailList/shared/mixins/dragMixin";
import { calculationMixin } from "./VehicleDetailList/shared/mixins/calculationMixin";

export default {
  name: "VehicleDetailList",
  mixins: [notificationMixin, dragMixin, calculationMixin],
  components: {
    ZoneSection,
  },
  props: {
    selectedVehicles: {
      type: Array,
      default: () => [],
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:selected-vehicles", "save-requested", "reset-requested"],
  data() {
    return {
      expandedZones: {}, // zone별 펼침/접힘 상태 관리
      expandedVehicles: {}, // vehicle별 펼침/접힘 상태 관리
      originalData: null, // 원본 데이터 백업
      hasUnsavedChanges: false, // 변경사항 추적
    };
  },
  computed: {
    totalDetailCount() {
      return this.selectedVehicles.reduce((total, vehicle) => {
        return total + (vehicle.detailList ? vehicle.detailList.length : 0);
      }, 0);
    },
    vehiclesByZone() {
      const grouped = {};
      this.selectedVehicles.forEach((vehicle) => {
        const zoneId = vehicle.zone || DEFAULT_CONFIG.UNKNOWN_ZONE;
        if (!grouped[zoneId]) {
          grouped[zoneId] = {
            vehicles: [],
            summary: {
              totLoadWt: 0,
              totLoadCbm: 0,
              totDistcVal: 0,
              totTrvlPeridVal: 0,
              totCostAmt: 0,
              maxWt: 0,
              maxVol: 0,
              vhclIds: [],
              vhclTcds: [],
            },
          };
        }

        grouped[zoneId].vehicles.push(vehicle);

        // 합계 계산
        const summary = grouped[zoneId].summary;
        summary.totLoadWt += Number(vehicle.totLoadWt || 0);
        summary.totLoadCbm += Number(vehicle.totLoadCbm || 0);
        summary.totDistcVal += Number(vehicle.totDistcVal || 0);
        summary.totTrvlPeridVal += Number(vehicle.totTrvlPeridVal || 0);
        summary.totCostAmt += Number(vehicle.totCostAmt || 0);
        summary.maxWt += Number(vehicle.maxWt || 0);
        summary.maxVol += Number(vehicle.maxVol || 0);
        // vhclId와 vhclTcd 수집
        if (vehicle.vhclId) summary.vhclIds.push(vehicle.vhclId);
        if (vehicle.vhclTcd) summary.vhclTcds.push(vehicle.vhclTcd);
      });
      return grouped;
    },
  },
  watch: {
    selectedVehicles: {
      handler(newValue) {
        console.log("🔄 selectedVehicles 변경 감지:", newValue);
        if (this.originalData) {
          this.checkForChanges();
        } else {
          // 처음 데이터가 로드될 때 원본 백업
          this.backupOriginalData();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 저장 및 변경 추적 관련 메서드들
    backupOriginalData() {
      this.originalData = JSON.parse(JSON.stringify(this.selectedVehicles));
      this.hasUnsavedChanges = false;
      console.log("📦 원본 데이터 백업 완료");
    },

    checkForChanges() {
      if (!this.originalData) return;

      const currentData = JSON.stringify(this.selectedVehicles);
      const originalData = JSON.stringify(this.originalData);
      const hasChanges = currentData !== originalData;

      if (this.hasUnsavedChanges !== hasChanges) {
        this.hasUnsavedChanges = hasChanges;
        console.log("🔄 변경사항 감지:", hasChanges ? "있음" : "없음");
      }
    },

    async saveChanges() {
      console.log("💾 Save 버튼 클릭 - 상위 컴포넌트에 저장 요청");

      // 상위 컴포넌트에 저장 요청 이벤트 발생
      this.$emit("save-requested", {
        data: this.selectedVehicles,
        originalData: this.originalData,
      });
    },

    resetChanges() {
      console.log("🔄 Reset 버튼 클릭 - 상위 컴포넌트에 리셋 요청");

      // 상위 컴포넌트에 리셋 요청 이벤트 발생
      this.$emit("reset-requested", {
        originalData: this.originalData,
      });
    },

    // 드래그 앤 드롭이나 기타 변경사항이 발생했을 때 호출할 메서드
    markAsChanged() {
      if (!this.hasUnsavedChanges) {
        this.hasUnsavedChanges = true;
        console.log("📝 변경사항 마크됨");
      }
    },

    // 상위 컴포넌트에서 호출할 수 있는 공개 메서드들
    onSaveSuccess() {
      this.backupOriginalData();
      this.showNotification("변경사항이 성공적으로 저장되었습니다.", "success");
      console.log("✅ 저장 성공 처리 완료");
    },

    onSaveError(error) {
      console.error("❌ 저장 실패:", error);
      this.showNotification("저장 중 오류가 발생했습니다.", "error");
    },

    onResetSuccess() {
      this.hasUnsavedChanges = false;
      this.showNotification("변경사항이 리셋되었습니다.", "info");
      console.log("✅ 리셋 성공 처리 완료");
    },

    // 포맷팅 메서드들 - formatUtils에서 import한 함수들 사용
    formatWeight: formatWeight,
    formatVolume: formatVolume,
    toggleZoneDetails(zoneId) {
      // 드래그 중일 때는 클릭 이벤트 무시
      if (this.isDragging) {
        console.log("🚫 드래그 중이므로 Zone 클릭 무시:", zoneId);
        return;
      }

      this.$set(this.expandedZones, zoneId, !this.expandedZones[zoneId]);
    },
    isZoneExpanded(zoneId) {
      return this.expandedZones[zoneId] || false;
    },
    toggleVehicleDetails(vehicleId) {
      // 드래그 중일 때는 클릭 이벤트 무시
      if (this.isDragging) {
        console.log("🚫 드래그 중이므로 클릭 무시:", vehicleId);
        return;
      }

      console.log("🚛 Vehicle 토글 클릭:", vehicleId);
      console.log("현재 상태:", this.expandedVehicles[vehicleId]);
      this.$set(
        this.expandedVehicles,
        vehicleId,
        !this.expandedVehicles[vehicleId]
      );
      console.log("변경된 상태:", this.expandedVehicles[vehicleId]);
    },
    isVehicleExpanded(vehicleId) {
      const isExpanded = this.expandedVehicles[vehicleId] || false;
      console.log(`🔍 Vehicle ${vehicleId} 펼쳐짐 상태:`, isExpanded);
      return isExpanded;
    },

    handleVehicleSummaryUpdate(vehicleId) {
      console.log("📊 Vehicle summary 업데이트 요청:", vehicleId);
      // calculationMixin의 updateVehicleSummaries 호출
      this.updateVehicleSummaries();
      // 변경사항 마크
      this.markAsChanged();
    },

    // 계산 관련 메서드들은 calculationMixin에서 제공됩니다.
    // 계산 관련 메서드들은 calculationMixin에서 제공됩니다.
    // 드래그 관련 메서드들은 dragMixin에서 제공됩니다.
    // 알림 메서드들은 notificationMixin에서 제공됩니다.
  },
};
</script>

<style scoped>
.vehicle-detail-list {
  height: 100%;
  overflow: hidden;
}

.card {
  height: 100%;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 1.25rem;
}

.card-body {
  padding: 1.25rem;
  overflow-y: auto;
  height: calc(100% - 80px);
}

/* 드래그 가능한 행 스타일 */
.draggable-row {
  cursor: default;
}

.draggable-row:hover {
  background-color: rgba(13, 110, 253, 0.03) !important;
}

.non-draggable-row {
  opacity: 0.7;
  background-color: rgba(220, 53, 69, 0.01) !important;
}

.non-draggable-row:hover {
  background-color: rgba(220, 53, 69, 0.02) !important;
}

/* Vue.Draggable 전용 스타일 (단순화) */
.draggable-tbody {
  min-height: 50px;
}

.sortable-ghost {
  opacity: 0.5;
  background-color: rgba(13, 110, 253, 0.08) !important;
}

.sortable-chosen {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.sortable-drag {
  background-color: rgba(13, 110, 253, 0.15) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000 !important;
  border: 1px solid #0d6efd;
}

.sortable-fallback {
  background-color: rgba(13, 110, 253, 0.1) !important;
  opacity: 0.7;
}

/* Vehicle 테이블 드래그 피드백 (단순화) */
.vehicle-table.dragging-active {
  border: 1px dashed rgba(13, 110, 253, 0.4);
}

.vehicle-table.dragging-active .draggable-tbody {
  background-color: rgba(13, 110, 253, 0.02);
  min-height: 60px;
}

.vehicle-table.dragging-active .draggable-tbody:empty::before {
  content: "드롭 가능";
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  color: #6c757d;
  font-size: 0.8rem;
}

/* 기타 유틸리티 스타일들 */
.seq-number {
  color: #6c757d;
  font-weight: 500;
  text-align: center;
  font-size: 0.8rem;
}

.vhcl-id {
  font-weight: 600;
  color: #0d6efd;
}

/* Bootstrap Icons */
.bi {
  font-family: bootstrap-icons !important;
}

/* Bootstrap Utility Classes */
.text-muted {
  color: #6c757d !important;
}
.text-primary {
  color: #0d6efd !important;
}
.text-center {
  text-align: center !important;
}
.text-dark {
  color: #212529 !important;
}
.text-light {
  color: #f8f9fa !important;
}
.display-4 {
  font-size: 3.5rem !important;
}
.py-4 {
  padding-top: 1.5rem !important;
  padding-bottom: 1.5rem !important;
}
.mt-3 {
  margin-top: 1rem !important;
}
.mb-0 {
  margin-bottom: 0 !important;
}
.mb-3 {
  margin-bottom: 1rem !important;
}
.mb-4 {
  margin-bottom: 1.5rem !important;
}
.ms-1 {
  margin-left: 0.25rem !important;
}
.ms-2 {
  margin-left: 0.5rem !important;
}
.small {
  font-size: 0.875em !important;
}
.fw-bold {
  font-weight: 700 !important;
}
.bg-primary {
  background-color: #0d6efd !important;
  color: white !important;
}
.bg-secondary {
  background-color: #6c757d !important;
  color: white !important;
}
.bg-info {
  background-color: #0dcaf0 !important;
  color: black !important;
}
.bg-success {
  background-color: #198754 !important;
  color: white !important;
}
.text-success {
  color: #198754 !important;
}
.d-flex {
  display: flex !important;
}
.align-items-center {
  align-items: center !important;
}
.justify-content-between {
  justify-content: space-between !important;
}

/* Bootstrap Table Styles */
.table {
  --bs-table-bg: transparent;
  --bs-table-accent-bg: transparent;
  --bs-table-striped-bg: rgba(0, 0, 0, 0.05);
  --bs-table-hover-bg: #f8f9fa;
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
  vertical-align: top;
  border-color: #dee2e6;
}

.table > :not(caption) > * > * {
  padding: 0.5rem 0.5rem;
  background-color: var(--bs-table-bg);
  border-bottom-width: 1px;
  box-shadow: inset 0 0 0 9999px var(--bs-table-accent-bg);
}

.table-striped > tbody > tr:nth-of-type(odd) > * {
  --bs-table-accent-bg: var(--bs-table-striped-bg);
  color: var(--bs-table-striped-color);
}

.table-hover > tbody > tr:hover > * {
  --bs-table-accent-bg: var(--bs-table-hover-bg);
  color: var(--bs-table-hover-color);
}

.table-sm > :not(caption) > * > * {
  padding: 0.25rem 0.25rem;
}

.table-dark {
  --bs-table-bg: #f8f9fa;
  --bs-table-striped-bg: #f8f9fa;
  --bs-table-hover-bg: #e9ecef;
  color: #212529;
  border-color: #dee2e6;
}

.table-secondary {
  --bs-table-bg: #e9ecef;
  color: #000;
  border-color: #dee2e6;
}

.table tfoot td {
  font-weight: 600;
  border-top: 2px solid #dee2e6;
  background-color: var(--bs-table-bg);
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Bootstrap Grid */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.75rem;
  margin-right: -0.75rem;
}

.col-md-1,
.col-md-2,
.col-md-3,
.col-md-6 {
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

@media (min-width: 768px) {
  .col-md-1 {
    flex: 0 0 8.333333%;
    max-width: 8.333333%;
  }
  .col-md-2 {
    flex: 0 0 16.666667%;
    max-width: 16.666667%;
  }
  .col-md-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

.g-2 > * {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-bottom: 1rem;
}

.fw-bold {
  font-weight: 700 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.text-end {
  text-align: center !important;
}

/* Bootstrap Flex Utilities */
.d-flex {
  display: flex !important;
}

.align-items-center {
  align-items: center !important;
}

.justify-content-between {
  justify-content: space-between !important;
}

/* Zone Toggle Styles */
.zone-basic-info {
  transition: background-color 0.2s ease;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.zone-basic-info:hover {
  background-color: rgba(25, 135, 84, 0.1);
}

/* Vehicle Toggle Styles */
.vehicle-basic-info {
  transition: background-color 0.2s ease;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.vehicle-basic-info:hover {
  background-color: rgba(13, 110, 253, 0.1);
}

.toggle-icon {
  font-size: 1.2rem;
  color: #198754;
  transition: transform 0.2s ease;
}

.expand-hint {
  font-size: 0.7rem;
  color: #6c757d;
  font-style: italic;
}

.zone-summary {
  animation: slideDown 0.3s ease-out;
}

.vehicle-section {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 통합 테이블 Tree 구조 스타일 */
.unified-table-section {
  animation: slideDown 0.3s ease-out;
}

.unified-vehicle-table {
  border-collapse: separate;
  border-spacing: 0;
}

.unified-vehicle-table .sticky-top {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Vehicle 헤더 행 스타일 */
.vehicle-header-row {
  background-color: #f8f9fa !important;
  border-top: 1px solid #dee2e6;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.vehicle-header-row:hover {
  background-color: #e9ecef !important;
}

.vehicle-tree-cell {
  font-weight: 600;
  color: #0d6efd;
}

.tree-toggle {
  font-size: 0.9rem;
  transition: transform 0.2s ease;
}

.tree-toggle:hover {
  transform: scale(1.1);
}

/* Tree 구조 표시 */
.tree-col {
  width: 200px;
  min-width: 150px;
}

.tree-cell {
  position: relative;
  padding-left: 1.5rem !important;
}

.tree-item {
  position: relative;
}

.tree-item::before {
  content: "";
  position: absolute;
  left: -1rem;
  top: 50%;
  width: 0.8rem;
  height: 1px;
  background-color: #dee2e6;
}

/* Detail 행 스타일 */
.detail-row {
  background-color: #fff;
  transition: background-color 0.2s ease;
}

.detail-row:hover {
  background-color: #f8f9fa !important;
}

/* 드래그 핸들 컬럼 폭 조정 */
.drag-handle-header {
  width: 50px;
  min-width: 50px;
}

.drag-handle-cell {
  width: 50px;
  padding: 0.25rem !important;
  text-align: center;
  vertical-align: middle;
}

/* Vehicle ID 컬럼 스타일 */
.vhcl-id {
  font-weight: 600;
  color: #0d6efd;
}

/* 순번 컬럼 */
.seq-number {
  text-align: center;
  font-weight: 500;
  width: 60px;
}

/* 테이블 간격 조정 */
.unified-vehicle-table tbody tr td {
  border-top: 1px solid #dee2e6;
}

.unified-vehicle-table .vehicle-header-row td {
  border-top: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
}

/* 반응형 대응 */
@media (max-width: 768px) {
  .tree-col {
    width: 120px;
    min-width: 100px;
  }

  .tree-cell {
    padding-left: 1rem !important;
  }
}
</style>
