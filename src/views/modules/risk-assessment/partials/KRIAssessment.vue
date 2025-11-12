<template>
  <div v-loading="loading">
    <div v-if="mode === 'manage'">
      <div v-if="assessments.length > 0" class="table-responsive">
        <p>Click on the <code>+</code> sign to see details</p>
        <v-client-table
          :data="assessments"
          v-loading="loading"
          :columns="columns"
          :options="options"
        >
          <template v-slot:child_row="{ row }">
            <div>
              <div>
                <span class="pull-right">
                  <el-button type="primary" plain size="mini" @click="setRiskTriggerThreshold(row)"
                    >Configure Risk Trigger Threshold</el-button
                  >
                </span>
                <p> Assessment Details </p>
                <el-row
                  v-if="
                    row.frequency_of_assessment !== null &&
                    row.unit_of_measurement !== null &&
                    row.risk_trigger_threshold !== null
                  "
                  :gutter="5"
                >
                  <el-col
                    v-for="(no_of_assessment, assess_index) in number_of_assessments[
                      row.frequency_of_assessment
                    ]"
                    :key="assess_index"
                    :md="2"
                  >
                    <label for=""
                      >{{
                        row.frequency_of_assessment.substring(
                          0,
                          row.frequency_of_assessment.length - 2
                        )
                      }}
                      {{ no_of_assessment }}</label
                    >
                    <div
                      :style="`padding: 10px; background: ${row.assessments[no_of_assessment][1]};`"
                    >
                      <input
                        v-model="row.assessments[no_of_assessment][0]"
                        class="form-control"
                        @blur="updateAssessmentValue($event.target.value, no_of_assessment, row)"
                      />
                    </div>
                    <hr />
                  </el-col>
                </el-row>
                <div v-else class="alert alert-danger" style="padding: 20px" :closable="false">
                  <strong>To Do List:</strong>
                  <ol>
                    <li v-if="row.frequency_of_assessment === null">
                      Set the Frequency of Assessment
                    </li>
                    <li v-if="row.unit_of_measurement === null"> Set the Unit of Measurement </li>
                    <li v-if="row.risk_trigger_threshold === null">
                      Configure the Risk Trigger Threshold
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:frequency_of_assessment="{ row }">
            <div>
              <select
                v-model="row.frequency_of_assessment"
                class="form-control"
                placeholder="Select"
                @change="updateField($event.target.value, 'frequency_of_assessment', row)"
              >
                <option
                  v-for="(frequency, freq_index) in frequencies"
                  :key="freq_index"
                  :label="frequency"
                  :value="frequency"
                ></option>
              </select>
            </div>
          </template>
          <template v-slot:unit_of_measurement="{ row }">
            <div>
              <select
                v-model="row.unit_of_measurement"
                class="form-control"
                placeholder="Select"
                @change="updateField($event.target.value, 'unit_of_measurement', row)"
              >
                <option
                  v-for="(measurement, m_index) in measurements"
                  :key="m_index"
                  :label="measurement"
                  :value="measurement"
                ></option>
              </select>
            </div>
          </template>
          <template v-slot:comment="{ row }">
            <div>
              <textarea
                v-model="row.comment"
                class="form-control"
                placeholder="Comment here..."
                @blur="updateField($event.target.value, 'comment', row)"
              ></textarea>
            </div>
          </template>
        </v-client-table>
      </div>
      <div v-else>
        <el-empty description="There are no Key Risk Indicator to assess." />
      </div>
      <!-- CREATE NEW ASSESSMENT-->
      <el-modal
        v-model="showThresholdForm"
        title="Set Risk Trigger Threshold"
        centered
        size="lg"
        hide-footer
      >
        <div>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td>Color</td>
                <td>Operator</td>
                <td>Value</td>
                <td></td>
              </tr>
              <tr v-for="(data, index) in threshold.data" :key="index">
                <td>
                  <!-- <el-color-picker v-model="data.color" /> -->
                  <v-swatches v-model="data.color" popover-x="right" swatches="text-advanced" />
                </td>
                <td>
                  <el-select
                    v-model="data.operator"
                    style="width: 100%"
                    placeholder="Select Operator"
                  >
                    <el-option
                      v-for="(operator, oper_index) in operators"
                      :key="oper_index"
                      :label="operator.label"
                      :value="operator.value"
                    />
                  </el-select>
                </td>
                <td>
                  <div v-if="data.operator !== '-'">
                    <el-input v-model="data.value" placeholder="Input Threshold Value" />
                  </div>
                  <div v-else>
                    <el-input v-model="data.value" placeholder="Lower Threshold" />
                    <hr />
                    <el-input v-model="data.value2" placeholder="Upper Threshold" />
                  </div>
                </td>
                <td>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    @click="removeThresholdLine(index)"
                  />
                </td>
              </tr>
              <tr v-if="fill_fields_error">
                <td colspan="5">
                  <label class="alert alert-danger"
                    >Please fill all empty fields before adding another row</label
                  >
                </td>
              </tr>
              <tr>
                <td colspan="4" align="right">
                  <el-button type="primary" plain size="mini" @click="addNewThresholdLine()">
                    Add New Row
                  </el-button>
                  <el-button
                    type="success"
                    size="mini"
                    :disabled="rowIsEmpty()"
                    @click="submitThreshhold()"
                  >
                    Submit
                  </el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-modal>
    </div>
    <div v-else class="table-responsive">
      <h3>KRI Assessment Summary</h3>
      <table id="KRIAssessmentTable" class="table table-bordered table-striped">
        <thead>
          <tr>
            <th
              data-fill-color="333333"
              data-f-color="ffffff"
              data-el-a-s="thin"
              :rowspan="2"
              colspan="4"
            ></th>
            <th
              v-for="quarterCount in 4"
              :key="quarterCount"
              data-fill-color="3A61C2"
              data-f-color="ffffff"
              data-a-h="center"
              data-el-a-s="thin"
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
              data-el-a-s="thin"
              :colspan="4"
              style="text-align: center"
              >Month {{ monthCount }}</th
            >
          </tr>
          <tr>
            <th data-fill-color="333333" data-f-color="ffffff" data-el-a-s="thin">KRI</th>
            <th data-fill-color="333333" data-f-color="ffffff" data-el-a-s="thin"
              >Frequency of Assessment</th
            >
            <th data-fill-color="333333" data-f-color="ffffff" data-el-a-s="thin"
              >Unit of Measurement</th
            >
            <th data-fill-color="333333" data-f-color="ffffff" data-el-a-s="thin">Comment</th>
            <th
              v-for="weekCount in 48"
              :key="weekCount"
              data-fill-color="333333"
              data-f-color="ffffff"
              data-a-h="center"
              data-el-a-s="thin"
              style="text-align: center"
              >Week {{ weekCount }}</th
            >
          </tr>
        </thead>
        <tbody>
          <tr v-for="(assessment, index) in assessments" :key="index">
            <td data-el-a-s="thin">
              <div style="width: 250px">
                {{ assessment.kri }}
              </div>
            </td>
            <td data-el-a-s="thin">
              <div style="width: 250px">
                {{ assessment.frequency_of_assessment }}
              </div>
            </td>
            <td data-el-a-s="thin">
              {{ assessment.unit_of_measurement }}
            </td>
            <td data-el-a-s="thin">
              <div style="width: 300px">
                {{ assessment.comment }}
              </div>
            </td>
            <td
              v-for="(no_of_assessment, assess_index) in number_of_assessments[
                assessment.frequency_of_assessment
              ]"
              :key="assess_index"
              :colspan="parseInt(48 / number_of_assessments[assessment.frequency_of_assessment])"
              :data-fill-color="assessment.assessments[no_of_assessment][1].slice(1)"
              data-f-color="000000"
              data-a-h="center"
              data-el-a-s="thin"
              :style="`padding: 20px; background: ${assessment.assessments[no_of_assessment][1]}; color: #000000;`"
            >
              {{ assessment.assessments[no_of_assessment][0] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import VSwatches from 'vue3-swatches'
import Resource from '@/api/resource'

export default {
  components: {
    VSwatches
  },
  props: {
    mode: {
      type: String,
      default: () => 'manage'
    }
  },
  data() {
    return {
      showTreatmentModal: false,
      loading: false,
      downloading: false,
      columns: ['kri', 'frequency_of_assessment', 'unit_of_measurement', 'comment'],
      options: {
        headings: {
          kri: 'KRI'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: false,
        texts: {
          filter: 'Search:'
        },
        sortable: [],
        // filterable: false,
        filterable: []
      },
      assessments: [],
      dir: false,
      frequencies: ['Weekly', 'Monthly', 'Quarterly'],
      measurements: ['Percentage', 'Count/Number'],
      operators: [
        { label: 'Equals (=)', value: '==' },
        { label: 'Less than (<)', value: '<' },
        { label: 'Less than or Equals to (≤)', value: '<=' },
        { label: 'Greater than (>)', value: '>' },
        { label: 'Greater than or Equals to (≥)', value: '>=' },
        { label: 'Range (a-b)', value: '-' }
      ],
      number_of_assessments: {
        Weekly: 48,
        Monthly: 12,
        Quarterly: 4
      },
      showThresholdForm: false,
      fill_fields_error: false,
      threshold: {
        id: '',
        data: []
      }
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    selectedClient() {
      this.fetchKRIAssessments()
    }
  },
  created() {
    this.fetchKRIAssessments()
  },
  methods: {
    fetchKRIAssessments(load = true) {
      this.loading = load
      const fetchRiskAssessmentsResource = new Resource('rcsa/fetch-risk-indicator-assessments')
      fetchRiskAssessmentsResource
        .list({ client_id: this.selectedClient.id, module: 'rcsa' })
        .then((response) => {
          this.assessments = response.assessments
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    setRiskTriggerThreshold(row) {
      this.threshold.id = row.id
      this.threshold.data = row.risk_trigger_threshold !== null ? row.risk_trigger_threshold : []
      if (this.threshold.data.length < 1) {
        this.addNewThresholdLine()
      }
      this.showThresholdForm = true
    },
    rowIsEmpty() {
      const checkEmptyLines = this.threshold.data.filter(
        (detail) => detail.color === '' || detail.value === '' || detail.operator === ''
      )

      if (checkEmptyLines.length >= 1 && this.threshold.data.length > 0) {
        return true
      }
      return false
    },
    addNewThresholdLine() {
      this.fill_fields_error = false
      if (this.rowIsEmpty()) {
        this.fill_fields_error = true
        // this.form_fields[index].seleted_category = true;
      } else {
        this.threshold.data.push({
          color: '#67c23a',
          value: '',
          value2: '',
          operator: ''
        })
      }
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.form_fields.splice(detailId, 1)
      }
    },
    removeThresholdLine(index) {
      this.fill_fields_error = false
      this.threshold.data.splice(index, 1)
    },
    submitThreshhold() {
      const fetchRiskAssessmentsResource = new Resource('rcsa/save-kri-threshold')
      fetchRiskAssessmentsResource
        .store({ id: this.threshold.id, threshold: this.threshold.data })
        .then(() => {
          this.fetchKRIAssessments(true)
          this.showThresholdForm = false
        })
        .catch(() => {
          this.loading = false
          this.showThresholdForm = false
        })
    },
    updateField(value, field, assessment, subField = '') {
      const params = {
        field,
        value,
        sub_field: subField
      }

      // assessment.loader = true
      const updateResources = new Resource('rcsa/update-risk-indicator-assessment')
      updateResources
        .update(assessment.id, params)
        .then(() => {
          // this.risk_assessments[assessment.index] = response
          this.fetchKRIAssessments(false)
        })
        .catch(() => {})
    },
    updateAssessmentValue(value, key, row) {
      const params = {
        key,
        value
      }

      // assessment.loader = true
      const updateResources = new Resource('rcsa/update-kri-assessment-value')
      updateResources
        .update(row.id, params)
        .then(() => {
          this.fetchKRIAssessments(false)
        })
        .catch(() => {})
    },
    exportTableToExcel(id) {
      this.downloading = true
      // const rawData = this.assessments
      // import('@/vendor/Export2Excel').then(excel => {
      //   excel.export_table_to_excel(id)
      //   setTimeout(() => {
      //     this.downloading = false
      //   }, 2000)
      // })
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: 'KRIAssessmentTable.xlsx',
          sheet: {
            name: 'Sheet 1'
          }
        })
      }, 1000)

      setTimeout(() => {
        this.downloading = false
      }, 30000)
    }
  }
}
</script>
<style scoped>
.form-control {
  padding: 0.2rem 0.2rem !important;
  background-color: #fff !important;
  background-clip: padding-box !important;
  border: 1px solid #d8d6de !important;
  border-radius: 0.357rem !important;
}
</style>
