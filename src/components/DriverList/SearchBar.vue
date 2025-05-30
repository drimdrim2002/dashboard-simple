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
  padding: 6px 12px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.search-container input[type="text"] {
  width: 160px;
  padding: 4px 6px;
  margin-right: 8px;
  box-sizing: border-box;
  font-size: 0.875rem;
}

.search-container select {
  width: 80px;
  height: 26px;
  margin-right: 8px;
  font-size: 0.875rem;
}
</style>
