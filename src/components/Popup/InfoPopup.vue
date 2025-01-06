<template>
  <div>
    <div class="popup-backdrop" v-if="isVisible" @click="hidePopup"></div>
    <div id="popup" class="popup" v-if="isVisible">
      <h3>상세 정보</h3>
      <p id="popup-content">선택된 숫자: {{ formatNumber(number) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoPopup",
  data() {
    return {
      isVisible: false,
      number: 0,
    };
  },
  methods: {
    showPopup(number) {
      this.number = number;
      this.isVisible = true;
    },
    hidePopup() {
      this.isVisible = false;
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
