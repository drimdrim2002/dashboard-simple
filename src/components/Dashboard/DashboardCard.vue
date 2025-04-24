<template>
  <div class="card">
    <div class="card-content">
      <div class="metric-row">
        <span class="label">{{ cardTitle }}</span>
        <span class="value" :style="{ color: cardColor }">
          <template v-if="type === 'cost'"
            >₩{{ formatCurrency(primaryValue) }}</template
          >
          <template v-else-if="type === 'plan'">{{ primaryValue }}</template>
          <template v-else>{{ formatNumber(primaryValue) }}</template>
        </span>
      </div>

      <div class="divider"></div>

      <div class="details">
        <!-- 주문 & 차량 카드 공통 UI -->
        <template v-if="type === 'order' || type === 'vehicle'">
          <div class="stat-item">
            <div class="stat-row">
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
          </div>

          <div class="stat-item">
            <div class="stat-row">
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
          </div>
        </template>

        <!-- 계획 카드용 UI -->
        <template v-else-if="type === 'plan'">
          <div class="stat-item">
            <div class="stat-row">
              <div class="stat-label">{{ firstItemLabel }}</div>
              <div class="stat-value">{{ firstItemValue }}</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-row plan-status-row">
              <div class="stat-label">{{ secondItemLabel }}</div>
              <div
                class="stat-value plan-status"
                :style="{ color: progressColor }"
              >
                {{ secondItemValue }}
              </div>
            </div>
          </div>
        </template>

        <!-- 비용 카드용 UI -->
        <template v-else-if="type === 'cost'">
          <div class="stat-item">
            <div class="stat-row">
              <div class="stat-label">{{ firstItemLabel }}</div>
              <div class="stat-value">{{ formatNumber(firstItemValue) }}</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-row">
              <div class="stat-label">{{ secondItemLabel }}</div>
              <div class="stat-value">
                ₩{{ formatCurrency(secondItemValue) }}
              </div>
            </div>
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
      validator: (value) =>
        ["order", "vehicle", "cost", "plan"].includes(value),
    },
    primaryValue: {
      type: [Number, String],
      required: true,
    },
    secondaryValue: {
      type: [Number, String],
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
        plan: "계획",
      };
      return titles[this.type];
    },
    cardColor() {
      const colors = {
        order: "#333",
        vehicle: "#333",
        cost: "#333",
        plan: "#333",
      };
      return colors[this.type];
    },
    progressColor() {
      const colors = {
        order: "#4876f8",
        vehicle: "#4cb8b8",
        cost: "#4caf50",
        plan: "#8e44ad",
      };
      return colors[this.type];
    },
    secondaryColor() {
      const colors = {
        order: "#f87048",
        vehicle: "#a0a0a0",
        cost: "#f5f5f5",
        plan: "#c39bd3",
      };
      return colors[this.type];
    },
    firstItemLabel() {
      if (this.type === "order") return "배정됨";
      if (this.type === "vehicle") return "사용중";
      if (this.type === "cost") return "경로";
      if (this.type === "plan") return "ID";
      return "";
    },
    secondItemLabel() {
      if (this.type === "order") return "미배정";
      if (this.type === "vehicle") return "미사용";
      if (this.type === "cost") return "경로당 비용";
      if (this.type === "plan") return "상태";
      return "";
    },
    firstItemValue() {
      if (this.type === "order" || this.type === "vehicle") {
        return this.secondaryValue;
      }
      if (this.type === "plan") {
        return this.primaryValue;
      }
      return this.routes;
    },
    secondItemValue() {
      if (this.type === "order" || this.type === "vehicle") {
        return this.primaryValue - this.secondaryValue;
      }
      if (this.type === "plan") {
        return this.secondaryValue;
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
      if (this.type === "plan") {
        return 100; // 계획 카드는 항상 100% 채워진 상태바 표시
      }
      return 0;
    },
  },
  methods: {
    formatNumber(num) {
      if (typeof num === "string") return num;
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatCurrency(num) {
      if (typeof num === "string") return num;
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
  min-width: 200px;
  min-height: 130px;
}

.card:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-content {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.label {
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
}

.value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1.1;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 6px 0;
}

.details {
  margin-top: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
}

.stat-item {
  margin-bottom: 5px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 18px;
  flex-wrap: wrap;
}

.stat-label {
  font-size: 13px;
  color: #666;
  width: 25%;
  white-space: nowrap;
}

.stat-value {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  width: 25%;
  text-align: right;
  margin-right: 10px;
}

.progress-bar {
  height: 2px;
  flex-grow: 1;
  width: 40%;
  background-color: #f5f5f5;
  border-radius: 1px;
  overflow: hidden;
}

.progress {
  height: 100%;
  border-radius: 1px;
}

.progress-inverse {
  height: 100%;
  border-radius: 1px;
}

.plan-status-row {
  justify-content: space-between;
}

.plan-status {
  text-align: right;
  font-weight: 600;
  margin-right: 0;
  width: auto;
}

@media (max-width: 1200px) {
  .card {
    min-width: 180px;
  }

  .value {
    font-size: 20px;
  }

  .stat-label,
  .stat-value {
    font-size: 12px;
  }
}

@media (max-width: 992px) {
  .card-content {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .card {
    width: 100%;
  }

  .stat-row {
    flex-wrap: nowrap;
  }
}
</style>
