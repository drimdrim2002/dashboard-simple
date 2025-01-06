<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class="checkbox-column">
            <input
              type="checkbox"
              :checked="allSelected"
              @change="toggleAllDrivers"
            />
          </th>
          <th>Lock</th>
          <th>Status</th>
          <th>Driver</th>
          <th>Driver Type</th>
          <th>Time</th>
          <th>Orders</th>
          <th>Distance</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="driver in drivers"
          :key="driver.id"
          :data-driver-id="driver.id"
        >
          <td class="checkbox-column">
            <input
              type="checkbox"
              v-model="selectedDrivers"
              :value="driver.id"
            />
          </td>
          <td>{{ driver.lockStatus ? "🔒" : "🔓" }}</td>
          <td>
            <span
              class="status-icon"
              :style="{ backgroundColor: driver.statusColor }"
            ></span>
          </td>
          <td>{{ driver.name }}</td>
          <td>{{ driver.type }}</td>
          <td>{{ driver.time }}</td>
          <td>{{ driver.orders }}</td>
          <td>{{ driver.distance }}</td>
        </tr>
      </tbody>
    </table>
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
    };
  },
  computed: {
    allSelected() {
      return (
        this.drivers.length > 0 &&
        this.selectedDrivers.length === this.drivers.length
      );
    },
  },
  methods: {
    toggleAllDrivers(event) {
      this.selectedDrivers = event.target.checked
        ? this.drivers.map((driver) => driver.id)
        : [];
    },
  },
};
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100% - 40px);
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  position: sticky;
  top: 0;
}

.checkbox-column {
  width: 30px;
  text-align: center;
}

.status-icon {
  height: 12px;
  width: 12px;
  display: inline-block;
  border-radius: 50%;
}
</style>
