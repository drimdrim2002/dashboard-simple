/**
 * 드래그 & 드롭 관련 Mixin
 * VehicleDetailList에서 사용하는 Vue.Draggable 기능을 제공합니다.
 */

import { NOTIFICATION_TYPES, DEFAULT_MESSAGES } from "../utils/constants";

export const dragMixin = {
  data() {
    return {
      // 드래그 상태 관리
      isDragging: false,
      draggedItem: null,
    };
  },

  methods: {
    /**
     * 드래그 가능 여부 확인
     * @param {Object} detail - 드래그할 상세 항목
     * @returns {boolean} 드래그 가능 여부
     */
    isDragable(detail) {
      // stopSeqNo가 1보다 크면 드래그 가능 (첫 번째 위치는 고정)
      return Number(detail.stopSeqNo || 0) > 1;
    },

    /**
     * 드래그 이동 검증 핸들러
     * @param {Object} evt - Vue.Draggable 이벤트 객체
     * @returns {boolean} 이동 허용 여부
     */
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
        // 이벤트 루프 차단 방지를 위해 nextTick으로 지연 실행
        this.$nextTick(() => {
          this.showMessage(
            DEFAULT_MESSAGES.DRAG_NOT_ALLOWED,
            NOTIFICATION_TYPES.WARNING
          );
        });
        return false;
      }

      // 2. Zone 간 이동 제한 (같은 zone 내에서만 이동 가능)
      if (fromZoneId && toZoneId && fromZoneId !== toZoneId) {
        console.log("🚫 다른 Zone으로 이동 시도:", fromZoneId, "→", toZoneId);
        // 이벤트 루프 차단 방지를 위해 nextTick으로 지연 실행
        this.$nextTick(() => {
          this.showMessage(
            DEFAULT_MESSAGES.ZONE_RESTRICTION,
            NOTIFICATION_TYPES.WARNING
          );
        });
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

    /**
     * 드래그 시작 핸들러
     * @param {Object} evt - Vue.Draggable 이벤트 객체
     */
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
          `주문 ${this.draggedItem.orderId} ${DEFAULT_MESSAGES.DRAG_START}`,
          NOTIFICATION_TYPES.INFO
        );
      }
    },

    /**
     * 드래그 종료 핸들러
     * @param {Object} evt - Vue.Draggable 이벤트 객체
     */
    onDragEnd(evt) {
      console.log("🟢 드래그 종료:", evt);

      // 드래그 상태 초기화를 즉시 실행
      this.isDragging = false;
      this.draggedItem = null;

      const oldIndex = evt.oldIndex;
      const newIndex = evt.newIndex;

      if (oldIndex !== newIndex) {
        console.log(`🟢 순서 변경: ${oldIndex} → ${newIndex}`);
        this.updateVehicleSummaries();
        this.showMessage(
          `${DEFAULT_MESSAGES.ORDER_CHANGED} (${oldIndex + 1} → ${
            newIndex + 1
          })`,
          NOTIFICATION_TYPES.SUCCESS
        );
      }

      // 이벤트 시스템 정리를 위해 nextTick에서 한 번 더 확인
      this.$nextTick(() => {
        // 혹시 모를 상태 불일치 방지
        if (this.isDragging) {
          this.isDragging = false;
          console.log("🔧 드래그 상태 강제 초기화");
        }
      });
    },

    /**
     * 항목 추가 핸들러
     * @param {Object} evt - Vue.Draggable 이벤트 객체
     */
    onAdd(evt) {
      console.log("🟡 항목 추가:", evt);
      // 다른 vehicle에서 항목이 추가된 경우
      this.updateVehicleSummaries();
    },

    /**
     * 항목 업데이트 핸들러
     * @param {Object} evt - Vue.Draggable 이벤트 객체
     */
    onUpdate(evt) {
      console.log("🔄 항목 업데이트:", evt);
      // 같은 vehicle 내에서 순서 변경된 경우
      this.updateVehicleSummaries();
    },

    /**
     * 정렬 완료 핸들러
     * @param {Object} evt - Vue.Draggable 이벤트 객체
     */
    onSort(evt) {
      console.log("🔀 정렬 완료:", evt);
      // 정렬이 완료된 경우
      this.updateVehicleSummaries();
    },

    /**
     * 항목 제거 핸들러
     * @param {Object} evt - Vue.Draggable 이벤트 객체
     */
    onRemove(evt) {
      console.log("🗑️ 항목 제거:", evt);
      // 다른 vehicle로 항목이 이동된 경우
      this.updateVehicleSummaries();
    },

    /**
     * 변경 이벤트 핸들러
     * @param {Object} evt - Vue.Draggable 이벤트 객체
     */
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
          NOTIFICATION_TYPES.SUCCESS
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
        this.showMessage(
          `주문 순서가 변경되었습니다.`,
          NOTIFICATION_TYPES.INFO
        );
      }

      // Vehicle summary 업데이트
      this.updateVehicleSummaries();
    },
  },
};

/**
 * 기본 내보내기 (default export)
 */
export default dragMixin;
