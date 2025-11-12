<template>
  <el-card>
    <div v-if="showInvoiceDetails">
      <div v:slot="header">
        <span>
          <el-button
            type="danger"
            @click="(fetchInvoices(), (showInvoiceDetails = false), $emit('details', false))"
          >
            Back
          </el-button>
        </span>
        <hr />
      </div>
      <invoice-details :selected-invoice="selectedInvoice" />
    </div>
    <div v-else>
      <el-row v-if="loading" :gutter="15">
        <el-col
          v-for="(count, count_index) in 4"
          :key="count_index"
          :xs="24"
          :sm="24"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <el-card>
            <el-skeleton :loading="loading" :rows="3" animated />
          </el-card>
        </el-col>
      </el-row>
      <span v-if="!loading">
        <el-button type="primary" plain @click="initialize()">
          <icon icon="tabler:reload" /> Refresh
        </el-button>
      </span>
      <el-row v-if="!loading" :gutter="6">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-dark">
                <icon icon="tabler:report-money" size="35" color="black" />
              </el-avatar>
              <div class="truncate">
                <h2>
                  {{ total_invoices }}
                </h2>
                <span>Total Invoices</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-warning" size="50">
                <icon icon="tabler:alert-circle" size="35" color="orange" />
              </el-avatar>
              <div class="truncate">
                <h2>
                  {{ pending_invoices }}
                </h2>
                <span>Pending Invoices</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-danger">
                <icon icon="tabler:disc" size="35" color="red" />
              </el-avatar>
              <div class="truncate">
                <h2>
                  {{ overdue_invoices }}
                </h2>
                <span>Overdue Invoices</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-success" size="50">
                <icon icon="tabler:file-check" color="green" size="35" />
              </el-avatar>
              <div class="truncate">
                <h2>
                  {{ paid_invoices }}
                </h2>
                <span>Paid Invoices</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col cols="6">
          <h3> List of Invoices </h3>
        </el-col>
        <el-col cols="6">
          <span class="pull-right">
            <el-button
              v-if="invoices.length > 0"
              :loading="downloadLoading"
              type="primary"
              plain
              @click="handleDownload('List of invoices', invoices)"
              ><icon icon="tabler:download" /> Export Excel</el-button
            >
          </span>
        </el-col>
      </el-row>
      <el-popover placement="right" width="400" trigger="click">
        <el-row :gutter="10">
          <p>Filter using the fields below</p>
          <div style="margin-bottom: 5px">
            <el-input v-model="query.invoice_no" placeholder="Invoice Number" />
          </div>
          <div style="margin-bottom: 5px">
            <el-input v-model="query.amount" placeholder="Amount">
              <template v-slot:prepend>
                {{ currency }}
              </template>
            </el-input>
            <br />
          </div>
          <div style="margin-bottom: 5px">
            <el-date-picker
              v-model="query.due_date"
              type="date"
              placeholder="Due Date"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </div>
          <div style="margin-bottom: 5px">
            <el-select v-model="query.status" placeholder="Invoice Status" style="width: 100%">
              <el-option
                v-for="(status, status_index) in ['Pending', 'Overdue', 'Paid']"
                :key="status_index"
                :value="status"
                :label="status"
              />
            </el-select>
          </div>
          <div style="margin-bottom: 5px">
            <el-select
              v-model="query.invoice_approval"
              placeholder="Invoice Status"
              style="width: 100%"
            >
              <el-option
                v-for="(status, status_index) in [
                  { label: 'Approved', value: 'Approve' },
                  { label: 'Rejected', value: 'Reject' }
                ]"
                :key="status_index"
                :value="status.value"
                :label="status.label"
              />
            </el-select>
          </div>
          <div style="margin-bottom: 5px">
            <el-button type="primary" @click="fetchInvoices"> Submit Query </el-button>
            <el-button type="default" @click="clearFields"> Clear Fields </el-button>
          </div>
        </el-row>
        <template v-slot:reference>
          <el-button> Filter By </el-button>
        </template>
      </el-popover>
      <hr />
      <v-client-table :data="invoices" v-loading="loading" :columns="columns" :options="options">
        <template v-slot:subtotal="{ row }">
          <div> {{ currency }}{{ Number(row.subtotal).toLocaleString() }} </div>
        </template>
        <template v-slot:discount="{ row }">
          <div> {{ currency }}{{ Number(row.discount).toLocaleString() }} </div>
        </template>
        <template v-slot:amount="{ row }">
          <div> {{ currency }}{{ Number(row.amount).toLocaleString() }} </div>
        </template>
        <template v-slot:action="{ row }">
          <div>
            <el-button type="success" @click="showSelectedInvoiceDetails(row)">
              Show Details
            </el-button>
          </div>
        </template>
      </v-client-table>
      <el-row :gutter="20">
        <pagination
          v-show="total > 10"
          :total="total"
          v-model:page="query.page"
          v-model:limit="query.limit"
          @pagination="fetchInvoices"
        />
      </el-row>
    </div>
    <el-modal
      v-if="showCreateModal"
      v-model="showCreateModal"
      title="Create New Invoice"
      centered
      size="xl"
      hide-footer
    >
      <create-invoice :vendor-id="vendorId" @saved="fetchInvoices" />
    </el-modal>
  </el-card>
