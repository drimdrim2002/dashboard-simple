/**
 * 포맷팅 관련 유틸리티 함수들
 * VehicleDetailList에서 사용하는 다양한 데이터 포맷팅 기능을 제공합니다.
 */

/**
 * 무게 값을 포맷팅합니다.
 * @param {number|string} value - 포맷팅할 무게 값
 * @returns {string} 포맷팅된 무게 문자열 (예: "1,000 kg")
 */
export function formatWeight(value) {
  if (!value || value === 0) return "-";
  return Number(value).toLocaleString() + " kg";
}

/**
 * 부피 값을 포맷팅합니다.
 * @param {number|string} value - 포맷팅할 부피 값
 * @returns {string} 포맷팅된 부피 문자열 (예: "1,000 m³")
 */
export function formatVolume(value) {
  if (!value || value === 0) return "-";
  return Number(value).toLocaleString() + " m³";
}

/**
 * 거리 값을 포맷팅합니다.
 * @param {number|string} value - 포맷팅할 거리 값
 * @returns {string} 포맷팅된 거리 문자열 (예: "1,000 km")
 */
export function formatDistance(value) {
  if (!value || value === 0) return "-";
  return Number(value).toLocaleString() + " km";
}

/**
 * 시간 값을 포맷팅합니다.
 * @param {number|string} value - 포맷팅할 시간 값 (분)
 * @returns {string} 포맷팅된 시간 문자열 (예: "1,000 min")
 */
export function formatTime(value) {
  if (!value || value === 0) return "-";
  return Number(value).toLocaleString() + " min";
}

/**
 * 24시간 형식 시간 문자열을 HH:MM:SS 형식으로 포맷팅합니다.
 * @param {string} timeString - 6자리 시간 문자열 (예: "123456")
 * @returns {string} HH:MM:SS 형식의 시간 문자열 (예: "12:34:56")
 */
export function formatTime24(timeString) {
  if (!timeString || timeString === "000000") return "00:00:00";

  // 6자리 숫자 문자열을 HH:MM:SS 형식으로 변환
  const timeStr = timeString.toString().padStart(6, "0");
  const hours = timeStr.substring(0, 2);
  const minutes = timeStr.substring(2, 4);
  const seconds = timeStr.substring(4, 6);

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * 거리 값을 미터에서 킬로미터로 변환하여 포맷팅합니다.
 * @param {number|string} value - 미터 단위의 거리 값
 * @returns {string} 킬로미터 단위의 포맷팅된 거리 문자열 (예: "1.5 km")
 */
export function formatDistanceKM(value) {
  if (!value) return "-";

  // 문자를 숫자로 변환하고 1000으로 나눈 후 소수점 첫째자리까지 표시
  const numValue = Number(value);
  if (isNaN(numValue)) return "-";

  const kmValue = (numValue / 1000).toFixed(1);
  return `${kmValue} km`;
}

/**
 * 초 단위 시간을 HH:MM:SS 형식으로 포맷팅합니다.
 * @param {number|string} seconds - 초 단위 시간
 * @returns {string} HH:MM:SS 형식의 시간 문자열
 */
export function formatSecondsToTime(seconds) {
  if (!seconds || seconds === 0) return "00:00:00";

  // 초를 숫자로 변환
  const totalSeconds = Number(seconds);
  if (isNaN(totalSeconds)) return "00:00:00";

  // 시, 분, 초 계산
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  // 2자리로 패딩하여 hh:mm:ss 형식으로 반환
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * 숫자를 지정된 소수점 자리수로 포맷팅합니다.
 * @param {number|string} value - 포맷팅할 숫자 값
 * @param {number} decimals - 소수점 자리수
 * @returns {string} 포맷팅된 숫자 문자열
 */
export function formatDecimal(value, decimals) {
  if (!value || value === 0) return "0.0";
  return Number(value).toFixed(decimals);
}

/**
 * 모든 포맷팅 함수들을 하나의 객체로 내보냅니다.
 * 컴포넌트에서 import { formatUtils } from './path' 형태로 사용 가능
 */
export const formatUtils = {
  formatWeight,
  formatVolume,
  formatDistance,
  formatTime,
  formatTime24,
  formatDistanceKM,
  formatSecondsToTime,
  formatDecimal,
};

/**
 * 기본 내보내기 (default export)
 * import formatUtils from './path' 형태로 사용 가능
 */
export default formatUtils;
