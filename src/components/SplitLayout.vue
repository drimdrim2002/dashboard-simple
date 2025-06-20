<template>
  <div class="split-layout">
    <!-- 좌측 패널 -->
    <div
      class="left-panel"
      ref="leftPanel"
      :style="{ width: leftPanelWidth + 'px' }"
    >
      <div class="panel-header" v-if="leftTitle">
        <h4 class="panel-title">
          <i v-if="leftIcon" :class="leftIcon"></i>
          {{ leftTitle }}
          <span v-if="leftBadge" class="badge bg-primary ms-2">{{
            leftBadge
          }}</span>
        </h4>
      </div>
      <div class="panel-content">
        <slot name="left"></slot>
      </div>
    </div>

    <!-- 가운데: 리사이즈 핸들 -->
    <div class="vertical-resize-handle" @mousedown="startVerticalResize">
      <div class="resize-grip"></div>
    </div>

    <!-- 우측 패널 -->
    <div
      class="right-panel"
      ref="rightPanel"
      :style="{ width: rightPanelWidth + 'px' }"
    >
      <div class="panel-header" v-if="rightTitle">
        <h4 class="panel-title">
          <i v-if="rightIcon" :class="rightIcon"></i>
          {{ rightTitle }}
          <span v-if="rightBadge" class="badge bg-secondary ms-2">{{
            rightBadge
          }}</span>
        </h4>
      </div>
      <div class="panel-content">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SplitLayout",
  props: {
    // 좌측 패널 설정
    leftTitle: {
      type: String,
      default: "",
    },
    leftIcon: {
      type: String,
      default: "",
    },
    leftBadge: {
      type: [String, Number],
      default: "",
    },
    // 우측 패널 설정
    rightTitle: {
      type: String,
      default: "",
    },
    rightIcon: {
      type: String,
      default: "",
    },
    rightBadge: {
      type: [String, Number],
      default: "",
    },
    // 레이아웃 설정
    initialLeftWidth: {
      type: Number,
      default: 0, // 0이면 자동 계산 (60%)
    },
    minPanelWidth: {
      type: Number,
      default: 300,
    },
    containerWidth: {
      type: Number,
      default: 0, // 0이면 부모 너비 사용
    },
  },
  data() {
    return {
      leftPanelWidth: 0,
      isVerticalResizing: false,
      verticalStartX: 0,
      verticalStartWidth: 0,
    };
  },
  computed: {
    rightPanelWidth() {
      const totalWidth =
        this.containerWidth || this.$el?.parentElement?.clientWidth || 800;
      return totalWidth - this.leftPanelWidth - 8; // 리사이즈 핸들 너비(8px) 제외
    },
  },
  mounted() {
    this.initializePanelWidth();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("mousemove", this.onVerticalResize);
    document.removeEventListener("mouseup", this.stopVerticalResize);
  },
  methods: {
    initializePanelWidth() {
      const totalWidth =
        this.containerWidth || this.$el?.parentElement?.clientWidth || 800;

      if (this.initialLeftWidth > 0) {
        this.leftPanelWidth = this.initialLeftWidth;
      } else {
        // 기본값: 전체 너비의 60%
        this.leftPanelWidth = Math.floor(totalWidth * 0.6);
      }

      // 최소/최대 너비 제한 적용
      this.constrainPanelWidth();
    },

    constrainPanelWidth() {
      const totalWidth =
        this.containerWidth || this.$el?.parentElement?.clientWidth || 800;
      const minWidth = this.minPanelWidth;
      const maxWidth = totalWidth - this.minPanelWidth - 8;

      this.leftPanelWidth = Math.max(
        minWidth,
        Math.min(maxWidth, this.leftPanelWidth)
      );
    },

    handleResize() {
      // 창 크기 변경 시 패널 너비 비율 유지
      const totalWidth =
        this.containerWidth || this.$el?.parentElement?.clientWidth || 800;

      if (this.leftPanelWidth > 0) {
        // 현재 비율 계산
        const currentRatio = this.leftPanelWidth / (totalWidth - 8);
        // 새로운 너비로 비율 적용
        this.leftPanelWidth = Math.floor((totalWidth - 8) * currentRatio);
        this.constrainPanelWidth();
      }
    },

    // 수직 리사이즈 (좌우 분할) 관련 메서드들
    startVerticalResize(e) {
      this.isVerticalResizing = true;
      this.verticalStartX = e.clientX;
      this.verticalStartWidth = this.leftPanelWidth;
      document.body.style.cursor = "ew-resize";

      document.addEventListener("mousemove", this.onVerticalResize);
      document.addEventListener("mouseup", this.stopVerticalResize);

      // 리사이즈 시작 이벤트 발생
      this.$emit("resize-start");
    },

    onVerticalResize(e) {
      if (!this.isVerticalResizing) return;

      const delta = e.clientX - this.verticalStartX;
      const newWidth = this.verticalStartWidth + delta;

      const totalWidth =
        this.containerWidth || this.$el?.parentElement?.clientWidth || 800;
      const minWidth = this.minPanelWidth;
      const maxWidth = totalWidth - this.minPanelWidth - 8;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        this.leftPanelWidth = newWidth;

        // 리사이즈 중 이벤트 발생
        this.$emit("resizing", {
          leftWidth: this.leftPanelWidth,
          rightWidth: this.rightPanelWidth,
        });
      }
    },

    stopVerticalResize() {
      this.isVerticalResizing = false;
      document.body.style.cursor = "default";

      document.removeEventListener("mousemove", this.onVerticalResize);
      document.removeEventListener("mouseup", this.stopVerticalResize);

      // 리사이즈 완료 이벤트 발생
      this.$emit("resize-end", {
        leftWidth: this.leftPanelWidth,
        rightWidth: this.rightPanelWidth,
      });
    },
  },
};
</script>

<style scoped>
.split-layout {
  display: flex;
  height: 100%;
  gap: 0;
}

.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.left-panel {
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.right-panel {
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.panel-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 12px 16px;
  flex-shrink: 0;
}

.panel-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-title i {
  font-size: 18px;
  color: #6c757d;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* 수직 리사이즈 핸들 */
.vertical-resize-handle {
  width: 8px;
  background-color: #e9ecef;
  cursor: ew-resize;
  transition: background-color 0.2s;
  user-select: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.vertical-resize-handle:hover {
  background-color: #ced4da;
}

.resize-grip {
  width: 3px;
  height: 40px;
  background-color: #adb5bd;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.vertical-resize-handle:hover .resize-grip {
  background-color: #6c757d;
}

/* Badge 스타일 */
.badge {
  font-size: 12px;
  padding: 0.25em 0.5em;
  border-radius: 0.375rem;
}

.badge.bg-primary {
  background-color: #0d6efd !important;
  color: white;
}

.badge.bg-secondary {
  background-color: #6c757d !important;
  color: white;
}

.ms-2 {
  margin-left: 0.5rem;
}
</style>
