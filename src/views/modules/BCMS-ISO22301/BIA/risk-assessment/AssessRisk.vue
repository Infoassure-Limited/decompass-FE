<template>
  <div v-loading="load">
    <!-- <el-select
      v-model="selectedClient"
      value-key="id"
      placeholder="Select Client"
      style="width: 100%;"
      @input="fetchProjects()"
    >
      <el-option
        v-for="(client, index) in clients"
        :key="index"
        :value="client.id"
        :label="client.name"
      />
    </el-select> -->
    <table class="table table-bordered table-responsive">
      <thead>
        <tr>
          <th></th>
          <!-- <th>RA-ID</th> -->
          <th>Business Process Name</th>
          <th>Risk Owner</th>
          <th>Risk Description</th>
          <th>Existing Treatment</th>
          <th>Likelihood</th>
          <th>Likelihood Rationale</th>
          <th>Impact</th>
          <th>Impact Rationale</th>
          <!-- <th>Risk Score</th>
          <th>Risk Level</th> -->
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in entries" :key="index">
          <td>
            <div>
              <el-tooltip effect="dark" content="Remove row" placement="top-start">
                <el-button
                  v-if="entries.length > 1"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeEntry(index)"
                />
              </el-tooltip>
              <br />
              <el-tooltip effect="dark" content="Add another row" placement="top-start">
                <el-button
                  v-if="index + 1 === entries.length"
                  type="success"
                  icon="el-icon-plus"
                  circle
                  @click="addEntry(index)"
                />
              </el-tooltip>
              <br />
              <el-tooltip effect="dark" content="Duplicate row" placement="top-start">
                <el-button
                  v-if="index + 1 === entries.length"
                  type="primary"
                  icon="el-icon-document-copy"
                  circle
                  @click="copyEntry(entry)"
                />
              </el-tooltip>
            </div>
          </td>
          <td>
            <select v-model="entry.business_process_id" placeholder="Select Business Process">
              <option
                v-for="(process, process_index) in businessProcesses"
                :key="process_index"
                :label="process.name"
                :value="process.id"
              ></option>
            </select>
          </td>
          <td>
            <input v-model="entry.risk_owner" placeholder="e.g CEO" type="text" />
          </td>
          <td>
            <input v-model="entry.risk_description" placeholder="Risk Description" type="text" />
          </td>
          <td>
            <input
              v-model="entry.existing_treatment"
              placeholder="Existing Treatment"
              type="text"
            />
          </td>
          <td>
            <select
              v-model="entry.likelihood"
              filterable
              style="width: 100%"
              placeholder="Likelihood"
            >
              <option
                v-for="(likelihood, likelihood_index) in likelihoods"
                :key="likelihood_index"
                :label="`${likelihood.value}-${likelihood.name}`"
                :value="likelihood.value"
              ></option>
            </select>
          </td>
          <td>
            <input
              v-model="entry.likelihood_rationale"
              placeholder="Likelihood Rationale"
              type="text"
            />
          </td>
          <td>
            <select v-model="entry.impact" filterable style="width: 100%" placeholder="Impact">
              <option
                v-for="(impact, impact_index) in impacts"
                :key="impact_index"
                :label="`${impact.value}-${impact.name}`"
                :value="impact.value"
              ></option>
            </select>
          </td>
          <td>
            <input v-model="entry.impact_rationale" placeholder="Impact Rationale" type="text" />
          </td>
        </tr>
        <tr v-if="fill_fields_error">
          <td colspan="6">
            <el-alert type="error">Please fill all empty fields before adding another row</el-alert>
          </td>
        </tr>
      </tbody>
    </table>
    <el-button v-if="!isRowEmpty()" round type="success" @click="submit()"> Submit </el-button>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
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
      pickerOptions: {
        disabledDate(date) {
          const d = new Date() // today
          d.setDate(d.getDate())
          return date >= d
        }
      },
      entries: [],
      activeName: '1',
      invoice_items: [],
      customer_name: '',
      selected_index: '',
      total: 0,
      dialogVisible: false,
      fill_fields_error: false,
      showSaveButton: true,
      load: false,
      rowIndex: '',
      categories: [],
      asset_types: [],
      BlockRemoval: false
    }
  },
  watch: {
    // selectedClient() {
    //
    //   const customer = this.selectedCustomer
    //   const { rowIndex } = app
    //   this.setCustomerDetails(customer, rowIndex)
    // },
  },
  created() {
    this.addEntry()
  },
  methods: {
    isRowEmpty() {
      const checkEmptyLines = this.entries.filter(
        (detail) =>
          detail.business_process_id === '' ||
          detail.risk_owner === '' ||
          detail.risk_description === '' ||
          detail.existing_treatment === '' ||
          detail.likelihood === '' ||
          detail.likelihood_rationale === '' ||
          detail.impact === '' ||
          detail.impact_rationale === ''
      )
      if (checkEmptyLines.length > 0) {
        return true
      }
      return false
    },
    addEntry() {
      this.fill_fields_error = false

      if (this.isRowEmpty()) {
        this.fill_fields_error = true
      } else {
        // if (this.invoice_items.length > 0)
        //     this.invoice_items[index].grade = '';
        this.entries.push({
          // ra_id: '',
          business_process_id: '',
          risk_owner: '',
          risk_description: '',
          existing_treatment: '',
          likelihood: '',
          likelihood_rationale: '',
          impact: '',
          impact_rationale: ''
        })
      }
    },
    copyEntry(entry) {
      if (this.isRowEmpty()) {
        this.fill_fields_error = true
      } else {
        this.entries.push({
          business_process_id: entry.business_process_id,
          risk_owner: entry.risk_owner
        })
      }
    },
    removeEntry(detailId) {
      this.fill_fields_error = false
      if (!this.BlockRemoval) {
        this.entries.splice(detailId, 1)
      }
    },
    submit() {
      this.$confirm('Are you sure you want to submit these entries?', 'Warning', {
        confirmButtonText: 'Yes Submit',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Sending...',
          // });
          if (this.entries.length > 0) {
            this.load = true
            const submitSales = new Resource('bia/store-risk-assessment')
            submitSales
              .store({
                business_unit_id: this.businessUnitId,
                client_id: this.clientId,
                assessments: this.entries
              })
              .then(() => {
                this.$message({
                  type: 'success',
                  message: 'Submitted Successfully'
                })
                this.$emit('submit', true)
                this.entries = []
                this.addEntry()
                this.load = false
              })
              .catch(() => {
                this.$message({
                  type: 'danger',
                  message: 'An error Occured'
                })
                this.load = false
              })
          }
          // this.loadForm = false;
        })
        .catch(() => {
          this.load = false
        })
    }
  }
}
</script>
