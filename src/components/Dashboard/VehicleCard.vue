<template>
  <div class="card">
    <div class="card-content">
      <div class="metric">
        <span class="label">차량</span>
        <span class="value">{{ formatNumber(totalVehicles) }}</span>
      </div>

      <div class="divider"></div>

      <div class="details">
        <div class="stat-item">
          <div class="stat-label">사용중</div>
          <div class="stat-value">{{ formatNumber(usedVehicles) }}</div>
          <div class="progress-bar">
            <div
              class="progress"
              :style="{ width: usedPercentage + '%' }"
            ></div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-label">미사용</div>
          <div class="stat-value">{{ formatNumber(notUsedVehicles) }}</div>
          <div class="progress-bar">
            <div
              class="progress-inverse"
              :style="{ width: 100 - usedPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VehicleCard",
  props: {
    usedVehicles: {
      type: Number,
      required: true,
    },
    totalVehicles: {
      type: Number,
      required: true,
    },
  },
  computed: {
    notUsedVehicles() {
      return this.totalVehicles - this.usedVehicles;
    },
    usedPercentage() {
      return this.totalVehicles === 0
        ? 0
        : Math.round((this.usedVehicles / this.totalVehicles) * 100);
    },
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  background-color: #4cb8b8;
  border-radius: 2px;
}

.progress-inverse {
  height: 100%;
  background-color: #a0a0a0;
  border-radius: 2px;
}
</style>
