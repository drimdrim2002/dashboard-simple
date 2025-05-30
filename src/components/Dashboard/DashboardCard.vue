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
        <!-- Order & Vehicle card common UI -->
        <div v-if="type === 'order' || type === 'vehicle'" class="card-body">
          <div class="card-numbers">
            <span class="primary-number">{{ primaryValue }}</span>
            <span class="divider">/</span>
            <span class="secondary-number">{{ secondaryValue }}</span>
          </div>
          <div class="card-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            <div class="progress-text">
              {{ progressPercentage }}% {{ getSecondaryLabel() }}
            </div>
          </div>
        </div>

        <!-- Plan card UI -->
        <div v-else-if="type === 'plan'" class="card-body plan-card">
          <div class="plan-info">
            <div class="plan-id">{{ primaryValue }}</div>
            <div class="plan-status" :class="getStatusClass()">
              {{ secondaryValue }}
            </div>
          </div>
        </div>

        <!-- Cost card UI -->
        <div v-else-if="type === 'cost'" class="card-body">
          <div class="card-numbers">
            <span class="primary-number">{{ primaryValue }}</span>
            <span class="divider">/</span>
            <span class="secondary-number">{{ secondaryValue }}</span>
          </div>
          <div class="card-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            <div class="progress-text">
              {{ progressPercentage }}% {{ getSecondaryLabel() }}
            </div>
          </div>
        </div>
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
        order: "Order",
        vehicle: "Vehicle",
        cost: "Cost",
        plan: "Plan",
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
      if (this.type === "order") return "Assigned";
      if (this.type === "vehicle") return "In Use";
      if (this.type === "cost") return "Route";
      if (this.type === "plan") return "ID";
      return "";
    },
    secondItemLabel() {
      if (this.type === "order") return "Unassigned";
      if (this.type === "vehicle") return "Unused";
      if (this.type === "cost") return "Cost per Route";
      if (this.type === "plan") return "Status";
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
    progressPercentage() {
      return this.percentage;
    },
    getSecondaryLabel() {
      return this.secondItemLabel;
    },
    getStatusClass() {
      const statuses = {
        order: "",
        vehicle: "",
        cost: "",
        plan: "",
      };
      return statuses[this.type];
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

.card-body {
  margin-bottom: 16px;
}

.card-numbers {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.primary-number,
.secondary-number {
  font-size: 18px;
  font-weight: 600;
}

.divider {
  margin: 0 8px;
}

.card-progress {
  display: flex;
  align-items: center;
}

.progress-bar {
  height: 2px;
  flex-grow: 1;
  background-color: #f5f5f5;
  border-radius: 1px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 1px;
  background-color: #4876f8;
}

.progress-text {
  margin-left: 8px;
  font-size: 13px;
  color: #666;
}

.plan-card {
  padding: 16px;
}

.plan-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-id {
  font-size: 18px;
  font-weight: 600;
}

.plan-status {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  text-align: right;
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
