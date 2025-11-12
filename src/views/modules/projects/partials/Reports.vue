<template>
  <el-tabs content-class="mt-1">
    <el-tab lazy>
      <template #title>
        <feather-icon icon="BarChartIcon" />
        <span>Assessment Summary</span>
      </template>
      <div v-if="selectedProject.standard.name === 'NDPA'">
        <assessment-summary :selected-project="selectedProject" />
        <summary-by-requirement :selected-project="selectedProject" />
      </div>
      <div v-else>
        <assessment-summary :selected-project="selectedProject" />
        <management-clause :selected-project="selectedProject" />
        <percentage-completion :selected-project="selectedProject" />
      </div>
    </el-tab>
    <el-tab lazy>
      <template #title>
        <feather-icon icon="ListIcon" />
        <span>Detailed Assessment Findings</span>
      </template>
      <assessment-findings :selected-project="selectedProject" />
    </el-tab>
  </el-tabs>
</template>
<script>
import AssessmentSummary from './charts/AssessmentSummary.vue'
import ManagementClause from './charts/ManagementClause.vue'
import PercentageCompletion from './charts/PercentageCompletion.vue'
import AssessmentFindings from './AssessmentFindings.vue'
import SummaryByRequirement from './charts/NDPA/SummaryByRequirement.vue'

export default {
  components: {
    AssessmentSummary,
    ManagementClause,
    PercentageCompletion,
    AssessmentFindings,
    SummaryByRequirement
  },
  props: {
    selectedProject: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
