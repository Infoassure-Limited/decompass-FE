<template>
  <el-card>
    <el-button
      :loading="downloading"
      type="primary"
      @click="exportTableToExcel('riskAssessmentTable')"
    >
      Export
    </el-button>
    <table id="riskAssessmentTable" class="table table-bordered table-striped table-responsive">
      <thead>
        <tr>
          <th
            colspan="4"
            style="font-size: 18px; text-align: center"
            data-f-sz="18"
            data-fill-color="45058d"
            data-f-color="ffffff"
          >
            RISK DESCRIPTION
          </th>
          <th
            colspan="7"
            style="font-size: 18px; text-align: center"
            data-f-sz="18"
            data-fill-color="45058d"
            data-f-color="ffffff"
          >
            PRE-TREATMENT
          </th>
          <th
            colspan="6"
            style="font-size: 18px; text-align: center"
            data-f-sz="18"
            data-fill-color="45058d"
            data-f-color="ffffff"
          >
            RISK TREATMENT
          </th>
          <th
            colspan="7"
            style="font-size: 18px; text-align: center"
            data-f-sz="18"
            data-fill-color="45058d"
            data-f-color="ffffff"
          >
            POST-TREATMENT
          </th>
        </tr>
        <tr>
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >REF</th
          >
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >Business Process Name</th
          >
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >Risk Owner</th
          >
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >Risk Description</th
          >
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >Existing Treatment</th
          >
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >Likelihood</th
          >
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >Likelihood Rationale</th
          >
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >Impact</th
          >
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >Impact Rationale</th
          >
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >Risk Score</th
          >
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >Risk Level</th
          >
          <th style="font-size: 14px" data-f-sz="14" data-fill-color="333333" data-f-color="ffffff"
            >Treatment Option</th
          >
          <th data-fill-color="333333" data-f-color="ffffff">Outage Scenario</th>
          <th data-fill-color="333333" data-f-color="ffffff">Treatment</th>
          <th data-fill-color="333333" data-f-color="ffffff">Responsible</th>
          <th data-fill-color="333333" data-f-color="ffffff">Present Status</th>
          <th data-fill-color="333333" data-f-color="ffffff">Timeline</th>
          <th data-fill-color="333333" data-f-color="ffffff">Likelihood</th>
          <th data-fill-color="333333" data-f-color="ffffff">Likelihood Rationale</th>
          <th data-fill-color="333333" data-f-color="ffffff">Impact</th>
          <th data-fill-color="333333" data-f-color="ffffff">Impact Rationale</th>
          <th data-fill-color="333333" data-f-color="ffffff">Risk Score</th>
          <th data-fill-color="333333" data-f-color="ffffff">Risk Level</th>
          <th data-fill-color="333333" data-f-color="ffffff">Residual Risk</th>
        </tr>
      </thead>
      <tbody v-if="!downloading">
        <tr v-for="(assessment, index) in riskAssessments" :key="index">
          <td>{{ assessment.ra_id }}</td>
          <td>
            <select
              v-model="assessment.business_process_id"
              placeholder="Select Business Process"
              @change="updateField($event, 'business_process_id', assessment)"
            >
              <option
                v-for="(process, process_index) in businessProcesses"
                :key="process_index"
                :label="process.name"
                :value="process.id"
              ></option>
            </select>
          </td>
          <td>
            <input
              v-model="assessment.risk_owner"
              type="text"
              @blur="updateField($event, 'risk_owner', assessment)"
            />
          </td>
          <td>
            <input
              v-model="assessment.risk_description"
              type="text"
              @blur="updateField($event, 'risk_description', assessment)"
            />
          </td>
          <td>
            <input
              v-model="assessment.existing_treatment"
              type="text"
              @blur="updateField($event, 'existing_treatment', assessment)"
            />
          </td>
          <td>
            <select
              v-model="assessment.likelihood"
              placeholder="Select Likelihood Value"
              @change="updateField($event, 'likelihood', assessment)"
            >
              <option
                v-for="(likelihood, l_index) in likelihoods"
                :key="l_index"
                :label="`${likelihood.value}-${likelihood.name}`"
                :value="likelihood.value"
              ></option>
            </select>
          </td>
          <td>
            <input
              v-model="assessment.likelihood_rationale"
              type="text"
              @blur="updateField($event, 'likelihood_rationale', assessment)"
            />
          </td>
          <td>
            <select
              v-model="assessment.impact"
              filterable
              style="width: 100%"
              placeholder="Impact"
              @change="updateField($event, 'impact', assessment)"
            >
              <option
                v-for="(impact, impact_index) in impacts"
                :key="impact_index"
                :label="`${impact.value}-${impact.name}`"
                :value="impact.value"
              ></option>
            </select>
          </td>
          <td>
            <input
              v-model="assessment.impact_rationale"
              type="text"
              @blur="updateField($event, 'impact_rationale', assessment)"
            />
          </td>
          <td>
            <span v-loading="assessment.loader">{{ assessment.risk_score }}</span>
          </td>
          <td :style="`background: #${customClass(assessment, 'risk_level')}`">
            <div v-loading="assessment.loader">{{ assessment.risk_level }} </div>
          </td>
          <td>
            <select
              v-model="assessment.treatment_option"
              placeholder="Select"
              @change="updateField($event, 'treatment_option', assessment)"
            >
              <option
                v-for="(assessment_option, option_index) in assessment_options"
                :key="option_index"
                :label="assessment_option"
                :value="assessment_option"
              ></option>
            </select>
          </td>
          <td>
            <select
              v-model="assessment.outage_scenerio"
              placeholder="Select"
              @change="updateField($event, 'outage_scenerio', assessment)"
            >
              <option
                v-for="(outage_scenerio, option_index) in outage_scenerios"
                :key="option_index"
                :label="outage_scenerio"
                :value="outage_scenerio"
              ></option>
            </select>
          </td>
          <td>
            <input
              v-model="assessment.treatment"
              type="text"
              @blur="updateField($event, 'treatment', assessment)"
            />
          </td>
          <td>
            <input
              v-model="assessment.responsible"
              type="text"
              @blur="updateField($event, 'responsible', assessment)"
            />
          </td>
          <td>
            <select
              v-model="assessment.status"
              placeholder="Select"
              @change="updateField($event, 'status', assessment)"
            >
              <option
                v-for="(status, status_index) in ['N/A', 'ONGOING', 'NOT STARTED', 'COMPLETED']"
                :key="status_index"
                :label="status"
                :value="status"
              ></option>
            </select>
          </td>
          <td>
            <input
              v-model="assessment.target_date_for_closure"
              placeholder="Timeline"
              type="text"
              @blur="updateField($event, 'target_date_for_closure', assessment)"
            />
          </td>
          <td>
            <select
              v-model="assessment.post_treatment_likelihood"
              placeholder="Select"
              @change="updateField($event, 'post_treatment_likelihood', assessment)"
            >
              <option
                v-for="(likelihood, l_index) in likelihoods"
                :key="l_index"
                :label="`${likelihood.value}-${likelihood.name}`"
                :value="likelihood.value"
              ></option>
              <option value="0" label="N/A"></option>
            </select>
          </td>
          <td>
            <input
              v-model="assessment.post_treatment_likelihood_rationale"
              type="text"
              @blur="updateField($event, 'post_treatment_likelihood_rationale', assessment)"
            />
          </td>
          <td>
            <select
              v-model="assessment.post_treatment_impact"
              placeholder="Select"
              @change="updateField($event, 'post_treatment_impact', assessment)"
            >
              <option
                v-for="(impact, c_index) in impacts"
                :key="c_index"
                :label="`${impact.value}-${impact.name}`"
                :value="impact.value"
              ></option>
              <option value="0" label="N/A"></option>
            </select>
          </td>
          <td>
            <input
              v-model="assessment.post_treatment_impact_rationale"
              type="text"
              @blur="updateField($event, 'post_treatment_impact_rationale', assessment)"
            />
          </td>
          <td>
            <span v-loading="assessment.loader">{{ assessment.post_treatment_risk_score }}</span>
          </td>
          <td :style="`background: #${customClass(assessment, 'post_treatment_risk_level')}`">
            <div v-loading="assessment.loader">{{ assessment.post_treatment_risk_level }} </div>
          </td>
          <td>
            <input
              v-model="assessment.residual_risk"
              placeholder=""
              type="text"
              @blur="updateField($event, 'risk_treatment_plan_residual', assessment)"
            />
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="(assessment, index) in riskAssessments" :key="index">
          <td>{{ assessment.ra_id }}</td>
          <td>{{ assessment.business_process.name }}</td>
          <td>{{ assessment.risk_owner }}</td>
          <td>{{ assessment.risk_description }}</td>
          <td>{{ assessment.existing_treatment }}</td>
          <td>{{ formatIds(assessment.likelihood, 'likelihood') }}</td>
          <td>{{ assessment.likelihood_rationale }}</td>
          <td>{{ formatIds(assessment.impact, 'impact') }}</td>
          <td>{{ assessment.impact_rationale }}</td>
          <td data-t="n">
            {{ assessment.risk_score }}
          </td>
          <td
            :style="`background: #${customClass(assessment, 'risk_level')}`"
            :data-fill-color="customClass(assessment, 'risk_level')"
          >
            {{ assessment.risk_level }}
          </td>
          <td>{{ assessment.treatment_option }}</td>
          <td>{{ assessment.outage_scenerio }}</td>
          <td>{{ assessment.treatment }}</td>
          <td>{{ assessment.responsible }}</td>
          <td>{{ assessment.status }}</td>
          <td>{{ assessment.target_date_for_closure }}</td>
          <td>{{ formatIds(assessment.post_treatment_likelihood, 'likelihood') }}</td>
          <td>{{ assessment.post_treatment_likelihood_rationale }}</td>
          <td>{{ formatIds(assessment.post_treatment_impact, 'impact') }}</td>
          <td>{{ assessment.post_treatment_impact_rationale }}</td>
          <td data-t="n">
            {{ assessment.post_treatment_risk_score }}
          </td>
          <td
            :style="`background: #${customClass(assessment, 'post_treatment_risk_level')}`"
            :data-fill-color="customClass(assessment, 'post_treatment_risk_level')"
          >
            {{ assessment.post_treatment_risk_level }}
          </td>
          <td>{{ assessment.residual_risk }}</td>
        </tr>
      </tbody>
    </table>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {},
  props: {
    businessUnitId: {
      type: Number,
      default: null
    },
    clientId: {
      type: Number,
      default: null
    },
    businessProcesses: {
      type: Array,
      default: () => []
    },
    riskAssessments: {
      type: Array,
      default: () => []
    },
    likelihoods: {
      type: Array,
      default: () => []
    },
    impacts: {
      type: Array,
      default: () => []
    },
    matrix: {
      type: String,
      default: '3x3'
    }
  },
  data() {
    return {
      loading: false,
      isCreaterisk_assessmentsidebarActive: false,
      pageLength: 10,
      dir: false,
      risk_assessments: [],
      clients: [],
      searchTerm: '',
      categories: [],
      asset_types: [],
      assessment_options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      outage_scenerios: [
        'Premise',
        'Technology',
        'People',
        'Transport',
        'Vendor',
        'Utility',
        'Other'
      ],
      downloading: false
    }
  },
  created() {},
  methods: {
    checkPermission,
    customClass(row, opt) {
      if (opt === 'risk_level') {
        if (row.risk_level === 'High') {
          return 'DD2C2C'
        }
        if (row.risk_level === 'Medium') {
          return 'F0C63E'
        }
        if (row.risk_level === 'Low') {
          return '3BD135'
        }
      }
      if (opt === 'post_treatment_risk_level') {
        if (row.post_treatment_risk_level === 'High') {
          return 'DD2C2C'
        }
        if (row.post_treatment_risk_level === 'Medium') {
          return 'F0C63E'
        }
        if (row.post_treatment_risk_level === 'Low') {
          return '3BD135'
        }
      }
      return ''
    },
    updateField($event, field, assessment) {
      // const valuesArray = [assessment.confidentiality, assessment.integrity, assessment.availability]
      // const impactVal = this.maxValue(valuesArray)
      // const riskVal = assessment.risk_likelihood_id * impactVal
      // const riskCategory = this.analyzeRiskCategory(riskVal)
      // const params = {
      //   field, value: $event.target.value, impact_value: impactVal, risk_value: riskVal, risk_level: riskCategory,
      // }
      const params = { field, value: $event.target.value, matrix: this.matrix }

      assessment.loader = true
      const fetchClientsResource = new Resource('bia/update-risk-assessment-field')
      fetchClientsResource.update(assessment.id, params).then(() => {
        // this.risk_assessments[assessment.index] = response
        this.$emit('reload')

        assessment.loader = false
      })
    },
    // maxValue(arrayNums) {
    //   let max = 0
    //   arrayNums.forEach(num => {
    //     if (num > max) {
    //       max = num
    //     }
    //   })
    //   return max
    // },
    // analyzeRiskCategory(riskValue) {
    //   if (riskValue >= 6) {
    //     return 'High'
    //   }
    //   if (riskValue >= 3) {
    //     return 'Medium'
    //   }
    //   return 'Low'
    // },
    exportTableToExcel(id) {
      this.downloading = true
      // const rawData = this.riskAssessments
      // import('@/vendor/Export2Excel').then(excel => {
      //   excel.export_table_to_excel(id)
      //   setTimeout(() => {
      //     this.downloading = false
      //   }, 2000)
      // })
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: 'BIARiskAssessmentTable.xlsx',
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
