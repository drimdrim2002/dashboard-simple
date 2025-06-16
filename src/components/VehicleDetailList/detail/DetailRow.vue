<template>
  <tr
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
      <div v-else class="drag-disabled" title="드래그 불가능 (첫 번째 위치)">
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
</template>

<script>
import {
  formatDistanceKM,
  formatSecondsToTime,
  formatTime24,
} from "../shared/utils/formatUtils";

export default {
  name: "DetailRow",
  props: {
    detail: {
      type: Object,
      required: true,
    },
    detailIndex: {
      type: Number,
      required: true,
    },
    vehicle: {
      type: Object,
      required: true,
    },
    zoneId: {
      type: String,
      required: true,
    },
  },
  methods: {
    formatDistanceKM,
    formatSecondsToTime,
    formatTime24,
    isDragable(detail) {
      // stopSeqNo가 1보다 크면 드래그 가능 (첫 번째 위치는 고정)
      return Number(detail.stopSeqNo || 0) > 1;
    },
  },
};
</script>

<style scoped>
.detail-row:hover {
  background-color: #f8f9fa;
}

.draggable-row {
  cursor: grab;
}

.draggable-row:active {
  cursor: grabbing;
}

.non-draggable-row {
  background-color: #f9f9f9;
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
  font-size: 0.9rem;
}

.tree-cell {
  padding-left: 1rem;
}

.tree-item {
  font-size: 0.85rem;
}

.seq-number {
  font-weight: 600;
  text-align: center;
}

.vhcl-id {
  font-family: "Courier New", monospace;
  font-size: 0.85rem;
}

.text-end {
  text-align: right;
}
</style>
