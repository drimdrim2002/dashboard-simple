/**
 * VehicleDetailList 관련 상수 정의
 * 하드코딩된 값들을 중앙화하여 유지보수성을 향상시킵니다.
 */

/**
 * 알림 메시지 타입
 */
export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
};

/**
 * 알림 표시 방식
 */
export const NOTIFICATION_DISPLAY_TYPES = {
  MODAL: "modal",
  BANNER: "banner",
  SNACKBAR: "snackbar",
};

/**
 * 기본 설정값들
 */
export const DEFAULT_CONFIG = {
  CACHE_MAX_SIZE: 100,
  UNKNOWN_ZONE: "Unknown Zone",
  DEFAULT_TIME: "00:00:00",
  //   NOTIFICATION_STYLE_DELAY: 100, // 알림 스타일 지연 시간 (ms)
  NOTIFICATION_AUTO_HIDE_DELAY: 3000, // 알림 자동 숨김 시간 (ms)
  EMPTY_TIME: "000000",
  SCROLL_SENSITIVITY: 100,
  SCROLL_SPEED: 10,
  ANIMATION_DURATION: 200,
  //   NOTIFICATION_AUTO_HIDE_DELAY: 3000,
  NOTIFICATION_STYLE_DELAY: 100,
};

/**
 * 알림 아이콘 매핑
 */
export const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.INFO]: "ℹ️",
  [NOTIFICATION_TYPES.SUCCESS]: "✅",
  [NOTIFICATION_TYPES.WARNING]: "⚠️",
  [NOTIFICATION_TYPES.ERROR]: "❌",
};

/**
 * 알림 타입별 한국어 제목
 */
export const NOTIFICATION_TITLES = {
  [NOTIFICATION_TYPES.INFO]: "정보",
  [NOTIFICATION_TYPES.SUCCESS]: "성공",
  [NOTIFICATION_TYPES.WARNING]: "경고",
  [NOTIFICATION_TYPES.ERROR]: "오류",
};

/**
 * 알림 타입별 색상 테마
 */
export const NOTIFICATION_COLORS = {
  [NOTIFICATION_TYPES.INFO]: {
    bg: "#d1ecf1",
    text: "#0c5460",
    border: "#bee5eb",
  },
  [NOTIFICATION_TYPES.SUCCESS]: {
    bg: "#d4edda",
    text: "#155724",
    border: "#c3e6cb",
  },
  [NOTIFICATION_TYPES.WARNING]: {
    bg: "#fff3cd",
    text: "#856404",
    border: "#ffeaa7",
  },
  [NOTIFICATION_TYPES.ERROR]: {
    bg: "#f8d7da",
    text: "#721c24",
    border: "#f5c6cb",
  },
};

/**
 * CSS 클래스명 상수
 */
export const CSS_CLASSES = {
  // 알림 관련
  NOTIFICATION_MODAL_BACKDROP: "notification-modal-backdrop",
  NOTIFICATION_MODAL: "notification-modal",
  NOTIFICATION_BANNER: "notification-banner",
  NOTIFICATION_SNACKBAR: "notification-snackbar",

  // 드래그 관련
  SORTABLE_GHOST: "sortable-ghost",
  SORTABLE_CHOSEN: "sortable-chosen",
  SORTABLE_DRAG: "sortable-drag",
  SORTABLE_FALLBACK: "sortable-fallback",

  // 상태 관련
  DRAGGING_ACTIVE: "dragging-active",
  DRAGGABLE_ROW: "draggable-row",
  NON_DRAGGABLE_ROW: "non-draggable-row",
  DETAIL_ROW: "detail-row",
};

/**
 * 스타일 ID 상수
 */
export const STYLE_IDS = {
  MODAL_NOTIFICATION_STYLES: "modal-notification-styles",
  BANNER_NOTIFICATION_STYLES: "banner-notification-styles",
  SNACKBAR_NOTIFICATION_STYLES: "snackbar-notification-styles",
};

/**
 * 기본 메시지들
 */
export const DEFAULT_MESSAGES = {
  DRAG_NOT_ALLOWED: "첫 번째 위치의 항목은 이동할 수 없습니다.",
  ZONE_RESTRICTION: "같은 Zone 내의 Vehicle로만 이동할 수 있습니다.",
  ORDER_CHANGED: "주문 순서가 변경되었습니다",
  DRAG_START: "드래그 시작",
  NO_SELECTED_VEHICLE: "No selected vehicle",
  NO_DETAIL_INFO: "이 vehicle에 대한 detail 정보가 없습니다.",
  CLICK_TO_EXPAND: "Click to expand",
  CLICK_TO_COLLAPSE: "Click to collapse",
  DROP_AVAILABLE: "드롭 가능",
  DRAG_NOT_POSSIBLE: "드래그 불가능 (첫 번째 위치)",
};

/**
 * vuedraggable 기본 설정
 */
export const DRAGGABLE_CONFIG = {
  disabled: false,
  animation: DEFAULT_CONFIG.ANIMATION_DURATION,
  ghostClass: CSS_CLASSES.SORTABLE_GHOST,
  chosenClass: CSS_CLASSES.SORTABLE_CHOSEN,
  dragClass: CSS_CLASSES.SORTABLE_DRAG,
  forceFallback: false,
  fallbackClass: CSS_CLASSES.SORTABLE_FALLBACK,
  scroll: true,
  scrollSensitivity: DEFAULT_CONFIG.SCROLL_SENSITIVITY,
  scrollSpeed: DEFAULT_CONFIG.SCROLL_SPEED,
  bubble: false,
};

/**
 * Z-Index 레벨
 */
export const Z_INDEX_LEVELS = {
  MODAL: 10000,
  BANNER: 10000,
  SNACKBAR: 10000,
  DRAGGING: 1000,
  STICKY_HEADER: 10,
};

/**
 * 애니메이션 설정
 */
export const ANIMATIONS = {
  FADE_IN_DURATION: "0.3s",
  SLIDE_DURATION: "0.3s",
  TRANSITION_EASE: "ease-out",
  HOVER_TRANSITION: "all 0.2s ease",
};

/**
 * 반응형 브레이크포인트
 */
export const BREAKPOINTS = {
  MOBILE: "768px",
  TABLET: "1024px",
  DESKTOP: "1200px",
};

/**
 * 유틸리티 함수들을 위한 기본값들
 */
export const UTILITY_DEFAULTS = {
  EMPTY_VALUE_DISPLAY: "-",
  DECIMAL_PLACES: 1,
  TIME_PADDING: 2,
  CACHE_EMPTY_KEY: "empty",
};

/**
 * 모든 상수를 하나의 객체로 내보내기
 */
export const CONSTANTS = {
  NOTIFICATION_TYPES,
  NOTIFICATION_DISPLAY_TYPES,
  DEFAULT_CONFIG,
  NOTIFICATION_ICONS,
  NOTIFICATION_TITLES,
  NOTIFICATION_COLORS,
  CSS_CLASSES,
  STYLE_IDS,
  DEFAULT_MESSAGES,
  DRAGGABLE_CONFIG,
  Z_INDEX_LEVELS,
  ANIMATIONS,
  BREAKPOINTS,
  UTILITY_DEFAULTS,
};

/**
 * 기본 내보내기 (default export)
 */
export default CONSTANTS;
