<template>
  <el-card>
    <div>
      <el-row>
        <el-col :md="21">
          <h3> List of Invoices </h3>
        </el-col>
        <el-col :md="3">
          <span class="pull-right">
            <el-dropdown @command="handleCreationCommand">
              <el-button type="primary">
                New Invoice <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template v-slot:dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="generate">Generate</el-dropdown-item>
                  <el-dropdown-item command="upload">Upload Invoice</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- <el-button
              type="primary"
              icon="document"
              @click="showCreateModal = true"
            >Create New Invoice</el-button> -->
          </span>
        </el-col>
      </el-row>
      <hr />
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
            <el-skeleton :loading="loading" :rows="1" animated />
          </el-card>
        </el-col>
      </el-row>

      <span v-if="!loading" style="cursor: pointer" @click="initialize()">
        <el-tooltip content="Refresh">
          <icon icon="tabler:reload" size="30" />
        </el-tooltip>
      </span>
      <el-row v-if="!loading" :gutter="6">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar size="50">
                <icon size="35" icon="tabler:file-text" color="black" />
              </el-avatar>
              <div class="truncate">
                <h2 class="font-weight-bolder">
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
              <el-avatar size="50">
                <icon size="35" icon="tabler:alert-circle" color="orange" />
              </el-avatar>
              <div class="truncate">
                <h2 class="font-weight-bolder">
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
              <el-avatar size="50">
                <icon size="35" icon="tabler:disc" color="red" />
              </el-avatar>
              <div class="truncate">
                <h2 class="font-weight-bolder">
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
              <el-avatar size="50">
                <icon size="35" icon="tabler:circle-check" color="green" />
              </el-avatar>
              <div class="truncate">
                <h2 class="font-weight-bolder">
                  {{ paid_invoices }}
                </h2>
                <span>Paid Invoices</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
      </el-row>
      <el-popover placement="right" width="400" trigger="click">
        <el-row :gutter="10">
          <p>Filter using the fields below</p>
          <div>
            <el-input v-model="query.invoice_no" placeholder="Invoice Number" />
          </div>
          <div>
            <el-input v-model="query.amount" placeholder="Amount">
              <template v-slot:prepend>
                {{ currency }}
              </template>
            </el-input>
            <br />
          </div>
          <div>
            <el-date-picker
              v-model="query.due_date"
              type="date"
              placeholder="Due Date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </div>
          <div>
            <el-select v-model="query.status" placeholder="Invoice Status" style="width: 100%">
              <el-option
                v-for="(status, status_index) in ['Pending', 'Overdue', 'Paid']"
                :key="status_index"
                :value="status"
                :label="status"
              />
            </el-select>
          </div>
          <div>
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
          <div>
            <el-button type="primary" @click="fetchInvoices"> Submit Query </el-button>
            <el-button type="default" @click="clearFields"> Clear Fields </el-button>
          </div>
        </el-row>
        <template v-slot:reference>
          <el-button> Filter By </el-button>
        </template>
      </el-popover>
      <v-client-table :data="invoices" v-loading="loading" :columns="columns" :options="options">
        <template v-slot:child_row="props">
          <div>
            <el-alert type="error" :closable="false">
              Invoice Details for {{ props.row.invoice_no }}
            </el-alert>
            <el-row :gutter="10">
              <el-col v-if="props.row.invoice_link !== null" :md="12">
                <h3>Uploaded Invoice</h3>
                <iframe
                  class="pdf"
                  :src="baseServerUrl + 'storage/' + props.row.invoice_link"
                  width="550"
                  height="500"
                ></iframe>
              </el-col>
              <el-col v-if="props.row.payment_evidence !== null" :md="12">
                <h3>Uploaded payment evidence</h3>
                <iframe
                  class="pdf"
                  :src="baseServerUrl + 'storage/' + props.row.payment_evidence"
                  width="550"
                  height="500"
                ></iframe>
              </el-col>
            </el-row>
            <v-client-table
              v-if="props.row.invoice_items.length > 0"
              v-model="props.row.invoice_items"
              :columns="['description', 'quantity', 'amount', 'action']"
              :options="{ filterable: false }"
            >
              <template v-slot:amount="{ row }">
                <div> {{ currency }}{{ Number(row.amount).toLocaleString() }} </div>
              </template>
              <template v-slot:action="{ row }">
                <div>
                  <span v-if="props.row.invoice_items.length > 1">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="Delete Invoice item"
                      placement="top-start"
                    >
                      <el-button
                        v-if="props.row.status === 'Pending'"
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        @click="destroyInvoiceItem(props.row, row.id)"
                      />
                    </el-tooltip>
                  </span>
                </div>
              </template>
            </v-client-table>
          </div>
        </template>
        <template v-slot:subtotal="{ row }">
          <div> {{ currency }}{{ Number(row.subtotal).toLocaleString() }} </div>
        </template>
        <template v-slot:discount="{ row }">
          <div> {{ currency }}{{ Number(row.discount).toLocaleString() }} </div>
        </template>
        <template v-slot:amount="{ row }">
          <div> {{ currency }}{{ Number(row.amount).toLocaleString() }} </div>
        </template>
        <template v-slot:invoice_approval="{ row }">
          <div>
            <div>
              {{
                row.invoice_approval !== null && row.invoice_approval.action === 'Approve'
                  ? 'Approved'
                  : row.invoice_approval !== null && row.invoice_approval.action === 'Reject'
                    ? 'Rejected'
                    : 'Pending'
              }}
              <br />
              <small v-if="row.invoice_approval !== null"
                ><em>{{ row.invoice_approval.details }}</em></small
              >
            </div>
          </div>
        </template>
        <template v-slot:action="props">
          <div>
            <span>
              <el-tooltip class="item" effect="dark" content="Edit Invoice" placement="top-start">
                <el-button
                  v-if="props.row.status === 'Pending' && props.row.invoice_link === null"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editRow(props.row)"
                />
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="Confirm Payment"
                placement="top-start"
              >
                <el-button
                  v-if="props.row.status === 'Paid' && props.row.is_confirmed === 0"
                  size="mini"
                  type="warning"
                  icon="el-icon-check"
                  @click="confirmPayment(props.row)"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="Delete Invoice" placement="top-start">
                <el-button
                  v-if="props.row.status === 'Pending'"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="destroyInvoice(props.row)"
                />
              </el-tooltip>
              <el-tag v-if="props.row.is_confirmed === 1" type="success">Payment Confirmed</el-tag>
            </span>
          </div>
        </template>
      </v-client-table>
      <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="query.page"
          v-model:limit="query.limit"
          @pagination="fetchInvoices"
        />
      </el-row>
    </div>
    <el-dialog
      v-if="showCreateModal"
      v-model="showCreateModal"
      title="Create New Invoice"
      centered
      width="80%"
      hide-footer
    >
      <create-invoice :vendor-id="vendorId" @saved="fetchInvoices" />
    </el-dialog>
    <el-dialog
      v-if="showUploadModal"
      v-model="showUploadModal"
      title="Upload Existing Invoice File"
      centered
      size="xl"
      hide-footer
    >
      <upload-invoice-file
        :vendor-id="vendorId"
        @saved="(fetchInvoices(), (showUploadModal = false))"
      />
    </el-dialog>
    <el-dialog
      v-if="showEditModal"
      v-model="showEditModal"
      title="Edit Invoice"
      centered
      width="80%"
      hide-footer
    >
      <edit-invoice :invoice="selectedInvoice" @updated="fetchInvoices" />
    </el-dialog>
  </el-card>
