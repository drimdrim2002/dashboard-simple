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
      :vehicle="vehicle"
    />
  </tr>
</template>

<script>
import TableCell from "../shared/components/TableCell.vue";
import { getDataColumns } from "../shared/config/tableColumns";
import { dragMixin } from "../shared/mixins/dragMixin";

export default {
  name: "VehicleDetailItem",
  mixins: [dragMixin],
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
    // isDragable은 dragMixin에서 제공됩니다
    // dragMixin에서 요구하는 updateVehicleSummaries 메서드를 빈 함수로 정의
    updateVehicleSummaries() {
      // VehicleDetailItem에서는 직접 계산 업데이트를 하지 않음
      console.log(
        "📊 VehicleDetailItem에서 Vehicle summary 업데이트 요청 무시"
      );
    },
  },
};
</script>

<style scoped>
.detail-row {
  font-size: 0.75rem; /* 세부 항목 글자 크기 축소 */
}

.detail-row td {
  padding: 0.3rem 0.4rem; /* 세부 항목 행 높이 더욱 축소 */
}

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
