<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <div v-if="showDocumentEditor !== 'none'">
      <span class="pull-right">
        <el-button type="danger" class="btn-icon" size="mini" @click="showDocumentEditor = 'none'">
          <feather-icon icon="XIcon" />
        </el-button>
      </span>
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
    <div v-else>
      <div class="flex">
        <el-tooltip content="Enable vendor to make modification to response" placement="bottom">
          <el-button
            v-if="isAdmin && questions[0].is_submitted === 1"
            type="success"
            @click="allowModification(questions)"
            ><icon icon="tabler:list-check" />
            Enable Modification
          </el-button>
        </el-tooltip>
        &nbsp;
        <el-select
          v-if="isAdmin && questions[0].is_submitted === 1"
          v-model="questions[0].status"
          placeholder="Change Status"
          @change="changeStatus($event, questions)"
        >
          <el-option
            v-for="(status, index) in statuses"
            :key="index"
            :value="status"
            :label="status"
          />
        </el-select>
        &nbsp;
        <el-tag
          v-if="questions[0].is_submitted === 1 && questions[0].status === null"
          plain
          round
          type="default"
        >
          Status: Submitted
        </el-tag>
        <el-tag
          v-else
          plain
          round
          :type="
            questions[0].status === 'Closed'
              ? 'success'
              : questions[0].status === 'Work In Progress'
                ? 'warning'
                : 'danger'
          "
        >
          Status: {{ questions[0].status ? questions[0].status : 'Open' }}
        </el-tag>
      </div>
      &nbsp;
      <div v-for="(question, question_index) in questions" :key="question_index">
        <div
          v-if="currenctQuestion === question_index"
          class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          style="padding: 5px; border: 5px double #c0c0c0; border-radius: 8px"
        >
          <div>
            <strong style="color: red">
              Question {{ question_index + 1 }} of {{ questions.length }}
            </strong>

            <div>
              <button
                v-if="question_index !== 0"
                class="btn btn-danger btn-sm"
                @click="change(question_index - 1)"
              >
                <feather-icon icon="ArrowLeftIcon" /> Prev
              </button>
              <button
                v-if="parseInt(question_index + 1) < questions.length"
                class="btn btn-primary btn-sm"
                @click="change(question_index + 1)"
              >
                Next
                <feather-icon icon="ArrowRightIcon" />
              </button>
              <button
                v-if="
                  !isAdmin &&
                  parseInt(question_index + 1) === questions.length &&
                  question.is_submitted === 0
                "
                class="btn btn-success btn-sm"
                @click="submitAnswers(questions)"
                ><feather-icon icon="SaveIcon" />
                Submit
              </button>
            </div>
          </div>
          <hr />
          <el-row v-loading="loading" :gutter="5">
            <el-col :lg="16" :md="16" :sm="24" :xs="24">
              <div
                v-if="showQuestions"
                style="background: #f0f0f0; padding: 10px; margin-bottom: 5px; border-radius: 5px"
              >
                <!--eslint-disable-next-line vue/no-v-html-->
                <span v-html="question.question"></span>
              </div>
              <el-tooltip
                v-if="question.key !== null"
                class="item"
                :content="question.key"
                placement="bottom"
              >
                <el-button>Key/Insight</el-button>
              </el-tooltip>
              <div style="padding: 10px">
                <div class="control-group">
                  <label class="control-label" for="inputEmail"></label>
                  <div class="controls">
                    <input v-model="question.id" type="hidden" />
                    <div v-if="!isAdmin">
                      <div v-if="question.is_submitted === 0">
                        <div>
                          <el-radio-group
                            v-if="
                              question.answer_type === 'yes-no' || question.answer_type === 'both'
                            "
                            v-model="question.answer"
                            @change="saveAnswer(question, 'answer')"
                          >
                            <el-radio label="YES" border> YES </el-radio>
                            <el-radio label="NO" border> NO </el-radio>
                            <el-radio label="NA" border> NOT APPLICABLE </el-radio>
                          </el-radio-group>
                          <br />
                          <div v-if="question.answer === 'NA'">
                            <el-alert type="error" :closable="false">
                              Kindly give reasons why this is NOT APPLICABLE
                            </el-alert>
                            <el-input
                              v-model="question.detailed_explanation"
                              type="textarea"
                              placeholder="Type reasons here..."
                              style="width: 100%"
                              @blur="saveAnswer(question, 'detailed_explanation')"
                            />
                          </div>
                          <div v-else>
                            <el-input
                              v-if="
                                question.answer_type === 'open-ended' ||
                                question.answer_type === 'both'
                              "
                              v-model="question.detailed_explanation"
                              type="textarea"
                              placeholder="Give some detailed response here..."
                              style="width: 100%"
                              @blur="saveAnswer(question, 'detailed_explanation')"
                            />
                          </div>
                          <hr />
                        </div>
                      </div>
                      <div v-else>
                        <strong>Response:</strong>&nbsp;{{ question.answer }}<br /><br />
                        {{ question.detailed_explanation }}
                      </div>
                    </div>
                    <div v-else>
                      <strong>Response:</strong>&nbsp;{{ question.answer }}<br /><br />
                      {{ question.detailed_explanation }}
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col v-if="question.upload_evidence === 1" :lg="8" :md="8" :sm="24" :xs="24">
              <div style="max-height: 300px; overflow: auto; background: #fcfcfc; padding: 10px">
                <el-button
                  v-if="!isAdmin && question.is_submitted === 0"
                  type="gradient-dark"
                  block
                  @click="addEvidence(question.id)"
                >
                  <feather-icon icon="UploadIcon" />
                  Upload Evidence
                </el-button>
                <div v-else> Uploaded Evidences </div>
                <hr />
                <el-alert
                  v-for="(evidence, evidence_index) in question.evidences"
                  :key="evidence_index"
                  show
                  :closable="false"
                >
                  <div v-loading="loadDelete">
                    <!-- <a
                              :href="baseServerUrl+'storage/'+evidence.link"
                              target="_blank"
                            >{{ evidence.evidence_title }}</a> -->
                    <small style="font-size: 11px">{{ evidence.evidence_title }}</small>
                    <span class="pull-right">
                      <el-dropdown>
                        <el-button type="text" circle>
                          <icon icon="tabler:dots-vertical" />
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
                              <a :href="baseServerUrl + 'storage/' + evidence.link" target="_blank"
                                >Download
                              </a>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="!isAdmin && question.is_submitted === 0">
                              <span @click="destroyDueDiligenceEvidence(evidence.id)">Delete</span>
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

          <el-row v-if="isAdmin && question.is_submitted === 1">
            <el-col v-if="question.risk_assessment !== null" :md="24">
              <edit-risk-assessment
                :risk-assessment="question.risk_assessment"
                :details="question"
                @updated="$message('Assessment Submitted')"
              />
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- <give-due-diligence-remarks
        v-if="showRemarkModal"
        v-model="showRemarkModal"
        :answer="selectedAnswerForRemark"
        :is-admin="isAdmin"
        @reload="fetchQuestionsWithResponse"
      /> -->
      <el-dialog v-model="showModal" title="Upload Evidence" centered size="lg" hide-footer>
        <upload-due-diligence-evidence :answer-id="selectedAnswer" @reload="$emit('submitted')" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import UploadDueDiligenceEvidence from '../../UploadDueDiligenceEvidence.vue'
