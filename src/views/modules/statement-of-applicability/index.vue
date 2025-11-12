<template>
  <el-card>
    <el-tabs content-class="mt-1" pills>
      <el-tab v-if="checkPermission(['manage-soa-settings'])" lazy>
        <template #title>
          <icon icon="tabler:settings" />
          <span>Setup</span>
        </template>
        <setup />
      </el-tab>
      <!-- <el-tab
        lazy
      >
        <template #title>
          <feather-icon icon="SearchIcon" />
          <span>Assess New Risk(s)</span>
        </template>
        <assessment />
      </el-tab> -->
      <el-tab lazy>
        <template #title>
          <feather-icon icon="EyeIcon" />
          <span>Statement of Applicability</span>
        </template>
        <StatementOfApplicability />
      </el-tab>
    </el-tabs>
  </el-card>
</template>

<script>
import checkPermission from '@/utils/permission'
import Setup from './partials/Setup.vue'
import StatementOfApplicability from './StatementOfApplicability.vue'

export default {
  components: {
    Setup,
    StatementOfApplicability
  },
  data() {
    return {}
  },
  methods: {
    checkPermission
  }
}
</script>
