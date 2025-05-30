<template>
  <div class="driver-list">
    <div>
      <search-bar
        @search="handleSearch"
        @replace-car="handleReplaceCar"
        @unlock="handleUnlock"
      ></search-bar>
      <div class="content">
        <driver-table
          :drivers="filteredDrivers"
          :route-list="routeList"
          :search-term="searchTerm"
          :search-type="searchType"
        ></driver-table>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from "./SearchBar.vue";
import DriverTable from "./DriverTable.vue";

export default {
  name: "DriverList",
  components: {
    SearchBar,
    DriverTable,
  },
  props: {
    routeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchTerm: "",
      searchType: "driver",
    };
  },
  computed: {
    drivers() {
      // routeList 데이터를 driver 형태로 변환
      return this.routeList.map((route, index) => ({
        id: index + 1,
        name: route.vhclId || "",
        type: route.vhclTcd || "Unknown",
        zone: route.zoneId || "",
        stopCount: route.stopRcnt || 0,
        cost: route.totCostAmt || 0,
        loadWeight: route.totLoadWt || 0,
        loadWeightRatio: route.totLoadWtRatio || 0,
        loadVolume: route.totLoadCbm || 0,
        loadVolumeRatio: route.totLoadCbmRatio || 0,
        distance: route.totDistcVal || 0,
        travelTime: route.totTrvlPeridVal || 0,
        ...route, // 원본 데이터도 포함
      }));
    },
    filteredDrivers() {
      let filtered = this.drivers;

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = this.drivers.filter((driver) => {
          if (this.searchType === "driver") {
            return driver.name.toLowerCase().includes(term);
          } else {
            return driver.type.toLowerCase().includes(term);
          }
        });
      }

      // Sort by driver name first, then by driver type if names are the same
      return filtered.sort((a, b) => {
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        const typeA = (a.type || "").toLowerCase();
        const typeB = (b.type || "").toLowerCase();

        // Compare by name first
        const nameComparison = nameA.localeCompare(nameB);
        if (nameComparison !== 0) {
          return nameComparison;
        }

        // If names are the same, compare by type
        return typeA.localeCompare(typeB);
      });
    },
  },
  methods: {
    handleSearch({ term, type }) {
      this.searchTerm = term;
      this.searchType = type;
    },
    handleReplaceCar() {
      console.log("Replace car action triggered");
      // Implement car replacement logic
    },
    handleUnlock() {
      console.log("Unlock action triggered");
      // Implement unlock logic
    },
  },
};
</script>

<style scoped>
.driver-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  transition: all 0.3s ease;
}

.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}

.content {
  flex: 1;
  position: relative;
  overflow: hidden;
  padding: 6px;
  min-height: 0;
}
</style>