import EditRiskAssessment from './EditRiskAssessment.vue'
// import GiveDueDiligenceRemarks from '../../GiveDueDiligenceRemarks.vue'
import VueDocumentEditor from '@/views/Components/editors/VueDocumentEditor.vue'
import VueSpreadsheetEditor from '@/views/Components/editors/VueSpreadsheetEditor.vue'
import Resource from '@/api/resource'

export default {
  components: {
    UploadDueDiligenceEvidence,
    EditRiskAssessment,
    // GiveDueDiligenceRemarks,
    VueDocumentEditor,
    VueSpreadsheetEditor
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: () => false
    },
    vendorId: {
      type: Number,
      required: true
    },
    questions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      domains: [],
      clients: [],
      currenctQuestion: 0,
      currentQuestionsAreSet: false,
      showQuestions: true,
      selectedAnswer: null,
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
      risk_scores: [
        { value: 1, label: '1-Low' },
        { value: 2, label: '2-Medium' },
        { value: 3, label: '3-High' }
      ],
      statuses: ['Open', 'Work In Progress', 'Closed']
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  mounted() {
    // this.fetchQuestionsWithResponse()
  },
  methods: {
    openRemarkModal(selectedAnswer) {
      this.selectedAnswerForRemark = selectedAnswer
      this.showRemarkModal = true
    },
    addEvidence(answerId) {
      this.selectedAnswer = answerId
      this.showModal = true
    },
    colorButton(index, current) {
      document.getElementById(`quest_button_${index}_${current}`).style.backgroundColor = '#ccc'
      // }
    },
    change(value) {
      this.currenctQuestion = value
      this.showQuestions = false
      setTimeout(() => {
        this.showQuestions = true
      }, 5)
    },
    fetchQuestionsWithResponse(load = true) {
      this.showRemarkModal = false
      this.loading = load
      const fetchQuestionsWithResponseResource = new Resource('vdd/responses/fetch')
      fetchQuestionsWithResponseResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.domains = response.domains
          if (!this.currentQuestionsAreSet) {
            this.setCurrentQuestions(this.domains)
          }
          this.loading = false
        })
    },
    saveAnswer(answer, field) {
      console.log(answer[field])
      const param = { answer: answer[field], field }
      const fetchConsultingsResource = new Resource('vdd/answers/update')
      fetchConsultingsResource.vUpdate(answer.id, param).then(() => {})
    },

    saveAssessment(answer, field) {
      console.log(answer[field])
      const param = { answer: answer[field], field }
      const fetchConsultingsResource = new Resource('vdd/responses/update')
      fetchConsultingsResource.update(answer.id, param).then(() => {})
    },
    submitAnswers(domains) {
      const message =
        'Click OK to confirm submit action. You will not be able to modify responses once you submit'

      if (window.confirm(message)) {
        this.$message('Response is submitted')
        const answerIds = []
        domains.forEach((response) => {
          answerIds.push(response.id)
        })
        this.loading = true
        const param = { answer_ids: answerIds, value: 1 }
        const submitAnswersResource = new Resource('vdd/answers/submit')
        submitAnswersResource.vStore(param).then(() => {
          this.$emit('submitted')
          this.$emit('reloadAnalytics')
          this.loading = false
        })
      }
    },
    changeStatus(value, questions) {
      const message = `Click OK to confirm that you want to set the status to  ${value}`

      if (window.confirm(message)) {
        const answerIds = []
        questions.forEach((question) => {
          answerIds.push(question.id)
        })
        const param = { answer_ids: answerIds, value }
        const submitAnswersResource = new Resource('vdd/responses/change-status')
        submitAnswersResource.store(param).then(() => {
          this.$message('Status Changed')
          this.$emit('submitted')
        })
      }
    },
    allowModification(domains) {
      const message = 'Click OK to confirm that you allow the modification of this response'

      if (window.confirm(message)) {
        const answerIds = []
        domains.forEach((question) => {
          answerIds.push(question.id)
        })
        const param = { answer_ids: answerIds, value: 0 }
        const submitAnswersResource = new Resource('vdd/responses/enable-modification')
        submitAnswersResource.store(param).then(() => {
          this.$message('Modification Enabled')
          this.$emit('submitted')
        })
      }
    },
    destroyDueDiligenceEvidence(id) {
      if (
        window.confirm('Are you sure you want to delete this document? This cannot be recovered')
      ) {
        this.loadDelete = true
        const destroyEvidenceResource = new Resource('vdd/answers/destroy-evidence')
        destroyEvidenceResource
          .vDestroy(id)
          .then(() => {
            // this.fetchQuestionsWithResponse(false)
            this.$message('Document Deleted')
            this.$emit('submitted')
            this.loadDelete = false
          })
          .catch((e) => {
            this.loadDelete = false
            this.$message(e.message)
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
