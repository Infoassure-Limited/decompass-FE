<template>
  <el-card>
    <div v-if="showTicketDetails">
      <div v:slot="header">
        <span>
          <el-button
            type="danger"
            @click="(fetchTickets(), (showTicketDetails = false), $emit('details', false))"
          >
            Back
          </el-button>
        </span>
        <hr />
      </div>
      <TicketDetails :selected-ticket="selectedTicket" />
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
            <el-skeleton :loading="loading" :rows="1" animated />
          </el-card>
        </el-col>
      </el-row>
      <el-row v-if="!loading">
        <el-col :xs="24">
          <span>
            <el-button size="size" type="info" plain @click="initialize()">
              <icon icon="tabler:reload" /> Refresh
            </el-button>
          </span>
        </el-col>
      </el-row>
      <el-row v-if="!loading" :gutter="6">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar size="50">
                <icon size="35" icon="tabler:file-text" color="black" />
              </el-avatar>
              <div class="truncate">
                <h2 class="font-weight-bolder">
                  {{ total_tickets }}
                </h2>
                <span>Total Tickets</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-warning" size="50">
                <icon size="35" icon="tabler:alert-circle" color="orange" />
              </el-avatar>
              <div class="truncate">
                <h2 class="font-weight-bolder">
                  {{ open_tickets }}
                </h2>
                <span>Open Tickets</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-danger" size="50">
                <icon size="35" icon="tabler:progress" color="blue" />
              </el-avatar>
              <div class="truncate">
                <h2 class="font-weight-bolder">
                  {{ in_progress_tickets }}
                </h2>
                <span>In Progress</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-success" size="50">
                <icon size="35" icon="tabler:circle-check" color="green" />
              </el-avatar>
              <div class="truncate">
                <h2 class="font-weight-bolder">
                  {{ resolved_tickets }}
                </h2>
                <span>Resolved</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <h3> Tickets </h3>
        </el-col>
        <el-col :md="12">
          <span class="pull-right">
            <el-button size="size" type="primary" @click="dialogFormVisible = true">
              <icon icon="tabler:plus" /> Create Ticket
            </el-button>
            <!-- <el-button
              v-if="tickets.length > 0"
              :loading="downloadLoading"
              style="margin:0 0 20px 20px;"
              type="primary"
              plain
              icon="el-icon-download"
              @click="handleDownload('List of tickets', tickets)"
            >Export Excel</el-button> -->
          </span>
        </el-col>
      </el-row>
      <el-popover placement="right" width="400" trigger="click">
        <el-row :gutter="10">
          <p>Filter using the fields below</p>
          <el-col :md="24">
            <div>
              <el-input v-model="query.ticket_no" placeholder="Ticket Number" />
            </div>
          </el-col>
          <el-col :md="24">
            <div>
              <el-select v-model="query.category" placeholder="Select Category" style="width: 100%">
                <el-option
                  v-for="(category, index) in categories"
                  :key="index"
                  :value="category"
                  :label="category"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :md="24">
            <div>
              <el-date-picker
                v-model="query.date"
                type="date"
                placeholder="Date"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </div>
          </el-col>
          <el-col :md="24">
            <div>
              <el-select v-model="query.status" placeholder="Ticket Status" style="width: 100%">
                <el-option
                  v-for="(status, status_index) in statuses"
                  :key="status_index"
                  :value="status"
                  :label="status"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :md="24">
            <div>
              <el-select v-model="query.priority" placeholder="Ticket Priority" style="width: 100%">
                <el-option
                  v-for="(priority, status_index) in ticket_priorities"
                  :key="status_index"
                  :value="priority"
                  :label="priority"
                />
              </el-select>
            </div>
          </el-col>
          <div>
            <el-button type="primary" @click="fetchTickets"> Submit Query </el-button>
            <el-button type="default" @click="clearFields"> Clear Fields </el-button>
          </div>
        </el-row>
        <template v-slot:reference>
          <el-button> Filter By </el-button>
        </template>
      </el-popover>
      <hr />
      <v-client-table :data="tickets" v-loading="loading" :columns="columns" :options="options">
        <template v-slot:action="{ row }">
          <div>
            <el-button @click="showSelectedTicketDetails(row)"> Show Details </el-button>
          </div>
        </template>
      </v-client-table>
      <el-row :gutter="20">
        <pagination
          v-show="total > 10"
          :total="total"
          v-model:page="query.page"
          v-model:limit="query.limit"
          @pagination="fetchTickets"
        />
      </el-row>
    </div>
    <el-dialog
      v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      title="Create New Contract Document"
      v-model:visible="dialogFormVisible"
    >
      <el-form v-loading="loading" :model="ticketForm">
        <el-form-item label="Issue Category">
          <el-select
            v-model="ticketForm.category"
            placeholder="Select Category"
            style="width: 100%"
          >
            <el-option
              v-for="(priority, index) in categories"
              :key="index"
              :value="priority"
              :label="priority"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Subject">
          <el-input
            v-model="ticketForm.subject"
            placeholder="State the subject of issue"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Message">
          <Editor
            id="mesage"
            v-model="ticketForm.message"
            placeholder="Give details of the stated issue..."
          />
        </el-form-item>
        <el-form-item label="Resolution Priority">
          <el-select v-model="ticketForm.priority" placeholder="Set Priority" style="width: 100%">
            <el-option
              v-for="(priority, index) in ticket_priorities"
              :key="index"
              :value="priority"
              :label="priority"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveTicket()">Submit</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import { Editor } from '@/components/Editor'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Pagination from '@/views/Components/Pagination-main/index.vue'
