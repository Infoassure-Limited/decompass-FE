<template>
  <div>
    <!-- <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="form.business_unit_id"
            placeholder="Select Business Unit"
            style="width: 100%;"
            filterable
            @input="fetchRisks()"
          >
            <el-option
              v-for="(business_unit, index) in business_units"
              :key="index"
              :value="business_unit.id"
              :label="business_unit.unit_name"
            />
          </el-select>
        </el-col>
      </el-row>
    </aside> -->
    <div>
      <el-button type="primary" @click="exportToExcel('RCMReport')"> Export </el-button>
      <p></p>
      <div class="table-responsive">
        <h3>Risk and Control Matrix for {{ assessmentModule.toUpperCase() }}</h3>
        <table id="RCMReport" v-loading="loading" class="table table-bordered">
          <thead>
            <tr>
              <template v-if="assessmentModule === 'rcsa'">
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px"
                  data-f-sz="14"
                >
                  <div style="width: 10px"> L1 </div>
                </th>
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px"
                  data-f-sz="14"
                >
                  <div style="width: 10px"> L2 </div>
                </th>
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px"
                  data-f-sz="14"
                >
                  <div style="width: 10px"> L3 </div>
                </th>
              </template>
              <template v-if="assessmentModule !== 'isms'">
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px"
                  data-f-sz="14"
                >
                  <div style="width: 50px"> PROCESS ID </div>
                </th>
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px"
                  data-f-sz="14"
                >
                  <div style="width: 150px"> DEPARTMENT/BUSINESS UNIT </div>
                </th>
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px"
                  data-f-sz="14"
                >
                  <div style="width: 250px"> PROCESS </div>
                </th>
              </template>
              <template v-if="assessmentModule === 'isms' || assessmentModule === 'ndpa'">
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px"
                  data-f-sz="14"
                >
                  <div style="width: 250px"> Asset Type </div>
                </th>
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px"
                  data-f-sz="14"
                >
                  <div style="width: 150px"> Asset </div>
                </th>
              </template>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> RISK NO. </div>
              </th>
              <template v-if="assessmentModule === 'rcsa'">
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px"
                  data-f-sz="14"
                >
                  <div style="width: 250px"> RISK CATEGORY </div>
                </th>
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px"
                  data-f-sz="14"
                >
                  <div style="width: 250px"> RISK SUB-CATEGORY </div>
                </th>
              </template>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 150px"> RISK OWNER </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> RISK DESCRIPTION </div>
              </th>
              <!-- <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  IMPACT/OUTCOME
                </div>
              </th> -->
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> CONTROL NO. </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> CONTROL LOCATION </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> CONTROL DESCRIPTION </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> CONTROL OWNER </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> FREQUENCY </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> CONTROL TYPE </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> NATURE OF CONTROL </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> APPLICATION USED </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> COMPENSATING CONTROL </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> TEST PROCEDURES </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> SAMPLE SIZE </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> DATA REQUIRED </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> LINK TO EVIDENCE </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> TEST CONCLUSION </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> GAP DESCRIPTION </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> TOD IMPROVEMENT OPPORTUNITY (IF ANY) </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> RECOMMENDATION </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> RESPONSIBILITY </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> TIMELINE </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px"
                data-f-sz="14"
              >
                <div style="width: 250px"> TOD GAP STATUS </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(report, index) in risk_registers" :key="index">
              <tr>
                <template v-if="assessmentModule === 'rcsa'">
                  <td>
                    {{ report.l1 }}
                  </td>
                  <td>
                    {{ report.l2 }}
                  </td>
                  <td>
                    {{ report.sub_unit }}
                  </td>
                </template>
                <template v-if="assessmentModule !== 'isms'">
                  <td>
                    {{ report.generated_process_id }}
                  </td>
                  <td>
                    {{ report.business_unit }}
                  </td>
                  <td>{{ report.business_process }}</td>
                </template>
                <template v-if="assessmentModule === 'isms' || assessmentModule === 'ndpa'">
                  <td>
                    {{ report.asset_type_name }}
                  </td>
                  <td>
                    {{ report.asset_name }}
                  </td>
                </template>
                <td>{{ report.risk_id }}</td>
                <template v-if="assessmentModule === 'rcsa'">
                  <td>{{ report.type }}</td>
                  <td>{{ report.sub_type }}</td>
                </template>
                <td>
                  {{ report.risk_owner }}
                </td>
                <td>
                  <!-- eslint-disable-next-line vue/no-v-html-->
                  <span v-html="report.vulnerability_description"></span>
                </td>
                <!-- <td>
                  <span v-html="report.outcome" />
                </td> -->
                <td>{{ report.control_no }}</td>
                <td>
                  {{ report.control_location }}
                </td>
                <td>
                  <!-- eslint-disable-next-line vue/no-v-html-->
                  <span v-html="report.control_description"></span>
                </td>
                <td>
                  {{ report.control_owner }}
                </td>
                <td>
                  {{ report.control_frequency }}
                </td>
                <td>
                  {{ report.control_type }}
                </td>
                <td>
                  {{ report.nature_of_control }}
                </td>
                <td>
                  {{ report.application_used_for_control }}
                </td>
                <td>
                  {{ report.compensating_control }}
                </td>
                <td>
                  {{ report.test_procedures }}
                </td>
                <td>
                  {{ report.sample_size }}
                </td>
                <td>
                  {{ report.data_required }}
                </td>
                <td>
                  <a
                    v-if="report.link_to_evidence !== null"
                    :href="baseServerUrl + 'storage/' + report.link_to_evidence"
                    >{{ baseServerUrl + 'storage/' + report.link_to_evidence }}</a
                  >
                </td>
                <td>
                  {{ report.test_conclusion }}
                </td>
                <td>
                  {{ report.gap_description }}
                </td>
                <td>
                  {{ report.tod_improvement_opportunity }}
                </td>
                <td>
                  {{ report.recommendation }}
                </td>
                <td>
                  {{ report.responsibility }}
                </td>
                <td>
                  {{ report.timeline }}
                </td>
                <td>
                  {{ report.tod_gap_status }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
// import {
//   BButton,
// } from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
// import TableToExcel from '@linways/table-to-excel'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // BButton,
  },
  props: {
    clientId: {
      type: Number,
      default: null
    },
    // businessUnitId: {
    //   type: Number,
    //   default: null,
    // },
    assessmentModule: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      downloading: false,
      control_frequencies: [
        'Per Transaction',
        'Daily',
        'Weekly',
        'Monthly',
        'Quarterly',
        'Biannually',
        'Annually',
        'N/A',
        'Per Merchant',
        'Per Terminal Request'
      ],
      risk_types: [],
      risk_registers: [],
      clients: [],
      business_units: [],
      showManageProject: false,
      selectedClient: null,
      showAssignModal: false,
      showAssignConsultantModal: false,
      form: {
        client_id: '',
        business_unit_id: ''
      },
      selectedRisk: null
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  watch: {
    businessUnitId() {
      this.form.client_id = this.clientId
      this.form.business_unit_id = this.businessUnitId
      this.fetchRisks()
    }
  },
  created() {
    this.form.client_id = this.clientId
    this.form.business_unit_id = this.businessUnitId
    this.fetchRiskCategories()
    this.fetchRisks()
  },
  methods: {
    checkPermission,
    fetchRiskCategories() {
      const fetchEntryResource = new Resource('risk-assessment/fetch-categories')
      fetchEntryResource
        .list({ client_id: this.form.client_id })
        .then((response) => {
          this.risk_types = response.categories
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    // fetchBusinessUnits() {
    //
    //   this.form.business_unit_id = ''
    //   const fetchCriteriaResource = new Resource('business-units/fetch-business-units')
    //   fetchCriteriaResource.list({ client_id: this.form.client_id })
    //     .then(response => {
    //       this.business_units = response.business_units
    //     }).catch(() => { this.loading = false })
    // },
    fetchRisks() {
      this.loading = true
      const fetchRisksResource = new Resource('fetch-module-risk-registers')
      fetchRisksResource
        .list({ client_id: this.form.client_id, module: this.assessmentModule })
        .then((response) => {
          this.risk_registers = response.risk_registers
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    updateField($event, field, assessment) {
      const params = { field, value: $event.target.value }
      const updateResource = new Resource('update-risk-register')
      updateResource.update(assessment.id, params).then(() => {
        this.$emit('reload')
      })
    },
    exportToExcel(id) {
      // this.downloading = true
      // setTimeout(() => {
      //   TableToExcel.convert(document.getElementById(id), {
      //     name: 'RCM-Report.xlsx',
      //     sheet: {
      //       name: 'Sheet 1'
      //     }
      //   })
      // }, 1000)
      // setTimeout(() => {
      //   this.downloading = false
      // }, 30000)
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyProjectsResource = new Resource('risk-assessment/destroy')
        destroyProjectsResource.destroy(row.id).then(() => {
          this.fetchRisks()
          this.loading = false
        })
      }
    }
  }
}
</script>
