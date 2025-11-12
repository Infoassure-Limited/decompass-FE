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
            <el-skeleton :loading="loading" :rows="3" animated />
          </el-card>
        </el-col>
      </el-row>
      <el-row v-if="!loading">
        <el-col :xs="24">
          <span class="pull-right">
            <el-button size="size" type="dark" plain @click="initialize()">
              <icon icon="tabler:reload" /> Refresh
            </el-button>
          </span>
        </el-col>
      </el-row>
      <el-row v-if="!loading" :gutter="6">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-dark" size="50">
                <icon size="35" icon="tabler:file-description" color="black" />
              </el-avatar>
              <div class="truncate">
                <h2>
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
                <icon size="35" icon="tabler:file-alert" color="red" />
              </el-avatar>
              <div class="truncate">
                <h2>
                  {{ open_tickets }}
                </h2>
                <span>Open</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-danger" size="50">
                <icon size="35" icon="tabler:file-dots" color="orange" />
              </el-avatar>
              <div class="truncate">
                <h2>
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
                <icon size="35" icon="tabler:file-check" color="green" />
              </el-avatar>
              <div class="truncate">
                <h2>
                  {{ resolved_tickets }}
                </h2>
                <span>Resolved</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col cols="6">
          <h3> Tickets </h3>
        </el-col>
        <el-col cols="6">
          <span class="pull-right">
            <el-button size="size" type="primary" @click="dialogFormVisible = true">
              <icon icon="tabler:file-plus" /> Create Ticket
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
          <div style="margin-bottom: 5px">
            <el-input v-model="query.ticket_no" placeholder="Ticket Number" />
          </div>
          <div style="margin-bottom: 5px">
            <el-select v-model="query.category" placeholder="Select Category" style="width: 100%">
              <el-option
                v-for="(category, index) in categories"
                :key="index"
                :value="category"
                :label="category"
              />
            </el-select>
            <br />
          </div>
          <div style="margin-bottom: 5px">
            <el-date-picker
              v-model="query.date"
              type="date"
              placeholder="Date"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </div>
          <div style="margin-bottom: 5px">
            <el-select v-model="query.status" placeholder="Ticket Status" style="width: 100%">
              <el-option
                v-for="(status, status_index) in statuses"
                :key="status_index"
                :value="status"
                :label="status"
              />
            </el-select>
          </div>
          <div style="margin-bottom: 5px">
            <el-select v-model="query.priority" placeholder="Ticket Priority" style="width: 100%">
              <el-option
                v-for="(priority, status_index) in ticket_priorities"
                :key="status_index"
                :value="priority"
                :label="priority"
              />
            </el-select>
          </div>
          <div style="margin-bottom: 5px">
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
          <ckeditor
            id="mesage"
            v-model="ticketForm.message"
            placeholder="Give details of the stated issue..."
            :editor="editor"
            :config="editorConfig"
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
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Pagination from '@/views/Components/Pagination-main/index.vue'
import TicketDetails from './TicketDetails.vue'
import Resource from '@/api/resource'

export default {
  components: {
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
    userData() {
      return this.$store.getters.userData
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
      form.created_by = `${this.userData.name} (${this.userData.email})`
      const saveTicketsResource = new Resource('vdd/client-tickets/store')
      saveTicketsResource
        .store(form)
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
      const fetchTicketResource = new Resource('vdd/client-tickets')
      fetchTicketResource
        .list(form)
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
      const ticketsResource = new Resource('vdd/reports/vendor-tickets-analysis')
      ticketsResource
        .list({ vendor_id: this.vendorId })
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
