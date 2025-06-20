/**
 * 계산 관련 유틸리티 함수들
 * VehicleDetailList에서 사용하는 다양한 계산 기능을 제공합니다.
 */

/**
 * DetailList에서 특정 필드의 총합을 계산합니다.
 * @param {Array} detailList - 계산할 detail 목록
 * @param {string} field - 합계를 구할 필드명 (예: 'distcVal', 'trnsPeridVal')
 * @returns {number} 해당 필드의 총합
 */
export function calculateVehicleTotal(detailList, field) {
  if (!detailList || detailList.length === 0) return 0;

  return detailList.reduce((total, detail) => {
    const value = Number(detail[field] || 0);
    return total + value;
  }, 0);
}

/**
 * DetailList에서 무게와 부피의 총합을 계산합니다 (순수 함수 버전).
 * @param {Array} detailList - 계산할 detail 목록
 * @returns {Object} 무게와 부피 총합 객체 { totalLoadWt, totalLoadVol }
 */
export function calculateVehicleSummaryPure(detailList) {
  if (!detailList || detailList.length === 0) {
    return { totalLoadWt: 0, totalLoadVol: 0 };
  }

  return detailList.reduce(
    (acc, detail) => {
      acc.totalLoadWt += Number(detail.loadWt || 0);
      acc.totalLoadVol += Number(detail.loadVol || 0);
      return acc;
    },
    { totalLoadWt: 0, totalLoadVol: 0 }
  );
}

/**
 * 캐시 키를 생성합니다.
 * @param {Array} detailList - detail 목록
 * @returns {string} 캐시 키 문자열
 */
export function generateCacheKey(detailList) {
  if (!detailList || detailList.length === 0) {
    return "empty";
  }

  return JSON.stringify(
    detailList.map((d) => ({
      orderId: d.orderId,
      loadWt: d.loadWt,
      loadVol: d.loadVol,
    }))
  );
}

/**
 * 캐시된 계산 결과를 관리하는 클래스
 * 컴포넌트에서 인스턴스를 생성하여 사용할 수 있습니다.
 */
export class VehicleSummaryCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * 캐시에서 값을 조회합니다.
   * @param {string} key - 캐시 키
   * @returns {Object|null} 캐시된 값 또는 null
   */
  get(key) {
    return this.cache.get(key) || null;
  }

  /**
   * 캐시에 값을 저장합니다.
   * @param {string} key - 캐시 키
   * @param {Object} value - 저장할 값
   */
  set(key, value) {
    // 최대 크기 초과 시 가장 오래된 항목 제거
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  /**
   * 캐시를 모두 지웁니다.
   */
  clear() {
    this.cache.clear();
  }

  /**
   * 현재 캐시 크기를 반환합니다.
   * @returns {number} 캐시 크기
   */
  size() {
    return this.cache.size;
  }
}

/**
 * DetailList의 무게와 부피 총합을 캐시와 함께 계산합니다.
 * @param {Array} detailList - 계산할 detail 목록
 * @param {VehicleSummaryCache} cache - 캐시 인스턴스
 * @returns {Object} 무게와 부피 총합 객체 { totalLoadWt, totalLoadVol }
 */
export function calculateVehicleSummaryWithCache(detailList, cache) {
  if (!detailList || detailList.length === 0) {
    return { totalLoadWt: 0, totalLoadVol: 0 };
  }

  // 캐시 키 생성
  const cacheKey = generateCacheKey(detailList);

  // 캐시에서 조회
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  // 캐시에 없으면 계산
  const summary = calculateVehicleSummaryPure(detailList);

  // 캐시에 저장
  cache.set(cacheKey, summary);

  return summary;
}

/**
 * Zone별 총합을 계산합니다.
 * @param {Array} vehicles - vehicle 목록
 * @returns {Object} Zone별 총합 객체
 */
export function calculateZoneSummary(vehicles) {
  const summary = {
    totLoadWt: 0,
    totLoadCbm: 0,
    totDistcVal: 0,
    totTrvlPeridVal: 0,
    totCostAmt: 0,
    maxWt: 0,
    maxVol: 0,
    maxStopRcnt: 0,
    vhclIds: [],
    vhclTcds: [],
  };

  vehicles.forEach((vehicle) => {
    summary.totLoadWt += Number(vehicle.totLoadWt || 0);
    summary.totLoadCbm += Number(vehicle.totLoadCbm || 0);
    summary.totDistcVal += Number(vehicle.totDistcVal || 0);
    summary.totTrvlPeridVal += Number(vehicle.totTrvlPeridVal || 0);
    summary.totCostAmt += Number(vehicle.totCostAmt || 0);
    summary.maxWt += Number(vehicle.maxWt || 0);
    summary.maxVol += Number(vehicle.maxVol || 0);
    summary.maxStopRcnt += Number(vehicle.maxStopRcnt || 0);

    // ID와 타입 수집
    if (vehicle.vhclId) summary.vhclIds.push(vehicle.vhclId);
    if (vehicle.vhclTcd) summary.vhclTcds.push(vehicle.vhclTcd);
  });

  return summary;
}

/**
 * 모든 계산 함수들을 하나의 객체로 내보냅니다.
 */
export const calculationUtils = {
  calculateVehicleTotal,
  calculateVehicleSummaryPure,
  calculateVehicleSummaryWithCache,
  generateCacheKey,
  calculateZoneSummary,
  VehicleSummaryCache,
};

/**
 * 기본 내보내기 (default export)
 */
export default calculationUtils;
