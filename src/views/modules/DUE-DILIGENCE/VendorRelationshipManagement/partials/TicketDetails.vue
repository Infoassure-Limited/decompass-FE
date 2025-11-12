<template>
  <el-row v-loading="loading" :gutter="20">
    <el-col :md="18">
      <el-card>
        <template v-slot:header>
          <div>
            <span class="pull-right">
              <strong>Ticket No.: </strong>{{ selectedTicket.ticket_no }}
            </span>
            <strong>Subject: </strong>{{ selectedTicket.subject }}<br />
            <small>By {{ selectedTicket.created_by }}</small>
          </div>
        </template>
        <div style="margin: 20px">
          <!-- eslint-disable-next-line vue/no-v-html-->
          <span v-html="selectedTicket.message"></span>
        </div>
      </el-card>
      <div>
        <aside v-loading="loadingResponse">
          <strong>Give Response</strong>
          <Editor v-model="ticketForm.message" placeholder="Give response here..." />
          <div>
            <br />
            <el-button
              type="primary"
              :disabled="ticketForm.message === '' || ticketForm.message === '<p><br></p>'"
              @click="sendResponse()"
            >
              Send
            </el-button>
          </div>
        </aside>
      </div>
      <div style="height: 450px; overflow: auto">
        <div v-if="ticket.responses.length > 0">
          <el-timeline>
            <el-timeline-item
              v-for="(response, index) in ticket.responses"
              :key="index"
              :timestamp="`${moment(response.created_at).fromNow()} by ${response.response_by}`"
              placement="top"
              color="#0bbd87"
            >
              <el-card>
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="response.message"></span>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div v-else>
          <el-empty description="No response is given yet">
            <el-button block type="primary" @click="dialogFormVisible = true">Reply</el-button>
          </el-empty>
        </div>
      </div>
    </el-col>
    <el-col :md="6">
      <span>
        <el-button
          v-if="ticket.status !== 'Resolved'"
          type="success"
          plain
          @click="resolveTicket()"
        >
          Resolved </el-button
        >&nbsp; <el-button type="info" plain @click="fetchTicketDetails()"> Refresh </el-button
        ><hr /> <el-tag>Priority: {{ ticket.priority }}</el-tag
        >&nbsp;
        <el-tag>Status: {{ ticket.status }}</el-tag>
      </span>
    </el-col>
  </el-row>
</template>
<script>
import { Editor } from '@/components/Editor'
import moment from 'moment'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: { Editor },
  props: {
    selectedTicket: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      uploadBulk: false,
      loading: false,
      loadingResponse: false,
      pageLength: 10,
      dir: false,
      vendors: [],
      ticket: {
        responses: []
      },
      ticketForm: {
        message: ''
      },
      dialogFormVisible: false
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    userData() {
      return this.$store.getters.userData
    }
  },
  mounted() {
    this.fetchTicketDetails()
  },
  methods: {
    moment,
    checkPermission,
    resolveTicket() {
      this.loading = true
      const resolveTicketResource = new Resource('vdd/client-tickets/update')
      resolveTicketResource
        .update(this.selectedTicket.id, { value: 'Resolved', field: 'status' })
        .then(() => {
          this.fetchTicketDetails()
          this.$alert(
            'The issue is flagged as Resolved. Any response to it will change the status to: In Progress'
          )
          this.loading = false
          this.dialogFormVisible = false
        })
    },
    sendResponse() {
      const form = this.ticketForm
      form.vendor_id = this.selectedTicket.vendor_id
      form.client_id = this.selectedTicket.client_id
      form.ticket_id = this.selectedTicket.id
      form.response_by = `${this.userData.name} (${this.userData.email})`
      this.loadingResponse = true
      const fetchTicketResource = new Resource('vdd/client-tickets/save-response')
      fetchTicketResource.store(form).then(() => {
        this.ticketForm = {
          message: ''
        }
        this.fetchTicketDetails()
        this.loadingResponse = false
        this.dialogFormVisible = false
      })
    },
    fetchTicketDetails() {
      this.loading = true
      const fetchTicketResource = new Resource('vdd/client-tickets/show')
      fetchTicketResource.get(this.selectedTicket.id).then((response) => {
        this.ticket = response.ticket
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
div.fixed {
  position: fixed;
  bottom: 45px;
  width: 850px;
  background: #f0f0f0;
  border: #cccccc solid 3px;
  padding: 20px;
  border-radius: 5px;
}
</style>
