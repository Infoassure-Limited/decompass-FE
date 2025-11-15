<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <aside>
      <el-row :gutter="5">
        <el-col
          v-if="checkPermission(['read-asset-risk-library', 'read-process-risk-library'])"
          :md="8"
        >
          <CardNavView id="library" @clickToView="viewType = 'riskLibrary'">
            <template #description>
              <div align="center">
                <icon icon="tabler:library" size="20" />
                <strong>Assigned Risk Register</strong>
              </div>
            </template>
          </CardNavView>
        </el-col>
        <el-col v-if="checkPermission(['perform-asset-ra', 'perform-dpia', 'perform-ra'])" :md="8">
          <CardNavView id="perform" @clickToView="viewType = 'performRA'">
            <template #description>
              <div align="center">
                <icon icon="tabler:shield-search" size="20" />
                <strong>Perform Risk Assessment</strong>
              </div>
            </template>
          </CardNavView>
        </el-col>
        <el-col v-if="checkRole(['admin'])" :md="8">
          <CardNavView id="setup" @clickToView="viewType = 'setupRA'">
            <template #description>
              <div align="center">
                <icon icon="tabler:tool" size="20" />
                <strong>Configure</strong>
              </div>
            </template>
          </CardNavView>
        </el-col>
      </el-row>
    </aside>
    <el-row>
      <el-col :md="24">
        <AssignedRiskLibrary v-if="viewType === 'riskLibrary'" :view-only="module" />
        <RiskSetup v-if="viewType === 'setupRA'" :module="module" />
        <RiskAssessmentDetails
          v-if="viewType === 'performRA'"
          :module="module"
          :view-only="viewOnly"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import RiskAssessmentDetails from './RiskAssessmentDetails.vue'
import RiskSetup from '@/views/modules/settings/partials/RiskAndThreats/index.vue'
import AssignedRiskLibrary from '@/views/modules/settings/partials/RiskAndThreats/AssignedRiskLibrary.vue'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import CardNavView from '@/views/Components/CardNavView.vue'

export default {
  components: {
    CardNavView,
    RiskAssessmentDetails,
    AssignedRiskLibrary,
    RiskSetup
  },
  props: {
    module: {
      type: String,
      default: () => 'all' // this is the general risk assessment
    },
    viewOnly: {
      type: String,
      default: () => 'all'
    }
  },
  data() {
    return {
      viewType: 'riskLibrary'
    }
  },
  mounted() {
    document.getElementById('library').click()
  },
  methods: {
    checkRole,
    checkPermission
  }
}
</script>
