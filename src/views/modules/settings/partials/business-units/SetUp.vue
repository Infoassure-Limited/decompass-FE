<template>
  <el-card>
    <business-units />
  </el-card>
  <!-- <el-tabs type="border-card">
    <el-tab-pane label="Business Units" :lazy="true">
      <business-units />
    </el-tab-pane>
    <el-tab-pane label="Manage Team Members" :lazy="true">
      <manage-access />
    </el-tab-pane>
  </el-tabs> -->
</template>

<script>
import checkPermission from '@/utils/permission'
import BusinessUnits from './partials/BusinessUnitsTable.vue'
// import ManageAccess from './partials/ManageAccess.vue'

export default {
  components: {
    BusinessUnits
    // ManageAccess
  },
  data() {
    return {
      business_impact_analyses: [],
      loading: false
    }
  },
  methods: {
    checkPermission
  }
}
</script>
