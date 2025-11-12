<template>
  <el-row v-if="contract !== null" v-loading="loading" :gutter="5">
    <el-col :md="24">
      <div style="border: #f0f0f0 4px solid; padding: 10px; border-radius: 5px">
        <el-row>
          <el-col :md="24">
            <div style="text-align: center">
              <h4>SLA PERFORMANCE SCORE CARD</h4>
              <strong>{{ contract.title }}</strong>
            </div>
          </el-col>
          <el-col :md="12">
            <p><strong>Contract ID:</strong> #{{ contract.id }}</p>
            <p><strong>Start Date:</strong> {{ contract.start_date }}</p>
            <p><strong>Expiry Date:</strong> {{ contract.expiry_date }}</p>
          </el-col>
          <el-col :md="12">
            <div style="text-align: right">
              <p> <strong>Created:</strong> {{ moment(contract.created_at).fromNow() }} </p>
              <p><strong>Last Modified:</strong> {{ moment(contract.updated_at).fromNow() }}</p>
              <p>
                <el-button
                  type="primary"
                  @click="viewDocument(baseServerUrl + 'storage/' + contract.file_link)"
                >
                  View Uploaded Document
                </el-button>
              </p>
            </div>
          </el-col>
        </el-row>
        <div v-if="sla !== null">
          <h4><em>SLA Performance Score Card</em></h4>
          <table v-loading="loading" class="table table-bordered">
            <tbody>
              <tr>
                <td>
                  <strong>Service Name/Title</strong>
                </td>
                <td>
                  {{ sla.service_name }}
                </td>
              </tr>
              <tr>
                <td><strong>Service Description</strong></td>
                <td>
                  {{ sla.service_description }}
                </td>
              </tr>
            </tbody>
          </table>
          <table v-if="sla !== null" class="table table-bordered">
            <tbody>
              <tr>
                <td colspan="4" align="center">
                  <h4>KPI METRICS</h4>
                  <small>Key Performance Indicators</small>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Metrics</td>
                <td
                  >Achieved Value <small>(Analyzed {{ sla.report_frequency }})</small></td
                >
              </tr>
              <tr v-for="(item, index) in sla.score_cards" :key="index">
                <template v-if="item.metrics !== '' && item.metrics !== null">
                  <td>
                    <span>
                      {{ index + 1 }}
                    </span>
                  </td>
                  <td width="200">
                    <strong>{{ item.kpi_metrics.metrics }}</strong
                    ><br />
                    <small
                      ><em>{{ item.kpi_metrics.hint }}</em></small
                    ><br />
                    <strong
                      >Target: {{ item.kpi_metrics.target }}{{ item.kpi_metrics.unit }}</strong
                    >
                  </td>
                  <td>
                    <el-row v-if="sla.report_frequency !== null" :gutter="1">
                      <el-col
                        v-for="(no_of_assessment, assess_index) in number_of_assessments[
                          sla.report_frequency
                        ][0]"
                        :key="assess_index"
                        :md="2"
                      >
                        <small align="center"
                          >{{ number_of_assessments[sla.report_frequency][1] }}
                          {{
                            number_of_assessments[sla.report_frequency][0] > 1
                              ? no_of_assessment
                              : ''
                          }}</small
                        >
                        <div
                          :style="`padding: 2px; border-radius: 5px; background: ${item.scores[no_of_assessment][1]};`"
                        >
                          <input
                            v-model="item.scores[no_of_assessment][0]"
                            class="form-control"
                            @blur="
                              updateAssessmentValue($event.target.value, no_of_assessment, item)
                            "
                          />
                        </div>
                        <hr />
                      </el-col>
                    </el-row>
                    <small>Supply achieved value</small>
                  </td>
                  <!-- <td>
                    <el-tag
                      :type="(item.score === 'Satisfied') ? 'success' : 'danger'"
                      effect="plain"
                    >
                      {{ item.score }}
                    </el-tag>
                  </td> -->
                </template>
              </tr>
              <!-- <tr>
                <td colspan="2">
                  <strong>Service Quality Rating</strong>
                </td>
                <td colspan="2">
                  <el-rate
                    v-model="score.service_quality_rating"
                    :colors="['red', 'orange', 'green']"
                    :texts="['Bad', 'Poor', 'Average', 'Good', 'Excellent']"
                    show-text
                    :allow-half="true"
                  />
                  <small>Customer satisfaction rating</small>
                </td>
              </tr> -->
            </tbody>
          </table>
          <!-- <table class="table table-bordered">
            <tbody>
              <tr>
                <td><strong>SLA Compliance Status</strong></td>
                <td>
                  Pending
                </td>
              </tr>
              <tr>
                <td><strong>Overall Performance Score</strong></td>
                <td>
                  Pending
                </td>
              </tr>
              <tr>
                <td><strong>Action Required</strong></td>
                <td>
                  <el-select
                    v-model="score.action_required"
                    style="width: 100%"
                    placeholder="Set Value"
                  >
                    <el-option
                      v-for="(method, index2) in ['None', 'Escalate', 'Issue Warning', 'Terminate']"
                      :key="index2"
                      :label="method"
                      :value="method"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <td><strong>Notes/Comments</strong></td>
                <td>
                  <div style="width: 99%">
                    <ckeditor
                      v-model="score.comments"
                      :editor="editor"
                      :config="editorConfig"
                    />
                    <small>Additional observations</small>
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>Approval Status</strong></td>
                <td>
                  <el-select
                    v-model="score.approval_status"
                    style="width: 100%"
                    placeholder="Set Value"
                  >
                    <el-option
                      v-for="(type, index4) in ['Pending', 'Approved', 'Reject']"
                      :key="index4"
                      :label="type"
                      :value="type"
                    />
                  </el-select>
                </td>
              </tr>
              <tr v-if="score.penalty_type === 'Financial Penalties'">
                <td><strong>Penalty Amount (%)</strong></td>
                <td>
                  <el-input
                    v-model="score.penalty_amount"
                    type="number"
                  >
                    <template slot="append">
                      %
                    </template>
                  </el-input>
                  <small>Set percentage of contract value as penalty</small>
                </td>
              </tr>
              <tr>
                <td
                  align="right"
                  colspan="2"
                >
                  <el-button
                    type="success"
                    @click="saveSLA()"
                  >
                    Save Changes
                  </el-button>
                </td>
              </tr>
            </tbody>
          </table> -->
        </div>
      </div>
      <el-dialog
        v-if="showDocumentModal"
        v-model="showDocumentModal"
        v-model:visible="showDocumentModal"
        title="Contract Document"
      >
        <iframe class="doc" :src="selectedDocument" width="650" height="500"></iframe>
      </el-dialog>
    </el-col>
    <!-- <el-col :md="7">
      <aside>
        <h4>Uploaded Contract</h4>
        <iframe
          class="doc"
          :src="baseServerUrl+'storage/'+contract.file_link"
          width="330"
          height="500"
        />
      </aside>
    </el-col> -->
  </el-row>
