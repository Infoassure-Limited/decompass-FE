<template>
  <el-card>
    <div v-if="manageContractSLA">
      <div v:slot="header">
        <span>
          <el-button type="danger" @click="(initialize(), (manageContractSLA = false))">
            Back
          </el-button>
        </span>
        <hr />
      </div>
      <el-tabs v-model="activeName">
        <!-- <el-tab-pane
          label="Performance Metrics Setup"
          name="first"
          lazy
        >
          <setup-performance-metrics :selected-contract="selectedContract" />
        </el-tab-pane>
        <el-tab-pane
          label="SLA Configuration"
          name="first"
          lazy
        >
          <configure-sla :selected-contract="selectedContract" />
        </el-tab-pane> -->
        <el-tab-pane label="SLA Performance Score Card" name="first" lazy>
          <sla-performance-score :selected-contract="selectedContract" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else>
      <div v:slot="header">
        <el-row>
          <el-col :md="12">
            <label>Select Vendor</label>
            <el-select
              v-model="selectedVendor"
              placeholder="Select Vendor"
              value-key="id"
              style="width: 100%"
              @change="initialize()"
            >
              <el-option
                v-for="(client, index) in vendors"
                :key="index"
                :value="client"
                :label="client.name"
              />
            </el-select>
          </el-col>
          <el-col v-if="form.vendor_id !== ''" :md="12">
            <span class="pull-right">
              <el-button type="primary" @click="createContract()">Create</el-button>
            </span>
          </el-col>
        </el-row>
      </div>
      <div v-if="form.vendor_id !== ''">
        <el-row v-if="!loading" :gutter="6">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-card>
              <el-card-body class="d-flex justify-content-between align-items-center">
                <el-avatar size="50">
                  <icon size="30" color="black" icon="tabler:file-invoice" />
                </el-avatar>
                <div class="truncate">
                  <h2>
                    {{ total_contracts }}
                  </h2>
                  <span>Total Contracts</span>
                </div>
              </el-card-body>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-card>
              <el-card-body class="d-flex justify-content-between align-items-center">
                <el-avatar size="50">
                  <icon size="30" color="green" icon="tabler:file-check" />
                </el-avatar>
                <div class="truncate">
                  <h2>
                    {{ active_contracts }}
                  </h2>
                  <span>Active Contracts</span>
                </div>
              </el-card-body>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-card>
              <el-card-body class="d-flex justify-content-between align-items-center">
                <el-avatar size="50">
                  <icon size="30" color="orange" icon="tabler:file-like" />
                </el-avatar>
                <div class="truncate">
                  <h2>
                    {{ renewed_contracts }}
                  </h2>
                  <span>Renewed Contracts</span>
                </div>
              </el-card-body>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-card>
              <el-card-body class="d-flex justify-content-between align-items-center">
                <el-avatar variant="light-danger" size="50">
                  <icon size="30" color="red" icon="tabler:file-x" />
                </el-avatar>
                <div class="truncate">
                  <h2>
                    {{ expired_contracts }}
                  </h2>
                  <span>Expired Contracts</span>
                </div>
              </el-card-body>
            </el-card>
          </el-col>
        </el-row>
        <v-client-table :data="contracts" v-loading="loading" :columns="columns" :options="options">
          <template v-slot:file_link="{ row }">
            <div>
              <span @click="viewDocument(baseServerUrl + 'storage/' + row.file_link)">
                <img src="/images/pdf.png" alt="Image" width="20" />
                <small style="font-weight: 900; padding: 10px">Click to view</small>
              </span>
            </div>
          </template>
          <template v-slot:sla="{ row }">
            <div>
              <el-button v-if="row.sla !== null" type="success" @click="manageSla(row)"
                >View</el-button
              >
            </div>
          </template>
          <template v-slot:action="{ row }">
            <div>
              <el-button-group>
                <el-tooltip content="Edit Contract">
                  <el-button type="default" plain @click="editEntry(row)">
                    <icon icon="tabler:edit" />
                  </el-button>
                </el-tooltip>
                <el-popover placement="left" width="550" trigger="click">
                  <div
                    style="
                      background: #bbe0b2;
                      color: #000000;
                      padding: 10px;
                      text-align: left;
                      border-radius: 5px;
                    "
                  >
                    <strong>Kindly provide a brief note about this renewal action.</strong>
                    <el-input
                      v-model="renewalForm.renewal_details.notes"
                      placeholder="Type here..."
                      type="textarea"
                    />
                    <br /><br />
                    <el-button
                      :loading="loadButton"
                      size="mini"
                      type="primary"
                      plain
                      :disabled="renewalForm.renewal_details.notes === ''"
                      @click="renewContract(row, 'Renewed')"
                    >
                      Submit
                    </el-button>
                  </div>
                  <template v-slot:reference>
                    <el-tooltip content="Renew Contract">
                      <el-button type="default" plain>
                        <icon icon="tabler:refresh" />
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-popover>
                <el-popover placement="left" width="550" trigger="click">
                  <div
                    style="
                      background: #e0b5b2;
                      color: #000000;
                      padding: 10px;
                      text-align: left;
                      border-radius: 5px;
                    "
                  >
                    <strong>Kindly provide a brief note about this termination action.</strong>
                    <el-input
                      v-model="renewalForm.renewal_details.notes"
                      placeholder="Type here..."
                      type="textarea"
                    />
                    <br /><br />
                    <el-button
                      :loading="loadButton"
                      size="mini"
                      type="primary"
                      plain
                      :disabled="renewalForm.renewal_details.notes === ''"
                      @click="renewContract(row, 'Terminated')"
                    >
                      Submit
                    </el-button>
                  </div>
                  <template v-slot:reference>
                    <el-tooltip content="Terminate Contract">
                      <el-button type="default" plain>
                        <icon icon="tabler:x" />
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-popover>
                <!-- <el-tooltip content="View SLA">
                <el-button
                  :disabled="row.sla === null"
                  size="small"
                  type="default"
                  plain
                  icon="el-icon-document"
                  @click="manageSla(row)"
                />
              </el-tooltip> -->
              </el-button-group>
            </div>
          </template>
        </v-client-table>
      </div>
      <el-dialog
        v-if="dialogFormVisible"
        v-model="dialogFormVisible"
        :title="`Create New Contract Document for ${selectedVendor.name}`"
        v-model:visible="dialogFormVisible"
      >
        <el-form :model="contractForm" label-position="top">
          <el-form-item label="Unique Title of the Contract Document">
            <el-input
              v-model="contractForm.title"
              placeholder="Type the title of the document"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="Start Date">
            <el-date-picker
              v-model="contractForm.start_date"
              type="date"
              placeholder="Set Start Date"
              style="width: 100%"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="Expiry Date">
            <el-date-picker
              v-model="contractForm.expiry_date"
              type="date"
              placeholder="Set Expiry Date"
              style="width: 100%"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="Upload Contract Document">
            <input class="form-control" type="file" @change="onImageChange" />
            <small>Acceptable file formats is PDF</small>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="saveContract()">Submit</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        v-if="showDocumentModal"
        v-model="showDocumentModal"
        v-model:visible="showDocumentModal"
        title="Contract Document"
      >
        <iframe class="doc" :src="selectedDocument" width="650" height="500"></iframe>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
