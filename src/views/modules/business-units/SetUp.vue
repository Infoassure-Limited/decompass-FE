<template>
  <!-- <business-units /> -->
  <el-tabs type="border-card">
    <el-tab-pane label="Business Units" :lazy="true">
      <business-units />
    </el-tab-pane>
    <el-tab-pane label="Impact Criteria" :lazy="true">
      <risk-impact-areas />
    </el-tab-pane>
    <el-tab-pane label="Impact Recovery Requirements by Time" :lazy="true">
      <recovery-requirements-by-time />
    </el-tab-pane>
    <el-tab-pane label="Manage Team Members" :lazy="true">
      <manage-access />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import checkPermission from '@/utils/permission'
import BusinessUnits from './partials/BusinessUnitsTable.vue'
import RiskImpactAreas from './partials/RiskImpactAreas.vue'
import RecoveryRequirementsByTime from './partials/RecoveryRequirementsByTime.vue'
import ManageAccess from './partials/ManageAccess.vue'

export default {
  components: {
    RecoveryRequirementsByTime,
    BusinessUnits,
    ManageAccess,
    RiskImpactAreas
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