import TicketDetails from './TicketDetails.vue'
import Resource from '@/api/resource'

export default {
  components: {
    Editor,
    Pagination,
    TicketDetails
  },
  props: {
    vendorId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      showTicketDetails: false,
      selectedTicket: null,
      downloadLoading: false,
      dialogFormVisible: false,
      pageLength: 10,
      dir: false,
      currency: '₦',
      columns: [
        'ticket_no',
        'category',
        'subject',
        'priority',
        'status',
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
          if (row.status === 'In Progress') {
            return { style: 'background: #f5f1d3; color: #000000' }
          }
          if (row.status === 'Open') {
            return { style: 'background: #f5dbd3; color: #000000' }
          }
          //   if (row.status === 'Resolved') {
          //     return { style: 'background: #eaf8e5; color: #000000' }
          //   }
          return {}
        },
        sortable: [],
        filterable: false
      },
      showEditForm: false,
      tickets: [],
      ticketForm: {
        category: '',
        subject: '',
        message: '',
        priority: 'Low'
      },
      categories: [
        'Onboarding issues',
        'Risk & Compliance issues',
        'Contract & SLAs issues',
        'Financials & Billing issues',
        'Technical issues',
        'Others'
      ],
      ticket_priorities: ['Low', 'Medium', 'High'],
      statuses: ['Open', 'In Progress', 'Resolved'],
      loading: false,
      approvalLoading: false,
      total_tickets: 0,
      open_tickets: 0,
      in_progress_tickets: 0,
      resolved_tickets: 0,
      query: {
        page: 1,
        limit: 50,
        vendor_id: '',
        status: '',
        category: '',
        date: '',
        ticket_no: '',
        priority: ''
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
    },
    otherUserData() {
      return this.$store.getters.otherUserData
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
      this.fetchTickets()
      this.fetchTicketAnalysis()
    },
    showSelectedTicketDetails(ticket) {
      this.showTicketDetails = true
      this.selectedTicket = ticket
      this.$emit('details', true)
    },
    clearFields() {
      this.query = {
        page: this.query.page,
        limit: this.query.limit,
        vendor_id: '',
        status: '',
        ticket_no: '',
        category: '',
        date: '',
        priority: ''
      }
      this.fetchTickets()
    },
    saveTicket() {
      this.loading = true
      const form = this.ticketForm
      form.vendor_id = this.vendorId
      form.created_by = `${this.otherUserData.name} (${this.otherUserData.email})`
      const saveTicketsResource = new Resource('vdd/vendor-tickets/store')
      saveTicketsResource
        .vStore(form)
        .then(() => {
          this.dialogFormVisible = false
          this.ticketForm = {
            subject: '',
            message: '',
            priority: ''
          }
          this.initialize()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchTickets() {
      const { limit, page } = this.query
      const form = this.query
      form.vendor_id = this.vendorId
      this.loading = true
      const fetchTicketResource = new Resource('vdd/vendor-tickets')
      fetchTicketResource
        .vList(form)
        .then((response) => {
          this.tickets = response.tickets.data
          this.tickets.forEach((element, index) => {
            element['index'] = (page - 1) * limit + index + 1
          })
          this.total = response.tickets.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchTicketAnalysis() {
      this.loading = true
      const ticketsResource = new Resource('vdd/vendor-reports/vendor-tickets-analysis')
      ticketsResource
        .vList({ vendor_id: this.vendorId })
        .then((response) => {
          this.total_tickets = response.total_tickets
          this.open_tickets = response.open_tickets
          this.in_progress_tickets = response.in_progress_tickets
          this.resolved_tickets = response.resolved_tickets
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleDownload(tableTitle, ticketsList) {
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
          'ticket_no',
          'subtotal',
          'discount',
          'amount',
          'due_date',
          'status',
          'payment_date'
        ]
        const list = ticketsList
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
