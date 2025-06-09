<template>
  <div class="vehicle-detail-list">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-list-ul"></i>
          Vehicle Detail Information
          <span v-if="totalDetailCount > 0" class="badge bg-primary ms-2">
            {{ totalDetailCount }} items
          </span>
        </h5>
      </div>

      <div class="card-body">
        <div
          v-if="selectedVehicles.length === 0"
          class="text-center text-muted py-4"
        >
          <i class="bi bi-inbox display-4"></i>
          <p class="mt-3">선택된 vehicle이 없습니다</p>
        </div>

        <div v-else>
          <div
            v-for="(zoneData, zoneId) in vehiclesByZone"
            :key="zoneId"
            class="zone-section mb-4"
          >
            <div class="zone-header mb-3">
              <h5 class="text-success mb-2">
                <i class="bi bi-geo-alt"></i>
                Zone: {{ zoneId }}
                <span class="badge bg-success ms-2">
                  {{ zoneData.vehicles.length }} vehicles
                </span>
              </h5>

              <!-- Zone 합계 정보 -->
              <div class="zone-summary">
                <div class="row g-2">
                  <div class="col-md-3">
                    <div class="summary-card">
                      <small class="text-muted">Vehicle IDs</small>
                      <div class="fw-bold">
                        {{ zoneData.summary.vhclIds.join(", ") || "N/A" }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="summary-card">
                      <small class="text-muted">Vehicle Types</small>
                      <div class="fw-bold">
                        {{
                          [...new Set(zoneData.summary.vhclTcds)].join(", ") ||
                          "N/A"
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="summary-card">
                      <small class="text-muted">Total Weight</small>
                      <div class="fw-bold text-primary">
                        {{ formatWeight(zoneData.summary.totLoadWt) }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="summary-card">
                      <small class="text-muted">Total Volume</small>
                      <div class="fw-bold text-info">
                        {{ formatVolume(zoneData.summary.totLoadCbm) }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="summary-card">
                      <small class="text-muted">Total Distance</small>
                      <div class="fw-bold text-warning">
                        {{ formatDistance(zoneData.summary.totDistcVal) }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="summary-card">
                      <small class="text-muted">Total Time</small>
                      <div class="fw-bold text-danger">
                        {{ formatTime(zoneData.summary.totTrvlPeridVal) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-for="vehicle in zoneData.vehicles"
              :key="vehicle.id"
              class="vehicle-section mb-3 ms-3"
            >
              <div class="vehicle-header mb-3">
                <h6 class="text-primary mb-0">
                  <i class="bi bi-truck"></i>
                  {{ vehicle.name }} ({{ vehicle.type }})
                  <span
                    v-if="vehicle.detailList && vehicle.detailList.length > 0"
                    class="badge bg-info ms-1"
                  >
                    {{ vehicle.detailList.length }} details
                  </span>
                </h6>
              </div>

              <div
                v-if="!vehicle.detailList || vehicle.detailList.length === 0"
                class="text-muted small"
              >
                이 vehicle에 대한 detail 정보가 없습니다.
              </div>

              <div v-else class="table-responsive">
                <table class="table table-striped table-hover table-sm">
                  <thead class="table-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Order ID</th>
                      <th scope="col">Weight(KG)</th>
                      <th scope="col">Volume(CBM)</th>
                      <th scope="col">Distance(KM)</th>
                      <th scope="col">Duration</th>
                      <th scope="col">Request Time</th>
                      <th scope="col">Customer Time</th>
                      <th scope="col">Arrival Time</th>
                      <th scope="col">Departure Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(detail, detailIndex) in vehicle.detailList"
                      :key="`${vehicle.id}-${detailIndex}`"
                    >
                      <td>{{ detailIndex + 1 }}</td>

                      <td>
                        {{ detail.orderId || detail.locId }}
                      </td>

                      <td>
                        {{ detail.loadWt }}
                      </td>
                      <td>
                        {{ detail.loadVol }}
                      </td>
                      <td>{{ formatDistanceKM(detail.distcVal) }}</td>
                      <td>
                        {{ formatSecondsToTime(detail.trnsPeridVal) }}
                      </td>
                      <td>
                        {{ detail.reqDate }}
                      </td>
                      <td>
                        {{ formatTime24(detail.custOpenTime) }} ~
                        {{ formatTime24(detail.custCloseTime) }}
                      </td>
                      <td>
                        {{ detail.arrDtm }}
                      </td>
                      <td>
                        {{ detail.depDtm }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="table-secondary">
                    <tr>
                      <td colspan="2" class="text-end fw-bold">Total:</td>

                      <td class="fw-bold">
                        {{
                          formatDecimal(
                            calculateVehicleTotal(vehicle.detailList, "loadWt"),
                            1
                          )
                        }}
                      </td>
                      <td class="fw-bold">
                        {{
                          formatDecimal(
                            calculateVehicleTotal(
                              vehicle.detailList,
                              "loadVol"
                            ),
                            1
                          )
                        }}
                      </td>
                      <td class="fw-bold">
                        {{
                          formatDistanceKM(
                            calculateVehicleTotal(
                              vehicle.detailList,
                              "distcVal"
                            )
                          )
                        }}
                      </td>
                      <td class="fw-bold">
                        {{
                          formatSecondsToTime(
                            calculateVehicleTotal(
                              vehicle.detailList,
                              "trnsPeridVal"
                            )
                          )
                        }}
                      </td>
                      <td colspan="4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VehicleDetailList",
  props: {
    selectedVehicles: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    totalDetailCount() {
      return this.selectedVehicles.reduce((total, vehicle) => {
        return total + (vehicle.detailList ? vehicle.detailList.length : 0);
      }, 0);
    },
    vehiclesByZone() {
      const grouped = {};
      this.selectedVehicles.forEach((vehicle) => {
        const zoneId = vehicle.zone || "Unknown Zone";
        if (!grouped[zoneId]) {
          grouped[zoneId] = {
            vehicles: [],
            summary: {
              totLoadWt: 0,
              totLoadCbm: 0,
              totDistcVal: 0,
              totTrvlPeridVal: 0,
              vhclIds: [],
              vhclTcds: [],
            },
          };
        }

        grouped[zoneId].vehicles.push(vehicle);

        // 합계 계산
        const summary = grouped[zoneId].summary;
        summary.totLoadWt += Number(vehicle.totLoadWt || 0);
        summary.totLoadCbm += Number(vehicle.totLoadCbm || 0);
        summary.totDistcVal += Number(vehicle.totDistcVal || 0);
        summary.totTrvlPeridVal += Number(vehicle.totTrvlPeridVal || 0);

        // vhclId와 vhclTcd 수집
        if (vehicle.vhclId) summary.vhclIds.push(vehicle.vhclId);
        if (vehicle.vhclTcd) summary.vhclTcds.push(vehicle.vhclTcd);
      });
      return grouped;
    },
  },
  methods: {
    formatWeight(value) {
      if (!value || value === 0) return "-";
      return Number(value).toLocaleString() + " kg";
    },
    formatVolume(value) {
      if (!value || value === 0) return "-";
      return Number(value).toLocaleString() + " m³";
    },
    formatDistance(value) {
      if (!value || value === 0) return "-";
      return Number(value).toLocaleString() + " km";
    },
    formatTime(value) {
      if (!value || value === 0) return "-";
      return Number(value).toLocaleString() + " min";
    },
    formatTime24(timeString) {
      if (!timeString || timeString === "000000") return "00:00:00";

      // 6자리 숫자 문자열을 HH:MM:SS 형식으로 변환
      const timeStr = timeString.toString().padStart(6, "0");
      const hours = timeStr.substring(0, 2);
      const minutes = timeStr.substring(2, 4);
      const seconds = timeStr.substring(4, 6);

      return `${hours}:${minutes}:${seconds}`;
    },
    formatDistanceKM(value) {
      if (!value) return "-";

      // 문자를 숫자로 변환하고 1000으로 나눈 후 정수로 반올림
      const numValue = Number(value);
      if (isNaN(numValue)) return "-";

      const kmValue = Math.round(numValue / 1000);
      return `${kmValue}`;
    },
    formatSecondsToTime(seconds) {
      if (!seconds || seconds === 0) return "00:00:00";

      // 초를 숫자로 변환
      const totalSeconds = Number(seconds);
      if (isNaN(totalSeconds)) return "00:00:00";

      // 시, 분, 초 계산
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const remainingSeconds = totalSeconds % 60;

      // 2자리로 패딩하여 hh:mm:ss 형식으로 반환
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    },
    calculateVehicleTotal(detailList, field) {
      if (!detailList || detailList.length === 0) return 0;

      return detailList.reduce((total, detail) => {
        const value = Number(detail[field] || 0);
        return total + value;
      }, 0);
    },
    formatDecimal(value, decimals) {
      if (!value || value === 0) return "0.0";
      return Number(value).toFixed(decimals);
    },
  },
};
</script>

<style scoped>
.vehicle-detail-list {
  height: 100%;
  overflow: hidden;
}

.card {
  height: 100%;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 1.25rem;
}

.card-body {
  padding: 1.25rem;
  overflow-y: auto;
  height: calc(100% - 80px);
}

.zone-section {
  border: 2px solid #198754;
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: #f8fff9;
  margin-bottom: 2rem;
}

.zone-header {
  border-bottom: 2px solid #198754;
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
}

.zone-summary {
  margin-top: 1rem;
}

.summary-card {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 0.75rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-card small {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.zone-summary {
  margin-top: 1rem;
}

.summary-card {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 0.75rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.vehicle-section {
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 1rem;
  background-color: #fdfdfe;
}

.vehicle-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}

.table th {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table td {
  font-size: 0.875rem;
  vertical-align: middle;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  font-size: 0.75rem;
}

/* Bootstrap Icons */
.bi {
  font-family: bootstrap-icons !important;
}

/* Bootstrap Utility Classes */
.text-muted {
  color: #6c757d !important;
}

.text-primary {
  color: #0d6efd !important;
}

.text-center {
  text-align: center !important;
}

.text-dark {
  color: #212529 !important;
}

.display-4 {
  font-size: 3.5rem !important;
}

.py-4 {
  padding-top: 1.5rem !important;
  padding-bottom: 1.5rem !important;
}

.mt-3 {
  margin-top: 1rem !important;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mb-3 {
  margin-bottom: 1rem !important;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}

.ms-1 {
  margin-left: 0.25rem !important;
}

.ms-2 {
  margin-left: 0.5rem !important;
}

.small {
  font-size: 0.875em !important;
}

/* Bootstrap Card Styles */
.bg-primary {
  background-color: #0d6efd !important;
  color: white !important;
}

.bg-secondary {
  background-color: #6c757d !important;
  color: white !important;
}

.bg-info {
  background-color: #0dcaf0 !important;
  color: black !important;
}

.bg-success {
  background-color: #198754 !important;
  color: white !important;
}

.text-success {
  color: #198754 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.text-info {
  color: #0dcaf0 !important;
}

.fw-bold {
  font-weight: 700 !important;
}

.bg-light {
  background-color: #f8f9fa !important;
}

/* Bootstrap Table Styles */
.table {
  --bs-table-bg: transparent;
  --bs-table-accent-bg: transparent;
  --bs-table-striped-bg: rgba(0, 0, 0, 0.05);
  --bs-table-hover-bg: rgba(0, 0, 0, 0.075);
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
  vertical-align: top;
  border-color: #dee2e6;
}

.table > :not(caption) > * > * {
  padding: 0.5rem 0.5rem;
  background-color: var(--bs-table-bg);
  border-bottom-width: 1px;
  box-shadow: inset 0 0 0 9999px var(--bs-table-accent-bg);
}

.table-striped > tbody > tr:nth-of-type(odd) > * {
  --bs-table-accent-bg: var(--bs-table-striped-bg);
  color: var(--bs-table-striped-color);
}

.table-hover > tbody > tr:hover > * {
  --bs-table-accent-bg: var(--bs-table-hover-bg);
  color: var(--bs-table-hover-color);
}

.table-sm > :not(caption) > * > * {
  padding: 0.25rem 0.25rem;
}

.table-dark {
  --bs-table-bg: #212529;
  --bs-table-striped-bg: #2c3034;
  --bs-table-hover-bg: #373b3e;
  color: #fff;
  border-color: #373b3e;
}

.table-secondary {
  --bs-table-bg: #e9ecef;
  color: #000;
  border-color: #dee2e6;
}

.table tfoot td {
  font-weight: 600;
  border-top: 2px solid #dee2e6;
  background-color: var(--bs-table-bg);
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Bootstrap Grid */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.75rem;
  margin-right: -0.75rem;
}

.col-md-1,
.col-md-2,
.col-md-3,
.col-md-6 {
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

@media (min-width: 768px) {
  .col-md-1 {
    flex: 0 0 8.333333%;
    max-width: 8.333333%;
  }
  .col-md-2 {
    flex: 0 0 16.666667%;
    max-width: 16.666667%;
  }
  .col-md-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

.g-2 > * {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-bottom: 1rem;
}

.fw-bold {
  font-weight: 700 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.text-end {
  text-align: center !important;
}
</style>
