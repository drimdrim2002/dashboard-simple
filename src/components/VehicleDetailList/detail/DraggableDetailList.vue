<template>
  <draggable
    v-model="mutableDetailList"
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
      v-for="(detail, detailIndex) in mutableDetailList"
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
  data() {
    return {
      mutableDetailList: [], // 드래그 가능한 변경 가능한 배열
    };
  },
  computed: {
    filteredDetailList() {
      if (!this.vehicle.detailList || !Array.isArray(this.vehicle.detailList)) {
        return [];
      }

      // locTcd가 "DEPOT"인 항목 제외
      return this.vehicle.detailList.filter((detail) => {
        return detail.locTcd !== "DEPOT";
      });
    },
  },
  watch: {
    // props 변경 시 로컬 데이터 업데이트
    filteredDetailList: {
      handler(newList) {
        // 각 detail에 원래 차량의 colorCode 저장
        this.mutableDetailList = newList.map((detail) => ({
          ...detail,
          originalColorCode: detail.originalColorCode || this.vehicle.colorCode,
        }));
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 부모 컴포넌트의 실제 데이터와 동기화
    syncToParent() {
      if (!this.vehicle.detailList) return;

      console.log("🔄 부모 데이터와 동기화 시작");
      console.log(
        "🔄 현재 mutableDetailList:",
        this.mutableDetailList.map(
          (d) => `${d.orderId || d.locId}(${d.originalColorCode})`
        )
      );

      // DEPOT 항목은 유지하고 나머지만 업데이트
      const depotItems = this.vehicle.detailList.filter(
        (detail) => detail.locTcd === "DEPOT"
      );

      // mutableDetailList의 각 항목에 originalColorCode가 없으면 현재 차량의 colorCode로 설정
      const processedDetailList = this.mutableDetailList.map((detail) => ({
        ...detail,
        originalColorCode: detail.originalColorCode || this.vehicle.colorCode,
      }));

      const updatedDetailList = [...depotItems, ...processedDetailList];

      // stopSeqNo는 원래 값 유지 (재조정하지 않음)

      // Vue 2의 반응성을 위해 배열을 완전히 교체
      this.vehicle.detailList.splice(
        0,
        this.vehicle.detailList.length,
        ...updatedDetailList
      );

      console.log("🔄 동기화 완료:", updatedDetailList.length, "개 항목");
      console.log(
        "🔄 업데이트된 순서:",
        updatedDetailList.map((d) => `${d.orderId || d.locId}(${d.stopSeqNo})`)
      );

      // 데이터 변경을 상위 컴포넌트에 알림
      this.$emit("data-changed");
    },

    // dragMixin에서 호출하는 updateVehicleSummaries
    updateVehicleSummaries() {
      console.log("📊 DraggableDetailList에서 Vehicle summary 업데이트 요청");

      // 먼저 부모 데이터와 동기화
      this.$nextTick(() => {
        this.syncToParent();
        // 그 다음 부모 컴포넌트에 계산 업데이트 요청
        this.$emit("update-vehicle-summary", this.vehicle.id);
      });
    },
  },
  emits: ["update-vehicle-summary", "data-changed"],
};
</script>

<style scoped>
/* Draggable 관련 스타일은 전역으로 처리되므로 여기서는 최소한만 정의 */
</style>