</template>

<script>
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Pagination from '@/views/Components/Pagination-main/index.vue'
import CreateInvoice from './CreateInvoice.vue'
import UploadInvoiceFile from './UploadInvoiceFile.vue'
import EditInvoice from './EditInvoice.vue'
import Resource from '@/api/resource'

export default {
  components: {
    Pagination,
    CreateInvoice,
    EditInvoice,
    UploadInvoiceFile
  },
  props: {
    vendorId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false,
      showCreateModal: false,
      showEditModal: false,
      showUploadModal: false,
      pageLength: 10,
      dir: false,
      currency: '₦',
      columns: [
        'action',
        'invoice_no',
        'subtotal',
        'discount',
        'amount',
        'due_date',
        'invoice_approval',
        'status',
        'payment_date'
        // 'user.password_status',
      ],

      options: {
        headings: {
          contact_email: 'Email',
          contact_phone: 'Phone',
          contact_address: 'Address',
          invoice_approval: 'Approval',
          status: 'Status',
          action: 'Action'

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
        // filterable: [
        //   'name',
        //   'contact_email',
        //   'contact_phone',
        // ],
      },
      total_invoices: 0,
      pending_invoices: 0,
      overdue_invoices: 0,
      paid_invoices: 0,
      showEditForm: false,
      invoices: [],
      loading: false,
      selectedInvoice: null,
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
    }
  },
  created() {
    this.fetchInvoices()
    this.fetchInvoiceAnalysis()
  },
  methods: {
    checkPermission,
    checkRole,
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
    handleCreationCommand(command) {
      if (command === 'generate') {
        this.showCreateModal = true
      }
      if (command === 'upload') {
        this.showUploadModal = true
      }
    },
    fetchInvoices() {
      const { limit, page } = this.query
      const form = this.query
      form.vendor_id = this.vendorId
      this.loading = true
      const fetchStaffResource = new Resource('vdd/invoices')
      fetchStaffResource
        .vList(form)
        .then((response) => {
          this.invoices = response.invoices.data
          this.invoices.forEach((element, index) => {
            element['index'] = (page - 1) * limit + index + 1
          })
          this.total = response.invoices.total
          this.loading = false
        })
        .catch((this.loading = false))
    },
    fetchInvoiceAnalysis() {
      this.loading = true
      const invoicesResource = new Resource('vdd/vendor-reports/vendor-invoices-analysis')
      invoicesResource
        .vList({ vendor_id: this.vendorId })
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
    editRow(invoice) {
      this.selectedInvoice = invoice
      this.showEditModal = true
    },
    confirmPayment(invoice) {
      this.$confirm(
        `This will confirm the payment of invoice ${invoice.invoice_no}. Continue?`,
        'Warning',
        {
          confirmButtonText: 'Yes, Continue',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          const fetchStaffResource = new Resource('vdd/invoices/confirm-payment')
          fetchStaffResource
            .vUpdate(invoice.id)
            .then(() => {
              this.$message({
                type: 'success',
                message: 'Payment Confirmed Successfully'
              })
              this.fetchInvoices()
              this.loading = false
            })
            .catch((this.loading = false))
        })
        .catch()
    },
    destroyInvoice(invoice) {
      this.$confirm(
        `This will delete invoice ${invoice.invoice_no} and it cannot be undone. Continue?`,
        'Warning',
        {
          confirmButtonText: 'Yes, Continue',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          const fetchStaffResource = new Resource('vdd/invoices/destroy')
          fetchStaffResource
            .vDestroy(invoice.id)
            .then(() => {
              this.$message({
                type: 'success',
                message: 'Invoice Deleted'
              })
              this.fetchInvoices()
              this.loading = false
            })
            .catch((this.loading = false))
        })
        .catch()
    },
    destroyInvoiceItem(invoice, itemId) {
      this.$confirm(
        `This will delete this item from invoice ${invoice.invoice_no} and it cannot be undone. Continue?`,
        'Warning',
        {
          confirmButtonText: 'Yes, Continue',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          const fetchStaffResource = new Resource('vdd/invoices/destroy-invoice-item')
          fetchStaffResource
            .vDestroy(itemId)
            .then(() => {
              this.$message({
                type: 'success',
                message: 'Invoice Item Deleted'
              })
              this.fetchInvoices()
              this.loading = false
            })
            .catch((this.loading = false))
        })
        .catch()
    },
    handleDownload(tableTitle, invoicesList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const multiHeader = [[tableTitle, '', '', '', '', '', '']]
        const tHeader = [
          // 'STUDENTSHIP STATUS',
          'STAFF ID',
          'SURNAME',
          'OTHER NAMES',
          'EMAIL',
          'PHONE',
          'GENDER'
        ]
        const filterVal = [
          // 'studentship_status',
          'user.username',
          'user.last_name',
          'user.first_name',
          'user.email',
          'user.phone1',
          'user.gender'
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
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'user.username') {
            return v.user.username
          }
          if (j === 'user.last_name') {
            return v.user.last_name
          }
          if (j === 'user.first_name') {
            return v.user.first_name
          }
          if (j === 'user.email') {
            return v.user.email
          }
          if (j === 'user.phone1') {
            return v.user.phone1
          }
          if (j === 'user.gender') {
            return v.user.gender
          }

          return v[j]
        })
      )
    }
  }
}
</script>
