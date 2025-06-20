<template>
  <div class="dashboard-container">
    <div class="dashboard">
      <!-- 1. Plan Overview Card -->
      <div class="plan-overview-card">
        <div class="card-header">
          <h3>📊 PLAN OVERVIEW</h3>
        </div>
        <div class="plan-content">
          <div class="plan-id">
            {{ planData ? planData.planId : "Loading..." }}
          </div>
          <div class="plan-status">
            {{ planData ? planData.exeScd : "N/A" }}
          </div>
          <div class="plan-period">
            {{ formatDateRange(planData?.statDate, planData?.endDate) }}
          </div>
        </div>
      </div>

      <!-- 2. Order Assignment Card -->
      <div class="metric-card">
        <div class="card-header">
          <h3>📋 ORDER ASSIGNMENT</h3>
        </div>
        <div class="metric-content">
          <div class="metric-numbers">
            <span class="primary-number">{{
              planData ? planData.alocOrderCnt : 0
            }}</span>
            <span class="divider">/</span>
            <span class="secondary-number">{{
              planData ? planData.totOrderCnt : 0
            }}</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: orderProgress + '%' }"
            ></div>
          </div>
          <div class="progress-text">{{ orderProgress }}% Complete</div>
        </div>
      </div>

      <!-- 3. Vehicle Usage Card -->
      <div class="metric-card">
        <div class="card-header">
          <h3>🚛 VEHICLE USAGE</h3>
        </div>
        <div class="metric-content">
          <div class="metric-numbers">
            <span class="primary-number">{{
              planData ? planData.alocVhclCnt : 0
            }}</span>
            <span class="divider">/</span>
            <span class="secondary-number">{{
              planData ? planData.totVhclCnt : 0
            }}</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: vehicleProgress + '%' }"
            ></div>
          </div>
          <div class="progress-text">{{ vehicleProgress }}% Used</div>
        </div>
      </div>

      <!-- 4. Cost Card -->
      <div class="cost-card">
        <div class="card-header">
          <h3>💰 TOTAL COST</h3>
        </div>
        <div class="cost-content">
          <div class="cost-amount">
            {{ formatCurrency(planData?.totCostAmt || 0) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  formatCurrency,
  formatDate,
  formatDateRange,
} from "@/utils/formatUtils";

export default {
  name: "DashboardStats",
  props: {
    planData: {
      type: Object,
      default: null,
    },
  },
  computed: {
    orderProgress() {
      if (
        !this.planData ||
        !this.planData.totOrderCnt ||
        this.planData.totOrderCnt === 0
      ) {
        return 0;
      }
      return Math.round(
        (this.planData.alocOrderCnt / this.planData.totOrderCnt) * 100
      );
    },
    vehicleProgress() {
      if (
        !this.planData ||
        !this.planData.totVhclCnt ||
        this.planData.totVhclCnt === 0
      ) {
        return 0;
      }
      return Math.round(
        (this.planData.alocVhclCnt / this.planData.totVhclCnt) * 100
      );
    },
  },
  methods: {
    formatDate,
    formatDateRange,
    formatCurrency,
  },
};
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  max-height: 200px;
  background-color: #fafafa;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
  padding: 12px 16px 8px 16px;
  flex-shrink: 0;
}

.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12px;
  padding: 0 16px 12px 16px;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  min-height: 0;
}

@media (max-width: 1200px) {
  .dashboard {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
}

@media (max-width: 992px) {
  .dashboard {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 0 12px 8px 12px;
  }

  .dashboard-title {
    padding: 8px 12px 6px 12px;
    font-size: 14px;
  }

  /* Adjust minimum widths for tablet */
  .plan-overview-card {
    min-width: 280px;
  }

  .metric-card,
  .cost-card {
    min-width: 190px;
  }
}

@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .dashboard-title {
    padding: 6px 12px 4px 12px;
    font-size: 13px;
  }

  .plan-overview-card,
  .metric-card,
  .cost-card {
    padding: 8px;
  }

  /* Reduce minimum widths for mobile */
  .plan-overview-card {
    min-width: 250px;
  }

  .metric-card,
  .cost-card {
    min-width: 180px;
  }

  .card-header h3 {
    font-size: 10px;
  }

  .primary-number {
    font-size: 16px;
  }

  .plan-id {
    font-size: 14px;
  }

  .cost-amount {
    font-size: 16px;
  }
}

/* Common card styles */
.plan-overview-card,
.metric-card,
.cost-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Individual card minimum widths */
.plan-overview-card {
  min-width: 300px;
}

.metric-card,
.cost-card {
  min-width: 200px;
}

.plan-overview-card:hover,
.metric-card:hover,
.cost-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  margin-bottom: 8px;
  border-bottom: 1px solid #f7fafc;
  padding-bottom: 4px;
  flex-shrink: 0;
}

.card-header h3 {
  font-size: 11px;
  font-weight: 600;
  color: #4a5568;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Plan Overview Card */
.plan-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.plan-id {
  font-size: 16px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.1;
}

.plan-status {
  font-size: 12px;
  font-weight: 600;
  color: #48bb78;
  background-color: #f0fff4;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.plan-period {
  font-size: 10px;
  color: #718096;
  font-weight: 500;
  line-height: 1.2;
}

.plan-details-mini {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.plan-details-mini div {
  font-size: 9px;
  color: #a0aec0;
  background-color: #f7fafc;
  padding: 1px 4px;
  border-radius: 3px;
  width: fit-content;
}

/* Metric Cards */
.metric-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.metric-numbers {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.primary-number {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
}

.divider {
  font-size: 14px;
  font-weight: 500;
  color: #a0aec0;
}

.secondary-number {
  font-size: 14px;
  font-weight: 500;
  color: #718096;
}

.progress-bar {
  height: 6px;
  background-color: #edf2f7;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  font-weight: 600;
  color: #48bb78;
  line-height: 1;
}

/* Cost Card */
.cost-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  justify-content: flex-start;
  align-items: flex-end;
}

.cost-amount {
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.1;
  text-align: right;
}

.cost-label {
  font-size: 10px;
  font-weight: 500;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Plan Details Styles */
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
