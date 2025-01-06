<template>
  <div class="dashboard">
    <order-card :total-orders="189" :assigned-orders="189"></order-card>
    <vehicle-card :used-vehicles="28" :total-vehicles="1145"></vehicle-card>
    <cost-card :total-cost="1232134343" :routes="13"></cost-card>
  </div>
</template>

<script>
import OrderCard from "./OrderCard.vue";
import VehicleCard from "./VehicleCard.vue";
import CostCard from "./CostCard.vue";

export default {
  name: "DashboardStats",
  components: {
    OrderCard,
    VehicleCard,
    CostCard,
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  gap: 20px;
  padding: 20px;
}
</style>
