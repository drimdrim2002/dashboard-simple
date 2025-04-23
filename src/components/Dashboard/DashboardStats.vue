<template>
  <div class="dashboard">
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
.dashboard {
  display: flex;
  gap: 24px;
  padding: 24px;
  background-color: #fafafa;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }
}
</style>
