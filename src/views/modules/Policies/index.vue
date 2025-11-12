<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Dashboard" lazy>
      <Dashboard />
    </el-tab-pane>
    <el-tab-pane label="Policy Categories" lazy>
      <PolicyCategories />
    </el-tab-pane>
    <el-tab-pane label="Policies" lazy>
      <Policies />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Dashboard from './Dashboard.vue'
import Policies from './partials/Policies.vue'
import PolicyCategories from './partials/PolicyCategories.vue'

export default {
  components: {
    Dashboard,
    Policies,
    PolicyCategories
  }
}
</script>
