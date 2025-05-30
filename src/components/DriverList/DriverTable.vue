<template>
  <div class="driver-table">
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr class="bg-light">
            <th class="seq-column">Seq</th>
            <th class="checkbox-column">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :checked="allSelected"
                  @change="toggleAllDrivers"
                />
              </div>
            </th>
            <th class="sortable" @click="sortBy('name')">
              Vehicle ID
              <i class="sort-icon" :class="getSortIcon('name')"></i>
            </th>
            <th class="sortable" @click="sortBy('type')">
              Vehicle Type
              <i class="sort-icon" :class="getSortIcon('type')"></i>
            </th>
            <th class="sortable" @click="sortBy('zone')">
              Zone ID
              <i class="sort-icon" :class="getSortIcon('zone')"></i>
            </th>
            <th class="sortable" @click="sortBy('stopCount')">
              Stop Count
              <i class="sort-icon" :class="getSortIcon('stopCount')"></i>
            </th>
            <th class="sortable" @click="sortBy('cost')">
              Cost
              <i class="sort-icon" :class="getSortIcon('cost')"></i>
            </th>
            <th class="sortable" @click="sortBy('loadWeight')">
              Load Weight
              <i class="sort-icon" :class="getSortIcon('loadWeight')"></i>
            </th>
            <th class="sortable" @click="sortBy('distance')">
              Distance
              <i class="sort-icon" :class="getSortIcon('distance')"></i>
            </th>
            <th class="sortable" @click="sortBy('travelTime')">
              Travel Time
              <i class="sort-icon" :class="getSortIcon('travelTime')"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(driver, index) in sortedDrivers"
            :key="driver.id"
            :data-driver-id="driver.id"
            class="align-middle"
          >
            <td class="seq-column">{{ index + 1 }}</td>
            <td class="checkbox-column">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="selectedDrivers"
                  :value="driver.id"
                />
              </div>
            </td>
            <td class="fw-medium">{{ driver.name }}</td>
            <td>
              <span
                class="driver-type-badge"
                :class="getDriverTypeClass(driver.type)"
              >
                {{ driver.type }}
              </span>
            </td>
            <td>{{ driver.zone }}</td>
            <td>
              <span class="orders-badge">{{ driver.stopCount }}</span>
            </td>
            <td>{{ formatCurrency(driver.cost) }}</td>
            <td>{{ formatWeight(driver.loadWeight) }}</td>
            <td>{{ formatDistance(driver.distance) }}</td>
            <td>{{ formatTime(driver.travelTime) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="drivers.length === 0" class="empty-state">
      <div class="text-center p-4">
        <i class="bi bi-car-front display-4 text-muted"></i>
        <p class="mt-3 text-muted">No drivers found</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DriverTable",
  props: {
    drivers: {
      type: Array,
      required: true,
    },
    routeList: {
      type: Array,
      default: () => [],
    },
    searchTerm: {
      type: String,
      default: "",
    },
    searchType: {
      type: String,
      default: "driver",
    },
  },
  data() {
    return {
      selectedDrivers: [],
      sortColumn: null,
      sortDirection: "asc", // 'asc' or 'desc'
    };
  },
  computed: {
    allSelected() {
      return (
        this.drivers.length > 0 &&
        this.selectedDrivers.length === this.drivers.length
      );
    },
    sortedDrivers() {
      if (!this.sortColumn) {
        return this.drivers;
      }

      return [...this.drivers].sort((a, b) => {
        let aValue = a[this.sortColumn];
        let bValue = b[this.sortColumn];

        // Special sorting for different types
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.localeCompare(bValue);
        } else {
          if (
            this.sortColumn === "stopCount" ||
            this.sortColumn === "cost" ||
            this.sortColumn === "loadWeight" ||
            this.sortColumn === "travelTime"
          ) {
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
          } else if (this.sortColumn === "distance") {
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
          } else if (
            this.sortColumn === "name" ||
            this.sortColumn === "type" ||
            this.sortColumn === "zone"
          ) {
            aValue = (aValue || "").toLowerCase();
            bValue = (bValue || "").toLowerCase();
          }
        }

        let result = 0;
        if (aValue < bValue) {
          result = -1;
        } else if (aValue > bValue) {
          result = 1;
        }

        return this.sortDirection === "desc" ? -result : result;
      });
    },
  },
  methods: {
    toggleAllDrivers(event) {
      this.selectedDrivers = event.target.checked
        ? this.drivers.map((driver) => driver.id)
        : [];
    },
    getDriverTypeClass(type) {
      // Return class based on driver type
      const typeMap = {
        "Full-time": "type-full",
        "Part-time": "type-part",
        Contract: "type-contract",
        Temporary: "type-temp",
      };
      return typeMap[type] || "type-default";
    },
    sortBy(column) {
      if (this.sortColumn === column) {
        // Change sort direction if same column is clicked
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        // Sort ascending if different column is clicked
        this.sortColumn = column;
        this.sortDirection = "asc";
      }
    },
    getSortIcon(column) {
      if (this.sortColumn !== column) {
        return "bi bi-arrow-down-up"; // Unsorted state
      }
      return this.sortDirection === "asc"
        ? "bi bi-arrow-up"
        : "bi bi-arrow-down";
    },
    formatCurrency(value) {
      // Implement currency formatting logic
      return value.toLocaleString();
    },
    formatWeight(value) {
      // Implement weight formatting logic
      return value.toLocaleString() + " kg";
    },
    formatDistance(value) {
      // Implement distance formatting logic
      return value.toLocaleString() + " km";
    },
    formatTime(value) {
      // Implement time formatting logic
      return value.toLocaleString() + " minutes";
    },
  },
};
</script>

