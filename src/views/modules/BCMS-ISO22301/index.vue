<template>
  <div>
    <h4>Welcome to the BCMS Module</h4>
    <el-tabs v-model="activeName" @tab-click="forceRerender">
      <el-tab-pane label="Overview" name="#dashboard">
        <Dashboard v-if="activeName === '#dashboard'" />
      </el-tab-pane>
      <el-tab-pane label="The BCMS Journey" name="#bcms-journey">
        <BCMSJourney v-if="activeName === '#bcms-journey'" />
      </el-tab-pane>
      <el-tab-pane v-if="checkRole(['admin'])" label="Business Units Setup" name="#business-unit">
        <BusinessUnits v-if="activeName === '#business-unit'" />
      </el-tab-pane>
      <el-tab-pane label="BIA" name="#bia">
        <BIA v-if="activeName === '#bia'" />
      </el-tab-pane>
      <el-tab-pane label="Risk Management" name="#risk-management">
        <ConsolidatedRA v-if="activeName === '#risk-management'" module="bcms" view-only="bcms" />
      </el-tab-pane>
      <!-- <el-tab-pane :key="keyValue" label="Compliance Assessment" name="#compliance-assessment" lazy>
        <ComplianceAssessment />
      </el-tab-pane> -->
      <el-tab-pane label="Incident Management" name="#incident-management">
        <IncidentManagement v-if="activeName === '#incident-management'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import checkRole from '@/utils/role'
import Dashboard from '@/views/modules/BCMS-ISO22301/Dashboard.vue'
import BusinessUnits from '@/views/modules/settings/partials/business-units/SetUp.vue'
import ConsolidatedRA from '@/views/modules/risk-assessment/index.vue'
import IncidentManagement from '@/views/modules/Incidents/index.vue'
import BIA from './BIA/Analyze.vue'
import BCMSJourney from './BCMSJourney.vue'

export default {
  name: 'BCMS',
  components: {
    ConsolidatedRA,
    BIA,
    Dashboard,
    BusinessUnits,
    IncidentManagement,
    BCMSJourney
  },
  data() {
    return {
      activeName: '#dashboard',
      keyValue: 1
    }
  },
  mounted() {
    this.setCurrentPage()
  },
  methods: {
    checkRole,
    forceRerender(tab, event) {
      this.keyValue += 1
      this.$router.push({ hash: `${tab.props.name}` })
      this.activeName = tab.props.name
    },
    setCurrentPage() {
      this.activeName = window.location.hash !== '' ? window.location.hash : '#dashboard'
    }
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  }
}
</script>
