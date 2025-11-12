<template>
  <div v-loading="loading">
    <div v:slot="header">
      <span>
        <el-button
          size="mini"
          :loading="downloading"
          type="primary"
          @click="exportTableToExcel('riskAssessmentTable')"
        >
          <feather-icon icon="DownloadIcon" class="mr-50" />
          <span class="align-middle">Export</span>
        </el-button>
      </span>
    </div>
    <p></p>
    <div v-if="riskAssessments.length > 0" class="table-responsive">
      <table id="riskAssessmentTable" class="table table-bordered table-striped">
        <thead>
          <!-- <tr>
            <th
              :colspan="15"
              style="font-size: 18px;"
              data-f-sz="18"
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              RISK ANALYSIS
            </th>
            <th
              :colspan="12"
              style="font-size: 18px;"
              data-f-sz="18"
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              TREATMENT
            </th>
            <th
              :colspan="1"
              style="font-size: 18px;"
              data-f-sz="18"
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              POST-TREATMENT
            </th>
            <th
              colspan="3"
              style="font-size: 18px;"
              data-f-sz="18"
              data-fill-color="46035a"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              RESIDUAL PLAN
            </th>
          </tr> -->
          <tr>
            <th rowspan="2" data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
              >RA-ID</th
            >
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff">Business Unit</th>
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
              >Business Process</th
            >
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff">Risk Owner</th>
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
              >Personal Data Asset</th
            >
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff">Risk Scenerio</th>
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
              >Existing Controls</th
            >
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff">Likelihood</th>
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
              >Likelihood Rationale</th
            >
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff">Impact</th>
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
              >Impact Rationale</th
            >
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff">Risk Score</th>
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff">Risk Level</th>
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff"
              >Treatment Option</th
            >
            <th data-fill-color="45058d" data-b-a-s="thin" data-f-color="ffffff"
              >Treatment Actions</th
            >
            <th data-fill-color="45058d" data-b-a-s="thin" data-f-color="ffffff"
              >Revised Likelihood</th
            >
            <th data-fill-color="45058d" data-b-a-s="thin" data-f-color="ffffff"
              >Revised Likelihood Rationale</th
            >
            <th data-fill-color="45058d" data-b-a-s="thin" data-f-color="ffffff">Revised Impact</th>
            <th data-fill-color="333333" data-b-a-s="thin" data-f-color="ffffff">Revised Impact</th>
            <th data-fill-color="45058d" data-b-a-s="thin" data-f-color="ffffff"
              >Revised Risk Score</th
            >
            <th data-fill-color="45058d" data-b-a-s="thin" data-f-color="ffffff"
              >Revised Risk Level</th
            >
            <th data-fill-color="46035a" data-b-a-s="thin" data-f-color="ffffff">Comments</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(assessment, index) in riskAssessments" :key="index">
            <td>{{ assessment.id }}</td>
            <td>
              {{ assessment.business_unit }}
            </td>
            <td>
              {{ assessment.business_process }}
            </td>
            <td>
              {{ assessment.risk_owner }}
            </td>
            <td>
              <div style="width: 300px">
                <!--eslint-disable-next-line vue/no-v-html-->
                <span v-html="assessment.personal_data_asset"></span>
              </div>
            </td>
            <td>
              <div style="width: 250px">
                <!--eslint-disable-next-line vue/no-v-html-->
                <span v-html="assessment.risk_scenerio"></span>
              </div>
            </td>
            <td>
              <div style="width: 300px">
                <!--eslint-disable-next-line vue/no-v-html-->
                <span v-html="assessment.existing_controls"></span>
              </div>
            </td>
            <td>
              {{ assessment.likelihood }}
            </td>
            <td>
              {{ assessment.likelihood_rationale }}
            </td>
            <td>
              {{ assessment.impact }}
            </td>
            <td>
              <div style="width: 300px">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="assessment.impact_rationale"></span>
              </div>
            </td>
            <td>
              {{ assessment.risk_score }}
            </td>
            <td
              :data-fill-color="customClass(assessment, 'risk_level')"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              {{ assessment.risk_level }}
            </td>
            <td>
              {{ assessment.treatment_option }}
            </td>
            <td width="250" label="Recommended Control">
              {{ assessment.treatment_actions }}
            </td>
            <td>
              {{ assessment.revised_likelihood }}
            </td>
            <td>
              {{ assessment.revised_likelihood_rationale }}
            </td>
            <td>
              {{ assessment.revised_impact }}
            </td>
            <td>
              <div style="width: 300px">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="assessment.revised_impact_rationale"></span>
              </div>
            </td>
            <td>
              {{ assessment.revised_risk_score }}
            </td>
            <td
              :data-fill-color="customClass(assessment, 'revised_risk_level')"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              {{ assessment.revised_risk_level }}
            </td>
            <td>
              {{ assessment.comments }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// import TableToExcel from '@linways/table-to-excel'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {},
  props: {
    selectedClient: {
      type: Object,
      default: () => ({})
    },
    likelihoods: {
      type: Array,
      default: () => []
    },
    impacts: {
      type: Array,
      default: () => []
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
  created() {
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
    fetchRiskAssessments(load = true) {
      this.loading = load
      const fetchRiskAssessmentsResource = new Resource('dpia/fetch-risk-assessments')
      fetchRiskAssessmentsResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.riskAssessments = response.risk_assessments
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
