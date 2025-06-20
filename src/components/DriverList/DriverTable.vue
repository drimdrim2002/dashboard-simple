<template>
  <div class="driver-table">
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr class="bg-light">
            <th class="checkbox-column">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :checked="allSelected"
                  @change="toggleAllDrivers"
                  @click.stop
                />
              </div>
            </th>
            <th class="seq-column">Seq</th>

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
            v-for="(driver, index) in paginatedDrivers"
            :key="`driver-${driver.id}-${currentPage}`"
            :data-driver-id="driver.id"
            class="align-middle"
            :class="{ selected: isDriverSelected(driver.id) }"
            @click="handleRowClick(driver.id, $event)"
          >
            <td
              class="checkbox-column"
              @click.stop="handleCheckboxClick(driver.id, $event)"
            >
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :checked="isDriverSelected(driver.id)"
                  @change="handleCheckboxChange(driver.id, $event)"
                  @click.stop
                />
              </div>
            </td>
            <td class="seq-column">{{ index + showingStart }}</td>

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

    <!-- Pagination -->
    <div class="pagination-container">
      <div class="entries-info">
        Showing {{ showingStart }} to {{ showingEnd }} of
        {{ sortedDrivers.length }} entries
        <span v-if="selectedDrivers.length > 0" class="selected-info">
          ({{ selectedDrivers.length }} selected)
        </span>
      </div>
      <div class="pagination-controls">
        <button
          @click="goToFirstPage"
          :disabled="currentPage === 1 || sortedDrivers.length === 0"
          class="pagination-btn"
        >
          First
        </button>
        <button
          @click="prevPage"
          :disabled="currentPage === 1 || sortedDrivers.length === 0"
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages || sortedDrivers.length === 0"
          class="pagination-btn"
        >
          Next
        </button>
        <button
          @click="goToLastPage"
          :disabled="currentPage === totalPages || sortedDrivers.length === 0"
          class="pagination-btn"
        >
          Last
        </button>
      </div>
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
import {
  formatNumberWithCommas,
  formatWeight,
  formatDistanceKM,
  formatSecondsToTime,
} from "@/utils/formatUtils";

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
      currentPage: 1,
      itemsPerPage: 10,
      isProcessingSelection: false, // 중복 처리 방지
    };
  },
  computed: {
    allSelected() {
      return (
        this.paginatedDrivers.length > 0 &&
        this.paginatedDrivers.every((driver) =>
          this.selectedDrivers.includes(driver.id)
        )
      );
    },
    sortedDrivers() {
      if (!this.sortColumn) {
        return this.drivers;
      }

      return [...this.drivers].sort((a, b) => {
        let aValue = a[this.sortColumn];
        let bValue = b[this.sortColumn];

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        // Convert values based on column type
        if (
          this.sortColumn === "stopCount" ||
          this.sortColumn === "cost" ||
          this.sortColumn === "loadWeight" ||
          this.sortColumn === "distance" ||
          this.sortColumn === "travelTime"
        ) {
          // Numeric columns
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        } else {
          // String columns (name, type, zone)
          aValue = String(aValue || "").toLowerCase();
          bValue = String(bValue || "").toLowerCase();
        }

        // Compare values
        let result = 0;
        if (aValue < bValue) {
          result = -1;
        } else if (aValue > bValue) {
          result = 1;
        }

        return this.sortDirection === "desc" ? -result : result;
      });
    },
    paginatedDrivers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedDrivers.slice(start, end);
    },
    totalPages() {
      return Math.max(
        1,
        Math.ceil(this.sortedDrivers.length / this.itemsPerPage)
      );
    },
    showingStart() {
      return this.sortedDrivers.length === 0
        ? 0
        : (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    showingEnd() {
      const end = this.currentPage * this.itemsPerPage;
      return Math.min(end, this.sortedDrivers.length);
    },
  },
  methods: {
    // 개선된 이벤트 핸들러들
    isDriverSelected(driverId) {
      return this.selectedDrivers.includes(driverId);
    },

    handleRowClick(driverId, event) {
      // 다른 요소에서 이벤트가 발생한 경우 무시
      if (
        event.target.closest(".checkbox-column") ||
        event.target.closest(".sortable") ||
        event.target.closest("button")
      ) {
        return;
      }

      this.toggleDriverSelection(driverId);
    },

    handleCheckboxClick(driverId, event) {
      event.stopPropagation();
      this.toggleDriverSelection(driverId);
    },

    handleCheckboxChange(driverId, event) {
      event.stopPropagation();
      // 체크박스 상태와 실제 선택 상태가 다른 경우에만 처리
      const isChecked = event.target.checked;
      const isSelected = this.isDriverSelected(driverId);

      if (isChecked !== isSelected) {
        this.toggleDriverSelection(driverId);
      }
    },

    toggleAllDrivers(event) {
      if (this.isProcessingSelection) return;
      this.isProcessingSelection = true;

      try {
        const isChecked = event.target.checked;

        if (isChecked) {
          // 현재 페이지의 모든 드라이버를 선택에 추가
          this.paginatedDrivers.forEach((driver) => {
            if (!this.selectedDrivers.includes(driver.id)) {
              this.selectedDrivers.push(driver.id);
            }
          });
        } else {
          // 현재 페이지의 모든 드라이버를 선택에서 제거
          const currentPageIds = this.paginatedDrivers.map(
            (driver) => driver.id
          );
          this.selectedDrivers = this.selectedDrivers.filter(
            (id) => !currentPageIds.includes(id)
          );
        }

        this.emitSelectedDrivers();
      } finally {
        // 처리 시간 단축으로 클릭 응답성 개선
        setTimeout(() => {
          this.isProcessingSelection = false;
        }, 30);
      }
    },

    toggleDriverSelection(driverId) {
      if (this.isProcessingSelection) return;
      this.isProcessingSelection = true;

      try {
        const index = this.selectedDrivers.indexOf(driverId);
        if (index === -1) {
          this.selectedDrivers.push(driverId);
        } else {
          this.selectedDrivers.splice(index, 1);
        }

        this.emitSelectedDrivers();
      } finally {
        this.$nextTick(() => {
          this.isProcessingSelection = false;
        });
      }
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
        // Reset to first page when changing sort column
        this.currentPage = 1;
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
    formatCurrency: formatNumberWithCommas,
    formatWeight,
    formatDistance: formatDistanceKM,
    formatTime: formatSecondsToTime,
    goToFirstPage() {
      this.currentPage = 1;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToLastPage() {
      this.currentPage = this.totalPages;
    },
    emitSelectedDrivers() {
      const selectedDriversInfo = this.drivers.filter((driver) =>
        this.selectedDrivers.includes(driver.id)
      );
      this.$emit("drivers-selected", selectedDriversInfo);
    },

    isSameDriverList(newList, oldList) {
      // 길이가 다르면 다른 리스트
      if (newList.length !== oldList.length) return false;

      // 모든 드라이버의 ID가 같은 순서로 있는지 확인
      return newList.every((driver, index) => driver.id === oldList[index].id);
    },
  },
  watch: {
    drivers: {
      handler(newDrivers, oldDrivers) {
        // 배열의 길이나 ID 구성이 실제로 변경된 경우에만 초기화
        if (
          !oldDrivers ||
          newDrivers.length !== oldDrivers.length ||
          !this.isSameDriverList(newDrivers, oldDrivers)
        ) {
          this.selectedDrivers = [];
        }
      },
      immediate: false,
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
  height: calc(100vh - 150px);
  max-height: 800px;
  display: flex;
  flex-direction: column;
}

.table-responsive {
  height: calc(100vh - 150px);
  min-height: 300px;
  max-height: 560px;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #dee2e6;
  flex: 1;
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
  padding: 0.5rem 0.75rem;
  vertical-align: middle;
  background-color: #f8f9fa;
}

.table tbody tr {
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.table tbody tr:hover .form-check-input {
  border-color: #0d6efd;
}

.table tbody tr.selected {
  background-color: #e7f1ff;
}

.table tbody tr.selected:hover {
  background-color: #d4e5ff;
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
  width: 40px;
  text-align: center;
  padding: 0.5rem;
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
.align-middle {
  vertical-align: middle !important;
  font-size: 0.8rem !important;
}
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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 1.5rem;
  margin: 0;
  padding: 0;
}
.form-check-input {
  width: 1.25em;
  height: 1.25em;
  margin: 0;
  cursor: pointer;
  border: 2px solid #dee2e6;
  transition: all 0.2s ease;
}

.form-check-input:hover {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-check-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
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
  min-width: 100px;
  font-size: 0.75rem;
}

.sortable:hover {
  background-color: #e9ecef !important;
}

.sort-icon {
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

.pagination-container {
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  border-radius: 0 0 8px 8px;
}

.entries-info {
  font-size: 0.75rem;
  color: #6c757d;
}

.selected-info {
  color: #0d6efd;
  font-weight: 600;
  margin-left: 0.5rem;
}

.page-info {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
}

.pagination-btn {
  padding: 0.25rem 0.5rem;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.75rem;
}

.pagination-btn:hover {
  background-color: #f8f9fa;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
