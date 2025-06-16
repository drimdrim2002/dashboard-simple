/**
 * 계산 및 업데이트 관련 Mixin
 * VehicleDetailList에서 사용하는 Vehicle Summary 계산 기능을 제공합니다.
 */

import {
  calculateVehicleSummaryWithCache,
  VehicleSummaryCache,
} from "../utils/calculationUtils";

import { DEFAULT_CONFIG } from "../utils/constants";

export const calculationMixin = {
  data() {
    return {
      // 성능 최적화용 캐시
      vehicleSummaryCache: new VehicleSummaryCache(
        DEFAULT_CONFIG.CACHE_MAX_SIZE
      ),
      lastUpdateTime: 0,
    };
  },

  methods: {
    /**
     * Vehicle의 상세 목록을 기반으로 요약 정보 계산
     * @param {Array} detailList - Vehicle의 상세 목록
     * @returns {Object} 계산된 요약 정보
     */
    calculateVehicleSummary(detailList) {
      return calculateVehicleSummaryWithCache(
        detailList,
        this.vehicleSummaryCache
      );
    },

    /**
     * 모든 Vehicle의 요약 정보를 업데이트
     * 드래그 & 드롭 후 호출되어 전체 요약 정보를 갱신합니다.
     */
    updateVehicleSummaries() {
      console.log("📊 Vehicle summary 업데이트 중...");
      this.vehicleSummaryCache.clear();

      this.selectedVehicles.forEach((vehicle) => {
        if (vehicle.detailList) {
          const summary = this.calculateVehicleSummary(vehicle.detailList);
          this.$set(vehicle, "totLoadWt", summary.totalLoadWt);
          this.$set(vehicle, "totLoadCbm", summary.totalLoadVol);
          console.log("📊 Vehicle", vehicle.id, "summary 업데이트:", summary);
        }
      });

      this.lastUpdateTime = Date.now();
      console.log("📊 Summary 업데이트 완료:", this.lastUpdateTime);
    },
  },
};

/**
 * 기본 내보내기 (default export)
 */
export default calculationMixin;
