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
              <!-- <div v-if="isZoneExpanded(zoneId)" class="zone-summary mt-3">
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
              </div> -->
            </div>

            <!-- 통합 테이블 (Tree 구조) -->
            <div
              v-if="isZoneExpanded(zoneId)"
              class="unified-table-section ms-3"
            >
              <div class="table-responsive">
                <table
                  class="table table-striped table-hover table-sm unified-vehicle-table"
                  :class="{ 'dragging-active': isDragging }"
                >
                  <thead class="table-dark sticky-top">
                    <tr>
                      <th scope="col" class="drag-handle-header">
                        <i class="bi bi-arrows-move text-light"></i>
                      </th>
                      <th scope="col" class="tree-col">Tree</th>
                      <th scope="col">#</th>
                      <th scope="col">Vehicle ID</th>
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
                  <tbody>
                    <template v-for="vehicle in zoneData.vehicles">
                      <!-- Vehicle 헤더 행 -->
                      <tr
                        :key="`vehicle-header-${vehicle.id}`"
                        class="vehicle-header-row"
                        @click="toggleVehicleDetails(vehicle.id)"
                        style="cursor: pointer"
                      >
                        <td></td>
                        <td class="vehicle-tree-cell">
                          <div class="d-flex align-items-center">
                            <i
                              :class="
                                isVehicleExpanded(vehicle.id)
                                  ? 'bi bi-chevron-down'
                                  : 'bi bi-chevron-right'
                              "
                              class="tree-toggle me-2 text-primary"
                            ></i>
                            <i class="bi bi-truck text-primary me-2"></i>
                            <strong class="text-primary"
                              >{{ vehicle.name }} ({{ vehicle.type }})</strong
                            >
                            <span
                              v-if="
                                vehicle.detailList &&
                                vehicle.detailList.length > 0
                              "
                              class="badge bg-info ms-2"
                            >
                              {{ vehicle.detailList.length }}
                            </span>
                            <span
                              v-if="isDragging"
                              class="badge bg-light text-muted ms-2"
                            >
                              드롭 가능
                            </span>
                          </div>
                        </td>
                        <td colspan="4" class="text-muted small"></td>
                        <td class="text-end fw-bold">
                          {{
                            formatDecimal(
                              calculateVehicleSummary(vehicle.detailList)
                                .totalLoadWt,
                              1
                            )
                          }}
                        </td>
                        <td class="text-end fw-bold">
                          {{
                            formatDecimal(
                              calculateVehicleSummary(vehicle.detailList)
                                .totalLoadVol,
                              1
                            )
                          }}
                        </td>
                        <td class="text-end fw-bold">
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

                      <!-- Vehicle Details - 빈 데이터 경우 -->
                      <tr
                        v-if="
                          isVehicleExpanded(vehicle.id) &&
                          (!vehicle.detailList ||
                            vehicle.detailList.length === 0)
                        "
                        :key="`vehicle-empty-${vehicle.id}`"
                      >
                        <td></td>
                        <td class="text-muted small ps-4">
                          <i class="bi bi-dash text-muted me-1"></i>
                          이 vehicle에 대한 detail 정보가 없습니다.
                        </td>
                        <td colspan="11"></td>
                      </tr>

                      <!-- Vehicle Details (Vue.Draggable 사용) -->
                      <draggable
                        v-if="
                          isVehicleExpanded(vehicle.id) &&
                          vehicle.detailList &&
                          vehicle.detailList.length > 0
                        "
                        :key="`vehicle-draggable-${vehicle.id}`"
                        :list="vehicle.detailList"
                        :group="{
                          name: `zone-${vehicle.zone}`,
                          pull: true,
                          put: true,
                        }"
                        :disabled="false"
                        :animation="200"
                        :ghost-class="'sortable-ghost'"
                        :chosen-class="'sortable-chosen'"
                        :drag-class="'sortable-drag'"
                        :force-fallback="false"
                        :fallback-class="'sortable-fallback'"
                        :scroll="true"
                        :scroll-sensitivity="100"
                        :scroll-speed="10"
                        :bubble="false"
                        :move="onMove"
                        @start="onDragStart"
                        @end="onDragEnd"
                        @add="onAdd"
                        @update="onUpdate"
                        @sort="onSort"
                        @remove="onRemove"
                        @change="onChange"
                        tag="div"
                        style="display: contents"
                        :data-vehicle-id="vehicle.id"
                        :data-zone-id="vehicle.zone"
                      >
                        <tr
                          v-for="(detail, detailIndex) in vehicle.detailList"
                          :key="`${vehicle.id}-${
                            detail.orderId || detail.locId
                          }-${detailIndex}`"
                          :class="{
                            'draggable-row': isDragable(detail),
                            'non-draggable-row': !isDragable(detail),
                            'detail-row': true,
                          }"
                          :data-order-id="detail.orderId || detail.locId"
                          :data-vehicle-id="vehicle.id"
                          :data-zone-id="vehicle.zone"
                        >
                          <!-- 드래그 핸들 -->
                          <td class="drag-handle-cell">
                            <div
                              v-if="isDragable(detail)"
                              class="drag-handle"
                              :title="'드래그하여 순서 변경'"
                            >
                              <i class="bi bi-grip-vertical"></i>
                            </div>
                            <div
                              v-else
                              class="drag-disabled"
                              title="드래그 불가능 (첫 번째 위치)"
                            >
                              <i class="bi bi-lock-fill"></i>
                            </div>
                          </td>

                          <!-- Tree 구조 표시 -->
                          <td class="tree-cell">
                            <div class="tree-item ps-4">
                              <i class="bi bi-dash text-muted me-1"></i>
                            </div>
                          </td>

                          <!-- 순번 -->
                          <td class="seq-number">{{ detailIndex + 1 }}</td>

                          <!-- Vehicle ID -->
                          <td class="vhcl-id">
                            {{ detail.vhclId }}
                          </td>

                          <!-- Order ID -->
                          <td>
                            {{ detail.orderId || detail.locId }}
                          </td>

                          <!-- Location ID -->
                          <td>{{ detail.locId }}</td>

                          <!-- Weight -->
                          <td class="text-end">{{ detail.loadWt }}</td>

                          <!-- Volume -->
                          <td class="text-end">{{ detail.loadVol }}</td>

                          <!-- Distance -->
                          <td class="text-end">
                            {{ formatDistanceKM(detail.distcVal) }}
                          </td>

                          <!-- Duration -->
                          <td>
                            {{ formatSecondsToTime(detail.trnsPeridVal) }}
                          </td>

                          <!-- Request Time -->
                          <td>{{ detail.reqDate }}</td>

                          <!-- Customer Time -->
                          <td>
                            {{ formatTime24(detail.custOpenTime) }} ~
                            {{ formatTime24(detail.custCloseTime) }}
                          </td>

                          <!-- Arrival Time -->
                          <td>{{ detail.arrDtm }}</td>

                          <!-- Departure Time -->
                          <td>{{ detail.depDtm }}</td>
                        </tr>
                      </draggable>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "VehicleDetailList",
  components: {
    draggable,
  },
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

      // 드래그 상태 관리
      isDragging: false,
      draggedItem: null,

      // 성능 최적화용 캐시
      vehicleSummaryCache: new Map(),
      lastUpdateTime: 0,
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
    // Vue.Draggable 관련 메서드들
    isDragable(detail) {
      // stopSeqNo가 1보다 크면 드래그 가능 (첫 번째 위치는 고정)
      return Number(detail.stopSeqNo || 0) > 1;
    },

    onMove(evt) {
      // 드래그 이동 가능 여부 검증
      const draggedItem = evt.draggedContext.element;
      const relatedItem = evt.relatedContext.element;

      // 소스와 타겟 정보 추출
      const fromElement = evt.from;
      const toElement = evt.to;
      const fromZoneId = fromElement?.dataset?.zoneId;
      const toZoneId = toElement?.dataset?.zoneId;
      const fromVehicleId = fromElement?.dataset?.vehicleId;
      const toVehicleId = toElement?.dataset?.vehicleId;

      console.log("🔍 onMove 검증:", {
        draggedItem: draggedItem?.orderId || draggedItem?.locId,
        isDragable: this.isDragable(draggedItem),
        fromZone: fromZoneId,
        toZone: toZoneId,
        fromVehicle: fromVehicleId,
        toVehicle: toVehicleId,
        relatedItem: relatedItem?.orderId || relatedItem?.locId,
      });

      // 1. 드래그 가능한 항목인지 확인 (첫 번째 위치는 이동 불가)
      if (!this.isDragable(draggedItem)) {
        console.log(
          "🚫 드래그 불가능한 항목:",
          draggedItem?.orderId || draggedItem?.locId
        );
        this.showMessage(
          "첫 번째 위치의 항목은 이동할 수 없습니다.",
          "warning"
        );
        return false;
      }

      // 2. Zone 간 이동 제한 (같은 zone 내에서만 이동 가능)
      if (fromZoneId && toZoneId && fromZoneId !== toZoneId) {
        console.log("🚫 다른 Zone으로 이동 시도:", fromZoneId, "→", toZoneId);
        this.showMessage(
          "같은 Zone 내의 Vehicle로만 이동할 수 있습니다.",
          "warning"
        );
        return false;
      }

      // 3. 이동 허용
      if (fromVehicleId !== toVehicleId) {
        console.log(
          "✅ Vehicle 간 이동 허용:",
          fromVehicleId,
          "→",
          toVehicleId
        );
      } else {
        console.log("✅ 같은 Vehicle 내 순서 변경 허용");
      }

      return true;
    },
    onDragStart(evt) {
      console.log("🔵 드래그 시작:", evt);
      this.isDragging = true;

      // 드래그되는 항목 정보 저장
      if (evt.item && evt.item.dataset) {
        this.draggedItem = {
          orderId: evt.item.dataset.orderId,
          vehicleId: evt.item.dataset.vehicleId,
          zoneId: evt.item.dataset.zoneId,
        };
        console.log("🔵 드래그 항목:", this.draggedItem);
        this.showMessage(
          `주문 ${this.draggedItem.orderId} 드래그 시작`,
          "info"
        );
      }
    },

    onDragEnd(evt) {
      console.log("🟢 드래그 종료:", evt);
      this.isDragging = false;

      const oldIndex = evt.oldIndex;
      const newIndex = evt.newIndex;

      if (oldIndex !== newIndex) {
        console.log(`🟢 순서 변경: ${oldIndex} → ${newIndex}`);
        this.updateVehicleSummaries();
        this.showMessage(
          `주문 순서가 변경되었습니다 (${oldIndex + 1} → ${newIndex + 1})`,
          "success"
        );
      }

      // 드래그 상태 초기화
      this.draggedItem = null;
    },

    onAdd(evt) {
      console.log("🟡 항목 추가:", evt);
      // 다른 vehicle에서 항목이 추가된 경우
      this.updateVehicleSummaries();
    },

    onUpdate(evt) {
      console.log("🔄 항목 업데이트:", evt);
      // 같은 vehicle 내에서 순서 변경된 경우
      this.updateVehicleSummaries();
    },

    onSort(evt) {
      console.log("🔀 정렬 완료:", evt);
      // 정렬이 완료된 경우
      this.updateVehicleSummaries();
    },

    onRemove(evt) {
      console.log("🗑️ 항목 제거:", evt);
      // 다른 vehicle로 항목이 이동된 경우
      this.updateVehicleSummaries();
    },

    onChange(evt) {
      console.log("🔄 변경 이벤트:", evt);

      if (evt.added) {
        console.log(
          "➕ 항목 추가됨:",
          evt.added.element?.orderId || evt.added.element?.locId
        );
        this.showMessage(
          `주문 ${
            evt.added.element?.orderId || evt.added.element?.locId
          }이(가) 이동되었습니다.`,
          "success"
        );
      }

      if (evt.removed) {
        console.log(
          "➖ 항목 제거됨:",
          evt.removed.element?.orderId || evt.removed.element?.locId
        );
      }

      if (evt.moved) {
        console.log(
          "🔀 항목 이동됨:",
          evt.moved.element?.orderId || evt.moved.element?.locId
        );
        this.showMessage(`주문 순서가 변경되었습니다.`, "info");
      }

      // Vehicle summary 업데이트
      this.updateVehicleSummaries();
    },
    // 업데이트 메서드
    updateVehicleSummaries() {
      console.log("📊 Vehicle summary 업데이트 중...");
      this.vehicleSummaryCache.clear();

      this.selectedVehicles.forEach((vehicle) => {
        if (vehicle.detailList) {
          const summary = this.calculateVehicleSummary(vehicle.detailList);
          this.$set(vehicle, "totLoadWt", summary.totalLoadWt);
          this.$set(vehicle, "totLoadCbm", summary.totalLoadVol);
          console.log("📊 Vehicle", vehicle.id, "summary 업데이트:", summary);
        }
      });

      this.lastUpdateTime = Date.now();
      console.log("📊 Summary 업데이트 완료:", this.lastUpdateTime);
    },

    // 알림 메서드들
    showMessage(message, type = "info") {
      console.log(`${this.getLogIcon(type)} ${message}`);

      // 실제 구현에서는 toast나 notification 라이브러리 사용
      // 임시로 console과 간단한 alert 사용
      if (type === "error" || type === "warning") {
        // 중요한 메시지는 alert로 표시
        alert(message);
      }
    },

    getLogIcon(type) {
      const icons = {
        info: "ℹ️",
        success: "✅",
        warning: "⚠️",
        error: "❌",
      };
      return icons[type] || "ℹ️";
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

/* 드래그 핸들 스타일 */
.drag-handle-header {
  width: 40px;
  text-align: center;
  padding: 0.5rem 0.25rem !important;
}

.drag-handle-cell {
  width: 40px;
  text-align: center;
  padding: 0.5rem 0.25rem !important;
  vertical-align: middle;
}

.drag-handle {
  cursor: grab;
  color: #6c757d;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.drag-handle:hover {
  color: #0d6efd;
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-disabled {
  cursor: not-allowed;
  color: #dc3545;
  padding: 0.25rem;
  opacity: 0.6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
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
  border-top: 2px solid #0d6efd;
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
  border-top: 2px solid #0d6efd;
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
