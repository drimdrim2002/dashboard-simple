<template>
  <div class="dashboard-container">
    <h2 class="dashboard-title">Dispatch Summary</h2>
    <div class="dashboard">
      <dashboard-card
        type="plan"
        primary-value="P123232"
        secondary-value="Executed"
      ></dashboard-card>

      <dashboard-card
        type="order"
        :primary-value="189"
        :secondary-value="189"
      ></dashboard-card>

      <dashboard-card
        type="vehicle"
        :primary-value="1145"
        :secondary-value="28"
      ></dashboard-card>

      <dashboard-card
        type="cost"
        :primary-value="1232134343"
        :secondary-value="0"
        :routes="13"
      ></dashboard-card>
    </div>
  </div>
</template>

<script>
import DashboardCard from "./DashboardCard.vue";

export default {
  name: "DashboardStats",
  components: {
    DashboardCard,
  },
};
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  background-color: #fafafa;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.dashboard-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin: 0;
  padding: 16px 24px 12px 24px;
}

.dashboard {
  display: flex;
  gap: 24px;
  padding: 0 24px 24px 24px;
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;
}

@media (max-width: 1200px) {
  .dashboard {
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .dashboard {
    gap: 16px;
    padding: 0 16px 16px 16px;
  }

  .dashboard-title {
    padding: 16px 16px 12px 16px;
  }
}

@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
    gap: 16px;
  }

  .dashboard-title {
    padding: 12px 16px 8px 16px;
    font-size: 18px;
  }
}
</style>
