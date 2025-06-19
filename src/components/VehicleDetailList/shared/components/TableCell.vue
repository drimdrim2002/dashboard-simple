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
      <i class="bi bi-dash text-muted me-1"></i>
    </div>

    <!-- 순번 -->
    <span v-else-if="column.type === 'sequence'" class="seq-number">
      {{ rowIndex + 1 }}
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
  },
};
</script>

<style scoped>
.drag-handle-cell {
  width: 40px;
  text-align: center;
  padding: 0.5rem 0.25rem !important;
  vertical-align: middle;
}

.drag-handle {
  cursor: grab;
  color: #6c757d;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
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
  padding: 0.25rem;
  opacity: 0.6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.tree-cell {
  padding-left: 1rem;
}

.tree-item {
  font-size: 0.85rem;
}

.seq-number {
  font-weight: 600;
  text-align: center;
}

.vhcl-id {
  font-family: "Courier New", monospace;
  font-size: 0.85rem;
}

.text-end {
  text-align: right;
}
</style>
