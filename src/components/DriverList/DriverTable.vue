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
            <th class="sortable" @click="sortBy('lockStatus')">
              Lock
              <i class="sort-icon" :class="getSortIcon('lockStatus')"></i>
            </th>
            <th class="sortable" @click="sortBy('statusColor')">
              Status
              <i class="sort-icon" :class="getSortIcon('statusColor')"></i>
            </th>
            <th class="sortable" @click="sortBy('name')">
              Driver
              <i class="sort-icon" :class="getSortIcon('name')"></i>
            </th>
            <th class="sortable" @click="sortBy('type')">
              Driver Type
              <i class="sort-icon" :class="getSortIcon('type')"></i>
            </th>
            <th class="sortable" @click="sortBy('time')">
              Time
              <i class="sort-icon" :class="getSortIcon('time')"></i>
            </th>
            <th class="sortable" @click="sortBy('orders')">
              Orders
              <i class="sort-icon" :class="getSortIcon('orders')"></i>
            </th>
            <th class="sortable" @click="sortBy('distance')">
              Distance
              <i class="sort-icon" :class="getSortIcon('distance')"></i>
            </th>
            <th class="actions-column">Actions</th>
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
            <td>
              <span
                class="lock-icon"
                :class="driver.lockStatus ? 'locked' : 'unlocked'"
              >
                <i
                  :class="
                    driver.lockStatus ? 'bi bi-lock-fill' : 'bi bi-unlock'
                  "
                ></i>
              </span>
            </td>
            <td>
              <span
                class="status-badge"
                :style="{ backgroundColor: getStatusColor(driver.statusColor) }"
              >
                {{ getColorStatus(driver.statusColor) }}
              </span>
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
            <td>{{ driver.time }}</td>
            <td>
              <span class="orders-badge">{{ driver.orders }}</span>
            </td>
            <td>{{ driver.distance }} km</td>
            <td class="actions-column">
              <div class="btn-group">
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="viewDriver(driver)"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="editDriver(driver)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
              </div>
            </td>
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
    <div
      class="pagination-container mt-3 d-flex justify-content-between align-items-center"
    >
      <div class="showing-entries text-muted small">
        Showing {{ drivers.length }} entries
      </div>
      <nav aria-label="Driver table navigation">
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item disabled">
            <a class="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item active"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
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
          // Priority sorting by status
          if (this.sortColumn === "status") {
            const statusOrder = { active: 1, waiting: 2, offline: 3 };
            aValue =
              (statusOrder[aValue] || 999) - (statusOrder[bValue] || 999);
          } else if (this.sortColumn === "lockStatus") {
            aValue = aValue ? 1 : 0;
            bValue = bValue ? 1 : 0;
          } else if (this.sortColumn === "statusColor") {
            // Priority sorting by status
            const statusPriority = {
              "#4caf50": 1, // Active
              "#2196f3": 2, // En Route
              "#ff9800": 3, // Standby
              "#f44336": 4, // Offline
            };
            aValue = statusPriority[aValue] || 5;
            bValue = statusPriority[bValue] || 5;
          } else if (this.sortColumn === "orders") {
            aValue = parseInt(aValue) || 0;
            bValue = parseInt(bValue) || 0;
          } else if (this.sortColumn === "distance") {
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
          } else if (this.sortColumn === "name" || this.sortColumn === "type") {
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
    viewDriver(driver) {
      console.log("View driver:", driver.id);
      // Implementation for viewing driver details
    },
    editDriver(driver) {
      console.log("Edit driver:", driver.id);
      // Implementation for editing driver
    },
    getStatusColor(color) {
      // Status color mapping
      const colorMap = {
        "#4caf50": "#4caf50", // Green (Active)
        "#ff9800": "#ff9800", // Orange (Waiting)
        "#f44336": "#f44336", // Red (Offline)
        "#2196f3": "#2196f3", // Blue (Moving)
      };
      return colorMap[color] || color;
    },
    getColorStatus(color) {
      // Return status text based on color
      const statusMap = {
        "#4caf50": "Active",
        "#ff9800": "Waiting",
        "#f44336": "Offline",
        "#2196f3": "Moving",
      };
      return statusMap[color] || "Unknown";
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
  },
};
</script>

<style scoped>
.driver-table {
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-responsive {
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}

.table {
  margin-bottom: 0;
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

.actions-column {
  width: 100px;
  text-align: right;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  min-width: 70px;
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

.lock-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.lock-icon.locked {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
}

.lock-icon.unlocked {
  color: #28a745;
  background-color: rgba(40, 167, 69, 0.1);
}

.empty-state {
  padding: 3rem 0;
  background-color: #fff;
}

.pagination-container {
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.page-link {
  color: #495057;
  border-color: #dee2e6;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
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

.pagination {
  display: flex;
  padding-left: 0;
  list-style: none;
}

.page-item:not(:first-child) .page-link {
  margin-left: -1px;
}

.page-link {
  position: relative;
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #dee2e6;
}

.pagination-sm .page-link {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

.page-item.active .page-link {
  z-index: 3;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
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
