<template>
  <div class="dashboard-container">
    <h2 class="dashboard-title">Dispatch Summary</h2>
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
          <div class="plan-details-mini">
            <div v-if="planData?.lssId">LSS: {{ planData.lssId }}</div>
            <div v-if="planData?.tnntId">TNT: {{ planData.tnntId }}</div>
          </div>
        </div>
      </div>

      <!-- 2. Order Assignment Card -->
      <div class="metric-card">
        <div class="card-header">
          <h3>📋 주문 배정</h3>
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
          <div class="progress-text">{{ orderProgress }}% 완료</div>
        </div>
      </div>

      <!-- 3. Vehicle Usage Card -->
      <div class="metric-card">
        <div class="card-header">
          <h3>🚛 차량 사용</h3>
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
          <div class="progress-text">{{ vehicleProgress }}% 사용</div>
        </div>
      </div>

      <!-- 4. Cost Card -->
      <div class="cost-card">
        <div class="card-header">
          <h3>💰 총 비용</h3>
        </div>
        <div class="cost-content">
          <div class="cost-amount">
            {{ formatCurrency(planData?.totCostAmt || 0) }}
          </div>
          <div class="cost-label">Total Cost</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    formatDateRange(startDate, endDate) {
      if (!startDate || !endDate) return "N/A";

      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return `${start.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })} - ${end.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}`;
      } catch (error) {
        return "N/A";
      }
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
      }).format(amount);
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 0 24px 24px 24px;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 1200px) {
  .dashboard {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
}

@media (max-width: 992px) {
  .dashboard {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px 16px 16px;
  }

  .dashboard-title {
    padding: 16px 16px 12px 16px;
  }
}

@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .dashboard-title {
    padding: 12px 16px 8px 16px;
    font-size: 18px;
  }
}

/* 카드 공통 스타일 */
.plan-overview-card,
.metric-card,
.cost-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.plan-overview-card:hover,
.metric-card:hover,
.cost-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  margin-bottom: 16px;
  border-bottom: 2px solid #f7fafc;
  padding-bottom: 8px;
}

.card-header h3 {
  font-size: 14px;
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
  gap: 8px;
}

.plan-id {
  font-size: 22px;
  font-weight: 700;
  color: #2d3748;
}

.plan-status {
  font-size: 16px;
  font-weight: 600;
  color: #48bb78;
  background-color: #f0fff4;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
  width: fit-content;
}

.plan-period {
  font-size: 13px;
  color: #718096;
  font-weight: 500;
}

.plan-details-mini {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}

.plan-details-mini div {
  font-size: 12px;
  color: #a0aec0;
  background-color: #f7fafc;
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
}

/* Metric Cards */
.metric-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-numbers {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.primary-number {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
}

.divider {
  font-size: 18px;
  font-weight: 500;
  color: #a0aec0;
}

.secondary-number {
  font-size: 18px;
  font-weight: 500;
  color: #718096;
}

.progress-bar {
  height: 8px;
  background-color: #edf2f7;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #48bb78;
}

/* Cost Card */
.cost-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cost-amount {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
}

.cost-label {
  font-size: 12px;
  font-weight: 500;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
