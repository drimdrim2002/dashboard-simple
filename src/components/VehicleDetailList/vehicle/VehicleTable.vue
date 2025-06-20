<template>
  <div class="unified-table-section ms-3">
    <div class="table-responsive">
      <table
        class="table table-hover table-sm unified-vehicle-table"
        :class="{ 'dragging-active': isDragging }"
      >
        <thead class="table-dark sticky-top">
          <tr>
            <th
              v-for="column in headerColumns"
              :key="column.key"
              scope="col"
              :class="column.className"
              :style="{ width: column.width }"
            >
              <i v-if="column.icon" :class="column.icon + ' text-light'"></i>
              <span v-else v-html="column.title"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <VehicleRows
            v-for="vehicle in zoneData.vehicles"
            :key="`vehicle-${vehicle.id}`"
            :vehicle="vehicle"
            :zone-id="zoneId"
            :is-dragging="isDragging"
            :is-expanded="isVehicleExpanded(vehicle.id)"
            @toggle-vehicle-details="$emit('toggle-vehicle-details', $event)"
            @update-vehicle-summary="$emit('update-vehicle-summary', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import VehicleRows from "./VehicleRows.vue";
import { getHeaderColumns } from "../shared/config/tableColumns";

export default {
  name: "VehicleTable",
  components: {
    VehicleRows,
  },
  computed: {
    headerColumns() {
      return getHeaderColumns();
    },
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
    isDragging: {
      type: Boolean,
      default: false,
    },
    isVehicleExpanded: {
      type: Function,
      required: true,
    },
  },
  emits: ["toggle-vehicle-details", "update-vehicle-summary"],
};
</script>

<style scoped>
.table-responsive {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #fff;
}

/* 스크롤바 스타일 */
.table-responsive::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.table thead th {
  border-top: none;
  border-bottom: 1px solid #dee2e6;
  font-weight: 600;
  font-size: 0.85rem;
  /* text-transform: uppercase; */ /* 헤더 대문자 변환 비활성화 */
  letter-spacing: 0.5px;
  padding: 0.5rem 0.75rem;
  vertical-align: middle;
  text-align: center !important; /* 헤더 텍스트 가운데 정렬 (우선순위 높임) */
  background-color: #f8f9fa;
  color: #000000;
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: normal; /* 줄바꿈 허용 */
  line-height: 1.2; /* 줄 간격 조정 */
}

.table tbody tr {
  border-bottom: 1px solid #f2f2f2;
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.table td {
  padding: 0.75rem 1rem;
  vertical-align: middle;
  border-top: none;
  font-size: 0.8rem;
}

/* 드래그 핸들 스타일 */
.drag-handle-header {
  width: 40px;
  text-align: center;
  padding: 0.5rem 0.25rem !important;
}

.unified-vehicle-table.dragging-active {
  user-select: none;
}
</style>
