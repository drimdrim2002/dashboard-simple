<template>
  <div class="card">
    <div class="card-header orders-header">Orders</div>
    <div class="card-body">
      <div class="percentage-container">
        <span class="percentage">{{ assignedPercentage }}%</span>
        <span class="status">assigned</span>
      </div>
      <div class="stat-row">
        <span>Assigned</span>
        <span class="number-link" @click="$emit('show-popup', assignedOrders)">
          {{ formatNumber(assignedOrders) }}
        </span>
      </div>
      <div class="stat-row">
        <span>Not Assigned</span>
        <span
          class="number-link"
          @click="$emit('show-popup', notAssignedOrders)"
        >
          {{ formatNumber(notAssignedOrders) }}
        </span>
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
  width: 300px;
  height: 160px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  background-color: white;
}

.card-header {
  height: 40px;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
}

.orders-header {
  background-color: #006d8f;
}

.card-body {
  height: 120px;
  padding: 15px 20px;
  box-sizing: border-box;
}

.percentage-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
}

.percentage {
  font-size: 24px;
  font-weight: bold;
}

.status {
  font-size: 18px;
  color: #666;
  margin-left: auto;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 16px;
}

.number-link {
  text-decoration: underline;
  cursor: pointer;
  color: #000;
}
</style>
