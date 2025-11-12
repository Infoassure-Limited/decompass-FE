<template>
  <div v-if="showDocumentEditor !== 'none'">
    <div>
      <span class="pull-right">
        <el-button type="danger" class="btn-icon" size="mini" @click="showDocumentEditor = 'none'">
          <icon icon="XIcon" />
        </el-button>
      </span>
    </div>
    <div>
      <vue-document-editor
        v-if="showDocumentEditor === 'word'"
        :document-path="selectedDocument.link"
        :document-title="selectedDocument.template_title"
      />
      <vue-spreadsheet-editor
        v-if="showDocumentEditor === 'spreadsheet'"
        :document-path="selectedDocument.link"
        :document-title="selectedDocument.template_title"
      />
    </div>
  </div>
  <div v-else>
    <el-skeleton :loading="loading" :rows="5" animated />
    <el-collapse accordion type="border">
      <el-collapse-item v-for="(clause, index) in clauses" :key="index" :name="index">
        <template v-slot:title>
          <div>
            <div v-if="answer_completion_status !== null && answer_completion_status[clause.id]">
              <el-avatar
                v-if="answer_completion_status[clause.id][0].pending === 0"
                variant="light-success"
              >
                <icon icon="tabler:circle-check" size="20" color="green" />
              </el-avatar>
              <el-avatar v-else>
                <icon icon="tabler:alert-triangle" size="20" color="red" />
              </el-avatar>
              <strong style="font-size: 16px"
                >&nbsp;&nbsp;{{ `${clause.name} - ${clause.description}` }}</strong
              >
            </div>
            <div v-else>
              <el-avatar>
                <icon icon="tabler:alert-triangle" size="20" color="red" />
              </el-avatar>
              <strong style="font-size: 16px"
                >&nbsp;&nbsp;{{ `${clause.name} - ${clause.description}` }}</strong
              >
            </div>
          </div>
        </template>
        <el-container
          v-if="clause.sections.length > 0"
          style="height: 100%; border: 1px solid #eee; background: #fff"
        >
          <el-aside
            element-loading-text="loading assessment, please wait..."
            width="200px"
            style="padding: 1px !important"
          >
            <div>
              <el-menu>
                <el-submenu
                  v-for="(section, section_index) in clause.sections"
                  :key="section_index"
                  :index="`${index}-${section_index}`"
                >
                  <template v-slot:title>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="section.description"
                      placement="right"
                      :open-delay="500"
                    >
                      <strong>{{ section.name }}</strong>
                    </el-tooltip>
                  </template>
                  <el-button
                    v-if="userData.all_roles.includes('admin')"
                    type="text"
                    @click="assignQuestions(section.questions)"
                  >
                    <i class="el-icon-s-promotion"></i>
                    Assign Tasks
                  </el-button>
                  <template v-for="(selectedQuestion, quest_index) in section.questions">
                    <el-menu-item
                      v-if="
                        userData.id === selectedQuestion.answer.assignee_id ||
                        userData.all_roles.includes('admin') ||
                        isAdmin
                      "
                      :key="quest_index"
                      :index="`${index}-${section_index}-${quest_index}`"
                      style="cursor: pointer"
                      @click="
                        viewQuestions(selectedQuestion, section, section_index, clause.id, index)
                      "
                    >
                      <strong>
                        <i class="el-icon-caret-right"></i>

                        {{ `Question - #${selectedQuestion.id}` }}
                      </strong>
                    </el-menu-item>
                  </template>
                </el-submenu>
              </el-menu>
            </div>
          </el-aside>

          <el-container>
            <el-main v-loading="loadView">
              <div v-if="viewType === 'welcome'" align="center">
                <el-avatar variant="light-success" size="100">
                  <icon icon="HelpCircleIcon" size="70" />
                </el-avatar>
                <p>Click on a Section to access the Complaince Questions</p>
              </div>
              <div v-if="viewType === 'load'" align="center">
                <h3>Question loading...</h3>
              </div>
              <div v-if="selectedClauseId === clause.id">
                <div v-if="question !== null">
                  <div>
                    <div>
                      <em
                        ><h5>{{ selectedSection.name }} - {{ selectedSection.description }}</h5></em
                      >
                    </div>
                  </div>
                  <div
                    v-if="
                      userData.id === question.answer.assignee_id ||
                      userData.all_roles.includes('admin') ||
                      isAdmin
                    "
                  >
                    <div
                      class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                      style="
                        margin-top: 15px;
                        padding: 5px;
                        border: 5px double #c0c0c0;
                        border-radius: 8px;
                      "
                    >
                      <span
                        v-if="userData.all_roles.includes('admin')"
                        style="cursor: pointer"
                        @click="assignQuestions([question])"
                      >
                        <el-alert
                          v-if="question.answer.assignee !== null"
                          type="success"
                          :closable="false"
                          center
                          show-icon
                          :title="`Assigned to ${question.answer.assignee.name}`"
                          description="Click to reassign a personnel"
                        />
                        <el-alert
                          v-else
                          type="warning"
                          :closable="false"
                          center
                          show-icon
                          title="Not Assigned"
                          description="Click to assign a personnel"
                        />
                      </span>
                      <span v-else>
                        <el-alert
                          v-if="question.answer.assignee !== null"
                          type="success"
                          :closable="false"
                          center
                          show-icon
                          :title="`Assigned to ${question.answer.assignee.name}`"
                        />
                        <el-alert
                          v-else
                          type="warning"
                          :closable="false"
                          center
                          show-icon
                          title="Not Assigned"
                        />
                      </span>
                      <div>
                        <span class="pull-right">
                          <el-button
                            v-if="
                              userData.all_roles.includes('admin') &&
                              question.answer.is_submitted === 1
                            "
                            type="success"
                            size="sm"
                            @click="allowModification([question])"
                            ><icon icon="tabler:thumb-up" />
                            Enable Modification
                          </el-button>
                          <!-- <el-dropdown>
                            <el-button
                              variant="flat"
                              class="btn-icon rounded-circle"
                            >
                              <icon
                                icon="MoreVerticalIcon"
                                size="25"
                              />
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item>
                                <span @click="openRemarkModal(question.answer)"><icon icon="MessageSquareIcon" /> View Remarks</span>
                              </el-dropdown-item>
                              <el-dropdown-item v-if="userData.all_roles.includes('admin') && question.answer.is_submitted === 1">
                                <span @click="allowModification(questions);"><icon icon="ThumbsUpIcon" /> Enable Modification</span>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown> -->
                        </span>

                        <div v-if="userData.id === question.answer.assignee_id">
                          <el-button
                            v-if="
                              question.answer.is_submitted === 0 &&
                              selectedProject.is_completed === 0
                            "
                            variant="primary"
                            size="sm"
                            @click="submitAnswers([question])"
                            ><icon icon="tabler:device-floppy" />
                            Submit
                          </el-button>
                          <el-button v-else variant="outline-secondary" size="sm"
                            ><icon icon="tabler:device-floppy" />
                            Submit
                          </el-button>
                        </div>
                        <div v-else>
                          <el-tag
                            v-if="question.answer.is_submitted === 0"
                            type="danger"
                            effect="plain"
                            :closable="false"
                            >Status: Not Submitted</el-tag
                          >
                          <el-tag v-else type="success" effect="plain" :closable="false"
                            >Status: Submitted</el-tag
                          >
                        </div>
                      </div>
                      <hr />
                      <el-row :gutter="5">
                        <el-col :lg="15" :md="15" :sm="24" :xs="24">
                          <div
                            v-if="showQuestions"
                            style="
                              background: #000000;
                              color: #ffffff;
                              padding: 10px;
                              border-radius: 5px;
                            "
                          >
                            <!-- eslint-disable-next-line vue/no-v-html -->
                            <span v-html="question.question"></span>
                            <em>{{ question.hint !== null ? `Hint: ${question.hint}` : '' }}</em>
                          </div>
                          <div v-if="question.answer.is_exception === 0" style="padding: 10px">
                            <div class="control-group">
                              <label class="control-label" for="inputEmail"></label>
                              <div class="controls">
                                <input v-model="question.id" type="hidden" />
                                <div>
                                  <div
                                    v-if="
                                      userData.id === question.answer.assignee_id &&
                                      question.answer.is_submitted === 0
                                    "
                                  >
                                    <div v-if="question.answer.assignee_id !== null">
                                      <el-radio-group
                                        v-model="question.answer.yes_or_no"
                                        @change="saveAnswer(question.answer, 'yes_or_no')"
                                      >
                                        <el-radio label="YES" border> YES </el-radio>
                                        <el-radio label="NO" border> NO </el-radio>
                                      </el-radio-group>
                                      <el-popover
                                        v-if="
                                          question.answer.is_exception === 0 &&
                                          selectedProject.is_completed === 0 &&
                                          question.can_have_exception === 1
                                        "
                                        placement="right"
                                        width="400"
                                        trigger="click"
                                      >
                                        <div
                                          style="
                                            background: #000000;
                                            color: #ffffff;
                                            padding: 10px;
                                            text-align: left;
                                            border-radius: 5px;
                                          "
                                        >
                                          <strong
                                            >Kindly justify why it is not applicable, then click on
                                            OK</strong
                                          >
                                          <el-input
                                            v-model="exceptionReason"
                                            placeholder="Type justification here..."
                                            type="textarea"
                                          />
                                          <br /><br />
                                          <el-button
                                            :loading="loadButton"
                                            size="mini"
                                            type="primary"
                                            plain
                                            :disabled="exceptionReason === ''"
                                            @click="createException(clause.id, question.answer.id)"
                                          >
                                            OK
                                          </el-button>
                                        </div>
                                        <template v-slot:reference>
                                          <el-button type="default" style="margin-left: 10px">
                                            NOT APPLICABLE
                                          </el-button>
                                        </template>
                                      </el-popover>
                                      <br />
                                      <el-input
                                        v-model="question.answer.open_ended_answer"
                                        type="textarea"
                                        placeholder="Give some details here..."
                                        style="width: 100%"
                                        @blur="saveAnswer(question.answer, 'open_ended_answer')"
                                      />
                                      <hr />
                                    </div>
                                  </div>
                                  <div v-else>
                                    <strong>Response:</strong>&nbsp;{{ question.answer.yes_or_no
                                    }}<br /><br />
                                    {{ question.answer.open_ended_answer }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else>
                            <el-alert type="error" :closable="false">
                              <strong>Not Applicable</strong>. To undo, click on the
                              <code>EXCLUSIONS</code> tab and reverse it
                            </el-alert>
                          </div>
                        </el-col>
                        <el-col :lg="9" :md="9" :sm="24" :xs="24">
                          <div
                            v-if="question.expected_document_template_ids.length > 0"
                            v-loading="loadDelete"
                            style="
                              max-height: 250px;
                              overflow: auto;
                              background: #fcfcfc;
                              padding: 10px;
                              border-radius: 8px;
                            "
                          >
                            <h4
                              >Expected Evidences ({{
                                question.expected_document_template_ids.length
                              }})</h4
                            >
                            <el-list-group>
                              <el-list-group-item
                                v-for="(
                                  template_id, template_index
                                ) in question.expected_document_template_ids"
                                :key="template_index"
                              >
                                <div v-if="uploads !== null">
                                  <small style="font-weight: 900">{{
                                    uploads[template_id][0].template_title
                                  }}</small>
                                  <span class="pull-right">
                                    <el-badge
                                      v-if="uploads[template_id][0].link !== null"
                                      variant="success"
                                    >
                                      <icon icon="tabler:alert-circle" />
                                    </el-badge>
                                    <el-badge v-else variant="danger">
                                      <icon icon="tabler:alert-circle" />
                                    </el-badge>
                                    <el-dropdown>
                                      <el-button variant="flat" circle>
                                        <icon icon="tabler:dots-vertical" />
                                        <!-- <icon
                                    icon="MoreHorizontalIcon"
                                  /> -->
                                      </el-button>
                                      <template v-slot:dropdown>
                                        <el-dropdown-menu>
                                          <el-dropdown-item>
                                            <a
                                              :href="
                                                baseServerUrl +
                                                'storage/' +
                                                uploads[template_id][0].template_link
                                              "
                                              target="_blank"
                                              ><icon icon="DownloadIcon" /> Download Template
                                            </a>
                                          </el-dropdown-item>
                                          <el-dropdown-item
                                            v-if="uploads[template_id][0].link !== null"
                                          >
                                            <a
                                              :href="
                                                baseServerUrl +
                                                'storage/' +
                                                uploads[template_id][0].link
                                              "
                                              target="_blank"
                                              ><icon icon="DownloadIcon" /> Download Evidence
                                            </a>
                                          </el-dropdown-item>
                                          <template
                                            v-if="
                                              userData.id === question.answer.assignee_id ||
                                              userData.all_roles.includes('admin')
                                            "
                                          >
                                            <el-dropdown-item
                                              v-if="uploads[template_id][0].link === null"
                                            >
                                              <span @click="addEvidence(uploads[template_id][0])"
                                                ><icon icon="UploadIcon" /> Upload Evidence</span
                                              >
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                              v-if="
                                                uploads[template_id][0].link !== null &&
                                                (uploads[template_id][0].link.split('.').pop() ===
                                                  'docx' ||
                                                  uploads[template_id][0].link.split('.').pop() ===
                                                    'doc')
                                              "
                                            >
                                              <span
                                                @click="
                                                  viewAndEditDocument(
                                                    uploads[template_id][0],
                                                    'word'
                                                  )
                                                "
                                                ><icon icon="EditIcon" /> Update Evidence</span
                                              >
                                            </el-dropdown-item>

                                            <el-dropdown-item
                                              v-if="
                                                uploads[template_id][0].link !== null &&
                                                (uploads[template_id][0].link.split('.').pop() ===
                                                  'xlsx' ||
                                                  uploads[template_id][0].link.split('.').pop() ===
                                                    'xls')
                                              "
                                            >
                                              <span
                                                @click="
                                                  viewAndEditDocument(
                                                    uploads[template_id][0],
                                                    'spreadsheet'
                                                  )
                                                "
                                                ><icon icon="EditIcon" /> Update Evidence</span
                                              >
                                            </el-dropdown-item>
                                          </template>

                                          <!-- <el-dropdown-item v-if="uploads[template_id][0].link !== null">
                                    <span @click="destroyGapAssessmentEvidence(uploads[template_id][0].id)"><icon icon="TrashIcon" /> Delete Evidence</span>
                                  </el-dropdown-item> -->
                                        </el-dropdown-menu>
                                      </template>
                                    </el-dropdown>
                                  </span>
                                </div>
                              </el-list-group-item>
                            </el-list-group>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row v-if="question.answer.is_submitted === 1">
                        <el-col :md="24">
                          <give-gap-assessment-remarks
                            :answer="question.answer"
                            :is-admin="userData.all_roles.includes('admin')"
                            @reload="fetchClausesWithQuestions"
                          />
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-container>
      </el-collapse-item>
      <el-dialog
        v-model="showRemarkModal"
        title="Consultant Remarks"
        centered
        size="md"
        hide-footer
      >
        <give-gap-assessment-remarks
          v-model="showRemarkModal"
          :answer="selectedAnswerForRemark"
          :is-admin="isAdmin"
          @reload="fetchClausesWithQuestions"
        />
      </el-dialog>
      <el-dialog
        v-model="showAssigneeModal"
        title="Assign Tasks To Personnel(s)"
        centered
        size="xl"
        hide-footer
      >
        <div v-loading="loadingTaskAssignment">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Task (Question)</th>
                <th>Personnel</th>
                <th>Deadline</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(answer, ansIndex) in selectedAnswers" :key="ansIndex">
                <td>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="answer.question"></span>
                </td>
                <td>
                  <el-select
                    v-model="answer.assignee_id"
                    placeholder="Select Personnel"
                    value-key="id"
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(user, user_index) in clientUsers"
                      :key="user_index"
                      :value="user.id"
                      :label="user.name"
                    />
                  </el-select>
                </td>
                <td>
                  <el-date-picker
                    v-model="answer.end_date"
                    placeholder="Select Due Date"
                    :picker-options="pickerOptions"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                  />
                </td>
                <td>
                  <el-input
                    v-model="answer.comment"
                    placeholder="Give more clarification on what is expected of the assignee"
                    type="textarea"
                    style="width: 100%"
                  />
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  <el-button @click="assignUserToRespond()"> Submit </el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-dialog>
      <el-dialog
        v-if="showModal"
        v-model="showModal"
        :title="`Kindly upload your ${selectedUploadTemplate.template_title}`"
        centered
        size="lg"
        hide-footer
      >
        <upload-gap-assessment-evidence
          :upload-template="selectedUploadTemplate"
          @reload="(fetchClausesWithQuestions(), (showModal = false))"
        />
      </el-dialog>
      <el-dialog
        v-if="enableDocumentuploadModal"
        v-model="enableDocumentuploadModal"
        title="Kindly upload the Expected Evidences"
        centered
        size="lg"
        hide-footer
      >
        <el-list-group v-if="pendingDocuments.length > 0">
          <el-list-group-item
            v-for="(pendingDocument, p_d_index) in pendingDocuments"
            :key="p_d_index"
          >
            <div>
              <small style="font-weight: 900">{{ pendingDocument.template_title }}</small>
              <span class="pull-right">
                <el-tooltip content="Click to upload" placement="top">
                  <el-button
                    variant="gradient-success"
                    class="btn-icon"
                    @click="addEvidence(pendingDocument)"
                  >
                    <icon icon="UploadIcon" />
                  </el-button>
                </el-tooltip>
              </span>
            </div>
          </el-list-group-item>
        </el-list-group>
        <el-button v-else variant="gradient-secondary" @click="enableDocumentuploadModal = false">
          <icon icon="XIcon" /> Click to close
        </el-button>
      </el-dialog>
    </el-collapse>
  </div>
