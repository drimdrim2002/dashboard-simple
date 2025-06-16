<template>
  <div class="unified-table-section ms-3">
    <div class="table-responsive">
      <table
        class="table table-hover table-sm unified-vehicle-table"
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

export default {
  name: "VehicleTable",
  components: {
    VehicleRows,
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.5rem 0.75rem;
  vertical-align: middle;
  background-color: #f8f9fa;
  color: #000000;
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: nowrap;
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
