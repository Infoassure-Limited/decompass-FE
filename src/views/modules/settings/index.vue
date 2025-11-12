<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="forceRerender">
      <!-- <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      > -->
      <el-tab-pane label="Manage Users" name="manage-users" lazy>
        <ManageClientUsers />
      </el-tab-pane>
      <!-- <el-tab-pane :key="keyValue" label="Asset Management" name="asset-inventory" lazy>
        <AssetManagement />
      </el-tab-pane>
      <el-tab-pane label="Business Units Setup" name="business-unit" lazy>
        <BusinessUnits />
      </el-tab-pane> -->
      <el-tab-pane label="Risk Management Setup" name="risk-management" lazy>
        <RiskSetup />
      </el-tab-pane>
      <el-tab-pane label="Access Control" name="access-control" lazy>
        <AccessControl />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// import AssetTypes from './partials/ManageAssetTypes/index.vue'
import ManageClientUsers from '@/views/modules/user/ClientUsers.vue'
// import AssetManagement from './partials/ManageAssets/index.vue'
// import BusinessUnits from './partials/business-units/SetUp.vue'
import RiskSetup from './partials/RiskAndThreats/index.vue'
import AccessControl from './partials/access-control/index.vue'

export default {
  components: {
    // AssetTypes,
    ManageClientUsers,
    // AssetManagement,
    // BusinessUnits,
    RiskSetup,
    AccessControl
    // NDPAReport,
  },
  data() {
    return {
      activeName: 'manage-users'
    }
  },
  mounted() {
    const { tab } = this.$route.params
    this.activeName = tab
  },
  methods: {
    forceRerender(tab, event) {
      // console.log(event.target.id)
      let hashString = event.target.id
      hashString = hashString.replace('tab-', '')
      // this.activeName = value
      this.$router.push({ name: 'SettingsIndex', params: { tab: `${hashString}` } })
    }
  }
}
</script>
