<template>
  <div class="card">
    <div class="card-header cost-header">Cost</div>
    <div class="card-body">
      <div class="cost-value">{{ formatNumber(totalCost) }}</div>
      <div class="stat-row">
        <span>Routes</span>
        <span class="number-link" @click="$emit('show-popup', routes)">
          {{ formatNumber(routes) }}
        </span>
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

.cost-header {
  background-color: #4caf50;
}

.card-body {
  height: 120px;
  padding: 15px 20px;
  box-sizing: border-box;
}

.cost-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
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
