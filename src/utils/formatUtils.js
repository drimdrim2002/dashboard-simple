/**
 * 글로벌 포맷팅 유틸리티 함수들
 * 프로젝트 전체에서 사용하는 다양한 데이터 포맷팅 기능을 제공합니다.
 */

/**
 * 숫자에 천단위 콤마를 추가합니다.
 * @param {number|string} num - 포맷팅할 숫자
 * @returns {string} 콤마가 추가된 숫자 문자열 (예: "1,000")
 */
export function formatNumber(num) {
  if (typeof num === "string") return num;
  if (!num && num !== 0) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 한국 통화 형식으로 포맷팅합니다.
 * @param {number|string} amount - 포맷팅할 금액
 * @returns {string} 한국 통화 형식 문자열 (예: "₩1,000")
 */
export function formatCurrency(amount) {
  if (!amount && amount !== 0) return "₩0";
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

/**
 * 천단위 콤마만 추가 (통화 기호 없음)
 * @param {number|string} value - 포맷팅할 값
 * @returns {string} 콤마가 추가된 숫자 문자열
 */
export function formatNumberWithCommas(value) {
  if (!value && value !== 0) return "0";
  return Number(value).toLocaleString();
}

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
 * 미터 단위 거리를 킬로미터로 변환하여 포맷팅합니다.
 * @param {number|string} meters - 미터 단위의 거리 값
 * @returns {string} 킬로미터 단위의 포맷팅된 거리 문자열 (예: "1.5 km")
 */
export function formatDistanceKM(meters) {
  if (!meters || meters === 0) return "0.0 km";
  const kmValue = (Number(meters) / 1000).toFixed(1);
  return `${kmValue} km`;
}

/**
 * 거리 값을 그대로 포맷팅합니다 (단위 변환 없음).
 * @param {number|string} value - 포맷팅할 거리 값
 * @returns {string} 포맷팅된 거리 문자열 (예: "1,000 km")
 */
export function formatDistanceValue(value) {
  if (!value || value === 0) return "-";
  return Number(value).toLocaleString() + " km";
}

/**
 * 초 단위 시간을 HH:MM:SS 형식으로 포맷팅합니다.
 * @param {number|string} seconds - 초 단위 시간
 * @returns {string} HH:MM:SS 형식의 시간 문자열
 */
export function formatSecondsToTime(seconds) {
  if (!seconds || seconds === 0) return "00:00:00";

  const totalSeconds = Number(seconds);
  if (isNaN(totalSeconds)) return "00:00:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * 분 단위 시간을 포맷팅합니다.
 * @param {number|string} minutes - 분 단위 시간
 * @returns {string} 포맷팅된 시간 문자열 (예: "60 min")
 */
export function formatTimeMinutes(minutes) {
  if (!minutes || minutes === 0) return "-";
  return Number(minutes).toLocaleString() + " min";
}

/**
 * 24시간 형식 시간 문자열을 HH:MM:SS 형식으로 포맷팅합니다.
 * @param {string} timeString - 6자리 시간 문자열 (예: "123456")
 * @returns {string} HH:MM:SS 형식의 시간 문자열 (예: "12:34:56")
 */
export function formatTime24(timeString) {
  if (!timeString || timeString === "000000") return "00:00:00";

  const timeStr = timeString.toString().padStart(6, "0");
  const hours = timeStr.substring(0, 2);
  const minutes = timeStr.substring(2, 4);
  const seconds = timeStr.substring(4, 6);

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * 숫자를 지정된 소수점 자리수로 포맷팅합니다.
 * @param {number|string} value - 포맷팅할 숫자 값
 * @param {number} decimals - 소수점 자리수
 * @returns {string} 포맷팅된 숫자 문자열
 */
export function formatDecimal(value, decimals = 1) {
  if (!value || value === 0) return "0.0";
  return Number(value).toFixed(decimals);
}

/**
 * 날짜를 한국 형식으로 포맷팅합니다.
 * @param {string|Date} dateString - 포맷팅할 날짜
 * @returns {string} 한국 형식 날짜 문자열 (예: "2024.01.01")
 */
export function formatDate(dateString) {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * 날짜 범위를 한국 형식으로 포맷팅합니다.
 * @param {string|Date} startDate - 시작 날짜
 * @param {string|Date} endDate - 종료 날짜
 * @returns {string} 한국 형식 날짜 범위 문자열
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return "N/A";

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })} - ${end.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })}`;
  } catch (error) {
    return "N/A";
  }
}

/**
 * 모든 포맷팅 함수들을 하나의 객체로 내보냅니다.
 * import { formatUtils } from '@/utils/formatUtils' 형태로 사용 가능
 */
export const formatUtils = {
  formatNumber,
  formatCurrency,
  formatNumberWithCommas,
  formatWeight,
  formatVolume,
  formatDistanceKM,
  formatDistanceValue,
  formatSecondsToTime,
  formatTimeMinutes,
  formatTime24,
  formatDecimal,
  formatDate,
  formatDateRange,
};

/**
 * 기본 내보내기 (default export)
 * import formatUtils from '@/utils/formatUtils' 형태로 사용 가능
 */
export default formatUtils;
