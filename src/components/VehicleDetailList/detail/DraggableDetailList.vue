<template>
  <draggable
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
    <VehicleDetailItem
      v-for="(detail, detailIndex) in vehicle.detailList"
      :key="`${vehicle.id}-${detail.orderId || detail.locId}-${detailIndex}`"
      :detail="detail"
      :detail-index="detailIndex"
      :vehicle="vehicle"
      :zone-id="zoneId"
    />
  </draggable>
</template>

<script>
import draggable from "vuedraggable";
import VehicleDetailItem from "./VehicleDetailItem.vue";
import { dragMixin } from "../shared/mixins/dragMixin";
import { notificationMixin } from "../shared/mixins/notificationMixin";

export default {
  name: "DraggableDetailList",
  mixins: [dragMixin, notificationMixin],
  components: {
    draggable,
    VehicleDetailItem,
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
  },
  methods: {
    // dragMixin에서 호출하는 updateVehicleSummaries를 빈 함수로 정의
    // 실제 계산은 부모 컴포넌트에서 담당
    updateVehicleSummaries() {
      console.log("📊 DraggableDetailList에서 Vehicle summary 업데이트 요청");
      // 부모 컴포넌트에 계산 업데이트 요청
      this.$emit("update-vehicle-summary", this.vehicle.id);
    },
  },
};
</script>

<style scoped>
/* Draggable 관련 스타일은 전역으로 처리되므로 여기서는 최소한만 정의 */
</style>