</template>
<script>
import moment from 'moment'
import UploadGapAssessmentEvidence from './UploadGapAssessmentEvidence.vue'
import GiveGapAssessmentRemarks from './GiveGapAssessmentRemarks.vue'
import VueDocumentEditor from '@/views/Components/editors/VueDocumentEditor.vue'
import VueSpreadsheetEditor from '@/views/Components/editors/VueSpreadsheetEditor.vue'
import Resource from '@/api/resource'

export default {
  components: {
    UploadGapAssessmentEvidence,
    GiveGapAssessmentRemarks,
    VueDocumentEditor,
    VueSpreadsheetEditor
  },
  props: {
    selectedProject: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      },
      clauses: [],
      questions: [],
      question: null,
      answer_completion_status: null,
      uploads: null,
      currenctQuestions: {},
      currentQuestionsAreSet: false,
      showQuestions: true,
      current_question: 0,
      selectedUploadTemplate: null,
      showRemarkModal: false,
      selectedAnswerForRemark: null,
      loadButton: false,
      loading: false,
      loadDelete: false,
      exceptionReason: '',
      adminRemark: '',
      showModal: false,
      showDocumentEditor: 'none',
      selectedDocument: '',
      clientUsers: [],
      assigneeForm: {
        user: null,
        userId: '',
        end_date: '',
        formerAssignee: ''
      },
      selectedAnswers: [],
      selectedAnswerId: '',
      showAssigneeModal: false,
      loadingTaskAssignment: false,
      pendingDocuments: [],
      enableDocumentuploadModal: false,
      selectedQuestionsforSubmission: [],
      loadView: false,
      viewType: 'welcome',
      selectedSection: null,
      selectedSectionIndex: null,
      selectedClauseId: null,
      selectedClauseIndex: null
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    userData() {
      return this.$store.getters.userData
    }
  },
  created() {
    this.fetchClausesWithQuestions()
    if (this.userData.all_roles.includes('admin')) {
      this.fetchClientUsers()
    }
  },
  methods: {
    moment,
    viewQuestions(selectedQuestion, section, sectionIndex, clauseId, clauseIndex) {
      this.viewType = 'load'
      this.question = null
      this.loadView = true
      this.selectedClauseId = clauseId
      this.selectedClauseIndex = clauseIndex
      this.selectedSectionIndex = sectionIndex
      this.selectedSection = section
      setTimeout(() => {
        this.question = selectedQuestion
        this.loadView = false
        this.viewType = 'question'
      }, 10)
    },
    openRemarkModal(selectedAnswer) {
      this.selectedAnswerForRemark = selectedAnswer
      this.showRemarkModal = !this.showRemarkModal
    },
    addEvidence(uploadTemplate) {
      this.selectedUploadTemplate = uploadTemplate
      this.showModal = true
    },
    fetchClausesWithQuestions(load = true) {
      this.showRemarkModal = false
      this.loading = load
      const { client_id } = this.selectedProject
      const { standard_id } = this.selectedProject
      const { id } = this.selectedProject
      const fetchConsultingsResource = new Resource('ndpa/clauses/fetch-clauses-with-questions')
      fetchConsultingsResource.list({ client_id, standard_id, project_id: id }).then((response) => {
        this.clauses = response.clauses
        this.answer_completion_status = response.answer_completion_status
        this.uploads = response.uploads
        // we need to do this to reload the questions after any action was taken
        if (this.selectedClauseIndex !== null) {
          this.questions =
            this.clauses[this.selectedClauseIndex].sections[this.selectedSectionIndex].questions
        }
        // we want to check for any evidence that are yet pending so that the modal will be updated
        this.checkForPendingDocumentUpload()
        this.loading = false
      })
    },
    fetchClientUsers() {
      const fetchConsultingsResource = new Resource('clients/users')
      fetchConsultingsResource.list().then((response) => {
        this.clientUsers = response.users
      })
    },
    saveAnswer(answer, field) {
      // console.log(answer[field])
      const param = { answer: answer[field], field }
      const fetchConsultingsResource = new Resource('ndpa/answers/update')
      fetchConsultingsResource.update(answer.id, param).then(() => {})
    },
    assignQuestions(questions) {
      const selectedAnswers = []
      questions.forEach((question) => {
        selectedAnswers.push({
          question: question.question,
          id: question.answer.id,
          assignee_id: question.answer.assignee_id,
          end_date: question.answer.end_date,
          comment: ''
        })
      })

      this.selectedAnswers = selectedAnswers
      // this.assigneeForm.user = answer.assignee
      // this.assigneeForm.userId = answer.assignee_id
      // this.assigneeForm.formerAssignee = (answer.assignee) ? answer.assignee.name : ''
      this.showAssigneeModal = true
    },
    assignSection() {},
    assignUserToRespond() {
      // console.log(answer[field])
      this.$confirm(
        'This will unassign the previous personnel from the task. Continue?',
        'Warning',
        {
          confirmButtonText: 'Yes, Continue',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          this.loadingTaskAssignment = true
          const param = { answers: this.selectedAnswers }
          const fetchConsultingsResource = new Resource('ndpa/answers/assign-user-to-respond')
          fetchConsultingsResource
            .store(param)
            .then(() => {
              this.fetchClausesWithQuestions(false)
              // this.question.answer.assignee = this.assigneeForm.user
              this.$message('Task assigned successfully')
              this.showAssigneeModal = false
              this.loadingTaskAssignment = false
            })
            .catch(() => {
              this.loadingTaskAssignment = false
              this.$message({
                type: 'danger',
                message: 'An error occured'
              })
            })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Action canceled',
          // })
        })
    },
    checkForPendingDocumentUpload() {
      const questions = this.selectedQuestionsforSubmission
      if (questions.length > 0) {
        const pendingDocuments = []
        questions.forEach((question) => {
          const templateIds = question.expected_document_template_ids
          templateIds.forEach((templateId) => {
            const { link } = this.uploads[templateId][0]
            if (link === null) {
              pendingDocuments.push(this.uploads[templateId][0])
            }
          })
        })
        this.pendingDocuments = pendingDocuments
        return pendingDocuments
      }
      return false
    },
    uploadPendingDocuments(documents) {
      this.pendingDocuments = documents
      this.enableDocumentuploadModal = true
    },
    submitAnswers(questions) {
      const answerIds = []
      let noAnswer = 0
      questions.forEach((question) => {
        answerIds.push(question.answer.id)
        if (
          question.answer.yes_or_no === null &&
          question.answer.open_ended_answer === null &&
          question.answer.is_exception === 0
        ) {
          noAnswer += 1
        }
      })

      if (noAnswer > 0) {
        this.$alert('Please respond to the question', 'No Response')
        return
      }
      this.selectedQuestionsforSubmission = questions
      const pendingDocuments = this.checkForPendingDocumentUpload()

      if (pendingDocuments.length > 0) {
        this.uploadPendingDocuments(pendingDocuments)
        return
      }

      const message =
        'Click OK to confirm submit action. You will not be able to modify responses once you submit'

      if (window.confirm(message)) {
        this.$message('Response Submitted. Background assessment is on going.')
        const param = { answer_ids: answerIds, value: 1 }
        const submitAnswersResource = new Resource('ndpa/answers/submit')
        submitAnswersResource.store(param).then((response) => {
          this.viewType = 'load'
          // this.fetchClausesWithQuestions(false)
          setTimeout(() => {
            this.question = response.question
            this.viewType = 'question'
          }, 10)
          this.$emit('reloadAnalytics')
        })
      }
    },
    createException(clauseId, answerId) {
      this.loadButton = true
      const param = {
        project_id: this.selectedProject.id,
        clause_id: clauseId,
        type: 'answer',
        answer_id: answerId,
        reason: this.exceptionReason
      }
      const createExceptionResource = new Resource('ndpa/exceptions/create')
      createExceptionResource.store(param).then(() => {
        this.question.answer.is_exception = 1
        this.loadButton = false
        this.$emit('reloadAnalytics')
      })
    },
    saveRemark(answerId, clauseIndex, questionIndex) {
      this.loadButton = true
      const remark = this.adminRemark
      const param = { remark }
      const saveRemarkResource = new Resource('ndpa/answers/remark-on-answer')
      saveRemarkResource.update(answerId, param).then(() => {
        this.questions[questionIndex].answer.remark = remark
        this.loadButton = false
        this.adminRemark = ''
      })
    },
    allowModification(questions) {
      const message = 'Click OK to confirm that you allow the modification of this response'

      if (window.confirm(message)) {
        const answerIds = []
        questions.forEach((question) => {
          answerIds.push(question.answer.id)
        })
        const param = { answer_ids: answerIds, value: 0 }
        const submitAnswersResource = new Resource('ndpa/answers/submit')
        submitAnswersResource.store(param).then(() => {
          this.$message('Modification Enabled')
          this.fetchClausesWithQuestions()
          this.$emit('reloadAnalytics')
        })
      }
    },
    destroyGapAssessmentEvidence(id) {
      if (
        window.confirm('Are you sure you want to delete this document? This cannot be recovered')
      ) {
        this.loadDelete = true
        const destroyEvidenceResource = new Resource('ndpa/answers/destroy-gap-assessment-evidence')
        destroyEvidenceResource
          .destroy(id)
          .then(() => {
            this.fetchClausesWithQuestions(false)
            this.$message('Document Deleted')
            this.loadDelete = false
          })
          .catch((e) => {
            this.loadDelete = false
            this.$message(e.response.message)
          })
      }
    },
    viewAndEditDocument(data, type) {
      this.selectedDocument = data
      this.showDocumentEditor = type
    }
  }
}
</script>
