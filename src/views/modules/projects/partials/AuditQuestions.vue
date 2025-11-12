<template>
  <div v-if="showDocumentEditor !== 'none'">
    <div>
      <span class="pull-right">
        <el-button type="danger" class="btn-icon" size="mini" @click="showDocumentEditor = 'none'">
          <feather-icon icon="XIcon" />
        </el-button>
      </span>
    </div>
    <div>
      <vue-document-editor
        v-if="showDocumentEditor === 'word'"
        :document-path="selectedDocument.link"
        :document-title="selectedDocument.evidence_title"
      />
      <vue-spreadsheet-editor
        v-if="showDocumentEditor === 'spreadsheet'"
        :document-path="selectedDocument.link"
        :document-title="selectedDocument.evidence_title"
      />
    </div>
  </div>
  <div v-else v-loading="loading">
    <el-collapse accordion type="border">
      <el-collapse-item v-for="(clause, index) in clauses" :key="index" :title="clause.name">
        <template v-for="(question, question_index) in clause.questions" :key="question_index">
          <div>
            <div
              v-if="currenctQuestions[index] === question_index"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
              style="padding: 5px; border: 5px double #c0c0c0; border-radius: 8px"
            >
              <div>
                <span class="pull-right">
                  <el-button
                    size="mini"
                    variant="outline-danger"
                    @click="openRemarkModal(question.answer)"
                  >
                    <feather-icon icon="MessageSquareIcon" />
                    Consultant Remark </el-button
                  >&nbsp;
                  <!-- <el-popover
                      v-model="adminRemark"
                      placeholder="Give remark here..."
                      type="textarea"
                    />
                    <br>
                    <el-button
                      :loading="loadButton"
                      size="mini"
                      type="success"
                      :disabled="adminRemark === ''"
                      @click="saveRemark(question.answer.id, index, question_index)"
                    >
                      Submit
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    size="mini"
                    type="primary"
                  >
                    <feather-icon
                      icon="MessageSquareIcon"
                    />
                    Give Remark
                  </el-button>
                </el-popover> -->
                  <el-button
                    v-if="isAdmin"
                    variant="success"
                    @click="allowModification(clause.questions)"
                    ><feather-icon icon="ThumbsUpIcon" />
                    Enable Modification
                  </el-button>
                </span>
                <strong style="color: red">
                  Question {{ question_index + 1 }} of {{ clause.questions.length }}
                </strong>

                <div>
                  <button
                    v-if="question_index !== 0"
                    class="btn btn-danger btn-sm"
                    @click="change(question_index - 1, index)"
                  >
                    <feather-icon icon="ArrowLeftIcon" /> Prev
                  </button>
                  <button
                    v-if="parseInt(question_index + 1) < clause.questions.length"
                    class="btn btn-primary btn-sm"
                    style="margin-left: 1px"
                    @click="change(question_index + 1, index)"
                  >
                    Next
                    <feather-icon icon="ArrowRightIcon" />
                  </button>
                  <button
                    v-if="
                      parseInt(question_index + 1) === clause.questions.length &&
                      question.answer.is_submitted === 0 &&
                      selectedProject.is_completed === 0
                    "
                    class="btn btn-success btn-sm"
                    @click="submitAnswers(clause.questions)"
                    ><feather-icon icon="SaveIcon" />
                    Submit
                  </button>
                </div>
                <div>
                  <button
                    v-for="(quest_count, q_index) in clause.questions.length"
                    :key="q_index"
                    :class="`btn ${parseInt(question_index) === q_index ? 'btn-primary' : 'btn-dark'} btn-dark btn-sm`"
                    style="margin: 1px 1px 0 0"
                    @click="change(q_index, index)"
                  >
                    {{ quest_count }}
                  </button>
                </div>
                <div>
                  <button
                    v-for="(quest_count, q_index) in clause.questions.length"
                    :key="q_index"
                    :class="`btn ${parseInt(question_index) === q_index ? 'btn-primary' : 'btn-dark'} btn-dark btn-sm`"
                    style="margin: 1px 1px 0 0"
                    @click="change(q_index, index)"
                  >
                    {{ quest_count }}
                  </button>
                </div>
              </div>
              <hr />
              <el-row :gutter="5">
                <el-col :lg="16" :md="16" :sm="24" :xs="24">
                  <div v-if="showQuestions">
                    <Editor id="question" v-model="question.question" disabled />
                  </div>
                  <div v-if="question.answer.is_exception === 0" style="padding: 10px">
                    <div class="control-group">
                      <label class="control-label" for="inputEmail"></label>
                      <div class="controls">
                        <input v-model="question.id" type="hidden" />
                        <div>
                          <div v-if="question.answer.is_submitted === 0">
                            <div v-if="question.answer_type === 'yes-no'">
                              <el-radio-group
                                v-model="question.answer.yes_or_no"
                                @change="saveAnswer(question.answer, 'yes_or_no')"
                              >
                                <el-radio label="YES" border> YES </el-radio>
                                <el-radio label="NO" border> NO </el-radio>
                              </el-radio-group>
                            </div>
                            <div v-else-if="question.answer_type === 'open_ended'">
                              <el-input
                                v-model="question.answer.open_ended_answer"
                                type="textarea"
                                placeholder="Type your response here..."
                                style="width: 100%"
                                @blur="saveAnswer(question.answer, 'open_ended_answer')"
                              />
                            </div>
                            <div v-else>
                              <el-radio-group
                                v-model="question.answer.yes_or_no"
                                @change="saveAnswer(question.answer, 'yes_or_no')"
                              >
                                <el-radio label="YES" border> YES </el-radio>
                                <el-radio label="NO" border> NO </el-radio>
                              </el-radio-group>
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
                        <!-- <div v-else>
                          <strong>Response:</strong>&nbsp;{{ question.answer.yes_or_no }}<br><br>
                          {{ question.answer.open_ended_answer }}
                        </div> -->
                      </div>
                    </div>

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
                      <div>
                        <strong>Kindly justify why it is not applicable, then click on DONE</strong>
                        <el-input
                          v-model="exceptionReason"
                          placeholder="Type justification here..."
                          type="textarea"
                        />
                        <br /><br />
                        <el-button
                          :loading="loadButton"
                          size="mini"
                          type="success"
                          :disabled="exceptionReason === ''"
                          @click="
                            createException(clause.id, question.answer.id, index, question_index)
                          "
                        >
                          Done
                        </el-button>
                      </div>
                      <template v-slot:reference>
                        <el-button size="mini" type="danger">
                          Click if Control/Requirement is NOT APPLICABLE
                        </el-button>
                      </template>
                    </el-popover>
                  </div>
                  <div v-else>
                    <el-alert type="error" :closable="false">
                      <strong>Not Applicable</strong>. To undo, click on the
                      <code>EXCLUSIONS</code> tab and reverse it
                    </el-alert>
                    <!-- <el-alert
                      v-else
                      type="error"
                      :closable="false"
                    >
                      <strong>Not Applicable</strong>
                    </el-alert> -->
                  </div>
                  <!-- <div>
                  <div
                    v-if="question.answer.remark !== null"
                  >

                    <hr>
                    <strong>Remark on this response: </strong>
                    <div
                      style="padding: 5px; border: 2px solid #409EFF; border-radius: 8px; margin: 5px;"
                    >

                      {{ question.answer.remark }}
                    </div>
                  </div>
                  <hr>
                </div> -->
                </el-col>
                <el-col :lg="8" :md="8" :sm="24" :xs="24">
                  <div
                    v-if="question.upload_evidence === 1"
                    v-loading="loadDelete"
                    style="height: 300px; overflow: auto; background: #fcfcfc; padding: 10px"
                  >
                    <el-button
                      v-if="question.answer.is_submitted === 0"
                      variant="outline-secondary"
                      block
                      @click="addEvidence(question.answer.id)"
                    >
                      <feather-icon icon="UploadIcon" />
                      Click to upload evidence
                    </el-button>
                    <small> Uploaded Evidences </small>
                    <hr />
                    <el-alert
                      v-for="(evidence, evidence_index) in question.answer.evidences"
                      :key="evidence_index"
                      variant="primary"
                      show
                    >
                      <div class="alert-body">
                        <!-- <a
                          :href="baseServerUrl+'storage/'+evidence.link"
                          target="_blank"
                        >{{ evidence.evidence_title }}</a> -->
                        <small style="font-size: 11px">{{ evidence.evidence_title }}</small>
                        <span class="pull-right">
                          <el-dropdown>
                            <el-button variant="flat" class="btn-icon rounded-circle">
                              <i class="el-icon-more-outline"></i>
                            </el-button>
                            <template v-slot:dropdown>
                              <el-dropdown-menu>
                                <el-dropdown-item
                                  v-if="
                                    evidence.link.split('.').pop() === 'docx' ||
                                    evidence.link.split('.').pop() === 'doc'
                                  "
                                >
                                  <span @click="viewAndEditDocument(evidence, 'word')"
                                    >Edit Word Doc</span
                                  >
                                </el-dropdown-item>

                                <!-- <el-dropdown-item
                                v-if="evidence.link.split('.').pop() === 'xlsx' || evidence.link.split('.').pop() === 'xls'"
                              >
                                <span @click="viewAndEditDocument(evidence, 'spreadsheet')">Edit Spreadsheet</span>
                              </el-dropdown-item> -->
                                <el-dropdown-item>
                                  <a
                                    :href="baseServerUrl + 'storage/' + evidence.link"
                                    target="_blank"
                                    >Download
                                  </a>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                  <span @click="destroyGapAssessmentEvidence(evidence.id)"
                                    >Delete</span
                                  >
                                </el-dropdown-item>
                              </el-dropdown-menu>
                            </template>
                          </el-dropdown>
                        </span>
                      </div>
                    </el-alert>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </template>
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
      <el-dialog v-model="showModal" title="Upload Evidence" centered size="lg" hide-footer>
        <upload-gap-assessment-evidence
          :answer-id="selectedAnswer"
          @reload="fetchClausesWithQuestions"
        />
      </el-dialog>
    </el-collapse>
  </div>
