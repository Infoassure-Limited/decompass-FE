<template>
  <div v-loading="loading">
    <el-row v-if="incident_details !== null" :gutter="10">
      <el-col :md="24">
        <el-tabs class="demo-tabs" type="card">
          <el-tab-pane label="Incident Details" lazy>
            <el-row :gutter="20">
              <el-col :md="12">
                <el-row :gutter="20">
                  <el-col :md="24">
                    <el-button-group>
                      <el-tooltip content="Mark as In Progress">
                        <el-button
                          :disabled="incident_details.status !== 'Open'"
                          type="info"
                          round
                          @click="incidentActions(incident_details.id, 'status', 'In Progress')"
                        >
                          <icon icon="tabler:folder-open" size="25" />
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="Mark as Resolved">
                        <el-button
                          :disabled="
                            incident_details.status !== 'In Progress' &&
                            incident_details.status !== 'Rejected'
                          "
                          type="success"
                          round
                          @click="incidentActions(incident_details.id, 'status', 'Resolved')"
                        >
                          <icon icon="tabler:file-check" size="25" />
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="Mark as Escalated">
                        <el-button
                          :disabled="incident_details.status !== 'In Progress'"
                          type="info"
                          round
                          @click="incidentActions(incident_details.id, 'status', 'Escalated')"
                        >
                          <icon icon="tabler:arrow-forward-up-double" size="25" />
                        </el-button>
                      </el-tooltip>
                    </el-button-group>
                    <div class="pull-right">
                      <el-alert type="info" :closable="false">
                        <strong>STATUS: {{ incident_details.status.toUpperCase() }}</strong>
                      </el-alert>
                    </div>
                  </el-col>
                  <el-col :md="24">
                    <div>
                      <strong>Reported by: {{ incident_details.reporter.name }}</strong>
                    </div>
                  </el-col>
                  <el-col :md="24">
                    <div>
                      <strong>Incident evidence link:</strong>
                      <a
                        :href="`${baseServerUrl}storage/${incident_details.evidence_link}`"
                        target="_blank"
                      >
                        Click to view
                      </a>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="5">
                  <el-col :md="24">
                    <div>
                      <strong>Incident Date.: </strong>
                      {{ moment(incident_details.occurred_at).format('lll') }}
                    </div>
                  </el-col>
                  <el-col :md="24">
                    <div>
                      <v-text-field
                        v-model="incident_details.incident_type.name"
                        class="mb-2"
                        label="Incident Category"
                        placeholder="Incident Category"
                        variant="outlined"
                        readonly
                      />
                    </div>
                  </el-col>
                  <el-col :md="24">
                    <div>
                      <v-text-field
                        v-model="incident_details.title"
                        class="mb-2"
                        label="Incident Title"
                        placeholder="Information Security Policy"
                        variant="outlined"
                        readonly
                      />
                    </div>
                  </el-col>
                  <el-col :md="24">
                    <v-textarea
                      v-model="incident_details.description"
                      class="mb-2"
                      :rows="2"
                      label="Description"
                      placeholder="Briefly describe the incident"
                      variant="outlined"
                      readonly
                    />
                  </el-col>
                  <el-col :md="24">
                    Affected Assets:
                    <el-tag
                      v-for="(asset, index) in incident_details.affected_assets"
                      :key="index"
                      type="danger"
                    >
                      {{ asset }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :md="12">
                <ImmediateActionTaken
                  :incident="incident_details"
                  @saved="fetchIncidentDetails"
                  :client-users="client_users"
                />
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane v-if="client_users.length > 0" label="Tasks & Resolution" lazy>
            <Tasks
              :incident="incident_details"
              @assigned="fetchIncidentDetails"
              :client-users="client_users"
            />
          </el-tab-pane>
          <el-tab-pane label="Root Cause Analysis" lazy>
            <RootCauseAnalysis :incident="incident_details" @uploaded="fetchIncidentDetails" />
          </el-tab-pane>
          <el-tab-pane label="Final Review & Approval" lazy>
            <el-row :gutter="20">
              <el-col :md="18">
                <el-row :gutter="20">
                  <el-col :md="24">
                    <el-button-group>
                      <el-tooltip content="Mark as Approved">
                        <el-button
                          :disabled="incident_details.status !== 'Resolved'"
                          type="success"
                          round
                          @click="incidentActions(incident_details.id, 'status', 'Approved')"
                        >
                          <icon icon="tabler:check" size="25" />
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="Mark as Rejected">
                        <el-button
                          :disabled="incident_details.status !== 'Resolved'"
                          type="danger"
                          round
                          @click="incidentActions(incident_details.id, 'status', 'Rejected')"
                        >
                          <icon icon="tabler:x" size="25" />
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="Mark as Closed">
                        <el-button
                          :disabled="incident_details.status !== 'Approved'"
                          type="primary"
                          round
                          @click="closeIncident(incident_details.id, 'status', 'Closed')"
                        >
                          <icon icon="tabler:file-zip" size="25" />
                        </el-button>
                      </el-tooltip>
                    </el-button-group>
                    <div class="pull-right">
                      <div v-if="incident_details.status === 'Closed'">
                        <strong>Closure Date.: </strong>
                        {{ moment(incident_details.closure_date).format('lll') }}
                      </div>
                      <!-- <el-alert type="info" :closable="false">
                        <strong
                          >Review Status: {{ incident_details.review_status.toUpperCase() }}</strong
                        >
                      </el-alert> -->
                    </div>
                  </el-col>
                  <el-col :md="24">
                    <div>
                      <strong>Reviewed by: {{ incident_details.reviewer.name }}</strong>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="5">
                  <!-- <el-col v-if="incident_details.status === 'Closed'" :md="24">
                    <div>
                      <strong>Closure Date.: </strong>
                      {{ moment(incident_details.closure_date).format('lll') }}
                    </div>
                  </el-col> -->
                  <el-col :md="24">
                    <div>
                      <v-textarea
                        v-model="incident_details.reviewer_comment"
                        class="mb-2"
                        label="Reviewer's Comment"
                        placeholder="Comments from the incident reviewer/approver"
                        variant="outlined"
                        @blur="giveReviewerComment(incident_details.id, 'reviewer_comment')"
                      />
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- <el-tab-pane label="RCA">
            <RootCauseAnalysis :incident-id="incident_details.id" />
          </el-tab-pane>
          <el-tab-pane label="Task">
            <AuditTrail :incident-id="incident_details.id" />
          </el-tab-pane> -->
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import Resource from '@/api/resource'
// import AssignIncidentResponder from './AssignIncidentResponder.vue'
import ImmediateActionTaken from './ImmediateActionTaken.vue'
// import IncidentEvidences from './IncidentEvidences.vue'
import Tasks from './Tasks.vue'
import RootCauseAnalysis from './RootCauseAnalysis.vue'
// import AuditTrail from './AuditTrail.vue'
export default {
  components: {
    // AssignIncidentResponder,
    ImmediateActionTaken,
    RootCauseAnalysis,
    Tasks
    // RootCauseAnalysis,
    // AuditTrail
  },
  props: {
    selectedData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      versions: [],
      selectedVersion: null,
      showVersion: false,
      loading: false,
      assigning: false,
      loadVersions: false,
      updateLoader: false,
      showEdit: false,
      incident_details: null,
      change_summary: '',
      review_intervals: ['Quarterly', 'Biannually', 'Annually'],
      client_users: []
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
    this.fetchIncidentDetails()
    this.fetchClientUsers()
  },
  methods: {
    moment,
    fetchClientUsers() {
      this.loading = true
      const clientUsersResource = new Resource('clients/users')
      clientUsersResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.client_users = response.users
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    assignUser(user) {
      this.$confirm(
        `Are you sure you want to assign this incident to ${user.name} ?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.assigning = true
          const assignUserResource = new Resource('isms/incidents/assign-user')
          assignUserResource
            .update(this.incident_details.id, { assigned_to: user.id })
            .then((response) => {
              this.$message.success('User assigned successfully')
              this.incident_details.assignee = user
              this.assigning = false
            })
            .catch((error) => {
              this.assigning = false
            })
        })
        .catch(() => {})
    },
    fetchIncidentDetails() {
      const fetchEntryResource = new Resource('isms/incidents/show')
      this.loading = true
      fetchEntryResource
        .get(this.selectedData.id)
        .then((response) => {
          this.incident_details = response.data
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    updatePolicy() {
      const updateResource = new Resource('policy/policies/update')
      const form = this.incident_details
      form.change_summary = this.change_summary
      this.updateLoader = true
      updateResource
        .update(form.id, form)
        .then((response) => {
          this.updateLoader = false
          this.$message(`Action Successful`)
          this.change_summary = ''
          this.fetchPolicyVersions()
        })
        .catch((error) => {
          this.$message({
            message: error.response.data.message,
            type: 'danger'
          })

          this.updateLoader = false
        })
    },
    updateFields(incident_details, field, value) {
      const updateResource = new Resource('policy/policies/update-fields')
      const form = { field, value }
      updateResource
        .update(incident_details.id, form)
        .then((response) => {
          this.$message(`Action Successful`)
          this.change_summary = ''
          this.fetchPolicyVersions()
        })
        .catch((error) => {
          this.$message({
            message: error.response.data.message,
            type: 'danger'
          })
        })
    },
    viewVersion(version) {
      this.selectedVersion = version
      this.showVersion = true
    },
    generatePdf(title, version) {
      const element = this.$refs.pdfContent.innerHTML
      const opt = {
        margin: 10,
        filename: `${title}-v${version}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      html2pdf().from(element).set(opt).save()
    },
    incidentActions(incidentId, field, value) {
      if (window.confirm(`Click OK to confirm ${value} action`)) {
        const actionResource = new Resource(`isms/incidents/update-fields`)
        const form = { field, value }
        this.loading = true
        actionResource
          .update(incidentId, form)
          .then((response) => {
            this.loading = false
            this.$message(`Action Successful`)
            this.fetchIncidentDetails()
          })
          .catch((error) => {
            this.$message({
              message: error,
              type: 'danger'
            })

            this.loading = false
          })
      }
    },
    closeIncident(incidentId) {
      if (window.confirm('Click OK to confirm closing of this incident')) {
        const actionResource = new Resource(`isms/incidents/close-incident`)
        this.loading = true
        actionResource
          .update(incidentId)
          .then((response) => {
            this.loading = false
            this.$message(`Incident Closed Successful`)
            this.fetchIncidentDetails()
          })
          .catch((error) => {
            this.$message({
              message: error,
              type: 'danger'
            })

            this.loading = false
          })
      }
    },
    giveReviewerComment(incidentId, field) {
      const comment = this.incident_details.reviewer_comment
      const actionResource = new Resource(`isms/incidents/update-fields`)
      const form = { field, value: comment }
      actionResource
        .update(incidentId, form)
        .then((response) => {
          this.loading = false
          this.$message(`Action Successful`)
          this.fetchIncidentDetails()
        })
        .catch((error) => {
          this.$message({
            message: error,
            type: 'danger'
          })

          this.loading = false
        })
    }
  }
}
</script>
<style scoped>
.pdf-container {
  position: relative;
}
.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 10em;
  color: rgba(0, 0, 0, 0.1);
  user-select: none;
  pointer-events: none;
}
</style>
