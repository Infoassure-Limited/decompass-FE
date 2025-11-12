<template>
  <div v-loading="loading">
    <div v:slot="header">
      <span>
        <!-- <el-button
          size="mini"
          type="primary"

          @click="isCreateSidebarActive = true"
        >
          <feather-icon
            icon="PlusIcon"
            class="mr-50"
          />
          <span class="align-middle">Create</span>
        </el-button> -->
        <el-button
          type="info"
          plain
          :loading="downloading"
          @click="exportTableToExcel('riskAssessmentTable')"
        >
          <icon icon="tabler:download" /> Export to Excel
        </el-button>
      </span>
    </div>
    <p></p>
    <div v-if="riskAssessments.length > 0" style="max-height: 550px; overflow: auto">
      <table id="riskAssessmentTable" class="table table-bordered table-striped">
        <thead>
          <tr>
            <th
              :colspan="parseInt(13 + riskAssessments[0].impact_data.length)"
              data-f-sz="18"
              style="font-size: 18px; background-color: #45668d; color: #ffffff"
              data-fill-color="45668d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              RISK ANALYSIS
            </th>
            <th
              :colspan="parseInt(10 + riskAssessments[0].impact_data.length)"
              data-f-sz="18"
              style="font-size: 18px; background-color: #45058d; color: #ffffff"
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              TREATMENT
            </th>
            <!-- <th
              data-f-sz="18"
              style="font-size: 18px; background-color: #45668d; color: #ffffff"
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              POST-TREATMENT
            </th> -->
            <th
              :colspan="3"
              data-f-sz="18"
              style="font-size: 18px; background-color: #46035a; color: #ffffff"
              data-fill-color="46035a"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              RESIDUAL PLAN
            </th>
          </tr>
          <tr>
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >RA-ID</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Risk Owner</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Asset Types</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Assets</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Applicable Threat</th
            >
            <!-- <th
                style="font-size: 16px; background-color: #45668d; color: #ffffff" data-fill-color ="333333"
                data-b-a-s="thin"
                data-f-color="ffffff"
            >Impact Outcome</th> -->
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Existing Controls</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Likelihood Value</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Likelihood Justification</th
            >
            <th
              v-for="impact_data in riskAssessments[0].impact_data"
              :key="`${impact_data.slug}_pre`"
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              {{ impact_data.name }}</th
            >
            <!-- <th
                v-for="impact_data in riskAssessments[0].impact_on_areas"
                :key="`${impact_data.slug}_pre2`"
                style="font-size: 16px; background-color: #45668d; color: #ffffff" data-fill-color ="333333"
                data-b-a-s="thin"
                data-f-color="ffffff"
                >
                {{ impact_data.name }}</th
                > -->
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Impact Value</th
            >
            <!-- <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Impact Rationale</th
            > -->
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Risk Score</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Risk Level</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Treatment Option</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              Treatment Option Details
            </th>
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Recommended Control</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Control Effectiveness Level</th
            >
            <!-- <th
                style="font-size: 16px; background-color: #45668d; color: #ffffff" data-fill-color ="45058d"
                data-b-a-s="thin"
                data-f-color="ffffff"
                >Applicable Annexture Controls</th> -->
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Present Status</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Timeline</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Responsibility</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Revised Likelihood Value</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Revised Likelihood Justification</th
            >
            <th
              v-for="impact_data in riskAssessments[0].revised_impact_data"
              :key="`${impact_data.slug}_post`"
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              {{ impact_data.name }}</th
            >
            <!-- <th
                v-for="impact_data in riskAssessments[0].revised_impact_on_areas"
                :key="`${impact_data.slug}_post2`"
                style="font-size: 16px; background-color: #45668d; color: #ffffff" data-fill-color ="333333"
                data-b-a-s="thin"
                data-f-color="ffffff"
                >
                {{ impact_data.name }}</th
                > -->
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Revised Impact Value</th
            >
            <!-- <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Revised Impact Rationale</th
            > -->
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Revised Risk Score</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Revised Risk Level</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Risk Treatment Option B</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Risk Treatment Plan Residual</th
            >
            <th
              style="font-size: 16px; background-color: #333333; color: #ffffff"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
              >Residual Plan Present Status</th
            >
          </tr>
        </thead>
        <tbody>
          <tr v-for="(assessment, index) in riskAssessments" :key="index">
            <td>{{ assessment.risk_id }}</td>
            <td>
              {{ assessment.risk_owner }}
            </td>
            <td>
              {{ assessment.asset_type_name }}
            </td>
            <td>
              {{ assessment.asset_name }}
            </td>
            <td>
              <div style="width: 300px">
                <!--eslint-disable-next-line vue/no-v-html-->
                <span v-html="assessment.vulnerability_description"></span>
              </div>
            </td>
            <!-- <td>
                <div style="width: 250px">
                <span v-html="assessment.outcome" />
                </div>

            </td> -->
            <td>
              <div style="width: 300px">
                <!--eslint-disable-next-line vue/no-v-html-->
                <span v-html="assessment.control_description"></span>
              </div>
            </td>
            <td>
              {{ assessment.likelihood_of_occurence }}
            </td>
            <td>
              <div style="width: 300px">
                <!--eslint-disable-next-line vue/no-v-html-->
                <span v-html="assessment.likelihood_rationale"></span>
              </div>
            </td>
            <td
              v-for="(impact_data, impact_data_index) in assessment.impact_data"
              :key="`${impact_data_index}_pre`"
            >
              <div style="width: 150px">
                {{ impact_data.meaning }}
              </div>
            </td>
            <!-- <td
                v-for="(impact_data, impact_data_index) in assessment.impact_on_areas"
                :key="`${impact_data_index}_pre2`"
                >
                <div style="width: 150px">
                    {{ impact_data.meaning }}
                </div>
                </td> -->
            <td>
              {{ assessment.impact_of_occurence }}
            </td>
            <!-- <td>
              <div style="width: 300px">
                <span v-html="assessment.impact_rationale"></span>
              </div>
            </td> -->
            <td>
              {{ assessment.risk_score }}
            </td>
            <td
              :style="`background: #${assessment.risk_level_color}`"
              :data-fill-color="assessment.risk_level_color"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              {{ assessment.risk_level }}
            </td>
            <td>
              {{ assessment.treatment_option }}
            </td>
            <td>
              <div
                style="width: 350px"
                v-if="
                  assessment.treatment_option !== 'Mitigate' &&
                  assessment.treatment_option_details !== null
                "
              >
                <ul>
                  <li
                    v-for="(detail, de_index) in assessment.treatment_option_details"
                    :key="de_index"
                    style="font-size: 12px"
                  >
                    <strong>{{ detail.question }}:</strong> {{ detail.answer }} <br />
                  </li>
                </ul>
              </div>
            </td>
            <td>
              <div style="width: 300px">
                <!--eslint-disable-next-line vue/no-v-html -->
                <span v-html="assessment.recommended_control"></span>
              </div>
            </td>
            <td>
              {{ assessment.control_effectiveness_level }}
            </td>
            <!-- <td>
                {{ assessment.applicable_annexture }}
                </td> -->
            <td>
              {{ assessment.status }}
            </td>
            <td> {{ assessment.timeline }} 2 </td>
            <td>
              {{ assessment.responsible }}
            </td>
            <td>
              {{ assessment.revised_likelihood_of_occurence }}
            </td>
            <td>
              {{ assessment.revised_likelihood_rationale }}
            </td>
            <td
              v-for="(impact_data, revised_impact_data_index) in assessment.revised_impact_data"
              :key="`${revised_impact_data_index}_post`"
            >
              <div style="width: 150px">
                {{ impact_data.meaning }}
              </div>
            </td>
            <!-- <td
                v-for="(
                    impact_data, revised_impact_data_index
                ) in assessment.revised_impact_on_areas"
                :key="`${revised_impact_data_index}_post2`"
                >
                <div style="width: 150px">
                    {{ impact_data.meaning }}
                </div>
                </td> -->
            <td>
              {{ assessment.revised_impact_of_occurence }}
            </td>
            <!-- <td>
              <div style="width: 300px">
                <span v-html="assessment.revised_impact_rationale"></span>
              </div>
            </td> -->
            <td>
              {{ assessment.revised_risk_score }}
            </td>
            <td
              :style="`background: #${assessment.revised_risk_level_color}`"
              :data-fill-color="assessment.revised_risk_level_color"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              {{ assessment.revised_risk_level }}
            </td>
            <td>
              {{ assessment.residual_risk_treatment_option }}
            </td>
            <td>
              {{ assessment.residual_treatment_option_details }}
            </td>
            <td>
              {{ assessment.residual_plan_present_status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <el-empty />
    </div>
  </div>
</template>

<script>
import TableToExcel from '@/vendor/TableToExcel'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
// import CreateRiskAssessment from './CreateRiskAssessment.vue'

export default {
  props: {
    standardId: {
      type: Number,
      default: () => 0
      // required: true,
    },
    assessmentModule: {
      type: String,
      default: () => 'all' // this is the general risk assessment
    }
  },
  data() {
    return {
      createAssetModal: false,
      createAssetTypeModal: false,
      showTreatmentModal: false,
      loading: false,
      isCreateSidebarActive: false,
      pageLength: 10,
      dir: false,
      riskAssessments: [],
      clients: [],
      searchTerm: '',
      categories: [],
      asset_types: [],
      assets: [],
      likelihoods: [],
      impacts: [],
      treatment_options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      downloading: false,
      selectedAssetTypeId: '',
      risk_appetite: null,
      selectedAssessment: '',
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentOption: false
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    }
  },
  watch: {
    selectedClient() {
      this.fetchImpacts()
      this.fetchLikelihoods()
      this.fetchAssetTypes()
      this.fetchRiskAssessments()
    }
  },
  created() {
    this.fetchImpacts()
    this.fetchLikelihoods()
    this.fetchAssetTypes()
    this.fetchRiskAssessments()
  },
  methods: {
    checkPermission,
    customClassName({ row, column }) {
      if (column.label === 'Risk Category') {
        if (row.risk_category === 'High') {
          return 'btn-danger'
        }
        if (row.risk_category === 'Medium') {
          return 'btn-warning'
        }
        if (row.risk_category === 'Low') {
          return 'btn-success'
        }
      }
      if (column.label === 'Revised Risk') {
        if (row.revised_risk_category === 'High') {
          return 'btn-danger'
        }
        if (row.revised_risk_category === 'Medium') {
          return 'btn-warning'
        }
        if (row.revised_risk_category === 'Low') {
          return 'btn-success'
        }
      }
      return ''
    },
    createAsset(asseTypeId) {
      if (asseTypeId === '' || asseTypeId === null) {
        this.$alert('Please select an asset type')
      } else {
        this.selectedAssetTypeId = asseTypeId
        this.createAssetModal = true
      }
    },
    customClass(row, opt) {
      if (opt === 'risk_category') {
        if (row.risk_category === 'High') {
          return 'DD2C2C'
        }
        if (row.risk_category === 'Medium') {
          return 'F0C63E'
        }
        if (row.risk_category === 'Low') {
          return '3BD135'
        }
      }
      if (opt === 'revised_risk_category') {
        if (row.revised_risk_category === 'High') {
          return 'DD2C2C'
        }
        if (row.revised_risk_category === 'Medium') {
          return 'F0C63E'
        }
        if (row.revised_risk_category === 'Low') {
          return '3BD135'
        }
      }
      return ''
    },
    fetchImpacts() {
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource
        .list({ client_id: this.selectedClient.id })
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
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.likelihoods = response.likelihoods
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    fetchRiskAssessments(load = true) {
      this.loading = load
      const fetchRiskAssessmentsResource = new Resource(
        'risk-assessment/fetch-all-risk-assessments'
      )
      fetchRiskAssessmentsResource
        .list({
          client_id: this.selectedClient.id,
          standard_id: this.standardId,
          module: this.assessmentModule
        })
        .then((response) => {
          this.riskAssessments = response.risk_assessments
          this.risk_appetite = response.risk_appetite
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    updateField(value, field, assessment, subField = '') {
      const params = {
        field,
        value,
        sub_field: subField
      }

      // assessment.loader = true
      const fetchClientsResource = new Resource('risk-assessment/update-fields')
      fetchClientsResource
        .update(assessment.id, params)
        .then(() => {
          // this.risk_assessments[assessment.index] = response
          this.fetchRiskAssessments(false)

          assessment.loader = false
        })
        .catch(() => {
          assessment.loader = false
        })
    },
    treatRisk(assessment) {
      const riskValue = assessment.overall_risk_rating
      const riskAppetite = this.risk_appetite
      if (riskValue <= riskAppetite) {
        this.treatment_comment = `Your Risk Value of ${riskValue} satisfies your Risk Appetite of ${riskAppetite}. You might want to Accept the risk, it's up to you.`
        this.treatment_alert_type = 'success'
        this.showTreatmentOption = false
      } else {
        this.treatment_comment = `Your Risk Value of ${riskValue} exceeds your Risk Appetite of ${riskAppetite}. Kindly pick an option to further treat the risk`
        this.treatment_alert_type = 'error'
        this.showTreatmentOption = true
      }
      this.selectedAssessment = assessment
      this.showTreatmentModal = true
    },
    fetchAssetTypes() {
      const fetchEntryResource = new Resource('assets/fetch-asset-types')
      this.loading = true
      fetchEntryResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.asset_types = response.asset_types
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    fetchAssets(assetTypeId) {
      // const assetTypeId = event.target.value
      const fetchAssetsResource = new Resource('risk-assessment/fetch-assets')
      fetchAssetsResource
        .list({ client_id: this.selectedClient.id, asset_type_id: assetTypeId })
        .then((response) => {
          this.assets = response.assets
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    exportTableToExcel(id) {
      this.downloading = true
      //   const rawData = this.riskAssessments
      //   import('@/vendor/Export2Excel').then((excel) => {
      //     excel.exportToExcel(id)
      //     setTimeout(() => {
      //       this.downloading = false
      //     }, 2000)
      //   })
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: 'RiskAssessmentTable.xlsx',
          sheet: {
            name: 'Sheet 1'
          }
        })
      }, 1000)
      setTimeout(() => {
        this.downloading = false
      }, 30000)
    },
    formatIds(value, option) {
      const { likelihoods } = app
      const { impacts } = app
      let val = ''
      if (option === 'likelihood') {
        likelihoods.forEach((likelihood) => {
          if (value === likelihood.id) {
            val = `${likelihood.id}-${likelihood.name}`
          }
        })
      }
      if (option === 'impact') {
        impacts.forEach((impact) => {
          if (value === impact.id) {
            val = `${impact.id}-${impact.name}`
          }
        })
      }
      return val
    }
  }
}
</script>