</template>
<script>
import { Editor } from '@/components/Editor'
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
    VueSpreadsheetEditor,
    Editor
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
      clauses: [],
      currenctQuestions: {},
      currentQuestionsAreSet: false,
      showQuestions: true,
      current_question: 0,
      selectedAnswer: null,
      showRemarkModal: false,
      selectedAnswerForRemark: null,
      loadButton: false,
      loading: false,
      loadDelete: false,
      exceptionReason: '',
      adminRemark: '',
      showModal: false,
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      showDocumentEditor: 'none',
      selectedDocument: ''
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.fetchClausesWithQuestions()
  },
  methods: {
    setCurrentQuestions(clauses) {
      for (let index = 0; index < clauses.length; index++) {
        this.currenctQuestions[index] = 0
      }
      this.currentQuestionsAreSet = true
    },
    change(value, index) {
      if (Object.hasOwnProperty.call(this.currenctQuestions, index)) {
        this.currenctQuestions[index] = value
      }
      this.showQuestions = false
      setTimeout(() => {
        this.showQuestions = true
      }, 5)
    },
    openRemarkModal(selectedAnswer) {
      this.selectedAnswerForRemark = selectedAnswer
      this.showRemarkModal = !this.showRemarkModal
    },
    addEvidence(answerId) {
      this.selectedAnswer = answerId
      this.showModal = true
    },
    fetchClausesWithQuestions(load = true) {
      this.showRemarkModal = false
      this.loading = load
      const { client_id } = this.selectedProject
      const { standard_id } = this.selectedProject
      const { id } = this.selectedProject
      const fetchConsultingsResource = new Resource('clauses/fetch-clauses-with-questions')
      fetchConsultingsResource.list({ client_id, standard_id, project_id: id }).then((response) => {
        this.clauses = response.clauses
        if (!this.currentQuestionsAreSet) {
          this.setCurrentQuestions(this.clauses)
        }
        this.loading = false
      })
    },
    colorButton(index, current) {
      document.getElementById(`quest_button_${index}_${current}`).style.backgroundColor = '#ccc'
      // }
    },
    saveAnswer(answer, field) {
      // console.log(answer[field])
      const param = { answer: answer[field], field }
      const fetchConsultingsResource = new Resource('answers/update')
      fetchConsultingsResource.update(answer.id, param).then(() => {})
    },
    submitAnswers(questions) {
      const message =
        'Click OK to confirm submit action. You will not be able to modify responses once you submit'

      if (window.confirm(message)) {
        this.$message('Response Submitted. Background assessment is on going.')
        const answerIds = []
        questions.forEach((question) => {
          answerIds.push(question.answer.id)
        })
        const param = { answer_ids: answerIds, value: 1 }
        const submitAnswersResource = new Resource('answers/submit')
        submitAnswersResource.store(param).then(() => {
          this.fetchClausesWithQuestions()
          this.$emit('reloadAnalytics')
        })
      }
    },
    createException(clauseId, answerId, clauseIndex, questionIndex) {
      this.loadButton = true
      const param = {
        project_id: this.selectedProject.id,
        clause_id: clauseId,
        type: 'answer',
        answer_id: answerId,
        reason: this.exceptionReason
      }
      const createExceptionResource = new Resource('exceptions/create')
      createExceptionResource.store(param).then(() => {
        const clause = this.clauses[clauseIndex]
        clause.questions[questionIndex].answer.is_exception = 1
        this.loadButton = false
        this.$emit('reloadAnalytics')
      })
    },
    saveRemark(answerId, clauseIndex, questionIndex) {
      this.loadButton = true
      const remark = this.adminRemark
      const param = { remark }
      const saveRemarkResource = new Resource('answers/remark-on-answer')
      saveRemarkResource.update(answerId, param).then(() => {
        const clause = this.clauses[clauseIndex]
        clause.questions[questionIndex].answer.remark = remark
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
        const submitAnswersResource = new Resource('answers/submit')
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
        const destroyEvidenceResource = new Resource('answers/destroy-gap-assessment-evidence')
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
