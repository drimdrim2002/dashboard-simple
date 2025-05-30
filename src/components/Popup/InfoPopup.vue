<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="popup" @click.stop>
      <h3>Detailed Information</h3>
      <p id="popup-content">Selected number: {{ formatNumber(number) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoPopup",
  data() {
    return {
      show: false,
      number: 0,
    };
  },
  methods: {
    showPopup(number) {
      this.number = number;
      this.show = true;
    },
    closePopup() {
      this.show = false;
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>

<style scoped>
.popup {
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-radius: 4px;
}

.popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>
