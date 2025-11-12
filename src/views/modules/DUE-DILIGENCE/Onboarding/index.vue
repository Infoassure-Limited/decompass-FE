<template>
  <el-tabs type="border-card">
    <el-tab-pane lazy>
      <template v-slot:label>
        <span><icon icon="tabler:users-group" /> Vendor Categories</span>
      </template>
      <vendorCategories />
    </el-tab-pane>
    <el-tab-pane lazy>
      <template v-slot:label>
        <span><icon icon="tabler:users-plus" /> Vendor Onboarding</span>
      </template>
      <vendor-list />
    </el-tab-pane>
    <el-tab-pane lazy>
      <template v-slot:label>
        <span><icon icon="tabler:user-search" /> Vendors Screening/Approval</span>
      </template>
      <ScreeningAndApproval />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import Dashboard from './Dashboard.vue'
import VendorList from './partials/VendorList.vue'
import ScreeningAndApproval from './partials/ScreeningAndApproval.vue'
import VendorCategories from './partials/VendorCategories.vue'

export default {
  components: {
    // Dashboard,
    VendorList,
    ScreeningAndApproval,
    VendorCategories
    // VendorUserRegistration,
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
