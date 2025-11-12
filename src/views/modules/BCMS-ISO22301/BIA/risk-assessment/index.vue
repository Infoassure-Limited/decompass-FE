<template>
  <el-card>
    <div>
      <el-tabs content-class="mt-1">
        <el-tab lazy>
          <template #title>
            <feather-icon icon="ListIcon" />
            <span>Risk Assessment Activity</span>
          </template>

          <assess-risk
            v-loading="loading"
            :client-id="clientId"
            :business-unit-id="businessUnitId"
            :business-processes="business_processes"
            :impacts="impacts"
            :likelihoods="likelihoods"
            :matrix="matrix"
            @submit="fetchRiskAssessments(false)"
          />
          <view-risk-assessment
            v-loading="loading"
            :client-id="clientId"
            :business-unit-id="businessUnitId"
            :business-processes="business_processes"
            :risk-assessments="risk_assessments"
            :impacts="impacts"
            :likelihoods="likelihoods"
            :matrix="matrix"
            @reload="fetchRiskAssessments(false)"
          />
        </el-tab>
        <el-tab lazy>
          <template #title>
            <feather-icon icon="EyeIcon" />
            <span>Risk Assessment Summary</span>
          </template>
          <risk-assessment-summary
            :client-id="clientId"
            :business-unit-id="businessUnitId"
            :business-processes="business_processes"
          />
        </el-tab>
        <!-- <el-tab
          lazy
        >
          <template #title>
            <feather-icon icon="EyeIcon" />
            <span>Risk Ranking Matrix</span>
          </template>
          <risk-ranking-matrix :matrix="matrix" />
        </el-tab> -->
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import checkPermission from '@/utils/permission'
import AssessRisk from './AssessRisk.vue'
import ViewRiskAssessment from './ViewRiskAssessment.vue'
// import RiskRankingMatrix from './RiskRankingMatrix.vue'
import RiskAssessmentSummary from './Summary.vue'
import Resource from '@/api/resource'

export default {
  components: {
    AssessRisk,
    ViewRiskAssessment,
    // RiskRankingMatrix,
    RiskAssessmentSummary
  },
  props: {
    businessUnitId: {
      type: Number,
      default: null
    },
    clientId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      clients: [],
      matrix: '3x3',
      impacts: [],
      likelihoods: [],
      risk_assessments: [],
      business_processes: [],
      loading: false
    }
  },
  created() {
    this.setMatrix()
    this.fetchRiskAssessments()
    this.fetchBusinessProcesses()
  },
  methods: {
    checkPermission,
    fetchBusinessProcesses() {
      this.loading = true
      const fetchBusinessProcesssResource = new Resource('business-units/fetch-business-processes')
      fetchBusinessProcesssResource
        .list({ business_unit_id: this.businessUnitId })
        .then((response) => {
          this.business_processes = response.business_processes
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchRiskAssessments(load = true) {
      this.loading = load
      const fetchRiskAssessmentsResource = new Resource('bia/fetch-risk-assessment')
      fetchRiskAssessmentsResource
        .list({ client_id: this.clientId, business_unit_id: this.businessUnitId })
        .then((response) => {
          this.risk_assessments = response.risk_assessments
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    setMatrix() {
      this.fetchImpacts()
      this.fetchLikelihoods()
    },
    fetchImpacts() {
      this.loading = true
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource
        .list({ client_id: this.clientId })
        .then((response) => {
          this.loading = false
          this.impacts = response.impacts
        })
        .catch((error) => {
          this.loading = false
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource
        .list({ client_id: this.clientId })
        .then((response) => {
          this.likelihoods = response.likelihoods
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    }
  }
}
</script>
