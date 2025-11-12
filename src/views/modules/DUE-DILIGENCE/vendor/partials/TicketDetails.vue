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
            <el-button block variant="primary" @click="dialogFormVisible = true">Reply</el-button>
          </el-empty>
        </div>
      </div>
      <div class="fixed">
        <el-form v-loading="loadingResponse" :model="ticketForm">
          <el-form-item label="Give Response">
            <Editor id="mesage" v-model="ticketForm.message" placeholder="Give response here..." />
          </el-form-item>
          <div>
            <el-button class="pull-right" type="primary" plain @click="sendResponse()"
              >Send</el-button
            >
          </div>
        </el-form>
      </div>
    </el-col>
    <el-col :md="6">
      <span>
        <el-button type="dark" plain @click="fetchTicketDetails()"> Refresh </el-button><hr />
        <el-tag>Priority: {{ ticket.priority }}</el-tag
        >&nbsp;
        <el-tag>Status: {{ ticket.status }}</el-tag>
      </span>
    </el-col>
  </el-row>
</template>
<script>
import moment from 'moment'
import { Editor } from '@/components/Editor'
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
    otherUserData() {
      return this.$store.getters.otherUserData
    }
  },
  mounted() {
    this.fetchTicketDetails()
  },
  methods: {
    moment,
    checkPermission,
    sendResponse() {
      const form = this.ticketForm
      form.vendor_id = this.selectedTicket.vendor_id
      form.client_id = this.selectedTicket.client_id
      form.ticket_id = this.selectedTicket.id
      form.response_by = `${this.otherUserData.name} (${this.otherUserData.email})`
      this.loadingResponse = true
      const fetchTicketResource = new Resource('vdd/vendor-tickets/save-response')
      fetchTicketResource.vStore(form).then(() => {
        this.fetchTicketDetails()
        this.loadingResponse = false
        this.dialogFormVisible = false
      })
    },
    fetchTicketDetails() {
      this.loading = true
      const fetchTicketResource = new Resource('vdd/vendor-tickets/show')
      fetchTicketResource.vGet(this.selectedTicket.id).then((response) => {
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
  bottom: 0;
  width: 850px;
  background: #f0f0f0;
  border: #cccccc solid 3px;
  padding: 20px;
  border-radius: 5px;
}
</style>
