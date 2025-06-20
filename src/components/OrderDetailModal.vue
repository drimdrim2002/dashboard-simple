<template>
  <div v-if="isVisible">
    <!-- Modal -->
    <div
      class="modal fade show"
      tabindex="-1"
      style="display: block"
      @click.self="closeModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-box-seam me-2"></i>
              Order Detail
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
            ></button>
          </div>

          <div class="modal-body">
            <div v-if="orderData" class="order-details">
              <!-- Vehicle 정보 -->
              <div class="card mb-3">
                <div class="card-header bg-light">
                  <h6 class="mb-0">
                    <i class="bi bi-truck me-2"></i>
                    Vehicle Info
                  </h6>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Vehicle ID:</label>
                        <span class="value">{{
                          orderData.vhclId || orderData.vehicleId
                        }}</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Vehicle Name:</label>
                        <span class="value">{{
                          orderData.vhclNm || orderData.vehicleName
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order 기본 정보 -->
              <div class="card mb-3">
                <div class="card-header bg-light">
                  <h6 class="mb-0">
                    <i class="bi bi-clipboard-data me-2"></i>
                    Order Info
                  </h6>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Order ID:</label>
                        <span class="value">{{
                          orderData.orderId || "-"
                        }}</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Location ID:</label>
                        <span class="value">{{ orderData.locId || "-" }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 물량 정보 -->
              <div class="card mb-3">
                <div class="card-header bg-light">
                  <h6 class="mb-0">
                    <i class="bi bi-boxes me-2"></i>
                    Item Info
                  </h6>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Weight (KG):</label>
                        <span class="value text-end">{{
                          formatNumber(orderData.loadWt)
                        }}</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Volume (CBM):</label>
                        <span class="value text-end">{{
                          formatNumber(orderData.loadVol)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 운송 정보 -->
              <div class="card mb-3">
                <div class="card-header bg-light">
                  <h6 class="mb-0">
                    <i class="bi bi-geo-alt me-2"></i>
                    Transport Info
                  </h6>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Distance (KM):</label>
                        <span class="value text-end">{{
                          formatDistance(orderData.distcVal)
                        }}</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Duration:</label>
                        <span class="value">{{
                          formatTime(orderData.trnsPeridVal)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 시간 정보 -->
              <div class="card">
                <div class="card-header bg-light">
                  <h6 class="mb-0">
                    <i class="bi bi-clock me-2"></i>
                    Timewindow
                  </h6>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Request DateTime:</label>
                        <span class="value">{{
                          formatDate(orderData.reqDate)
                        }}</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Arrival DateTime:</label>
                        <span class="value">{{
                          formatDateTime(orderData.arrDtm)
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Open Time:</label>
                        <span class="value">{{
                          formatCustomerTime(orderData.custOpenTime)
                        }}</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Close Time:</label>
                        <span class="value">{{
                          formatCustomerTime(orderData.custCloseTime)
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="info-item">
                        <label>Departure DateTime:</label>
                        <span class="value">{{
                          formatDateTime(orderData.depDtm)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              <i class="bi bi-x-lg me-1"></i>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div class="modal-backdrop fade show" @click="closeModal"></div>
  </div>
</template>

<script>
import { formatDistanceKM, formatTime24 } from "@/utils/formatUtils";

export default {
  name: "OrderDetailModal",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    orderData: {
      type: Object,
      default: null,
    },
  },
  emits: ["close"],
  watch: {
    isVisible(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
  },
  beforeDestroy() {
    document.body.style.overflow = "";
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    formatNumber(value) {
      if (!value && value !== 0) return "-";
      return Number(value).toLocaleString();
    },
    formatTime(value) {
      if (!value && value !== 0) return "-";
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = value % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },
    formatDistance(value) {
      if (!value && value !== 0) return "-";
      return formatDistanceKM(value);
    },
    formatCustomerTime(value) {
      if (!value) return "-";
      return formatTime24(value);
    },
    formatDate(value) {
      if (!value) return "-";
      try {
        const date = new Date(value);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } catch (e) {
        return value;
      }
    },
    formatDateTime(value) {
      if (!value) return "-";
      try {
        const date = new Date(value);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } catch (e) {
        return value;
      }
    },
  },
};
</script>

<style scoped>
.modal {
  z-index: 1050;
}

.modal-backdrop {
  z-index: 1040;
}

.info-item {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0;
  min-width: 140px;
}

.info-item .value {
  color: #212529;
  font-weight: 500;
  text-align: right;
  flex: 1;
  margin-left: 1rem;
}

.card {
  border: 1px solid #e3e6f0;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  border-radius: 0.35rem;
}

.card-header {
  border-bottom: 1px solid #e3e6f0;
  background-color: #f8f9fc !important;
}

.card-header h6 {
  color: #5a5c69;
  font-weight: 700;
}

.text-end {
  text-align: right !important;
}

.modal-content {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.modal-header {
  border-bottom: 1px solid #e3e6f0;
}

.modal-footer {
  border-top: 1px solid #e3e6f0;
  background-color: #f8f9fc;
}

.btn-close {
  box-shadow: none;
}

.btn-close:focus {
  box-shadow: none;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

/* Custom scrollbar */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
