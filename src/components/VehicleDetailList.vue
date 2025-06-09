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
            v-for="vehicle in selectedVehicles"
            :key="vehicle.id"
            class="vehicle-section mb-4"
          >
            <div class="vehicle-header mb-3">
              <h6 class="text-primary mb-0">
                <i class="bi bi-truck"></i>
                {{ vehicle.name }} ({{ vehicle.type }})
                <span class="badge bg-secondary ms-2">
                  Zone: {{ vehicle.zone }}
                </span>
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
                    <th scope="col">Detail ID</th>
                    <th scope="col">Stop Order</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Address</th>
                    <th scope="col">Load Weight</th>
                    <th scope="col">Load Volume</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Travel Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(detail, detailIndex) in vehicle.detailList"
                    :key="`${vehicle.id}-${detailIndex}`"
                  >
                    <td>{{ detailIndex + 1 }}</td>
                    <td>
                      <span class="badge bg-light text-dark">
                        {{ detail.dtlId || "N/A" }}
                      </span>
                    </td>
                    <td>
                      <span class="badge bg-primary">
                        {{ detail.stopOrder || detail.stopSeq || "N/A" }}
                      </span>
                    </td>
                    <td>{{ detail.customerName || detail.custNm || "N/A" }}</td>
                    <td class="text-truncate" style="max-width: 200px">
                      {{ detail.address || detail.addr || "N/A" }}
                    </td>
                    <td>
                      {{
                        formatWeight(detail.loadWeight || detail.loadWt || 0)
                      }}
                    </td>
                    <td>
                      {{
                        formatVolume(detail.loadVolume || detail.loadCbm || 0)
                      }}
                    </td>
                    <td>
                      {{
                        formatDistance(detail.distance || detail.distcVal || 0)
                      }}
                    </td>
                    <td>
                      {{
                        formatTime(detail.travelTime || detail.trvlTime || 0)
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
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

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
