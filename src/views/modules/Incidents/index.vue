<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Dashboard" lazy>
      <Dashboard />
    </el-tab-pane>
    <el-tab-pane label="Incidents" lazy>
      <Incident />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Dashboard from './Dashboard.vue'
import Incident from './partials/Incident.vue'

export default {
  components: {
    Dashboard,
    Incident
  }
}
</script>
