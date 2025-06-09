<template>
  <div class="vehicle-detail-list">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-list-ul"></i>
          Vehicle Detail Information
          <span v-if="totalDetailCount > 0" class="badge bg-primary ms-2">
            {{ totalDetailCount }} items
          </span>
        </h5>
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
          <div
            v-for="(zoneData, zoneId) in vehiclesByZone"
            :key="zoneId"
            class="zone-section mb-4"
          >
            <div class="zone-header mb-3">
              <!-- 기본 Zone 정보 + 토글 버튼 -->
              <div
                class="zone-basic-info"
                @click="toggleZoneDetails(zoneId)"
                style="cursor: pointer"
              >
                <h5
                  class="text-success mb-0 d-flex align-items-center justify-content-between"
                >
                  <span>
                    <i class="bi bi-geo-alt"></i>
                    Zone: {{ zoneId }}
                    <span class="badge bg-success ms-2">
                      {{ zoneData.vehicles.length }} vehicles
                    </span>
                    <span class="text-muted ms-2 small">
                      Weight: {{ formatWeight(zoneData.summary.totLoadWt) }} |
                      Volume: {{ formatVolume(zoneData.summary.totLoadCbm) }} |
                      Cost:
                      {{ Number(zoneData.summary.totCostAmt).toLocaleString() }}
                      <span class="expand-hint ms-1"
                        >({{
                          isZoneExpanded(zoneId)
                            ? "Click to collapse"
                            : "Click to expand"
                        }})</span
                      >
                    </span>
                  </span>
                  <span class="toggle-icon">
                    <i
                      :class="
                        isZoneExpanded(zoneId)
                          ? 'bi bi-chevron-up'
                          : 'bi bi-chevron-down'
                      "
                    ></i>
                  </span>
                </h5>
              </div>

              <!-- 상세 Zone 합계 정보 (접기/펼치기) -->
              <div v-if="isZoneExpanded(zoneId)" class="zone-summary mt-3">
                <div class="row g-2">
                  <div class="col-md-2">
                    <div class="summary-card">
                      <small class="text-muted">Vehicle IDs</small>
                      <div class="fw-bold">
                        {{ zoneData.summary.vhclIds.join(", ") || "N/A" }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="summary-card">
                      <small class="text-muted">Vehicle Types</small>
                      <div class="fw-bold">
                        {{
                          [...new Set(zoneData.summary.vhclTcds)].join(", ") ||
                          "N/A"
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="summary-card">
                      <small class="text-muted">Total Cost</small>
                      <div class="fw-bold">
                        {{
                          Number(zoneData.summary.totCostAmt).toLocaleString()
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="summary-card">
                      <small class="text-muted">Total Weight</small>
                      <div class="fw-bold">
                        {{ formatWeight(zoneData.summary.totLoadWt) }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="summary-card">
                      <small class="text-muted">Total Volume</small>
                      <div class="fw-bold">
                        {{ formatVolume(zoneData.summary.totLoadCbm) }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="summary-card">
                      <small class="text-muted">Total Distance</small>
                      <div class="fw-bold text">
                        {{ formatDistance(zoneData.summary.totDistcVal) }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="summary-card">
                      <small class="text-muted">Total Time</small>
                      <div class="fw-bold">
                        {{ formatTime(zoneData.summary.totTrvlPeridVal) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <template v-if="isZoneExpanded(zoneId)">
              <div
                v-for="vehicle in zoneData.vehicles"
                :key="vehicle.id"
                class="vehicle-section mb-3 ms-3"
              >
                <div
                  class="vehicle-header mb-3 drop-zone"
                  @dragover="onDragOver"
                  @drop="onDrop($event, vehicle)"
                  @dragenter="$event.currentTarget.classList.add('drag-over')"
                  @dragleave="
                    $event.currentTarget.classList.remove('drag-over')
                  "
                >
                  <!-- Vehicle 기본 정보 + 토글 버튼 -->
                  <div
                    class="vehicle-basic-info"
                    @click="toggleVehicleDetails(vehicle.id)"
                    style="cursor: pointer"
                  >
                    <h6
                      class="text-primary mb-0 d-flex align-items-center justify-content-between"
                    >
                      <span>
                        <i class="bi bi-truck"></i>
                        {{ vehicle.name }} ({{ vehicle.type }})
                        <span
                          v-if="
                            vehicle.detailList && vehicle.detailList.length > 0
                          "
                          class="badge bg-info ms-1"
                        >
                          {{ vehicle.detailList.length }} orders
                        </span>
                        <span class="text-muted ms-2 small">
                          Loaded Weight:
                          {{
                            formatDecimal(
                              calculateVehicleSummary(vehicle.detailList)
                                .totalLoadWt,
                              1
                            )
                          }}
                          , Max Weight: {{ vehicle.maxWt || 0 }}kg | Loaded
                          Volume:
                          {{
                            formatDecimal(
                              calculateVehicleSummary(vehicle.detailList)
                                .totalLoadVol,
                              1
                            )
                          }}
                          , Max Volume: {{ vehicle.maxVol }}m³
                          <span class="expand-hint ms-1"
                            >({{
                              isVehicleExpanded(vehicle.id)
                                ? "Click to collapse"
                                : "Click to expand"
                            }})</span
                          >
                        </span>
                      </span>
                      <span class="toggle-icon">
                        <i
                          :class="
                            isVehicleExpanded(vehicle.id)
                              ? 'bi bi-chevron-up'
                              : 'bi bi-chevron-down'
                          "
                        ></i>
                      </span>
                    </h6>
                  </div>
                </div>

                <div
                  v-if="!vehicle.detailList || vehicle.detailList.length === 0"
                  class="text-muted small"
                >
                  이 vehicle에 대한 detail 정보가 없습니다.
                </div>

                <div
                  v-else-if="isVehicleExpanded(vehicle.id)"
                  class="table-responsive"
                >
                  <table class="table table-striped table-hover table-sm">
                    <thead class="table-dark">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Order ID</th>
                        <th scope="col">Location ID</th>
                        <th scope="col">Weight(KG)</th>
                        <th scope="col">Volume(CBM)</th>
                        <th scope="col">Distance(KM)</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Request Time</th>
                        <th scope="col">Customer Time</th>
                        <th scope="col">Arrival Time</th>
                        <th scope="col">Departure Time</th>
                      </tr>
                    </thead>
                    <tbody
                      @dragover="onTableDragOver($event, vehicle)"
                      @drop="onDrop($event, vehicle)"
                      @dragleave="hideDropIndicator"
                    >
                      <!-- 드롭 인서트 라인 (테이블 시작 부분) -->
                      <tr
                        v-if="
                          dropIndicator.show &&
                          dropIndicator.targetVehicle?.id === vehicle.id &&
                          dropIndicator.insertIndex === 0
                        "
                        class="drop-insert-row"
                      >
                        <td colspan="11" class="drop-insert-cell">
                          <div class="drop-insert-indicator">
                            <i class="bi bi-arrow-down-circle-fill"></i>
                            <span class="drop-text"
                              >여기에 드롭하세요 (첫 번째 위치)</span
                            >
                          </div>
                        </td>
                      </tr>

                      <!-- 데이터 행들 -->
                      <tr
                        v-for="(detail, detailIndex) in vehicle.detailList"
                        :key="`data-${vehicle.id}-${detailIndex}`"
                        :draggable="isDragable(detail)"
                        :class="{
                          'draggable-row': isDragable(detail),
                          'non-draggable-row': !isDragable(detail),
                        }"
                        :aria-label="
                          isDragable(detail)
                            ? `드래그 가능한 주문 ${
                                detail.orderId || detail.locId
                              }`
                            : `드래그 불가능한 주문 ${
                                detail.orderId || detail.locId
                              }`
                        "
                        :tabindex="isDragable(detail) ? 0 : -1"
                        role="gridcell"
                        @dragstart="onDragStart($event, detail, vehicle)"
                        @dragend="onDragEnd"
                        @dragover="onRowDragOver"
                        @drop="onRowDrop($event, vehicle, detailIndex)"
                        @dragenter="
                          $event.currentTarget.classList.add('row-drag-over')
                        "
                        @dragleave="
                          $event.currentTarget.classList.remove('row-drag-over')
                        "
                        @keydown="
                          onRowKeyDown($event, detail, vehicle, detailIndex)
                        "
                      >
                        <td>{{ detailIndex + 1 }}</td>

                        <td>
                          {{ detail.orderId || detail.locId }}
                        </td>
                        <td>
                          {{ detail.locId }}
                        </td>
                        <td>
                          {{ detail.loadWt }}
                        </td>
                        <td>
                          {{ detail.loadVol }}
                        </td>
                        <td>{{ formatDistanceKM(detail.distcVal) }}</td>
                        <td>
                          {{ formatSecondsToTime(detail.trnsPeridVal) }}
                        </td>
                        <td>
                          {{ detail.reqDate }}
                        </td>
                        <td>
                          {{ formatTime24(detail.custOpenTime) }} ~
                          {{ formatTime24(detail.custCloseTime) }}
                        </td>
                        <td>
                          {{ detail.arrDtm }}
                        </td>
                        <td>
                          {{ detail.depDtm }}
                        </td>
                      </tr>

                      <!-- 각 행 뒤의 드롭 인서트 라인들 -->
                      <tr
                        v-for="dropLine in getDropLinesForVehicle(vehicle)"
                        :key="dropLine.key"
                        class="drop-insert-row"
                      >
                        <td colspan="11" class="drop-insert-cell">
                          <div class="drop-insert-indicator">
                            <i class="bi bi-arrow-down-circle-fill"></i>
                            <span class="drop-text">{{
                              dropLine.message
                            }}</span>
                          </div>
                        </td>
                      </tr>

                      <!-- 마지막 위치 드롭 인서트 라인 -->
                      <tr
                        v-if="shouldShowDropLineForIndex(vehicle, null)"
                        :key="`drop-end-${vehicle.id}`"
                        class="drop-insert-row"
                      >
                        <td colspan="11" class="drop-insert-cell">
                          <div class="drop-insert-indicator">
                            <i class="bi bi-arrow-down-circle-fill"></i>
                            <span class="drop-text"
                              >여기에 드롭하세요 ({{
                                (vehicle.detailList?.length || 0) + 1
                              }}번째 위치)</span
                            >
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot class="table-secondary">
                      <tr>
                        <td colspan="3" class="text-end fw-bold">Total:</td>

                        <td class="fw-bold">
                          {{
                            formatDecimal(
                              calculateVehicleTotal(
                                vehicle.detailList,
                                "loadWt"
                              ),
                              1
                            )
                          }}
                        </td>
                        <td class="fw-bold">
                          {{
                            formatDecimal(
                              calculateVehicleTotal(
                                vehicle.detailList,
                                "loadVol"
                              ),
                              1
                            )
                          }}
                        </td>
                        <td class="fw-bold">
                          {{
                            formatDistanceKM(
                              calculateVehicleTotal(
                                vehicle.detailList,
                                "distcVal"
                              )
                            )
                          }}
                        </td>
                        <td class="fw-bold">
                          {{
                            formatSecondsToTime(
                              calculateVehicleTotal(
                                vehicle.detailList,
                                "trnsPeridVal"
                              )
                            )
                          }}
                        </td>
                        <td colspan="4"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VehicleDetailList",
  props: {
    selectedVehicles: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      expandedZones: {}, // zone별 펼침/접힘 상태 관리
      expandedVehicles: {}, // vehicle별 펼침/접힘 상태 관리
      // 대안 3: 마우스 위치 기반 드롭 위치 추적
      dropIndicator: {
        show: false,
        targetVehicle: null,
        insertIndex: -1,
        mouseY: 0,
      },
      // 성능 최적화용 캐시
      vehicleSummaryCache: new Map(),
      lastUpdateTime: 0,
      dragOverTimeout: null,
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
        const zoneId = vehicle.zone || "Unknown Zone";
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
  methods: {
    formatWeight(value) {
      if (!value || value === 0) return "-";
      return Number(value).toLocaleString() + " kg";
    },
    formatVolume(value) {
      if (!value || value === 0) return "-";
      return Number(value).toLocaleString() + " m³";
    },
    formatDistance(value) {
      if (!value || value === 0) return "-";
      return Number(value).toLocaleString() + " km";
    },
    formatTime(value) {
      if (!value || value === 0) return "-";
      return Number(value).toLocaleString() + " min";
    },
    formatTime24(timeString) {
      if (!timeString || timeString === "000000") return "00:00:00";

      // 6자리 숫자 문자열을 HH:MM:SS 형식으로 변환
      const timeStr = timeString.toString().padStart(6, "0");
      const hours = timeStr.substring(0, 2);
      const minutes = timeStr.substring(2, 4);
      const seconds = timeStr.substring(4, 6);

      return `${hours}:${minutes}:${seconds}`;
    },
    formatDistanceKM(value) {
      if (!value) return "-";

      // 문자를 숫자로 변환하고 1000으로 나눈 후 소수점 첫째자리까지 표시
      const numValue = Number(value);
      if (isNaN(numValue)) return "-";

      const kmValue = (numValue / 1000).toFixed(1);
      return `${kmValue} km`;
    },
    formatSecondsToTime(seconds) {
      if (!seconds || seconds === 0) return "00:00:00";

      // 초를 숫자로 변환
      const totalSeconds = Number(seconds);
      if (isNaN(totalSeconds)) return "00:00:00";

      // 시, 분, 초 계산
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const remainingSeconds = totalSeconds % 60;

      // 2자리로 패딩하여 hh:mm:ss 형식으로 반환
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    },
    calculateVehicleTotal(detailList, field) {
      if (!detailList || detailList.length === 0) return 0;

      return detailList.reduce((total, detail) => {
        const value = Number(detail[field] || 0);
        return total + value;
      }, 0);
    },
    formatDecimal(value, decimals) {
      if (!value || value === 0) return "0.0";
      return Number(value).toFixed(decimals);
    },
    toggleZoneDetails(zoneId) {
      this.$set(this.expandedZones, zoneId, !this.expandedZones[zoneId]);
    },
    isZoneExpanded(zoneId) {
      return this.expandedZones[zoneId] || false;
    },
    toggleVehicleDetails(vehicleId) {
      this.$set(
        this.expandedVehicles,
        vehicleId,
        !this.expandedVehicles[vehicleId]
      );
    },
    isVehicleExpanded(vehicleId) {
      return this.expandedVehicles[vehicleId] || false;
    },
    calculateVehicleSummary(detailList) {
      if (!detailList || detailList.length === 0) {
        return { totalLoadWt: 0, totalLoadVol: 0 };
      }

      // 캐시 키 생성 (detailList의 해시)
      const cacheKey = JSON.stringify(
        detailList.map((d) => ({
          orderId: d.orderId,
          loadWt: d.loadWt,
          loadVol: d.loadVol,
        }))
      );

      // 캐시에서 조회
      if (this.vehicleSummaryCache.has(cacheKey)) {
        return this.vehicleSummaryCache.get(cacheKey);
      }

      const summary = detailList.reduce(
        (acc, detail) => {
          acc.totalLoadWt += Number(detail.loadWt || 0);
          acc.totalLoadVol += Number(detail.loadVol || 0);
          return acc;
        },
        { totalLoadWt: 0, totalLoadVol: 0 }
      );

      // 캐시에 저장 (최대 100개까지만)
      if (this.vehicleSummaryCache.size > 100) {
        const firstKey = this.vehicleSummaryCache.keys().next().value;
        this.vehicleSummaryCache.delete(firstKey);
      }
      this.vehicleSummaryCache.set(cacheKey, summary);

      return summary;
    },
    // Drag and Drop 관련 함수들
    isDragable(detail) {
      console.log("isDragable called:", detail);
      // stopSeqNo가 0보다 크면 드래그 가능
      // return Number(detail.stopSeqNo || 0) > 0;
      const result = true;
      console.log("isDragable result:", result);
      return result;
    },
    onDragStart(event, detail, sourceVehicle) {
      console.log("🔵 onDragStart called:", detail, sourceVehicle);

      const dragData = {
        detail: detail,
        sourceVehicleId: sourceVehicle.id,
        sourceZoneId: sourceVehicle.zone,
      };

      console.log("🔵 dragData:", dragData);

      try {
        event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
        event.dataTransfer.effectAllowed = "move";
        console.log("🔵 dataTransfer set successfully");

        // 드래그 중인 요소에 시각적 표시
        event.target.style.opacity = "0.5";
        event.target.style.cursor = "grabbing";
        event.target.setAttribute("dragging", "true");

        // 드롭 인디케이터 초기화
        this.hideDropIndicator();

        console.log("🔵 Drag start completed");
      } catch (error) {
        console.error("🔴 Error in onDragStart:", error);
      }
    },
    onDragEnd(event) {
      console.log("🟡 onDragEnd called");
      // 드래그 완료 후 스타일 복원
      event.target.style.opacity = "";
      event.target.style.cursor = "";
      event.target.removeAttribute("dragging");

      // 드롭 인디케이터 숨기기
      this.hideDropIndicator();
    },
    onDragOver(event) {
      console.log("🟠 onDragOver called");
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    onTableDragOver(event, vehicle) {
      // 디바운싱을 위한 래퍼 함수
      if (this.dragOverTimeout) {
        clearTimeout(this.dragOverTimeout);
      }

      this.dragOverTimeout = setTimeout(() => {
        this.handleTableDragOver(event, vehicle);
      }, 16); // 60fps를 위한 16ms 간격
    },
    handleTableDragOver(event, vehicle) {
      console.log("🟠 handleTableDragOver called for vehicle:", vehicle.id);
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      // 마우스 위치 기반으로 정확한 드롭 위치 계산
      this.calculateDropPosition(event, vehicle);
    },
    onRowDragOver(event) {
      event.preventDefault();
      event.stopPropagation(); // 부모 요소의 dragover 이벤트 방지
      event.dataTransfer.dropEffect = "move";
    },
    onRowDrop(event, targetVehicle, dropIndex) {
      console.log(
        "🎯 onRowDrop called at index:",
        dropIndex,
        "vehicle:",
        targetVehicle.id
      );
      event.preventDefault();
      event.stopPropagation(); // 부모 요소의 drop 이벤트 방지

      try {
        const dragData = JSON.parse(event.dataTransfer.getData("text/plain"));
        console.log("🎯 Retrieved dragData:", dragData);

        const { detail, sourceVehicleId, sourceZoneId } = dragData;

        // Validation 로직
        console.log(
          "🎯 Validating drop:",
          sourceZoneId,
          "→",
          targetVehicle.zone
        );
        if (!this.validateDrop(sourceZoneId, targetVehicle.zone)) {
          console.log("🔴 Validation failed: different zones");
          alert("Cannot move order to different zone!");
          return;
        }

        console.log("🎯 Moving order to specific position:", dropIndex);
        // Order를 특정 위치로 이동
        this.moveOrderToPosition(
          detail,
          sourceVehicleId,
          targetVehicle.id,
          dropIndex
        );

        // 드래그 오버 스타일 제거
        event.currentTarget.classList.remove("row-drag-over");
      } catch (error) {
        console.error("🔴 Row drop failed:", error);
      }
    },
    onDrop(event, targetVehicle) {
      console.log("🟢 onDrop called:", targetVehicle);
      event.preventDefault();

      try {
        const dragDataText = event.dataTransfer.getData("text/plain");
        if (!dragDataText) {
          throw new Error("드래그 데이터를 찾을 수 없습니다.");
        }

        const dragData = JSON.parse(dragDataText);
        console.log("🟢 Retrieved dragData:", dragData);

        const { detail, sourceVehicleId, sourceZoneId } = dragData;

        if (!detail || !sourceVehicleId || !sourceZoneId) {
          throw new Error("필수 드래그 데이터가 누락되었습니다.");
        }

        // Validation 로직
        console.log(
          "🟢 Validating drop:",
          sourceZoneId,
          "→",
          targetVehicle.zone
        );
        if (!this.validateDrop(sourceZoneId, targetVehicle.zone)) {
          this.showErrorMessage("다른 Zone으로는 주문을 이동할 수 없습니다!");
          return;
        }

        console.log(
          "🟢 Moving order from",
          sourceVehicleId,
          "to",
          targetVehicle.id
        );
        // Order 이동 실행
        this.moveOrder(detail, sourceVehicleId, targetVehicle.id);
        this.showSuccessMessage("주문이 성공적으로 이동되었습니다.");
      } catch (error) {
        console.error("🔴 Drop failed:", error);
        this.showErrorMessage(
          `드롭 처리 중 오류가 발생했습니다: ${error.message}`
        );
      } finally {
        this.hideDropIndicator();
        this.cleanupDragStyles();
      }
    },
    validateDrop(sourceZoneId, targetZoneId) {
      // zoneId가 다르면 fail, 그 외는 true
      return sourceZoneId === targetZoneId;
    },
    moveOrder(detail, sourceVehicleId, targetVehicleId, insertIndex = -1) {
      console.log(
        "🚚 Moving order:",
        detail.orderId,
        "from",
        sourceVehicleId,
        "to",
        targetVehicleId,
        insertIndex !== -1 ? `at position ${insertIndex}` : "at end"
      );

      // 원본 vehicle에서 order 제거
      const sourceVehicle = this.selectedVehicles.find(
        (v) => v.id === sourceVehicleId
      );
      let removedFromIndex = -1;
      if (sourceVehicle && sourceVehicle.detailList) {
        const detailIndex = sourceVehicle.detailList.findIndex(
          (d) => d.orderId === detail.orderId && d.locId === detail.locId
        );
        if (detailIndex !== -1) {
          console.log("🚚 Removing from source vehicle at index", detailIndex);
          sourceVehicle.detailList.splice(detailIndex, 1);
          removedFromIndex = detailIndex;
        } else {
          console.log("🔴 Detail not found in source vehicle");
        }
      } else {
        console.log("🔴 Source vehicle not found or has no detailList");
      }

      // 타겟 vehicle에 order 추가
      const targetVehicle = this.selectedVehicles.find(
        (v) => v.id === targetVehicleId
      );
      if (targetVehicle) {
        if (!targetVehicle.detailList) {
          targetVehicle.detailList = [];
        }

        if (insertIndex === -1) {
          // 끝에 추가
          console.log("🚚 Adding to target vehicle at end");
          targetVehicle.detailList.push(detail);
        } else {
          // 특정 위치에 삽입
          let finalInsertIndex = insertIndex;

          // 같은 vehicle 내에서 이동하는 경우 index 조정
          if (sourceVehicleId === targetVehicleId && removedFromIndex !== -1) {
            if (removedFromIndex < insertIndex) {
              finalInsertIndex = insertIndex - 1;
            }
          }

          console.log("🚚 Inserting at index", finalInsertIndex);
          targetVehicle.detailList.splice(finalInsertIndex, 0, detail);
        }
      } else {
        console.log("🔴 Target vehicle not found");
      }

      // Vehicle summary 정보 갱신
      this.updateVehicleSummaries();
    },
    moveOrderToPosition(detail, sourceVehicleId, targetVehicleId, dropIndex) {
      // 통합된 moveOrder 함수 사용
      this.moveOrder(detail, sourceVehicleId, targetVehicleId, dropIndex);
    },
    updateVehicleSummaries() {
      console.log("📊 Updating vehicle summaries");
      // 캐시 초기화
      this.vehicleSummaryCache.clear();

      // 모든 vehicle의 summary 정보를 다시 계산
      this.selectedVehicles.forEach((vehicle) => {
        if (vehicle.detailList) {
          const summary = this.calculateVehicleSummary(vehicle.detailList);
          // Vehicle의 총 weight와 volume 업데이트
          this.$set(vehicle, "totLoadWt", summary.totalLoadWt);
          this.$set(vehicle, "totLoadCbm", summary.totalLoadVol);
          console.log("📊 Updated vehicle", vehicle.id, "summary:", summary);
        }
      });

      // 마지막 업데이트 시간 기록
      this.lastUpdateTime = Date.now();
      console.log("📊 Vehicle summaries updated at:", this.lastUpdateTime);
    },
    // 대안 2+3: 마우스 위치 기반 정확한 드롭 위치 계산
    calculateDropPosition(event, vehicle) {
      const tbody = event.currentTarget;
      // 드롭 인서트 라인이 아닌 실제 데이터 행만 선택
      const dataRows = tbody.querySelectorAll("tr:not(.drop-insert-row)");
      const mouseY = event.clientY;

      this.dropIndicator.show = true;
      this.dropIndicator.targetVehicle = vehicle;
      this.dropIndicator.mouseY = mouseY;

      let insertIndex = 0;

      // 데이터 행이 없는 경우 (빈 vehicle)
      if (dataRows.length === 0) {
        insertIndex = 0;
      } else {
        // 각 행의 위치를 확인하여 마우스 위치에 따른 삽입 인덱스 계산
        for (let i = 0; i < dataRows.length; i++) {
          const rect = dataRows[i].getBoundingClientRect();
          const rowMiddle = rect.top + rect.height / 2;

          if (mouseY < rowMiddle) {
            insertIndex = i;
            break;
          }
          insertIndex = i + 1;
        }
      }

      this.dropIndicator.insertIndex = insertIndex;
      console.log(
        "🎯 Drop position calculated:",
        insertIndex,
        "at Y:",
        mouseY,
        "for vehicle:",
        vehicle.id
      );
    },
    hideDropIndicator() {
      this.dropIndicator.show = false;
      this.dropIndicator.targetVehicle = null;
      this.dropIndicator.insertIndex = -1;
    },
    shouldShowDropLineForIndex(vehicle, afterIndex) {
      if (!this.dropIndicator.show || !this.dropIndicator.targetVehicle) {
        return false;
      }

      if (this.dropIndicator.targetVehicle.id !== vehicle.id) {
        return false;
      }

      // afterIndex가 null인 경우 마지막 위치 체크
      if (afterIndex === null) {
        const vehicleLength = vehicle.detailList
          ? vehicle.detailList.length
          : 0;
        return this.dropIndicator.insertIndex === vehicleLength;
      }

      // 특정 인덱스 뒤 위치 체크
      return this.dropIndicator.insertIndex === afterIndex + 1;
    },
    getDropLinesForVehicle(vehicle) {
      if (!this.dropIndicator.show || !this.dropIndicator.targetVehicle) {
        return [];
      }

      if (this.dropIndicator.targetVehicle.id !== vehicle.id) {
        return [];
      }

      const dropLines = [];
      const vehicleDetails = vehicle.detailList || [];

      // 각 행 뒤의 드롭 라인들 체크
      for (let i = 0; i < vehicleDetails.length; i++) {
        if (this.dropIndicator.insertIndex === i + 1) {
          dropLines.push({
            key: `drop-after-${vehicle.id}-${i}`,
            message: `여기에 드롭하세요 (${i + 2}번째 위치)`,
          });
        }
      }

      return dropLines;
    },
    showErrorMessage(message) {
      // 실제 구현에서는 toast나 notification 라이브러리 사용
      alert(message);
    },
    showSuccessMessage(message) {
      // 실제 구현에서는 toast나 notification 라이브러리 사용
      console.log("✅ Success:", message);
    },
    cleanupDragStyles() {
      // 모든 드래그 관련 스타일 정리
      const draggedElements = document.querySelectorAll('[dragging="true"]');
      draggedElements.forEach((el) => {
        el.style.opacity = "";
        el.style.cursor = "";
        el.removeAttribute("dragging");
      });
    },
    onRowKeyDown(event, detail, vehicle, detailIndex) {
      if (event.key === "Enter" && this.isDragable(detail)) {
        console.log("🟢 onRowKeyDown called for vehicle:", vehicle.id);
        event.preventDefault();
        this.onRowDrop(event, vehicle, detailIndex);
      }
    },
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

.zone-section {
  border: 2px solid #198754;
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: #f8fff9;
  margin-bottom: 2rem;
}

.zone-header {
  border-bottom: 2px solid #198754;
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
}

.zone-summary {
  margin-top: 1rem;
}

.summary-card {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 0.75rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-card small {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.vehicle-section {
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 1rem;
  background-color: #fdfdfe;
}

.vehicle-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}

.table th {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table td {
  font-size: 0.875rem;
  vertical-align: middle;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  font-size: 0.75rem;
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

/* Bootstrap Card Styles */
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

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.text-info {
  color: #0dcaf0 !important;
}

.fw-bold {
  font-weight: 700 !important;
}

.bg-light {
  background-color: #f8f9fa !important;
}

/* Bootstrap Table Styles */
.table {
  --bs-table-bg: transparent;
  --bs-table-accent-bg: transparent;
  --bs-table-striped-bg: rgba(0, 0, 0, 0.05);
  --bs-table-hover-bg: rgba(0, 0, 0, 0.075);
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
  --bs-table-bg: #212529;
  --bs-table-striped-bg: #2c3034;
  --bs-table-hover-bg: #373b3e;
  color: #fff;
  border-color: #373b3e;
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

/* Drag and Drop Styles */
.table .draggable-row {
  cursor: grab !important;
  transition: background-color 0.2s ease, transform 0.1s ease;
  user-select: none;
}

.table .draggable-row:hover {
  background-color: rgba(13, 110, 253, 0.1) !important;
  cursor: grab !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table .draggable-row:active,
.table .draggable-row[dragging="true"] {
  cursor: grabbing !important;
  background-color: rgba(13, 110, 253, 0.2) !important;
  transform: scale(0.98);
}

.table .draggable-row td {
  cursor: grab !important;
}

.table .draggable-row:hover td {
  cursor: grab !important;
}

.table .non-draggable-row {
  cursor: not-allowed !important;
  opacity: 0.6;
  user-select: none;
}

.table .non-draggable-row td {
  cursor: not-allowed !important;
}

.table .non-draggable-row:hover {
  background-color: rgba(220, 53, 69, 0.05) !important;
  cursor: not-allowed !important;
}

.table .non-draggable-row:hover td {
  cursor: not-allowed !important;
}

tbody[draggable="true"] {
  border: 2px dashed #0d6efd;
  background-color: rgba(13, 110, 253, 0.05);
}

/* Drop zone 시각적 피드백 */
tbody:hover {
  background-color: rgba(13, 110, 253, 0.02);
}

/* 추가 커서 강제 적용 */
tr[draggable="true"] {
  cursor: grab !important;
}

tr[draggable="true"]:hover {
  cursor: grab !important;
}

tr[draggable="true"] td {
  cursor: grab !important;
}

tr[draggable="false"],
tr:not([draggable="true"]) {
  cursor: not-allowed !important;
}

tr[draggable="false"] td,
tr:not([draggable="true"]) td {
  cursor: not-allowed !important;
}

/* Drop Zone Styles */
.drop-zone {
  transition: all 0.2s ease;
  border: 2px dashed transparent;
  border-radius: 0.375rem;
  padding: 0.25rem;
}

.drop-zone.drag-over {
  border-color: #0d6efd !important;
  background-color: rgba(13, 110, 253, 0.05) !important;
  box-shadow: 0 0 10px rgba(13, 110, 253, 0.3);
}

.vehicle-header.drop-zone {
  min-height: 60px;
}

.vehicle-header.drop-zone.drag-over {
  transform: scale(1.02);
}

/* Row Drop Zone Styles */
.row-drag-over {
  background-color: rgba(13, 110, 253, 0.15) !important;
  border: 3px solid #0d6efd !important;
  border-radius: 8px;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
  position: relative;
}

.row-drag-over::before {
  content: "← 여기에 드롭됩니다";
  position: absolute;
  right: -150px;
  top: 50%;
  transform: translateY(-50%);
  background: #0d6efd;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

/* 대안 2+3: 정확한 드롭 인서트 라인 */
.drop-insert-row {
  height: 50px !important;
  background: linear-gradient(
    90deg,
    rgba(13, 110, 253, 0.95),
    rgba(25, 135, 84, 0.95)
  ) !important;
  animation: pulseInsert 1.5s infinite;
  position: relative;
}

.drop-insert-cell {
  padding: 0 !important;
  border: none !important;
  position: relative;
  text-align: center;
}

.drop-insert-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: linear-gradient(135deg, #0d6efd, #198754);
  color: white;
  font-weight: bold;
  font-size: 14px;
  border-radius: 25px;
  margin: 3px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.drop-insert-indicator::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shine 2s infinite;
}

.drop-insert-indicator i {
  margin-right: 10px;
  font-size: 18px;
  animation: bounce 1.5s infinite;
}

.drop-text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 700;
}

@keyframes pulseInsert {
  0%,
  100% {
    box-shadow: 0 6px 20px rgba(13, 110, 253, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 8px 30px rgba(25, 135, 84, 0.5);
    transform: scale(1.02);
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
}
</style>