</template>

<script>
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Pagination from '@/views/Components/Pagination-main/index.vue'
import InvoiceDetails from './InvoiceDetails.vue'
import Resource from '@/api/resource'

export default {
  components: {
    Pagination,
    InvoiceDetails
  },
  props: {
    vendorId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      showInvoiceDetails: false,
      selectedInvoice: null,
      downloadLoading: false,
      showCreateModal: false,
      pageLength: 10,
      dir: false,
      currency: '₦',
      columns: [
        'invoice_no',
        'subtotal',
        'discount',
        'amount',
        'due_date',
        'status',
        'payment_date',
        'action'
        // 'user.password_status',
      ],

      options: {
        headings: {
          action: ''
          // id: 'S/N',
        },
        filterByColumn: false,
        rowAttributesCallback(row) {
          if (row.status === 'Pending') {
            return { style: 'background: #f5f1d3; color: #000000' }
          }
          if (row.status === 'Overdue') {
            return { style: 'background: #f5dbd3; color: #000000' }
          }
          //   if (row.status === 'Paid') {
          //     return { style: 'background: #eaf8e5; color: #000000' }
          //   }
          return {}
        },
        sortable: [],
        filterable: false
      },
      showEditForm: false,
      invoices: [],
      loading: false,
      approvalLoading: false,
      total_invoices: 0,
      pending_invoices: 0,
      overdue_invoices: 0,
      paid_invoices: 0,
      query: {
        page: 1,
        limit: 50,
        vendor_id: '',
        status: '',
        amount: '',
        due_date: '',
        invoice_no: '',
        invoice_approval: ''
      },
      total: 0
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    vendorId() {
      this.initialize()
    }
  },
  mounted() {
    this.initialize()
  },
  methods: {
    checkPermission,
    checkRole,
    initialize() {
      this.fetchInvoices()
      this.fetchInvoiceAnalysis()
    },
    showSelectedInvoiceDetails(invoice) {
      this.showInvoiceDetails = true
      this.selectedInvoice = invoice
      this.$emit('details', true)
    },
    clearFields() {
      this.query = {
        page: this.query.page,
        limit: this.query.limit,
        vendor_id: '',
        status: '',
        amount: '',
        due_date: '',
        invoice_no: '',
        invoice_approval: ''
      }
      this.fetchInvoices()
    },
    fetchInvoices() {
      const { limit, page } = this.query
      const form = this.query
      form.vendor_id = this.vendorId
      this.loading = true
      const fetchStaffResource = new Resource('vdd/vendor-invoices')
      fetchStaffResource
        .list(form)
        .then((response) => {
          this.invoices = response.invoices.data
          this.invoices.forEach((element, index) => {
            element['index'] = (page - 1) * limit + index + 1
          })
          this.total = response.invoices.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchInvoiceAnalysis() {
      this.loading = true
      const invoicesResource = new Resource('vdd/reports/vendor-invoices-analysis')
      invoicesResource
        .list({ client_id: this.selectedClient.id, vendor_id: this.vendorId })
        .then((response) => {
          this.total_invoices = response.total_invoices
          this.pending_invoices = response.pending_invoices
          this.overdue_invoices = response.overdue_invoices
          this.paid_invoices = response.paid_invoices
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleDownload(tableTitle, invoicesList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const multiHeader = [[tableTitle, '', '', '', '', '', '']]
        const tHeader = [
          // 'STUDENTSHIP STATUS',
          'INVOICE NO',
          `SUBTOTAL (${this.currency})`,
          `DISCOUNT (${this.currency})`,
          `TOTAL AMOUNT (${this.currency})`,
          'DUE DATE',
          'STATUS',
          'PAYMENT DATE'
        ]
        const filterVal = [
          'invoice_no',
          'subtotal',
          'discount',
          'amount',
          'due_date',
          'status',
          'payment_date'
        ]
        const list = invoicesList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          data,
          filename: tableTitle,
          autoWidth: true,
          bookType: 'csv'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    }
  }
}
</script>
