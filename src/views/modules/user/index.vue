<template>
  <el-card>
    <staff-list />
  </el-card>
</template>

<script>
import StaffList from './partials/StaffList.vue'
// import StaffRegistration from './partials/RegisterStaff.vue'

export default {
  components: {
    StaffList
    // StaffRegistration,
  }
}
</script>