// import ConfigureSla from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/ConfigureSLA.vue'
import SlaPerformanceScore from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/SLAPerformanceScore.vue'
// import SetupPerformanceMetrics from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/SetupPerformanceMetrics.vue'

export default {
  components: {
    // ConfigureSla,
    SlaPerformanceScore
  },
  data() {
    return {
      activeName: 'first',
      pickerOptions: {
        disabledDate(date) {
          const d = new Date() // today
          d.setDate(d.getDate())
          return date > d
        }
      },
      dialogFormVisible: false,
      showDocumentModal: false,
      selectedDocument: '',
      loading: false,
      loadButton: false,
      pageLength: 10,
      dir: false,
      total_contracts: 0,
      active_contracts: 0,
      renewed_contracts: 0,
      expired_contracts: 0,
      vendors: [],
      selectedVendor: null,
      contracts: [],
      columns: [
        'contract_no',
        'title',
        'file_link',
        'start_date',
        'expiry_date',
        'status',
        'sla',
        'action'
      ],

      options: {
        headings: {
          file_link: 'File',
          action: ''
          // id: 'S/N',
        },
        filterByColumn: false,
        sortable: [],
        filterable: false
      },
      contractForm: {
        id: '',
        title: '',
        start_date: '',
        expiry_date: '',
        uploadableFile: null
      },
      renewalForm: {
        renewal_details: { status: '', notes: '' }
      },
      form: {
        vendor_id: '',
        client_id: ''
      },
      selectedContract: null,
      manageContractSLA: false
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  mounted() {
    this.fetchVendors()
  },
  methods: {
    checkPermission,
    initialize() {
      this.fetchContracts()
      this.fetchContractsAnalysis()
    },
    editEntry(row) {
      this.contractForm = row
      this.contractForm.uploadableFile = null
      this.dialogFormVisible = true
    },
    onImageChange(e) {
      // console.log(e.target.files[0].type)
      const fileType = e.target.files[0].type
      if (fileType !== 'application/pdf') {
        this.$alert('Only .pdf file format is accepted')
        return false
      }

      this.contractForm.uploadableFile = e.target.files[0]
      return true
    },
    manageSla(contract) {
      this.selectedContract = contract
      this.manageContractSLA = true
    },
    viewDocument(doc) {
      this.showDocumentModal = true
      this.selectedDocument = doc
    },
    saveContract() {
      if (this.contractForm.title === '') {
        this.$alert('Please provide a title for this document')
        return false
      }
      // if (this.contractForm.uploadableFile === null) {
      //   this.$alert('Please upload a Contract Document with .pdf file format')
      //   return false
      // }
      this.loading = true
      const formData = new FormData()
      formData.append('client_id', this.selectedClient.id)
      formData.append('vendor_id', this.selectedVendor.id)
      formData.append('id', this.contractForm.id)
      formData.append('title', this.contractForm.title)
      formData.append('start_date', this.contractForm.start_date)
      formData.append('expiry_date', this.contractForm.expiry_date)
      formData.append('file_uploaded', this.contractForm.uploadableFile)
      const uploadEvidenceResource = new Resource('vdd/client-contracts/upload-contract')
      uploadEvidenceResource
        .store(formData)
        .then(() => {
          this.fetchContracts()
          this.$message({
            type: 'success',
            message: 'Contract uploaded successfully'
          })
          this.contractForm = {
            title: '',
            start_date: '',
            expiry_date: '',
            uploadableFile: null
          }
          this.dialogFormVisible = false
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })

      return true
    },
    showDetails(value) {
      this.showInvoiceDetails = value
    },
    createContract() {
      this.dialogFormVisible = true
    },
    fetchVendors() {
      this.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-approved-vendors')
      fetchStaffResource.list({ all: true }).then((response) => {
        this.vendors = response.vendors
        this.loading = false
      })
    },
    renewContract(contract, status) {
      this.loadButton = true
      const { renewalForm } = this
      renewalForm.status = status
      renewalForm.renewal_details.status = status
      const fetchContractsResource = new Resource('vdd/client-contracts/renewal')
      fetchContractsResource.update(contract.id, renewalForm).then(() => {
        this.loadButton = false
        this.fetchContracts()
      })
    },
    fetchContracts() {
      this.loading = true
      const { form } = this
      form.client_id = this.selectedClient.id
      form.vendor_id = this.selectedVendor.id
      const fetchContractsResource = new Resource('vdd/client-contracts/fetch')
      fetchContractsResource.list(form).then((response) => {
        this.contracts = response.contracts
        this.loading = false
      })
    },
    fetchContractsAnalysis() {
      this.loading = true
      const invoicesResource = new Resource('vdd/reports/vendor-contracts-analysis')
      invoicesResource
        .list({ client_id: this.selectedClient.id, vendor_id: this.selectedVendor.id })
        .then((response) => {
          this.total_contracts = response.total_contracts
          this.active_contracts = response.active_contracts
          this.renewed_contracts = response.renewed_contracts
          this.expired_contracts = response.expired_contracts
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
