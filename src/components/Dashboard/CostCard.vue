<template>
  <div class="card">
    <div class="card-content">
      <div class="metric">
        <span class="label">비용</span>
        <span class="value">₩{{ formatCurrency(totalCost) }}</span>
      </div>

      <div class="divider"></div>

      <div class="details">
        <div class="stat-item">
          <div class="stat-label">경로</div>
          <div class="stat-value">{{ formatNumber(routes) }}</div>
        </div>

        <div class="stat-item">
          <div class="stat-label">경로당 비용</div>
          <div class="stat-value">₩{{ formatCurrency(costPerRoute) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CostCard",
  props: {
    totalCost: {
      type: Number,
      required: true,
    },
    routes: {
      type: Number,
      required: true,
    },
  },
  computed: {
    costPerRoute() {
      return this.routes > 0 ? Math.round(this.totalCost / this.routes) : 0;
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
</style>
