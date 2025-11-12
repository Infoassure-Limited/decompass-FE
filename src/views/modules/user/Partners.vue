<template>
  <el-card>
    <PartnerList />
    <!-- <el-tabs content-class="mt-1" pills>
      <el-tab-pane lazy>
        <template #label>
          <icon icon="tabler:list" />
          <span>Partner List</span>
        </template>
        <PartnerList />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['create-partners'])" lazy>
        <template #label>
          <icon icon="tabler:user-plus" />
          <span>Register Partner</span>
        </template>
        <PartnerRegistration />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['create-partners'])" lazy>
        <template #label>
          <icon icon="tabler:user-plus" />
          <span>Register Partner Users</span>
        </template>
        <partner-user-registration />
      </el-tab-pane>
    </el-tabs> -->
  </el-card>
</template>

<script>
import PartnerList from './partials/PartnerList.vue'
// import PartnerRegistration from './partials/RegisterPartner.vue'
// // import PartnerUserRegistration from './partials/RegisterUserPartner.vue'
// import checkPermission from '@/utils/permission'

export default {
  components: {
    PartnerList
    // PartnerRegistration
    // PartnerUserRegistration
  },
  methods: {
    // checkPermission
  }
}
</script>
