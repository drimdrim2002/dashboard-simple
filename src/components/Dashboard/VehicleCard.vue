<template>
  <div class="card">
    <div class="card-header vehicles-header">Vehicles</div>
    <div class="card-body">
      <div class="percentage-container">
        <span class="percentage">{{ usedPercentage }}%</span>
        <span class="status">used</span>
      </div>
      <div class="stat-row">
        <span>Used</span>
        <span class="number-link" @click="$emit('show-popup', usedVehicles)">
          {{ formatNumber(usedVehicles) }}
        </span>
      </div>
      <div class="stat-row">
        <span>Not Used</span>
        <span class="number-link" @click="$emit('show-popup', notUsedVehicles)">
          {{ formatNumber(notUsedVehicles) }}
        </span>
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

.vehicles-header {
  background-color: #00a0d1;
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
