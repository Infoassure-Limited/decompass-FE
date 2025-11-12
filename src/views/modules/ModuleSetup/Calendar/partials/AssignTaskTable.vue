<template>
  <div v-loading="loader">
    <div v-if="data !== null">
      <el-row :gutter="20">
        <el-col :md="10">
          <h3 v-if="data.task.activity_no !== null"
            >Process {{ `${data.task.activity_no} - ${data.task.name}` }}</h3
          >
          <h3 v-else>{{ `${data.task.name}` }}</h3>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td>
                  <p>
                    <strong> Assigned To: </strong>
                    <span>
                      {{ data.assignee ? data.assignee.name : 'Not assigned' }}
                    </span>
                  </p>
                  <p>
                    <strong>Task Initiation Date: </strong>
                    <span>
                      {{ data ? moment(data.start_date).format('ll') : 'Not stated' }}
                    </span>
                  </p>
                  <!-- <p>
                    <strong>Due Date: </strong>
                    <span>
                      {{
                        data
                          ? moment(data.end_date).format('ll')
                          : 'Not stated'
                      }}
                    </span>
                  </p> -->
                  <p>
                    <strong>Task Recurrence: </strong>
                    <span>
                      {{ data ? data.recurrence : 'Not stated' }}
                    </span>
                  </p>
                </td>
              </tr>
              <template v-if="data.task.tasks">
                <tr v-if="data.task.tasks.length > 0">
                  <td>
                    <strong>Sub Tasks</strong>
                    <p></p>
                    <ul>
                      <li v-for="(task, index) in data.task.tasks" :key="index">
                        {{ task }}
                      </li>
                    </ul>
                  </td>
                </tr>
              </template>
              <tr>
                <td>
                  <strong>Description</strong>
                  <p></p>
                  <span v-html="data.task.description"></span>
                </td>
              </tr>
              <template v-if="selectedModule === 'ndpa'">
                <tr v-if="data.task.implementation_guide.length > 0">
                  <td>
                    <strong>Implementation Guide</strong>
                    <p></p>
                    <ul>
                      <li v-for="(task, index) in data.task.implementation_guide" :key="index">
                        {{ task }}
                      </li>
                    </ul>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td>
                    <strong>Implementation Guide</strong>
                    <p></p>
                    <span v-html="data.task.implementation_guide"></span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </el-col>
        <el-col :md="14">
          <div v-if="data">
            <el-alert :type="statusColor(data.status)" :closable="false">
              {{ data.status.toUpperCase() }}
            </el-alert>
          </div>
          <br />
          <el-button-group>
            <el-tooltip
              :content="data.assignee === null ? 'Assign Task' : 'Reassign Task'"
              placement="top"
            >
              <el-button v-if="role === 'admin'" @click="setDetails(data)">
                <icon icon="tabler:user-plus" size="25" color="brown" />
              </el-button>
            </el-tooltip>
            <el-tooltip
              v-if="data.assignee !== null"
              content="Reverse Assigned Task"
              placement="top"
            >
              <el-button v-if="role === 'admin'" @click="reverseAssignedTask(data)">
                <icon icon="tabler:user-cancel" size="25" color="red" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="View chats around the task" placement="top">
              <el-button @click="showChat = true">
                <icon icon="tabler:messages" size="25" color="black" />
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="role === 'admin'" content="Mark task as completed" placement="top">
              <el-button :disabled="data === null" @click="markTaskAsDone(data.id)">
                <icon icon="tabler:check" size="25" color="green" />
              </el-button>
            </el-tooltip>
          </el-button-group>
          <hr />

          <aside v-if="uploads.length > 0">
            <h4> <icon icon="tabler:folder-open" size="25" /> Required Evidences </h4>
            <el-card v-for="(upload, index) in uploads" :key="index" class="mb-1">
              <div>
                <div class="pull-right">
                  <el-button-group>
                    <el-button
                      v-if="upload.link !== null"
                      type="text"
                      size="small"
                      @click="setView(upload)"
                    >
                      <icon icon="tabler:eye" /> View
                    </el-button>
                    <el-button v-else type="text" size="small" @click="uploadDocument(upload)">
                      <icon icon="tabler:upload" /> Upload
                    </el-button>
                    <!-- <el-button v-if="upload.link !== null" type="text" size="small">
                      <icon icon="tabler:download" /> Download
                    </el-button> -->
                  </el-button-group>
                  <icon v-if="upload.link !== null" icon="tabler:check" color="green" />
                  <icon v-else icon="tabler:alert-circle" color="red" />
                </div>
                <div>
                  <small><icon icon="tabler:file-description" /> {{ upload.title }}</small>
                  <br />
                </div>
              </div>
            </el-card>
          </aside>
          <div v-if="data.assignee !== null">
            <RecurrentTasks
              v-if="showRecurrentTask"
              :occurence="data.occurence"
              :task="data"
              :selected-module="selectedModule"
            />
          </div>
          <div v-else align="center">
            <div v-if="role === 'admin'">
              <h3>This task is not yet assigned to anyone</h3>
              <p>&nbsp;</p>
              <span @click="setDetails(data)" style="cursor: pointer">
                <icon icon="tabler:user-plus" size="50" color="brown" /><br />
                Click here to assign
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-drawer
      v-if="showChat"
      v-model="showChat"
      direction="rtl"
      title="Communication on this task"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <TaskChats :task="data" :selected-module="selectedModule" />
    </el-drawer>
    <el-drawer
      v-if="showEditor"
      v-model="showEditor"
      direction="rtl"
      :title="`${selectedDocument.title}`"
      size="87%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div>
        <vue-document-editor
          v-if="showDocumentEditor === 'word'"
          :document-data="selectedDocument"
          mode="readOnly"
          @refresh="loadTask(false)"
        />
        <vue-spreadsheet-editor
          v-if="showDocumentEditor === 'spreadsheet'"
          :document-data="selectedDocument"
          mode="readOnly"
          @refresh="loadTask(false)"
        />
        <iframe
          v-if="showDocumentEditor === 'others'"
          :src="`${baseServerUrl}storage/${docSrc}`"
          style="width: 100%; height: 500px"
        ></iframe>
      </div>
    </el-drawer>
    <el-dialog
      v-if="showAssignModal"
      v-model="showAssignModal"
      hide-footer
      width="50%"
      centered
      title="Assign Task"
    >
      <el-row v-loading="loading" :gutter="20">
        <el-col :md="24">
          <label for="">Select Assignee</label>
          <el-select
            v-model="assignForm.assignee_id"
            placeholder="Select Assignee"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="(user, user_index) in staff"
              :key="user_index"
              :value="user.id"
              :label="user.name"
            >
              <span style="float: left">{{ user.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                user.designation ? user.designation : ''
              }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :md="12">
          <label for="">Set Start Date</label>
          <el-date-picker
            v-model="assignForm.start_date"
            type="date"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-col>
        <el-col :md="12">
          <label for="">Set End Date</label>
          <el-date-picker
            v-model="assignForm.end_date"
            type="date"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="Pick a date"
            style="width: 100%"
            @change="fetchProjects"
          />
        </el-col>
        <el-col :md="24">
          <label for="">How often will the task be performed?</label>
          <el-radio-group v-model="assignForm.recurrence" fill="#343a40">
            <el-radio-button label="Weekly" value="Weekly" />
            <el-radio-button label="Monthly" value="Monthly" />
            <el-radio-button label="Quarterly" value="Quarterly" />
            <el-radio-button label="Biannually" value="Biannually" />
            <el-radio-button label="Annually" value="Annually" />
            <el-radio-button label="Adhoc" value="Adhoc" />
          </el-radio-group>
        </el-col>
        <el-col :md="24">
          <hr />
          <el-button :loading="loader" type="primary" @click="assignTask()">
            <span class="align-middle">Assign</span>
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      v-if="showUploadEvidenceModal"
      v-model="showUploadEvidenceModal"
      hide-footer
      centered
      title="Upload required evidence"
      @close="loadTask()"
    >
      <UploadExpectedDocument
        :upload-template="selectedTemplate"
        :selected-module="selectedModule"
      />
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import Resource from '@/api/resource'
import VueDocumentEditor from '@/views/Components/editors/VueDocumentEditorForClients.vue'
import VueSpreadsheetEditor from '@/views/Components/editors/VueSpreadsheetEditorForClients.vue'
import TaskChats from './TaskChats.vue'
import RecurrentTasks from './RecurrentTasks.vue'
import UploadExpectedDocument from './UploadExpectedDocument.vue'

export default {
  components: {
    VueDocumentEditor,
    VueSpreadsheetEditor,
    TaskChats,
    UploadExpectedDocument,
    RecurrentTasks
  },
  props: {
    selectedData: {
      type: Object,
      default: () => null
    },
    staff: {
      type: Array,
      default: () => []
    },
    role: {
      type: String,
      default: () => 'user'
    },
    selectedModule: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showRecurrentTask: true,
      showChat: false,
      data: null,
      assignForm: {
        module_activity_task_id: '',
        assignee_id: '',
        start_date: new Date(),
        end_date: new Date(),
        recurrence: null
      },
      empty_form: {
        module_activity_task_id: '',
        assignee_id: '',
        start_date: new Date(),
        end_date: new Date(),
        recurrence: null
      },
      loader: false,
      details: [],
      showAssignModal: false,
      selectedindex: null,
      loadTasks: false,
      loadingUploads: false,
      uploads: [],
      showEditor: false,
      selectedDocument: {
        title: ''
      },
      showDocumentEditor: '',
      type: 'others',
      form: {
        title: ''
      },
      docSrc: '',
      selectedTemplate: null,
      showUploadEvidenceModal: false
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  mounted() {
    // this.data = this.selectedData
    this.loadTask()
  },
  methods: {
    moment,
    disabledDate(time) {
      return time.getTime() <= Date.now() - 8.64e7 // Disable past dates
    },
    loadTask(load = true) {
      this.loader = load
      this.showEditor = false
      const evidenceResource = new Resource(`${this.selectedModule}/calendar/show-task`)
      evidenceResource
        .get(this.selectedData.id)
        .then((response) => {
          this.loader = false
          this.data = response.assigned_task
          this.uploads = response.evidences
          this.$emit('update:tasks', response.assigned_task)
          // send mail
        })
        .catch((error) => {
          this.loader = false
          console.log(error.response.data.message)
        })
    },
    uploadDocument(template) {
      this.showUploadEvidenceModal = true
      this.selectedTemplate = template
    },
    setView(upload) {
      this.showEditor = false
      this.selectedDocument = {
        title: '',
        type: ''
      }
      this.showDocumentEditor = ''
      this.docSrc = ''
      this.type = 'others' // this returns the file extension

      setTimeout(() => {
        this.selectedDocument = upload
        if (upload.link !== null) {
          this.type = upload.link.split('.').pop()
        } else {
          this.type = 'others'
        }
        this.selectedDocument.type = this.type
        this.docSrc = upload.link
        this.showEditor = true
        if (this.type === 'doc' || this.type === 'docx') {
          this.showDocumentEditor = 'word'
        } else if (this.type === 'csv' || this.type === 'xlsx' || this.type === 'xls') {
          this.showDocumentEditor = 'spreadsheet'
          // document.getElementById(`${this.type}-download`).click()
        } else {
          this.showDocumentEditor = 'others'
        }
      }, 10)
    },
    setDetails(assignedTask) {
      this.assignForm.module_activity_task_id = assignedTask.module_activity_task_id
      this.assignForm.recurrence = assignedTask.recurrence
      this.assignForm.assignee_id = assignedTask.assignee_id
      this.assignForm.start_date = assignedTask.start_date
      this.assignForm.end_date = assignedTask.end_date
      this.showAssignModal = true
    },
    fetchUploadedEvidiences() {
      if (this.data.document_template_ids !== null) {
        this.loadingUploads = true
        const evidenceResource = new Resource('uploads/fetch-uploaded-document-with-template-ids')
        evidenceResource
          .store({ template_ids: this.data.task.document_template_ids })
          .then((response) => {
            this.loadingUploads = false
            this.uploads = response.uploads
            // send mail
          })
          .catch((error) => {
            console.log(error.response.data.message)
            this.loadingUploads = false
          })
      }
    },
    assignTask() {
      const createTaskResource = new Resource(`${this.selectedModule}/calendar/assign-task-to-user`)
      const { assignForm } = this
      this.loader = true
      createTaskResource
        .store(assignForm)
        .then((response) => {
          this.assignForm = this.empty_form
          this.loadTask()
          this.$emit('update:tasks', response.assigned_task)
          this.showAssignModal = false
          this.loader = false

          this.$message('Task Assigned Successfully')
          // send mail
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.loader = false
        })
    },
    markTaskAsDone(taskId, index) {
      if (confirm('Click OK to mark this task as completed?')) {
        this.loader = true
        const fetchResource = new Resource(`${this.selectedModule}/calendar/mark-task-as-done`)
        fetchResource
          .update(taskId)
          .then((response) => {
            this.$message.success('Task marked as completed successfully')
            this.loadTask()
            this.loader = false
          })
          .catch((error) => {
            this.$alert(error.response.data.message)
            this.loader = false
          })
      }
      // Logic to mark the task as done
    },
    statusColor(status) {
      if (status === 'completed' || status === 'submitted') {
        return 'success'
      }
      if (status === 'in progress') {
        return 'warning'
      }
      return 'error'
    },
    reverseAssignedTask(assignedTask) {
      if (
        confirm(
          `This will reverse the task assigned to ${assignedTask.assignee.name}. Click OK continue`
        )
      ) {
        this.loader = true
        this.showRecurrentTask = false
        const fetchResource = new Resource(`${this.selectedModule}/calendar/undo-task-assignment`)
        fetchResource
          .destroy(assignedTask.id)
          .then((response) => {
            this.$message.success('Task assignment reversed successfully')
            this.loadTask()
            this.loader = false
            this.showRecurrentTask = true
          })
          .catch(() => {
            console.error('Failed to mark task as done')
          })
      }
    }
  }
}
</script>
