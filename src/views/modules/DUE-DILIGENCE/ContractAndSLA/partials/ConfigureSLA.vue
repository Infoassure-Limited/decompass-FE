<template>
  <el-row v-if="contract !== null" :gutter="5">
    <el-col :md="24">
      <div style="border: #f0f0f0 4px solid; padding: 10px; border-radius: 5px">
        <el-row>
          <el-col :md="24">
            <div style="text-align: center">
              <h4>SLA CONFIGURATION FORM</h4>
              <strong>{{ contract.title }}</strong>
            </div>
          </el-col>
          <el-col :md="12">
            <p><strong>Contract No:</strong> {{ contract.contract_no }}</p>
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
        <div v-loading="loading">
          <h4><em>Service Level Agreement (SLA)</em></h4>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td colspan="2" align="center">
                  <h4>SLA GENERAL INFORMATION</h4>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Service Name/Title</strong>
                </td>
                <td>
                  <el-input
                    v-model="sla.service_name"
                    placeholder="Name/Title of the service provided by the vendor"
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Service Description</strong></td>
                <td>
                  <el-input
                    v-model="sla.service_description"
                    type="textarea"
                    placeholder="Brief explanation of the service provided..."
                    maxlength="500"
                    rows="4"
                    show-word-limit
                  />
                </td>
              </tr>
              <tr>
                <td><strong>SLA Start Date</strong></td>
                <td>
                  <el-date-picker
                    v-model="sla.start_date"
                    type="date"
                    placeholder="Set Start Date"
                    style="width: 100%"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                  />
                </td>
              </tr>
              <tr>
                <td><strong>SLA Expiry Date</strong></td>
                <td>
                  <el-date-picker
                    v-model="sla.expiry_date"
                    type="date"
                    placeholder="Set Expiry Date"
                    style="width: 100%"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Renewal Terms</strong></td>
                <td>
                  <el-radio-group v-model="sla.renewal_terms">
                    <el-radio border label="Auto-Renew" />
                    <el-radio border label="Manual Review" />
                    <el-radio border label="Termination" />
                  </el-radio-group>
                </td>
              </tr>
              <tr>
                <td><strong>Approval Workflow</strong></td>
                <td>
                  <el-select
                    v-model="sla.approval_workflow"
                    filterable
                    style="width: 100%"
                    placeholder="Set Value"
                  >
                    <el-option
                      v-for="(approval, index) in ['Risk Manager', 'Compliance Team']"
                      :key="index"
                      :label="approval"
                      :value="approval"
                    />
                  </el-select>
                  <small>Define who must approve the SLA</small>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td colspan="4" align="center">
                  <h4>PERFORMANCE METRICS</h4>
                  <small>Define key performance expectations</small>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Metrics</td>
                <td>Unit</td>
                <td>Target Value</td>
              </tr>
              <tr v-for="(item, index) in sla.performance_metrics" :key="index">
                <td width="160">
                  <span v-if="item.modify">
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="removeLine(index)"
                    />
                    <el-button
                      size="mini"
                      type="success"
                      icon="el-icon-plus"
                      @click="addLine(index)"
                    />
                  </span>
                  <span v-else>
                    {{ index + 1 }}
                  </span>
                </td>
                <td width="280">
                  <div v-if="item.modify">
                    <el-input v-model="item.metrics" placeholder="Input your metrics value" />
                  </div>
                  <div v-else>
                    <strong>{{ item.metrics }}</strong>
                  </div>
                  <small
                    ><em>{{ item.hint }}</em></small
                  >
                </td>
                <td>
                  <el-select
                    v-model="item.unit"
                    filterable
                    style="width: 100%"
                    placeholder="Pick"
                    :disabled="item.unit_disabled"
                  >
                    <el-option
                      v-for="(unit, unit_index) in ['%', 'Hrs', 'Days']"
                      :key="unit_index"
                      :label="unit"
                      :value="unit"
                    />
                  </el-select>
                </td>
                <td>
                  <el-input
                    v-if="item.unit !== ''"
                    v-model="item.target"
                    type="number"
                    :min="1"
                    :max="100"
                  >
                    <template v-slot:append>
                      {{ item.unit }}
                    </template>
                  </el-input>
                </td>
              </tr>
              <tr v-if="fill_fields_error">
                <td colspan="5">
                  <el-alert type="error" :closable="false"
                    >Please fill all empty fields before adding another row</el-alert
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td colspan="2" align="center">
                  <h4>RESPONSIBILITIES</h4>
                  <small>Define roles for vendor and client</small>
                </td>
              </tr>
              <tr>
                <td><strong>Vendor Responsibities</strong></td>
                <td>
                  <div style="width: 99%">
                    <ckeditor
                      v-model="sla.vendor_responsibilities"
                      :editor="editor"
                      :config="editorConfig"
                    />
                    <small>List vendor duties (e.g., security, reporting)</small>
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>Client/Customer Responsibities</strong></td>
                <td>
                  <div style="width: 99%">
                    <ckeditor
                      v-model="sla.client_responsibilities"
                      :editor="editor"
                      :config="editorConfig"
                    />
                    <small>List client/customer responsibilities</small>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2" align="center">
                  <h4>MONITORING & REPORTING</h4>
                  <small>Define how performance is tracked</small>
                </td>
              </tr>
              <tr>
                <td><strong>Performance Monitoring Method</strong></td>
                <td>
                  <el-select
                    v-model="sla.performance_monitoring_method"
                    style="width: 100%"
                    placeholder="Set Value"
                  >
                    <el-option
                      v-for="(method, index2) in ['Automated Reports', 'Periodic Reviews']"
                      :key="index2"
                      :label="method"
                      :value="method"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <td><strong>Reporting Frequency</strong></td>
                <td>
                  <el-radio-group v-model="sla.report_frequency">
                    <el-radio border label="Weekly" />
                    <el-radio border label="Monthly" />
                    <el-radio border label="Quarterly" />
                    <el-radio border label="Biannualy" />
                    <el-radio border label="Anually" />
                  </el-radio-group>
                  <!-- <el-select
                      v-model="sla.report_frequency"
                      style="width: 100%"
                      placeholder="Set Value"
                    >
                      <el-option
                        v-for="(frequency, index3) in ['Weekly', 'Monthly', 'Quarterly', 'Biannualy', 'Anually']"
                        :key="index3"
                        :label="frequency"
                        :value="frequency"
                      />
                    </el-select> -->
                </td>
              </tr>
              <tr>
                <td colspan="2" align="center">
                  <h4>PENALTY FOR BREACH</h4>
                  <small>Define consequences of SLA breaches</small>
                </td>
              </tr>
              <tr>
                <td><strong>Penalty Type</strong></td>
                <td>
                  <el-select v-model="sla.penalty_type" style="width: 100%" placeholder="Set Value">
                    <el-option
                      v-for="(type, index4) in [
                        'Service Credits',
                        'Financial Penalties',
                        'Contract Termination'
                      ]"
                      :key="index4"
                      :label="type"
                      :value="type"
                    />
                  </el-select>
                </td>
              </tr>
              <tr v-if="sla.penalty_type === 'Financial Penalties'">
                <td><strong>Penalty Amount (%)</strong></td>
                <td>
                  <el-input v-model="sla.penalty_amount" type="number">
                    <template v-slot:append> % </template>
                  </el-input>
                  <small>Set percentage of contract value as penalty</small>
                </td>
              </tr>
              <tr>
                <td align="right" colspan="2">
                  <el-button type="success" @click="saveSLA()"> Save Changes </el-button>
                </td>
              </tr>
            </tbody>
          </table>
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
      approvalAction: null,
      approvalForm: {
        details: '',
        action: ''
      },
      contract: null,
      defaultSLAVal: {
        vendor_id: '',
        client_id: '',
        contract_id: '',
        service_name: '',
        service_description: '',
        uptime_guarantee: 99,
        response_time: 3,
        resolution_time: 24,
        vendor_responsibilities: '',
        client_responsibilities: '',
        report_frequency: '',
        performance_monitoring_method: '',
        penalty_type: '',
        penalty_amount: '',
        start_date: '',
        expiry_date: '',
        renewal_terms: '',
        approval_workflow: '',
        performance_metrics: []
      },
      sla: null,
      fill_fields_error: false,
      performance_metrics: [
        {
          modify: false,
          metrics: 'Uptime Guarantee',
          hint: 'The percentage of time a service or system is functional and accessible',
          target: 99,
          unit: '%',
          unit_disabled: true,
          result: ''
        },
        {
          modify: false,
          metrics: 'Rapid Response Time',
          hint: 'Define response time for critical issues',
          target: 3,
          unit: 'Hrs',
          unit_disabled: true,
          result: ''
        },
        {
          modify: false,
          metrics: 'Resolution Time',
          hint: 'Define time to resolve non-critical issues',
          target: 12,
          unit: 'Hrs',
          unit_disabled: true,
          result: ''
        }
      ],
      showDocumentModal: false,
      selectedDocument: null
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  watch: {
    performance_metrics() {
      this.blockRemoval = this.sla.performance_metrics.length <= 4
    }
  },
  mounted() {
    this.setupSLAValues()
  },
  methods: {
    moment,
    viewDocument(doc) {
      this.showDocumentModal = true
      this.selectedDocument = doc
    },
    rowIsEmpty() {
      this.fill_fields_error = false
      const checkEmptyLines = this.sla.performance_metrics.filter(
        (detail) => detail.metrics === '' || detail.target === null || detail.unit === ''
      )
      if (checkEmptyLines.length >= 1) {
        this.fill_fields_error = true
        // this.performance_metrics[index].seleted_category = true;
        return true
      }
      return false
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.sla.performance_metrics.splice(detailId, 1)
      }
    },
    addLine() {
      if (this.rowIsEmpty() && this.sla.performance_metrics.length > 0) {
        return false
      }
      this.sla.performance_metrics.push({
        modify: true,
        metrics: '',
        hint: '',
        target: null,
        unit: '',
        unit_disabled: false,
        result: ''
      })
      return true
    },
    setupSLAValues() {
      this.contract = this.selectedContract
      this.sla = this.selectedContract.sla !== null ? this.selectedContract.sla : this.defaultSLAVal
      this.sla.performance_metrics =
        this.sla.performance_metrics !== null
          ? this.sla.performance_metrics
          : this.performance_metrics
      this.sla.vendor_id = this.contract.vendor_id
      this.sla.client_id = this.contract.client_id
      this.sla.contract_id = this.contract.id
      this.addLine()
    },
    saveSLA() {
      this.loading = true
      const form = this.sla
      const saveSLAResource = new Resource('vdd/client-contracts/save-sla')
      saveSLAResource
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
