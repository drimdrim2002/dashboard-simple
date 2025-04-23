<template>
  <div class="card">
    <div class="card-content">
      <div class="metric">
        <span class="label">주문</span>
        <span class="value">{{ formatNumber(totalOrders) }}</span>
      </div>

      <div class="divider"></div>

      <div class="details">
        <div class="stat-item">
          <div class="stat-label">배정됨</div>
          <div class="stat-value">{{ formatNumber(assignedOrders) }}</div>
          <div class="progress-bar">
            <div
              class="progress"
              :style="{ width: assignedPercentage + '%' }"
            ></div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-label">미배정</div>
          <div class="stat-value">{{ formatNumber(notAssignedOrders) }}</div>
          <div class="progress-bar">
            <div
              class="progress-inverse"
              :style="{ width: 100 - assignedPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderCard",
  props: {
    totalOrders: {
      type: Number,
      required: true,
    },
    assignedOrders: {
      type: Number,
      required: true,
    },
  },
  computed: {
    notAssignedOrders() {
      return this.totalOrders - this.assignedOrders;
    },
    assignedPercentage() {
      return this.totalOrders === 0
        ? 0
        : Math.round((this.assignedOrders / this.totalOrders) * 100);
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
  background-color: #4876f8;
  border-radius: 2px;
}

.progress-inverse {
  height: 100%;
  background-color: #f87048;
  border-radius: 2px;
}
</style>