<style scoped>
.driver-table {
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-responsive {
  height: calc(100vh - 400px);
  min-height: 250px;
  max-height: 500px;
  overflow-y: scroll;
  overflow-x: auto;
  border: 1px solid #dee2e6;
}

/* 스크롤바 스타일 */
.table-responsive::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.table-responsive::-webkit-scrollbar-corner {
  background: #f1f1f1;
}

.table {
  margin-bottom: 0;
  min-width: 1200px;
}

.table thead th {
  border-top: none;
  border-bottom: 1px solid #dee2e6;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.75rem 1rem;
  vertical-align: middle;
  background-color: #f8f9fa;
}

.table tbody tr {
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
  transition: background-color 0.2s;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.table td {
  padding: 0.75rem 1rem;
  vertical-align: middle;
  border-top: none;
}

.seq-column {
  width: 50px;
  text-align: center;
  font-weight: 500;
  color: #6c757d;
}

.checkbox-column {
  width: 30px;
  text-align: center;
}

.driver-type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.type-full {
  background-color: #e3f2fd;
  color: #1976d2;
}

.type-part {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.type-contract {
  background-color: #e8f5e9;
  color: #388e3c;
}

.type-temp {
  background-color: #fff3e0;
  color: #e65100;
}

.type-default {
  background-color: #f5f5f5;
  color: #616161;
}

.orders-badge {
  background-color: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.empty-state {
  padding: 3rem 0;
  background-color: #fff;
}

/* Bootstrap Icons (Should be loaded via CDN) */
.bi {
  font-family: bootstrap-icons !important;
}

/* Bootstrap Utility Classes (Should load Bootstrap CSS) */
.text-muted {
  color: #6c757d !important;
}
.fw-medium {
  font-weight: 500 !important;
}
.small {
  font-size: 0.875em !important;
}
.mt-3 {
  margin-top: 1rem !important;
}
.p-4 {
  padding: 1.5rem !important;
}
.mb-0 {
  margin-bottom: 0 !important;
}
.d-flex {
  display: flex !important;
}
.justify-content-between {
  justify-content: space-between !important;
}
.align-items-center {
  align-items: center !important;
}
.text-center {
  text-align: center !important;
}
.display-4 {
  font-size: 3.5rem !important;
}

.form-check {
  display: block;
  min-height: 1.5rem;
  padding-left: 1.5em;
  margin-bottom: 0.125rem;
}
.form-check-input {
  width: 1em;
  height: 1em;
  margin-top: 0.25em;
  margin-left: -1.5em;
  cursor: pointer;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s,
    box-shadow 0.15s;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
}

.btn-group {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
}

.btn-outline-primary {
  color: #0d6efd;
  border-color: #0d6efd;
}
.btn-outline-primary:hover {
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}
.btn-outline-secondary:hover {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: background-color 0.2s;
}

.sortable:hover {
  background-color: #e9ecef !important;
}

.sort-icon {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.sortable:hover .sort-icon {
  opacity: 1;
}

.sortable .sort-icon.bi-arrow-up,
.sortable .sort-icon.bi-arrow-down {
  opacity: 1;
  color: #0d6efd;
}
</style>
