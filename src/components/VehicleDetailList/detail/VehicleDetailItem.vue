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
    <TableCell
      v-for="column in dataColumns"
      :key="column.key"
      :column="column"
      :data="detail"
      :row-index="detailIndex"
      :is-dragable="isDragable(detail)"
    />
  </tr>
</template>

<script>
import TableCell from "../shared/components/TableCell.vue";
import { getDataColumns } from "../shared/config/tableColumns";

export default {
  name: "VehicleDetailItem",
  components: {
    TableCell,
  },
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
  computed: {
    dataColumns() {
      return getDataColumns();
    },
  },
  methods: {
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
</style>
