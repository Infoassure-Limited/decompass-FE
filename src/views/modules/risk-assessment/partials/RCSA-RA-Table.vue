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
          <icon icon="tabler:download" /> Export
        </el-button>
      </span>
    </div>
    <p></p>
    <div v-if="riskAssessments.length > 0" style="max-height: 550px; overflow: auto">
      <el-tabs content-class="mt-1">
        <el-tab lazy>
          <template #title>
            <feather-icon icon="ListIcon" />
            <span>Process Level Risk Universe</span>
          </template>

          <table id="riskAssessmentTable" class="table table-bordered table-striped">
            <thead>
              <tr>
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
                  >Business Unit</th
                >
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
                  >Business Process</th
                >
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff">RISK ID</th>
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff">RISK TYPE</th>
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
                  >RISK DESCRIPTION</th
                >
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
                  >Impact/Outcome</th
                >
                <th
                  v-for="impact_data in riskAssessments[0].impact_data"
                  :key="`${impact_data.slug}_pre`"
                  div
                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >
                  {{ impact_data.name }}</th
                >
                <th
                  v-for="impact_data in riskAssessments[0].impact_on_areas"
                  :key="`${impact_data.slug}_pre2`"
                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >
                  {{ impact_data.name }}</th
                >
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
                  >Impact of Occurence</th
                >
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
                  >Likelihood of Occurence</th
                >
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
                  >Overall Rating</th
                >
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
                  >Inherent Risk Rating</th
                >
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff">Treatment</th>
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
                  >Control/Mitigating Actions</th
                >
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
                  >Control Effectiveness Level</th
                >
                <th
                  v-for="impact_data in riskAssessments[0].revised_impact_data"
                  :key="`${impact_data.slug}_post`"
                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >
                  {{ impact_data.name }}</th
                >
                <th
                  v-for="impact_data in riskAssessments[0].revised_impact_on_areas"
                  :key="`${impact_data.slug}_post2`"
                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >
                  {{ impact_data.name }}</th
                >
                <th data-fill-color="45058d" data-b-a-s="thin" data-f-color="ffffff"
                  >Impact of Occurence</th
                >
                <th data-fill-color="45058d" data-b-a-s="thin" data-f-color="ffffff"
                  >Likelihood of Occurence</th
                >
                <th data-fill-color="45058d" data-b-a-s="thin" data-f-color="ffffff"
                  >Overall Rating</th
                >
                <th data-fill-color="45058d" data-b-a-s="thin" data-f-color="ffffff"
                  >Residual Risk Rating</th
                >
                <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
                  >Primary Risk Owners</th
                >
                <th data-fill-color="46035a" data-b-a-s="thin" data-f-color="ffffff"
                  >Key Risk Indicator</th
                >
              </tr>
            </thead>
            <tbody>
              <tr v-for="(assessment, index) in riskAssessments" :key="index">
                <td>
                  <div style="width: 250px">
                    {{ assessment.business_unit }}
                  </div>
                </td>
                <td>
                  <div style="width: 250px">
                    {{ assessment.business_process }}
                  </div>
                </td>
                <td>{{ assessment.risk_id }}</td>
                <td>{{ assessment.type }}</td>
                <td>
                  <div style="width: 300px">
                    {{ assessment.vulnerability_description }}
                  </div>
                </td>
                <td>
                  <div style="width: 300px">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="assessment.impact_rationale"></span>
                  </div>
                </td>
                <td
                  v-for="(impact_data, impact_data_index) in assessment.impact_data"
                  :key="impact_data_index"
                >
                  {{ impact_data.meaning }}
                </td>
                <td
                  v-for="(impact_data, impact_data_index) in assessment.impact_on_areas"
                  :key="`${impact_data_index}_pre2`"
                >
                  <div style="width: 150px">
                    {{ impact_data.meaning }}
                  </div>
                </td>
                <td>
                  {{ assessment.impact_of_occurence }}
                </td>
                <td>
                  {{ assessment.likelihood_of_occurence }}
                </td>
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
                  <div style="width: 300px">
                    <!--eslint-disable-next-line vue/no-v-html -->
                    <span v-html="assessment.recommended_control"></span>
                  </div>
                </td>
                <td>
                  {{ assessment.control_effectiveness_level }}
                </td>
                <td
                  v-for="(impact_data, revised_impact_data_index) in assessment.revised_impact_data"
                  :key="`${revised_impact_data_index}_post`"
                >
                  {{ impact_data.meaning }}
                </td>
                <td
                  v-for="(
                    impact_data, revised_impact_data_index
                  ) in assessment.revised_impact_on_areas"
                  :key="`${revised_impact_data_index}_post2`"
                >
                  <div style="width: 150px">
                    {{ impact_data.meaning }}
                  </div>
                </td>
                <td>
                  {{ assessment.revised_impact_of_occurence }}
                </td>
                <td>
                  {{ assessment.revised_likelihood_of_occurence }}
                </td>
                <td>
                  {{ assessment.revised_risk_score }}
                </td>
                <td
                  :style="`background: #${assessment.revised_risk_level_color}`"
                  :data-fill-color="assessment.revised_risk_level_color"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >
                  <div>{{ assessment.revised_risk_level }} </div>
                </td>
                <td>
                  {{ assessment.risk_owner }}
                </td>
                <td>
                  <div style="width: 300px">
                    <!--eslint-disable-next-line vue/no-v-html -->
                    <span v-html="assessment.key_risk_indicator"></span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-tab>
        <el-tab lazy>
          <template #title>
            <feather-icon icon="AlertTriangleIcon" />
            <span>Key Risk Indicator Assessment</span>
          </template>

          <div v-if="downloading">
            <table id="KRIAssessmentTable" class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th
                    data-fill-color="333333"
                    data-f-color="ffffff"
                    data-b-a-s="thin"
                    :rowspan="2"
                    colspan="4"
                  ></th>
                  <th
                    v-for="quarterCount in 4"
                    :key="quarterCount"
                    data-fill-color="3A61C2"
                    data-f-color="ffffff"
                    data-a-h="center"
                    data-b-a-s="thin"
                    :colspan="12"
                    style="text-align: center"
                    >Quater {{ quarterCount }}</th
                  >
                </tr>
                <tr>
                  <th
                    v-for="monthCount in 12"
                    :key="monthCount"
                    data-fill-color="673AC2"
                    data-f-color="ffffff"
                    data-a-h="center"
                    data-b-a-s="thin"
                    :colspan="4"
                    style="text-align: center"
                    >Month {{ monthCount }}</th
                  >
                </tr>
                <tr>
                  <th data-fill-color="333333" data-f-color="ffffff" data-b-a-s="thin">KRI</th>
                  <th data-fill-color="333333" data-f-color="ffffff" data-b-a-s="thin"
                    >Frequency of Assessment</th
                  >
                  <th data-fill-color="333333" data-f-color="ffffff" data-b-a-s="thin"
                    >Unit of Measurement</th
                  >
                  <th data-fill-color="333333" data-f-color="ffffff" data-b-a-s="thin">Comment</th>
                  <th
                    v-for="weekCount in 48"
                    :key="weekCount"
                    data-fill-color="333333"
                    data-f-color="ffffff"
                    data-a-h="center"
                    data-b-a-s="thin"
                    style="text-align: center"
                    >Week {{ weekCount }}</th
                  >
                </tr>
              </thead>
              <tbody>
                <tr v-for="(assessment, index) in riskAssessments" :key="index">
                  <td data-b-a-s="thin">
                    <div style="width: 250px">
                      {{ assessment.kri }}
                    </div>
                  </td>
                  <td data-b-a-s="thin">
                    <div style="width: 250px">
                      {{ assessment.frequency_of_assessment }}
                    </div>
                  </td>
                  <td data-b-a-s="thin">
                    {{ assessment.unit_of_measurement }}
                  </td>
                  <td data-b-a-s="thin">
                    <div style="width: 300px">
                      {{ assessment.comment }}
                    </div>
                  </td>
                  <td
                    v-for="(no_of_assessment, assess_index) in number_of_assessments[
                      assessment.frequency_of_assessment
                    ]"
                    :key="assess_index"
                    :colspan="
                      parseInt(48 / number_of_assessments[assessment.frequency_of_assessment])
                    "
                    :data-fill-color="assessment.assessments[no_of_assessment][1].slice(1)"
                    data-f-color="000000"
                    data-a-h="center"
                    data-b-a-s="thin"
                    :style="`padding: 20px; background: ${assessment.assessments[no_of_assessment][1]}; color: #000000;`"
                  >
                    {{ assessment.assessments[no_of_assessment][0] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <k-r-i-assessment v-else mode="manage" />
        </el-tab>
      </el-tabs>
    </div>
    <div v-else>
      <el-empty />
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import KRIAssessment from './KRIAssessment.vue'
// import CreateRiskAssessment from './CreateRiskAssessment.vue'

export default {
  components: {
    KRIAssessment
    // CreateRiskAssessment,
  },
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
      // this.downloading = true
      // const rawData = this.riskAssessments
      // import('@/vendor/Export2Excel').then(excel => {
      //   excel.export_table_to_excel(id)
      //   setTimeout(() => {
      //     this.downloading = false
      //   }, 2000)
      // })
      // setTimeout(() => {
      //   TableToExcel.convert(document.getElementById(id), {
      //     name: 'RiskAssessmentTable.xlsx',
      //     sheet: {
      //       name: 'Sheet 1'
      //     }
      //   })
      // }, 1000)
      // setTimeout(() => {
      //   this.downloading = false
      // }, 30000)
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
