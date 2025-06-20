/**
 * VehicleDetailList 테이블 컬럼 정의
 * 헤더와 데이터 컬럼의 동기화를 위한 중앙 설정 파일
 */

import {
  formatDistanceKM,
  formatSecondsToTime,
  // formatTime24,
} from "@/utils/formatUtils";

/**
 * 테이블 컬럼 정의
 * @typedef {Object} TableColumn
 * @property {string} key - 데이터 키
 * @property {string} title - 헤더 제목
 * @property {string} [width] - 컬럼 너비 (CSS)
 * @property {string} [align] - 텍스트 정렬 (left, center, right)
 * @property {string} [className] - 추가 CSS 클래스
 * @property {Function} [formatter] - 데이터 포맷팅 함수
 * @property {boolean} [sortable] - 정렬 가능 여부
 * @property {boolean} [visible] - 표시 여부
 */

export const VEHICLE_DETAIL_COLUMNS = [
  {
    key: "drag-handle",
    title: "",
    width: "40px",
    align: "center",
    className: "drag-handle-header",
    sortable: false,
    visible: true,
    type: "action", // 특별한 타입 표시
    icon: "bi bi-arrows-move",
  },
  {
    key: "tree",
    title: "Vehicle ID",
    width: "60px",
    align: "left",
    className: "tree-col",
    sortable: false,
    visible: true,
    type: "tree",
  },
  {
    key: "sequence",
    title: "Seq",
    width: "50px",
    align: "center",
    className: "seq-number",
    sortable: false,
    visible: true,
    type: "sequence",
  },
  {
    key: "vhclId",
    title: "Vehicle ID",
    width: "100px",
    align: "left",
    className: "vhcl-id",
    sortable: true,
    visible: true,
    type: "data",
  },
  {
    key: "orderId",
    title: "Order ID",
    width: "120px",
    align: "left",
    sortable: true,
    visible: true,
    type: "data",
    fallback: "locId", // orderId가 없으면 locId 사용
  },
  {
    key: "locId",
    title: "Location ID",
    width: "120px",
    align: "left",
    sortable: true,
    visible: true,
    type: "data",
  },
  {
    key: "loadWt",
    title: "Weight<br/>(KG)",
    width: "100px",
    align: "right",
    className: "text-end",
    sortable: true,
    visible: true,
    type: "data",
  },
  {
    key: "loadVol",
    title: "Volume<br/>(CBM)",
    width: "100px",
    align: "right",
    className: "text-end",
    sortable: true,
    visible: true,
    type: "data",
  },
  {
    key: "distcVal",
    title: "Distance<br/>(KM)",
    width: "100px",
    align: "right",
    className: "text-end",
    sortable: true,
    visible: true,
    type: "data",
    formatter: formatDistanceKM,
  },
  {
    key: "trnsPeridVal",
    title: "Duration<br/>(HH:MM:SS)",
    width: "100px",
    align: "center",
    sortable: true,
    visible: true,
    type: "data",
    formatter: formatSecondsToTime,
  },
  // {
  //   key: "reqDate",
  //   title: "Request Time",
  //   width: "120px",
  //   align: "center",
  //   sortable: true,
  //   visible: true,
  //   type: "data",
  // },
  // {
  //   key: "customerTime",
  //   title: "Customer Time",
  //   width: "150px",
  //   align: "center",
  //   sortable: false,
  //   visible: true,
  //   type: "composite", // 두 개의 데이터를 조합
  //   fields: ["custOpenTime", "custCloseTime"],
  //   formatter: (openTime, closeTime) =>
  //     `${formatTime24(openTime)} ~ ${formatTime24(closeTime)}`,
  // },
  // {
  //   key: "arrDtm",
  //   title: "Arrival Time",
  //   width: "120px",
  //   align: "center",
  //   sortable: true,
  //   visible: true,
  //   type: "data",
  // },
  // {
  //   key: "depDtm",
  //   title: "Departure Time",
  //   width: "120px",
  //   align: "center",
  //   sortable: true,
  //   visible: true,
  //   type: "data",
  // },
];

/**
 * 표시할 컬럼만 필터링
 */
export function getVisibleColumns() {
  return VEHICLE_DETAIL_COLUMNS.filter((col) => col.visible);
}

/**
 * 특정 타입의 컬럼만 가져오기
 */
export function getColumnsByType(type) {
  return VEHICLE_DETAIL_COLUMNS.filter((col) => col.type === type);
}

/**
 * 컬럼 키로 컬럼 정의 찾기
 */
export function getColumnByKey(key) {
  return VEHICLE_DETAIL_COLUMNS.find((col) => col.key === key);
}

/**
 * 헤더용 컬럼 정보 가져오기
 */
export function getHeaderColumns() {
  return getVisibleColumns().map((col) => ({
    key: col.key,
    title: col.title,
    width: col.width,
    align: col.align,
    className: col.className,
    sortable: col.sortable,
    icon: col.icon,
    type: col.type,
  }));
}

/**
 * 데이터 렌더링용 컬럼 정보 가져오기
 */
export function getDataColumns() {
  return getVisibleColumns().map((col) => ({
    key: col.key,
    align: col.align,
    className: col.className,
    formatter: col.formatter,
    type: col.type,
    fields: col.fields,
    fallback: col.fallback,
  }));
}

/**
 * 컬럼 표시/숨김 설정 업데이트
 */
export function updateColumnVisibility(columnKey, visible) {
  const column = getColumnByKey(columnKey);
  if (column) {
    column.visible = visible;
  }
}

/**
 * 기본 내보내기
 */
export default {
  VEHICLE_DETAIL_COLUMNS,
  getVisibleColumns,
  getColumnsByType,
  getColumnByKey,
  getHeaderColumns,
  getDataColumns,
  updateColumnVisibility,
};
