<template>
  <aside v-loading="loading">
    <el-row v-if="resolution_actions !== null">
      <el-col :md="24">
        <div class="pull-right">
          <el-button type="info" @click="showModal = true">
            <icon icon="tabler:plus" />&nbsp;Take immediate action
          </el-button>
        </div>
        <h4> Immediate Actions Taken</h4>
      </el-col>
      <el-col :md="24">
        <aside>
          <div style="height: 320px; overflow: auto">
            <el-card v-for="(action, index) in resolution_actions" :key="index" class="mb-1">
              <strong>Action Taken: </strong>
              <p>{{ action.immediate_action_taken }}</p>
              <span>
                <strong>Assigned To: </strong>
                <el-select v-model="action.assigned_to" placeholder="Select Assignee" disabled>
                  <el-option
                    v-for="(user, index) in clientUsers"
                    :key="index"
                    :label="user.name"
                    :value="user.id"
                  />
                </el-select>
              </span>
              <strong>Is escalated? </strong>
              <span>{{ action.is_escalated }}</span>
              <div v-if="action.is_escalated === 'Yes'">
                <strong>Escalation Details: </strong>
                <p>{{ action.escalation_details }}</p>
              </div>
            </el-card>
          </div>
        </aside>
      </el-col>
    </el-row>
    <!--Create Form-->
    <el-dialog v-model="showModal" title="Take Immediate Action" destroy-on-close hide-footer>
      <el-row :gutter="10">
        <el-col :md="12">
          <label for="">Assign To</label>
          <el-select
            v-model="form.assigned_to"
            placeholder="Select Assignee"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="(user, index) in clientUsers"
              :key="index"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-col>
        <el-col :md="12">
          <label for="">Deadline</label>
          <el-date-picker
            v-model="form.deadline"
            type="date"
            placeholder="Select date and time"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            :shortcuts="shortcuts"
          />
        </el-col>
        <el-col :md="24">
          <v-textarea
            v-model="form.immediate_action_taken"
            :readonly="loader"
            class="mb-1"
            :rows="3"
            label="State Immediate Action Taken"
            placeholder="Detailed description of the immediate action you took to mitigate the incident"
            variant="outlined"
          />
        </el-col>
        <el-col :md="24">
          <label for="">Do you want to escalate this incident?</label>
          <el-radio-group v-model="form.is_escalated" style="width: 100%">
            <el-radio value="No">No</el-radio>
            <el-radio value="Yes">Yes</el-radio>
          </el-radio-group>
        </el-col>
        <el-col v-if="form.is_escalated === 'Yes'" :md="24">
          <v-textarea
            v-model="form.escalation_details"
            :readonly="loader"
            class="mb-1"
            :rows="3"
            label="Escation Details"
            placeholder="State the details for the escalation"
            variant="outlined"
          />
        </el-col>
        <el-col :md="24">
          <v-btn
            :disabled="loader"
            :loading="loader"
            color="green"
            size="x-large"
            variant="flat"
            block
            @click="submitHandler()"
          >
            Submit
          </v-btn>
        </el-col>
      </el-row>
    </el-dialog>
  </aside>
</template>
<script>
import moment from 'moment'
import Resource from '@/api/resource'
export default {
  props: {
    incident: {
      type: Object,
      required: true
    },
    clientUsers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      versions: [],
      selectedVersion: null,
      showVersion: false,
      loading: false,
      loader: false,
      loadVersions: false,
      updateLoader: false,
      showModal: false,
      resolution_actions: null,
      change_summary: '',
      form: {
        immediate_action_taken: '',
        is_escalated: 'No',
        assigned_to: '',
        escalation_details: '',
        deadline: ''
      }
    }
  },
  mounted() {
    this.fetchActions()
  },
  methods: {
    moment,
    fetchActions() {
      const fetchEntryResource = new Resource('isms/incidents/fetch-resolution-actions')
      this.loading = true
      fetchEntryResource
        .get(this.incident.id)
        .then((response) => {
          this.resolution_actions = response.resolution_actions
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
        `Are you sure you want to assign this task to ${user.name} ?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.assigning = true
          const assignUserResource = new Resource('isms/incidents/assign-user-to-task')
          assignUserResource
            .update(this.resolution_actions.id, { assigned_to: user.id })
            .then((response) => {
              this.$message.success('User assigned successfully')
              this.resolution_actions.assignee = user
              this.assigning = false
            })
            .catch((error) => {
              this.assigning = false
            })
        })
        .catch(() => {})
    },
    submitHandler() {
      const actionResource = new Resource(`isms/incidents/store-resolution-action`)
      this.loader = true
      const { form } = this
      form.incident_id = this.incident.id
      actionResource
        .store(this.form)
        .then((response) => {
          this.loader = false
          this.showModal = false
          this.$message(`Action Successful`)
          this.fetchActions()
        })
        .catch((error) => {
          this.$message({
            message: error,
            type: 'danger'
          })

          this.loader = false
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
