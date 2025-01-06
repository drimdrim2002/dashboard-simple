<template>
  <div class="driver-list">
    <div class="header">
      <h1>Driver List</h1>
    </div>
    <div>
      <search-bar
        @search="handleSearch"
        @replace-car="handleReplaceCar"
        @unlock="handleUnlock"
      ></search-bar>
      <div class="content">
        <driver-table
          :drivers="filteredDrivers"
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
  data() {
    return {
      drivers: [],
      searchTerm: "",
      searchType: "driver",
    };
  },
  computed: {
    filteredDrivers() {
      if (!this.searchTerm) return this.drivers;

      const term = this.searchTerm.toLowerCase();
      return this.drivers.filter((driver) => {
        if (this.searchType === "driver") {
          return driver.name.toLowerCase().includes(term);
        } else {
          return driver.type.toLowerCase().includes(term);
        }
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
    loadDriverData() {
      fetch("driver_data.json")
        .then((response) => response.json())
        .then((data) => {
          this.drivers = data.drivers;
        })
        .catch((error) => console.error("Error loading driver data:", error));
    },
  },
  created() {
    this.loadDriverData();
  },
};
</script>

<style scoped>
.driver-list {
  display: flex;
  flex-direction: column;
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
}

.content {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  padding: 20px;
}
</style>
