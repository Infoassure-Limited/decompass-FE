<template>
  <el-card>
    <el-tabs v-model="ismsActiveName" @tab-click="forceRerender">
      <!-- <el-tabs
      v-model="ismsActiveName"
      tab-position="left"
      @tab-click="handleClick"
    > -->
      <el-tab-pane label="Overview" name="#dashboard">
        <dashboard v-if="ismsActiveName === '#dashboard'" />
      </el-tab-pane>
      <el-tab-pane label="The ISMS Journey" name="#isms-journey">
        <ISMSJourney v-if="ismsActiveName === '#isms-journey'" />
      </el-tab-pane>
      <!-- <el-tab-pane :key="keyValue" label="Compliance Assessment" name="#compliance-assessment" >
        <ComplianceAssessment v-if="ismsActiveName === '#compliance-assessment'" />
      </el-tab-pane> -->
      <el-tab-pane label="Asset Management" name="#asset-inventory">
        <AssetManagement v-if="ismsActiveName === '#asset-inventory'" />
        <!-- <el-tabs type="border-card">
          <el-tab-pane label="Manage Asset Types" >
            <AssetTypes />
          </el-tab-pane>
          <el-tab-pane label="Manage Assets" >
            <AssetManagement />
          </el-tab-pane>
        </el-tabs> -->
      </el-tab-pane>
      <el-tab-pane label="Risk Management" name="#risk-management">
        <ConsolidatedRA
          v-if="ismsActiveName === '#risk-management'"
          module="isms"
          view-only="isms"
        />
      </el-tab-pane>
      <el-tab-pane label="Statement Of Applicability" name="#soa">
        <SOA v-if="ismsActiveName === '#soa'" />
      </el-tab-pane>
      <el-tab-pane label="Policy Management" name="#policy-management">
        <PolicyManagement v-if="ismsActiveName === '#policy-management'" />
      </el-tab-pane>
      <el-tab-pane label="Incident Management" name="#incident-management">
        <IncidentManagement v-if="ismsActiveName === '#incident-management'" />
      </el-tab-pane>
      <!-- <el-tab-pane label="Risk Management" name="#risk-management" >
      <risk-assessment />
    </el-tab-pane>
    <el-tab-pane label="Contracts & SLA" name="#contract-and-sla" >
      <contract-and-sla />
    </el-tab-pane>
    <el-tab-pane label="Financials & Billing" name="#financials-and-billing" >
      <financials-and-billing />
    </el-tab-pane>
    <el-tab-pane label="Vendor Relationship" name="#vrm" >
      <VRM />
    </el-tab-pane> -->
    </el-tabs>
  </el-card>
</template>
<script>
import checkPermission from '@/utils/permission'
import Dashboard from '@/views/modules/ISMS-ISO27001/Dashboard.vue'
// import AssetTypes from '@/views/modules/settings/partials/ManageAssetTypes/index.vue'
import AssetManagement from '@/views/modules/settings/partials/ManageAssets/index.vue'
import ConsolidatedRA from '@/views/modules/risk-assessment/index.vue'
// import ComplianceAssessment from './partials/ComplianceAssessment.vue'
import ISMSJourney from './ISMSJourney.vue'
import PolicyManagement from '@/views/modules/Policies/index.vue'
import IncidentManagement from '@/views/modules/Incidents/index.vue'
import SOA from '@/views/modules/statement-of-applicability/index.vue'
// import checkRole from '@/utils/role'
// import VRM from '@/views/modules/ISMS-ISO27001/VendorRelationshipManagement/index.vue'

export default {
  name: 'ISMS',
  components: {
    ConsolidatedRA,
    // AssetTypes,
    AssetManagement,
    Dashboard,
    // ComplianceAssessment,
    PolicyManagement,
    IncidentManagement,
    ISMSJourney,
    SOA
    // FinancialsAndBilling,
    // ContractAndSla,
    // VRM
    // NDPAReport,
  },
  data() {
    return {
      ismsActiveName: '#dashboard',
      keyValue: 1
    }
  },
  mounted() {
    this.setCurrentPage()
  },
  methods: {
    checkPermission,
    forceRerender(tab, event) {
      this.keyValue += 1
      this.$router.push({ hash: `${tab.props.name}` })
      this.ismsActiveName = tab.props.name
    },
    setCurrentPage() {
      this.ismsActiveName = window.location.hash !== '' ? window.location.hash : '#dashboard'
    }
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  }
}
</script>