</template>
<script>
import moment from 'moment'
import Resource from '@/api/resource'

export default {
  props: {
    selectedContract: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      currency: '₦',
      loading: false,
      contract: null,
      defaultScoreVal: {
        contract_id: '',
        client_id: '',
        vendor_id: '',
        sla_config_id: '',
        delivery_timeliness: '',
        service_quality_rating: '',
        uptime_performance: '',
        issue_resolution_time: '',
        sla_compliance_status: '',
        overall_performance_score: '',
        action_required: '',
        comments: '',
        approval_status: ''
      },
      number_of_assessments: {
        Weekly: [52, 'Week'],
        Monthly: [12, 'Month'],
        Quarterly: [4, 'Quarter'],
        Biannually: [2, 'Half'],
        Annually: [1, '']
      },
      score_cards: [],
      score: null,
      sla: null,
      showDocumentModal: false,
      selectedDocument: null
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  mounted() {
    this.setupSLAValues()
    this.showSLA()
  },
  methods: {
    moment,
    determineScore(target, result, unit, rowIndex) {
      switch (unit) {
        case '%':
          if (result === '' || result === null) {
            this.score.score_cards[rowIndex].score = 'Undetermined'
          } else if (parseInt(result) < parseInt(target)) {
            this.score.score_cards[rowIndex].score = 'Breached'
          } else {
            this.score.score_cards[rowIndex].score = 'Satisfied'
          }
          break
        case 'Hrs':
          if (result === '' || result === null) {
            this.score.score_cards[rowIndex].score = 'Undetermined'
          } else if (parseInt(result) > parseInt(target)) {
            this.score.score_cards[rowIndex].score = 'Breached'
          } else {
            this.score.score_cards[rowIndex].score = 'Satisfied'
          }
          break
        case 'Days':
          if (result === '' || result === null) {
            this.score.score_cards[rowIndex].score = 'Undetermined'
          } else if (parseInt(result) > parseInt(target)) {
            this.score.score_cards[rowIndex].score = 'Breached'
          } else {
            this.score.score_cards[rowIndex].score = 'Satisfied'
          }
          break
        default:
          this.score.score_cards[rowIndex].score = 'Undetermined'
          break
      }
    },
    viewDocument(doc) {
      this.showDocumentModal = true
      this.selectedDocument = doc
    },
    setupSLAValues() {
      this.contract = this.selectedContract
      // this.sla = this.selectedContract.sla
      // this.score = (this.selectedContract.score !== null) ? this.selectedContract.score : this.defaultScoreVal
      // this.score.score_cards = (this.selectedContract.score !== null) ? this.score.score_cards : this.sla.performance_metrics
      // this.score.vendor_id = this.contract.vendor_id
      // this.score.client_id = this.contract.client_id
      // this.score.contract_id = this.contract.id
      // this.score.sla_config_id = this.sla.id

      // for (let index = 0; index < this.score.score_cards.length; index++) {
      //   const item = this.score.score_cards[index]
      //   this.determineScore(item.target, item.result, item.unit, index)
      // }
    },
    showSLA(load = true) {
      this.loading = load
      const saveScoreResource = new Resource('vdd/client-contracts/show-sla')
      saveScoreResource
        .get(this.selectedContract.sla.id)
        .then((response) => {
          this.sla = response.sla

          // for (let index = 0; index < this.sla.score_cards.length; index++) {
          //   const item = this.sla.score_cards[index]
          //   this.determineScore(item.target, item.result, item.unit, index)
          // }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    updateAssessmentValue(value, key, row) {
      const params = {
        key,
        value
      }

      // assessment.loader = true
      const updateResources = new Resource('vdd/client-contracts/update-kpi-scores')
      updateResources
        .update(row.id, params)
        .then(() => {
          this.showSLA(false)
        })
        .catch(() => {})
    },
    saveSLA() {
      this.loading = true
      const form = this.score
      const saveScoreResource = new Resource('vdd/client-contracts/save-performance-score')
      saveScoreResource
        .store(form)
        .then(() => {
          this.$message({ message: 'Action Successful', type: 'success' })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
