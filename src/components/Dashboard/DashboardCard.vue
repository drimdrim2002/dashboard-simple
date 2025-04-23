<template>
  <div class="card">
    <div class="card-content">
      <div class="metric">
        <span class="label">{{ cardTitle }}</span>
        <span class="value" :style="{ color: cardColor }">
          <template v-if="type === 'cost'"
            >₩{{ formatCurrency(primaryValue) }}</template
          >
          <template v-else>{{ formatNumber(primaryValue) }}</template>
        </span>
      </div>

      <div class="divider"></div>

      <div class="details">
        <!-- 주문 & 차량 카드 공통 UI -->
        <template v-if="type === 'order' || type === 'vehicle'">
          <div class="stat-item">
            <div class="stat-label">{{ firstItemLabel }}</div>
            <div class="stat-value">{{ formatNumber(firstItemValue) }}</div>
            <div class="progress-bar">
              <div
                class="progress"
                :style="{
                  width: percentage + '%',
                  backgroundColor: progressColor,
                }"
              ></div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-label">{{ secondItemLabel }}</div>
            <div class="stat-value">{{ formatNumber(secondItemValue) }}</div>
            <div class="progress-bar">
              <div
                class="progress-inverse"
                :style="{
                  width: 100 - percentage + '%',
                  backgroundColor: secondaryColor,
                }"
              ></div>
            </div>
          </div>
        </template>

        <!-- 비용 카드용 UI -->
        <template v-else-if="type === 'cost'">
          <div class="stat-item">
            <div class="stat-label">{{ firstItemLabel }}</div>
            <div class="stat-value">{{ formatNumber(firstItemValue) }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">{{ secondItemLabel }}</div>
            <div class="stat-value">₩{{ formatCurrency(secondItemValue) }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardCard",
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ["order", "vehicle", "cost"].includes(value),
    },
    primaryValue: {
      type: Number,
      required: true,
    },
    secondaryValue: {
      type: Number,
      required: true,
    },
    routes: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    cardTitle() {
      const titles = {
        order: "주문",
        vehicle: "차량",
        cost: "비용",
      };
      return titles[this.type];
    },
    cardColor() {
      const colors = {
        order: "#333",
        vehicle: "#333",
        cost: "#333",
      };
      return colors[this.type];
    },
    progressColor() {
      const colors = {
        order: "#4876f8",
        vehicle: "#4cb8b8",
        cost: "#4caf50",
      };
      return colors[this.type];
    },
    secondaryColor() {
      const colors = {
        order: "#f87048",
        vehicle: "#a0a0a0",
        cost: "#f5f5f5",
      };
      return colors[this.type];
    },
    firstItemLabel() {
      if (this.type === "order") return "배정됨";
      if (this.type === "vehicle") return "사용중";
      if (this.type === "cost") return "경로";
      return "";
    },
    secondItemLabel() {
      if (this.type === "order") return "미배정";
      if (this.type === "vehicle") return "미사용";
      if (this.type === "cost") return "경로당 비용";
      return "";
    },
    firstItemValue() {
      if (this.type === "order" || this.type === "vehicle") {
        return this.secondaryValue;
      }
      return this.routes;
    },
    secondItemValue() {
      if (this.type === "order" || this.type === "vehicle") {
        return this.primaryValue - this.secondaryValue;
      }
      // 경로당 비용 계산
      return this.routes > 0 ? Math.round(this.primaryValue / this.routes) : 0;
    },
    percentage() {
      if (this.type === "order" || this.type === "vehicle") {
        return this.primaryValue === 0
          ? 0
          : Math.round((this.secondaryValue / this.primaryValue) * 100);
      }
      return 0;
    },
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatCurrency(num) {
      return this.formatNumber(num);
    },
  },
};
</script>

<style scoped>
.card {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  overflow: hidden;
  min-width: 250px;
}

.card:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-content {
  padding: 24px;
}

.metric {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.label {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
  margin-bottom: 4px;
}

.value {
  font-size: 32px;
  font-weight: 600;
  color: #333;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 16px 0;
}

.details {
  margin-top: 16px;
}

.stat-item {
  margin-bottom: 16px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
}

.stat-value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.progress-bar {
  height: 4px;
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  border-radius: 2px;
}

.progress-inverse {
  height: 100%;
  border-radius: 2px;
}
</style>
