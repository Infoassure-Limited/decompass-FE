<template>
  <el-card>
    <div v-if="manageContractSLA">
      <div v:slot="header">
        <span>
          <el-button type="danger" @click="(fetchContracts(), (manageContractSLA = false))">
            Back
          </el-button>
        </span>
        <hr />
      </div>
      <configure-sla :selected-contract="selectedContract" />
      <!-- <el-tabs v-model="activeName">
        <el-tab-pane
          label="SLA Configuration"
          name="first"
          lazy
        >
          <configure-sla :selected-contract="selectedContract" />
        </el-tab-pane>
        <el-tab-pane
          v-if="selectedContract.sla !== null"
          label="Performance Scorecard"
          name="second"
          lazy
        >
          <sla-performance-score :selected-contract="selectedContract" />
        </el-tab-pane>
      </el-tabs> -->
    </div>
    <div v-else>
      <div v:slot="header">
        <el-row>
          <el-col :md="24">
            <span class="pull-right">
              <el-button type="primary" @click="createContract()">Create</el-button>
            </span>
          </el-col>
        </el-row>
      </div>
      <v-client-table
        v-if="form.vendor_id !== ''"
        :data="contracts"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <template v-slot:file_link="{ row }">
          <div>
            <span @click="viewDocument(baseServerUrl + 'storage/' + row.file_link)">
              <img src="/images/pdf.png" alt="Image" width="20" />
              <small style="font-weight: 900; padding: 10px">Click to view</small>
            </span>
          </div>
        </template>
        <template v-slot:action="{ row }">
          <div>
            <el-button size="small" type="success" @click="manageSla(row)"> Manage SLA </el-button>
            <el-button size="small" type="info" @click="editEntry(row)"> Edit </el-button>
          </div>
        </template>
      </v-client-table>
      <el-dialog
        v-if="dialogFormVisible"
        v-model="dialogFormVisible"
        title="Create New Contract Document"
        v-model:visible="dialogFormVisible"
      >
        <el-form :model="contractForm">
          <el-form-item label="Upload Contract Document">
            <input class="form-control" type="file" @change="onImageChange" />
            <small>Acceptable file format is PDF</small>
          </el-form-item>
          <el-form-item>
            <!-- <el-input v-model="contractForm.title" autocomplete="off" /> -->
            <v-text-field
              density="compact"
              v-model="contractForm.title"
              label="Unique Title of the Contract Document"
              variant="outlined"
            />
          </el-form-item>
          <el-form-item>
            <small>Start Date</small>
            <el-date-picker
              v-model="contractForm.start_date"
              type="date"
              placeholder="Set Start Date"
              style="width: 100%"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <small>Expiry Date</small>
            <el-date-picker
              v-model="contractForm.expiry_date"
              type="date"
              placeholder="Set Expiry Date"
              style="width: 100%"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
            />
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
import ConfigureSla from '@/views/modules/DUE-DILIGENCE/vendor/partials/ConfigureSLA.vue'
// import SlaPerformanceScore from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/SLAPerformanceScore.vue'
// import SetupPerformanceMetrics from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/SetupPerformanceMetrics.vue'

export default {
  components: {
    ConfigureSla
  },
  props: {
    vendorId: {
      type: Number,
      required: true
    }
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
      pageLength: 10,
      dir: false,
      contracts: [],
      columns: [
        'action',
        'contract_no',
        'title',
        'file_link',
        'start_date',
        'expiry_date'
        // 'user.password_status',
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
      form: {
        vendor_id: '',
        client_id: ''
      },
      selectedContract: null,
      manageContractSLA: false
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  mounted() {
    this.fetchContracts()
  },
  methods: {
    checkPermission,
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
      // attempt extracting file content
      // this.convertPdfToText(e.target.files[0])

      this.contractForm.uploadableFile = e.target.files[0]
      return true
    },
    convertPdfToText(file) {
      this.loading = true
      const formData = new FormData()
      formData.append('file_uploaded', file)
      const uploadEvidenceResource = new Resource('vdd/pdf-to-text')
      uploadEvidenceResource
        .vStore(formData)
        .then((response) => {
          console.log(response)
        })
        .catch(() => {
          this.loading = false
        })
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
      //   if (this.contractForm.uploadableFile === null) {
      //     this.$alert('Please upload a Contract Document with .pdf file format')
      //     return false
      //   }
      this.loading = true
      const formData = new FormData()
      // formData.append('client_id', this.vendor.client_id)
      formData.append('vendor_id', this.vendorId)
      formData.append('id', this.contractForm.id)
      formData.append('title', this.contractForm.title)
      formData.append('start_date', this.contractForm.start_date)
      formData.append('expiry_date', this.contractForm.expiry_date)
      formData.append('file_uploaded', this.contractForm.uploadableFile)
      const uploadEvidenceResource = new Resource('vdd/vendor-contracts/upload-contract')
      uploadEvidenceResource
        .vStore(formData)
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
    fetchContracts() {
      this.loading = true
      const { form } = this
      // form.client_id = this.vendor.client_id
      form.vendor_id = this.vendorId
      const fetchContractsResource = new Resource('vdd/vendor-contracts/fetch')
      fetchContractsResource.vList(form).then((response) => {
        this.contracts = response.contracts
        this.loading = false
      })
    }
  }
}
</script>
