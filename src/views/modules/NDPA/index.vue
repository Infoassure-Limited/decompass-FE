<template>
  <el-card>
    <!-- <h4>Welcome to the NDPA Module</h4> -->
    <el-tabs v-model="activeTabName" @tab-click="forceRerender">
      <el-tab-pane label="Overview" name="#overview">
        <div v-if="activeTabName === '#overview'">
          <NDPADashboard />
        </div>
      </el-tab-pane>
      <el-tab-pane label="The NDPA Journey" name="#ndpa-journey">
        <div v-if="activeTabName === '#ndpa-journey'">
          <NDPAJourney />
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane lazy label="Compliance Assessment" name="#compliance">
        <GapAssessment
          :selected-client="selectedClient"
          :selected-project="selectedProject"
          :is-admin="isAdmin"
        />
      </el-tab-pane> -->
      <el-tab-pane
        v-if="checkPermission(['read-business-unit'])"
        label="Business Unit Setup"
        name="#business_unit"
      >
        <div v-if="activeTabName === '#business_unit'">
          <BusinessUnit />
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane lazy label="Risk Library" name="#risk_library">
        <div v-if="activeTabName === '#risk_library'">
          <RiskLibrary module="ndpa" view-only="ndpa" />
        </div>
      </el-tab-pane> -->
      <el-tab-pane v-if="checkPermission(['manage-pda'])" label="PDA" name="#pda">
        <div v-if="activeTabName === '#pda'">
          <PDA :selected-client="selectedClient" />
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['manage-ropa'])" label="RoPA" name="#ropa">
        <div v-if="activeTabName === '#ropa'">
          <RoPA :selected-client="selectedClient" />
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['perform-dpia'])" label="DPIA" name="#dpia">
        <div v-if="activeTabName === '#dpia'">
          <ConsolidatedRA module="ndpa" view-only="ndpa" />
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane lazy
      label="Reports"
      name="third"
    >
      <n-d-p-a-report />
    </el-tab-pane> -->
    </el-tabs>
  </el-card>
</template>
<script>
import checkRole from '@/utils/role'
import checkPermission from '@/utils/permission'
import NDPADashboard from '@/views/modules/NDPA/Dashboard.vue'
// import NDPAManage from '@/views/modules/NDPA/Manage.vue'
import BusinessUnit from '@/views/modules/settings/partials/business-units/SetUp.vue'
// import GapAssessment from './partials/GapAssessment.vue'
// import RiskLibrary from '@/views/modules/settings/partials/RiskAndThreats/ViewRiskControlMatrix.vue'
import ConsolidatedRA from '@/views/modules/risk-assessment/index.vue'

// import DPIA from './DPIA/index.vue'
import RoPA from './RoPA/index.vue'
import PDA from './PDA/index.vue'
import NDPAJourney from './NDPAJourney.vue'
// import NDPAReport from '@/views/modules/NDPA/Report.vue'

export default {
  components: {
    NDPADashboard,
    NDPAJourney,
    PDA,
    RoPA,
    // NDPAManage,
    BusinessUnit,
    // GapAssessment,
    // RiskLibrary,
    // DPIA
    ConsolidatedRA
    // NDPAReport,
  },
  data() {
    return {
      activeTabName: '#overview',
      isAdmin: this.$store.getters.isAdmin,
      moduleIsActive: false,
      projects: [],
      selectedProject: null
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    }
  },
  mounted() {
    this.setCurrentPage()
  },
  methods: {
    checkRole,
    checkPermission,
    forceRerender(tab, event) {
      this.keyValue += 1
      this.activeName = tab.props.name
      this.$router.push({ hash: `${tab.props.name}` })
    },
    setCurrentPage() {
      this.activeTabName = window.location.hash !== '' ? window.location.hash : '#overview'
      this.$router.push({ hash: `${this.activeTabName}` })
    }
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  }
}
</script>
