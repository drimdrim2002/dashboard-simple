<template>
  <div>
    <dashboard-stats />
    <div class="container">
      <driver-list :style="{ width: driverListWidth }" />
      <button class="toggle-button" :class="buttonPosition" @click="toggleView">
        <svg
          class="arrow-icon"
          viewBox="0 0 24 24"
          :style="{ transform: viewState === 0 ? 'rotate(180deg)' : 'none' }"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <map-view :style="{ width: mapViewWidth }" />
    </div>
  </div>
</template>

<script>
import DashboardStats from "./components/Dashboard/DashboardStats.vue";
import DriverList from "./components/DriverList/DriverList.vue";
import MapView from "./components/Map/MapView.vue";

export default {
  name: "App",
  components: {
    DashboardStats,
    DriverList,
    MapView,
  },
  data() {
    return {
      viewState: 1,
    };
  },
  computed: {
    buttonPosition() {
      return {
        left: this.viewState === 0,
        center: this.viewState === 1,
        right: this.viewState === 2,
      };
    },
    driverListWidth() {
      switch (this.viewState) {
        case 0:
          return "0%";
        case 1:
          return "40%";
        case 2:
          return "100%";
        default:
          return "40%";
      }
    },
    mapViewWidth() {
      switch (this.viewState) {
        case 0:
          return "100%";
        case 1:
          return "60%";
        case 2:
          return "0%";
        default:
          return "60%";
      }
    },
  },
  methods: {
    toggleView() {
      switch (this.viewState) {
        case 0:
          this.viewState = 2;
          break;
        case 1:
          this.viewState = 0;
          break;
        case 2:
          this.viewState = 1;
          break;
      }
      this.$nextTick(() => {
        this.$emit("map-resize");
      });
    },
  },
};
</script>

<style>
body,
html {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #f0f0f0;
}

.container {
  position: relative;
  display: flex;
  height: 700px;
  width: 100%;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  fill: #666;
  transition: transform 0.3s ease;
}

.toggle-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  width: 24px;
  height: 60px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-button.left {
  left: 0;
}

.toggle-button.center {
  left: 40%;
  transform: translateX(-50%) translateY(-50%);
}

.toggle-button.right {
  right: 0;
}

.toggle-button:hover .arrow-icon {
  fill: #333;
}
</style>
