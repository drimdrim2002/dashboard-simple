<template>
  <div class="dashboard-container">
    <h2 class="dashboard-title">Dispatch Summary</h2>
    <div class="dashboard">
      <dashboard-card
        type="plan"
        :primary-value="planData ? planData.planId : 'Loading...'"
        :secondary-value="planData ? planData.exeScd : 'N/A'"
      ></dashboard-card>

      <dashboard-card
        type="order"
        :primary-value="planData ? planData.totOrderCnt : 0"
        :secondary-value="planData ? planData.alocOrderCnt : 0"
      ></dashboard-card>

      <dashboard-card
        type="vehicle"
        :primary-value="planData ? planData.totVhclCnt : 0"
        :secondary-value="planData ? planData.alocVhclCnt : 0"
      ></dashboard-card>

      <dashboard-card
        type="cost"
        :primary-value="planData ? planData.totCostAmt : 0"
        :secondary-value="0"
        :routes="13"
      ></dashboard-card>
    </div>

    <!-- planData 상세 정보 표시 -->
    <div v-if="planData" class="plan-details">
      <h3>Plan Details</h3>
      <div class="details-grid">
        <div class="detail-item">
          <span class="label">LSS ID:</span>
          <span class="value">{{ planData.lssId }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Tenant ID:</span>
          <span class="value">{{ planData.tnntId }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Start Date:</span>
          <span class="value">{{ formatDate(planData.statDate) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">End Date:</span>
          <span class="value">{{ formatDate(planData.endDate) }}</span>
        </div>
      </div>
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
  props: {
    planData: {
      type: Object,
      default: null,
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "N/A";

      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } catch (error) {
        return dateString;
      }
    },
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

/* Plan Details 스타일 */
.plan-details {
  margin: 0 24px 24px 24px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.plan-details h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f7fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.detail-item .label {
  font-weight: 600;
  color: #4a5568;
}

.detail-item .value {
  color: #2d3748;
  font-weight: 500;
}

@media (max-width: 992px) {
  .plan-details {
    margin: 0 16px 16px 16px;
    padding: 16px;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .plan-details {
    margin: 0 16px 16px 16px;
    padding: 12px;
  }

  .plan-details h3 {
    font-size: 14px;
  }

  .detail-item {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
