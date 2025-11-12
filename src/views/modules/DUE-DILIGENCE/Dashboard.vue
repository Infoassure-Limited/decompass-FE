<template>
  <el-tabs type="border-card">
    <!-- <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    > -->
    <el-tab-pane label="Onboarding" lazy>
      <OnboardingDashboard />
    </el-tab-pane>
    <el-tab-pane label="Risk Assessment" lazy>
      <RiskAssessmentDashboard />
    </el-tab-pane>
    <!-- <el-tab-pane
      label="Vendor Onboarding"
      name="#onboarding"
      lazy
    >
      <RiskAssessment />
    </el-tab-pane>
    <el-tab-pane
      label="Risk Management"
      name="#risk-management"
      lazy
    >
      <risk-assessment />
    </el-tab-pane>
    <el-tab-pane
      label="Contracts & SLA"
      name="#contract-and-sla"
      lazy
    >
      <contract-and-sla />
    </el-tab-pane>
    <el-tab-pane
      label="Financials & Billing"
      name="#financials-and-billing"
      lazy
    >
      <financials-and-billing />
    </el-tab-pane>
    <el-tab-pane
      label="Vendor Relationship"
      name="#vrm"
      lazy
    >
      <VRM />
    </el-tab-pane> -->
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
import OnboardingDashboard from '@/views/modules/DUE-DILIGENCE/Onboarding/Dashboard.vue'
import RiskAssessmentDashboard from '@/views/modules/DUE-DILIGENCE/RiskAssessment/Dashboard.vue'
// import FinancialsAndBilling from '@/views/modules/DUE-DILIGENCE/FinancialsAndBilling/index.vue'
// import ContractAndSla from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/index.vue'
// import VRM from '@/views/modules/DUE-DILIGENCE/VendorRelationshipManagement/index.vue'

export default {
  components: {
    OnboardingDashboard,
    RiskAssessmentDashboard
  }
}
</script>
