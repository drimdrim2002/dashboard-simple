<template>
  <div class="search-container">
    <input
      v-model="term"
      type="text"
      placeholder="Search..."
      @input="emitSearch"
    />
    <select v-model="type" @change="emitSearch">
      <option value="driver">Driver</option>
      <option value="type">Driver Type</option>
    </select>
    <div class="icon-buttons">
      <button
        class="icon-button"
        @click="$emit('replace-car')"
        title="Replace Car"
      >
        🚗
      </button>
      <button class="icon-button" @click="$emit('unlock')" title="Unlock">
        🔓
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      term: "",
      type: "driver",
    };
  },
  methods: {
    emitSearch() {
      this.$emit("search", {
        term: this.term,
        type: this.type,
      });
    },
  },
};
</script>

<style scoped>
.search-container {
  padding: 10px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-container input[type="text"] {
  width: 200px;
  padding: 5px;
  margin-right: 10px;
  box-sizing: border-box;
}

.search-container select {
  width: 90px;
  height: 30px;
  margin-right: 10px;
}

.icon-buttons {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.icon-button {
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
