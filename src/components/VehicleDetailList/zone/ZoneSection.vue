<template>
  <div class="zone-section mb-4">
    <div class="zone-header mb-3">
      <!-- 기본 Zone 정보 + 토글 버튼 -->
      <div
        class="zone-basic-info"
        @click="toggleZoneDetails"
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
              Weight: {{ formatWeight(zoneData.summary.totLoadWt) }} | Volume:
              {{ formatVolume(zoneData.summary.totLoadCbm) }} | Cost:
              {{ Number(zoneData.summary.totCostAmt).toLocaleString() }}
              <span class="expand-hint ms-1"
                >({{
                  isExpanded ? "Click to collapse" : "Click to expand"
                }})</span
              >
            </span>
          </span>
          <span class="toggle-icon">
            <i
              :class="isExpanded ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"
            ></i>
          </span>
        </h5>
      </div>
    </div>

    <!-- 통합 테이블 (Tree 구조) -->
    <VehicleTable
      v-if="isExpanded"
      :zone-id="zoneId"
      :zone-data="zoneData"
      :is-dragging="isDragging"
      :is-vehicle-expanded="isVehicleExpanded"
      @toggle-vehicle-details="$emit('toggle-vehicle-details', $event)"
      @update-vehicle-summary="$emit('update-vehicle-summary', $event)"
    />
  </div>
</template>

<script>
import VehicleTable from "../vehicle/VehicleTable.vue";
import { formatWeight, formatVolume } from "@/utils/formatUtils";

export default {
  name: "ZoneSection",
  components: {
    VehicleTable,
  },
  props: {
    zoneId: {
      type: String,
      required: true,
    },
    zoneData: {
      type: Object,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      default: false,
    },
    isDragging: {
      type: Boolean,
      default: false,
    },
    isVehicleExpanded: {
      type: Function,
      required: true,
    },
  },
  emits: [
    "toggle-zone-details",
    "toggle-vehicle-details",
    "update-vehicle-summary",
  ],
  methods: {
    formatWeight,
    formatVolume,
    toggleZoneDetails() {
      this.$emit("toggle-zone-details", this.zoneId);
    },
  },
};
</script>

<style scoped>
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

.expand-hint {
  font-size: 0.8rem;
  opacity: 0.7;
}

.toggle-icon {
  transition: transform 0.2s ease;
}

.zone-basic-info:hover .toggle-icon {
  transform: scale(1.1);
}
</style>
