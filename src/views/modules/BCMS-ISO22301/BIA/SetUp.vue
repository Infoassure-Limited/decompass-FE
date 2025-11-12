<template>
  <el-card>
    <BusinessUnits />
  </el-card>
</template>

<script>
import checkPermission from '@/utils/permission'
import BusinessUnits from '@/views/modules/settings/partials/business-units/SetUp.vue'
// import ManageAccess from './partials/ManageAccess.vue'

export default {
  components: {
    BusinessUnits
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    checkPermission
  }
}
</script>
