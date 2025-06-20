<template>
  <tbody class="vehicle-rows">
    <!-- Vehicle 헤더 행 -->
    <tr
      class="vehicle-header-row"
      @click="toggleVehicleDetails"
      style="cursor: pointer"
    >
      <td></td>
      <td class="vehicle-tree-cell">
        <div class="d-flex align-items-center">
          <i
            :class="isExpanded ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"
            class="tree-toggle me-2 text-primary"
          ></i>
          <i class="bi bi-truck text-primary me-2"></i>
          <span
            class="vehicle-id-text"
            :style="{ color: vehicle.colorCode || '#0d6efd' }"
            >{{ vehicle.name }} ({{ vehicle.type }})</span
          >
          <span
            v-if="vehicle.detailList && vehicle.detailList.length > 0"
            class="badge bg-info ms-2"
          >
            {{ vehicle.detailList.length }}
          </span>
          <span v-if="isDragging" class="badge bg-light text-muted ms-2">
            드롭 가능
          </span>
        </div>
      </td>
      <!-- Seq 컬럼 -->
      <td class="text-center">
        {{ (vehicle.detailList ? vehicle.detailList.length : 0) - 1 }}
      </td>
      <!-- Vehicle ID 컬럼 (숨김 처리) -->
      <td style="display: none"></td>
      <!-- Order ID 컬럼 -->
      <td class="text-center">
        {{ getOrderIdCount(vehicle.detailList) }}
      </td>
      <!-- Location ID 컬럼 -->
      <td class="text-center">
        {{ getLocIdCount(vehicle.detailList) }}
      </td>
      <td class="text-end fw-bold">
        {{
          formatDecimal(
            calculateVehicleSummary(vehicle.detailList).totalLoadWt,
            1
          )
        }}
      </td>
      <td class="text-end fw-bold">
        {{
          formatDecimal(
            calculateVehicleSummary(vehicle.detailList).totalLoadVol,
            1
          )
        }}
      </td>
      <td class="text-end fw-bold">
        {{
          formatDistanceKM(
            calculateVehicleTotal(vehicle.detailList, "distcVal")
          )
        }}
      </td>
      <td class="text-end fw-bold">
        {{
          formatSecondsToTime(
            calculateVehicleTotal(vehicle.detailList, "trnsPeridVal")
          )
        }}
      </td>
      <td colspan="2"></td>
    </tr>

    <!-- Vehicle Details - 빈 데이터 경우 -->
    <tr
      v-if="
        isExpanded && (!vehicle.detailList || vehicle.detailList.length === 0)
      "
    >
      <td></td>
      <td class="text-muted small ps-4">
        <i class="bi bi-dash text-muted me-1"></i>
        이 vehicle에 대한 detail 정보가 없습니다.
      </td>
      <td colspan="9"></td>
    </tr>

    <!-- Vehicle Details (Vue.Draggable 사용) -->
    <DraggableDetailList
      v-if="isExpanded && vehicle.detailList && vehicle.detailList.length > 0"
      :vehicle="vehicle"
      :zone-id="zoneId"
      @update-vehicle-summary="$emit('update-vehicle-summary', $event)"
    />
  </tbody>
</template>

<script>
import DraggableDetailList from "../detail/DraggableDetailList.vue";
import {
  formatDecimal,
  formatDistanceKM,
  formatSecondsToTime,
} from "@/utils/formatUtils";
import { calculateVehicleTotal } from "../shared/utils/calculationUtils";
import { calculationMixin } from "../shared/mixins/calculationMixin";

export default {
  name: "VehicleSummary",
  mixins: [calculationMixin],
  components: {
    DraggableDetailList,
  },
  props: {
    vehicle: {
      type: Object,
      required: true,
    },
    zoneId: {
      type: String,
      required: true,
    },
    isDragging: {
      type: Boolean,
      default: false,
    },
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggle-vehicle-details", "update-vehicle-summary"],
  methods: {
    formatDecimal,
    formatDistanceKM,
    formatSecondsToTime,
    calculateVehicleTotal,
    getOrderIdCount(detailList) {
      if (!detailList || !Array.isArray(detailList)) return 0;
      return detailList.filter((detail) => detail.orderId).length;
    },
    getLocIdCount(detailList) {
      if (!detailList || !Array.isArray(detailList)) return 0;
      return detailList.filter((detail) => detail.locId).length;
    },
    toggleVehicleDetails() {
      // 드래그 중일 때는 클릭 이벤트 무시
      if (this.isDragging) {
        console.log("🚫 드래그 중이므로 클릭 무시:", this.vehicle.id);
        return;
      }

      console.log("🚛 VehicleSummary에서 토글 클릭:", this.vehicle.id);
      console.log("현재 isExpanded 상태:", this.isExpanded);
      this.$emit("toggle-vehicle-details", this.vehicle.id);
    },
  },
};
</script>

<style scoped>
.vehicle-rows {
  display: contents;
}

.vehicle-header-row {
  background-color: #f8f9fa;
  font-weight: 600;
}

.vehicle-header-row:hover {
  background-color: #e9ecef !important;
}

.vehicle-tree-cell {
  padding-left: 0.5rem;
}

.tree-toggle {
  font-size: 0.9rem;
  transition: transform 0.2s ease;
}

.vehicle-header-row:hover .tree-toggle {
  transform: scale(1.1);
}

.badge {
  font-size: 0.75rem;
}

.vehicle-id-text {
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
