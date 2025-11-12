<template>
  <el-tabs v-model="activeName" @tab-click="forceRerender" stretch lazy>
    <el-tab-pane label="Dashboard" name="#dashboard" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:dashboard" /> Dashboard</span>
      </template>
      <Dashboard v-if="activeName === '#dashboard'" />
    </el-tab-pane>
    <el-tab-pane label="Manage Vendors" name="#manage" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:users" /> Manage Vendors</span>
      </template>
      <onboarding v-if="activeName === '#manage'" />
    </el-tab-pane>
    <el-tab-pane label="Risk Management" name="#risk-management" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:alert-triangle" /> Risk Management</span>
      </template>
      <risk-assessment v-if="activeName === '#risk-management'" />
    </el-tab-pane>
    <el-tab-pane label="Contracts & SLA" name="#contract" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:file-invoice" /> Contracts & SLA</span>
      </template>
      <contract-and-sla v-if="activeName === '#contract'" />
    </el-tab-pane>
    <el-tab-pane label="Financials & Billing" name="#financials" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:report-money" /> Financials & Billing</span>
      </template>
      <FinancialsAndBilling v-if="activeName === '#financials'" />
    </el-tab-pane>
    <el-tab-pane label="Vendor Relationship" name="#vrm" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:heart-handshake" /> Vendor Relationship</span>
      </template>
      <VRM v-if="activeName === '#vrm'" />
    </el-tab-pane>
    <!-- <el-tab-pane
      label="Audit Assessment"
      name="fifth"
      lazy
    >
      <div>
        <img
          align="center"
          src="images/construction.jpg"
        >
      </div>
    </el-tab-pane>
    <el-tab-pane
      label="Reports & Analytics"
      name="sixth"
      lazy
    >
      <div>
        <img
          align="center"
          src="images/construction.jpg"
        >
      </div>
    </el-tab-pane> -->
  </el-tabs>
</template>
<script>
import Dashboard from '@/views/modules/DUE-DILIGENCE/Dashboard.vue'
import Onboarding from '@/views/modules/DUE-DILIGENCE/Onboarding/index.vue'
import RiskAssessment from '@/views/modules/DUE-DILIGENCE/RiskAssessment/index.vue'
import FinancialsAndBilling from '@/views/modules/DUE-DILIGENCE/FinancialsAndBilling/index.vue'
import ContractAndSla from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/index.vue'
import VRM from '@/views/modules/DUE-DILIGENCE/VendorRelationshipManagement/index.vue'

export default {
  components: {
    Dashboard,
    Onboarding,
    RiskAssessment,
    FinancialsAndBilling,
    ContractAndSla,
    VRM
    // NDPAReport,
  },
  data() {
    return {
      activeName: '#dashboard',
      keyValue: 1
    }
  },
  beforeMount() {
    this.setCurrentPage()
  },
  methods: {
    forceRerender(tab, event) {
      this.keyValue += 1
      this.activeName = tab.props.name
      this.$router.push({ hash: `${tab.props.name}` })
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
