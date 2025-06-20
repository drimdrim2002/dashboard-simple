<template>
  <td :class="cellClasses" :style="cellStyles">
    <!-- 드래그 핸들 -->
    <div v-if="column.type === 'action'" class="drag-handle-cell">
      <div
        v-if="isDragable"
        class="drag-handle"
        :title="'드래그하여 순서 변경'"
      >
        <i class="bi bi-grip-vertical"></i>
      </div>
      <div v-else class="drag-disabled" title="드래그 불가능 (첫 번째 위치)">
        <i class="bi bi-lock-fill"></i>
      </div>
    </div>

    <!-- 트리 구조 -->
    <div v-else-if="column.type === 'tree'" class="tree-item ps-4">
      <span class="tree-connector text-muted me-1">└</span>
    </div>

    <!-- 순번 -->
    <span
      v-else-if="column.type === 'sequence'"
      class="seq-number seq-badge"
      :style="getSequenceStyle()"
    >
      {{ data.stopSeqNo }}
    </span>

    <!-- 복합 데이터 (Customer Time 등) -->
    <span v-else-if="column.type === 'composite'">
      {{ renderCompositeValue() }}
    </span>

    <!-- 일반 데이터 -->
    <span v-else>
      {{ renderValue() }}
    </span>
  </td>
</template>

<script>
export default {
  name: "TableCell",
  props: {
    column: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    rowIndex: {
      type: Number,
      required: true,
    },
    isDragable: {
      type: Boolean,
      default: false,
    },
    vehicle: {
      type: Object,
      default: null,
    },
  },
  computed: {
    cellClasses() {
      const classes = [];

      if (this.column.className) {
        classes.push(this.column.className);
      }

      // 특별한 타입별 클래스 추가
      if (this.column.type === "action") {
        classes.push("drag-handle-cell");
      } else if (this.column.type === "tree") {
        classes.push("tree-cell");
      } else if (this.column.type === "sequence") {
        classes.push("seq-number");
      }

      return classes.join(" ");
    },

    cellStyles() {
      const styles = {};

      if (this.column.width) {
        styles.width = this.column.width;
      }

      if (this.column.align) {
        styles.textAlign = this.column.align;
      }

      return styles;
    },
  },
  methods: {
    renderValue() {
      let value;

      // fallback 지원
      if (
        this.column.fallback &&
        (!this.data[this.column.key] || this.data[this.column.key] === "")
      ) {
        value = this.data[this.column.fallback];
      } else {
        value = this.data[this.column.key];
      }

      // 포맷터 적용
      if (
        this.column.formatter &&
        typeof this.column.formatter === "function"
      ) {
        return this.column.formatter(value);
      }

      return value || "";
    },

    renderCompositeValue() {
      if (!this.column.fields || !this.column.formatter) {
        return "";
      }

      const values = this.column.fields.map((field) => this.data[field]);
      return this.column.formatter(...values);
    },

    getSequenceStyle() {
      // detail의 originalColorCode를 우선 사용, 없으면 현재 vehicle의 colorCode 사용
      const colorCode =
        this.data.originalColorCode || this.vehicle?.colorCode || "#6c757d";

      // 색상을 약간 투명하게 만들어서 배경색으로 사용
      const backgroundColor = colorCode + "20"; // 20은 12.5% 투명도

      return {
        color: colorCode,
        backgroundColor: backgroundColor,
        borderColor: colorCode,
      };
    },
  },
};
</script>

<style scoped>
.drag-handle-cell {
  width: 40px;
  text-align: center;
  padding: 0.1rem 0.25rem !important; /* tree-cell과 동일한 상하 패딩으로 통일 */
  vertical-align: middle;
}

.drag-handle {
  cursor: grab;
  color: #6c757d;
  padding: 0.2rem; /* 드래그 핸들 내부 패딩 축소 */
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem; /* 드래그 핸들 아이콘 크기 축소 */
}

.drag-handle:hover {
  color: #0d6efd;
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-disabled {
  cursor: not-allowed;
  color: #dc3545;
  padding: 0.2rem; /* 드래그 비활성화 패딩 축소 */
  opacity: 0.6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem; /* 드래그 비활성화 아이콘 크기 축소 */
}

.tree-cell {
  padding: 0.1rem 0.5rem 0.1rem 1rem !important; /* 상하패딩 축소, 좌우패딩 조정 */
}

.tree-item {
  font-size: 0.75rem; /* 트리 항목 글자 크기 축소 */
}

.tree-connector {
  font-family: monospace; /* 트리 기호를 균등한 폭으로 표시 */
  font-size: 0.8rem;
  font-weight: normal;
}

.seq-number {
  font-weight: 600;
  text-align: center;
  font-size: 0.75rem; /* 순번 글자 크기 축소 */
}

.seq-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid;
  font-weight: 700;
  transition: all 0.2s ease;
}

.seq-badge:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vhcl-id {
  font-family: "Courier New", monospace;
  font-size: 0.75rem; /* Vehicle ID 글자 크기 축소 */
}

.text-end {
  text-align: right;
}
</style>
