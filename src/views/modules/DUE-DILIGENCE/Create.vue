<template>
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
    <b-tabs v-if="selectedClient !== null" content-class="mt-1">
      <b-tab>
        <template #title>
          <span>Details</span>
        </template>
        <app-collapse v-loading="loading" accordion type="border">
          <app-collapse-item
            v-for="(domainQuestions, index) in domains"
            :key="index"
            :title="index"
          >
            <div v-for="(question, question_index) in domainQuestions" :key="question_index">
              <div
                v-if="currenctQuestions[index] === question_index"
                class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                style="padding: 5px; border: 5px double #c0c0c0; border-radius: 8px"
              >
                <div>
                  <span class="pull-right">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="openRemarkModal(question.response)"
                    >
                      <feather-icon icon="MessageSquareIcon" />
                      Consultant Remark
                    </el-button>
                    <button
                      v-if="isAdmin"
                      class="btn btn-success btn-sm"
                      @click="allowModification(domainQuestions)"
                      ><feather-icon icon="ThumbsUpIcon" />
                      Enable Modification
                    </button>
                  </span>
                  <strong style="color: red">
                    Question {{ question_index + 1 }} of {{ domainQuestions.length }}
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
                      v-if="parseInt(question_index + 1) < domainQuestions.length"
                      class="btn btn-primary btn-sm"
                      @click="change(question_index + 1, index)"
                    >
                      Next
                      <feather-icon icon="ArrowRightIcon" />
                    </button>
                    <button
                      v-if="
                        !isAdmin &&
                        parseInt(question_index + 1) === domainQuestions.length &&
                        question.response.is_submitted === 0
                      "
                      class="btn btn-success btn-sm"
                      @click="submitAnswers(domainQuestions)"
                      ><feather-icon icon="SaveIcon" />
                      Submit
                    </button>
                  </div>
                </div>
                <hr />
                <el-row :gutter="5">
                  <el-col :lg="16" :md="16" :sm="24" :xs="24">
                    <div
                      v-if="showQuestions"
                      style="background: #f0f0f0; padding: 10px; margin-bottom: 5px"
                    >
                      <!--eslint-disable-next-line vue/no-v-html-->
                      <span v-html="question.question"></span>
                    </div>
                    <el-tooltip
                      v-if="question.key !== null"
                      class="item"
                      effect="light"
                      :content="question.key"
                      placement="bottom"
                    >
                      <el-button>Key/Insight</el-button>
                    </el-tooltip>
                    <div style="padding: 10px">
                      <div class="control-group">
                        <label class="control-label" for="inputEmail"></label>
                        <div class="controls">
                          <input v-model="question.response.id" type="hidden" />
                          <div v-if="!isAdmin">
                            <div v-if="question.response.is_submitted === 0">
                              <div>
                                <el-radio-group
                                  v-model="question.response.answer"
                                  @change="saveAnswer(question.response, 'answer')"
                                >
                                  <el-radio label="YES" border> YES </el-radio>
                                  <el-radio label="NO" border> NO </el-radio>
                                  <el-radio label="NA" border> NOT APPLICABLE </el-radio>
                                </el-radio-group>
                                <br />
                                <div v-if="question.response.answer === 'NA'">
                                  <el-alert type="error" :closable="false">
                                    Kindly give reasons why this is NOT APPLICABLE
                                  </el-alert>
                                  <el-input
                                    v-model="question.response.detailed_explanation"
                                    type="textarea"
                                    placeholder="Type reasons here..."
                                    style="width: 100%"
                                    @blur="saveAnswer(question.response, 'detailed_explanation')"
                                  />
                                </div>
                                <div v-else>
                                  <el-input
                                    v-model="question.response.detailed_explanation"
                                    type="textarea"
                                    placeholder="Give some detailed response here..."
                                    style="width: 100%"
                                    @blur="saveAnswer(question.response, 'detailed_explanation')"
                                  />
                                </div>
                                <hr />
                              </div>
                            </div>
                            <div v-else>
                              <strong>Response:</strong>&nbsp;{{ question.response.answer
                              }}<br /><br />
                              {{ question.response.detailed_explanation }}
                            </div>
                          </div>
                          <div v-else>
                            <strong>Response:</strong>&nbsp;{{ question.response.answer
                            }}<br /><br />
                            {{ question.response.detailed_explanation }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :lg="8" :md="8" :sm="24" :xs="24">
                    <div style="height: 300px; overflow: auto; background: #fcfcfc; padding: 10px">
                      <b-button
                        v-if="!isAdmin"
                        variant="gradient-primary"
                        block
                        @click="addEvidence(question.response.id)"
                      >
                        <feather-icon icon="UploadIcon" />
                        Upload Evidence
                      </b-button>
                      <div v-if="isAdmin"> Uploaded Evidences </div>
                      <hr />
                      <b-alert
                        v-for="(evidence, evidence_index) in question.response.evidences"
                        :key="evidence_index"
                        variant="primary"
                        show
                      >
                        <div v-loading="loadDelete" class="alert-body">
                          <!-- <a
                            :href="baseServerUrl+'storage/'+evidence.link"
                            target="_blank"
                          >{{ evidence.evidence_title }}</a> -->
                          <small style="font-size: 11px">{{ evidence.evidence_title }}</small>
                          <span class="pull-right">
                            <el-dropdown>
                              <b-button variant="flat" class="btn-icon rounded-circle">
                                <i class="el-icon-more-outline"></i>
                              </b-button>
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
                                  <el-dropdown-item v-if="!isAdmin">
                                    <span @click="destroyDueDiligenceEvidence(evidence.id)"
                                      >Delete</span
                                    >
                                  </el-dropdown-item>
                                </el-dropdown-menu>
                              </template>
                            </el-dropdown>
                          </span>
                        </div>
                      </b-alert>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </app-collapse-item>
        </app-collapse>
        <give-due-diligence-remarks
          v-if="showRemarkModal"
          v-model="showRemarkModal"
          :answer="selectedAnswerForRemark"
          :is-admin="isAdmin"
          @reload="fetchQuestionsWithResponse"
        />
        <b-modal v-model="showModal" title="Upload Evidence" centered size="lg" hide-footer>
          <upload-due-diligence-evidence
            :answer-id="selectedAnswer"
            @reload="fetchQuestionsWithResponse"
          />
        </b-modal>
      </b-tab>
      <b-tab v-if="isAdmin">
        <template #title>
          <span>Report</span>
        </template>
        <report :data="domains" :selected-client="selectedClient" />
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import UploadDueDiligenceEvidence from './UploadDueDiligenceEvidence.vue'
import GiveDueDiligenceRemarks from './GiveDueDiligenceRemarks.vue'
import Report from './Report.vue'
import VueDocumentEditor from '@/views/Components/editors/VueDocumentEditor.vue'
import VueSpreadsheetEditor from '@/views/Components/editors/VueSpreadsheetEditor.vue'
import Resource from '@/api/resource'

export default {
  components: {
    UploadDueDiligenceEvidence,
    GiveDueDiligenceRemarks,
    VueDocumentEditor,
    VueSpreadsheetEditor,
    Report
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      domains: [],
      clients: [],
      currenctQuestions: {},
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
      selectedDocument: ''
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
  watch: {
    selectedClient() {
      this.setDueDiligenceResponses()
    }
  },
  created() {
    this.setDueDiligenceResponses()
  },
  methods: {
    setCurrentQuestions(domains) {
      // const noOfDomains = Object.keys(domains).length

      for (const key in domains) {
        if (!Object.hasOwnProperty.call(this.currenctQuestions, key)) {
          this.currenctQuestions[key] = 0
        }
        // this.currenctQuestions[key] = 0
      }
      this.currentQuestionsAreSet = true
    },
    openRemarkModal(selectedAnswer) {
      this.selectedAnswerForRemark = selectedAnswer
      this.showRemarkModal = true
    },
    addEvidence(answerId) {
      this.selectedAnswer = answerId
      this.showModal = true
    },
    fetchQuestionsWithResponse(load = true) {
      this.showRemarkModal = false
      this.loading = load
      const fetchQuestionsWithResponseResource = new Resource(
        'due-diligence/questions/fetch-questions-with-response'
      )
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
    setDueDiligenceResponses() {
      this.loading = true
      const fetchQuestionsWithResponseResource = new Resource('due-diligence/answers/save')
      fetchQuestionsWithResponseResource.store({ client_id: this.selectedClient.id }).then(() => {
        this.fetchQuestionsWithResponse()
        this.loading = false
      })
    },
    colorButton(index, current) {
      document.getElementById(`quest_button_${index}_${current}`).style.backgroundColor = '#ccc'
      // }
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
    saveAnswer(answer, field) {
      // console.log(answer[field])
      const param = { answer: answer[field], field }
      const fetchConsultingsResource = new Resource('due-diligence/answers/update')
      fetchConsultingsResource.update(answer.id, param).then(() => {})
    },
    submitAnswers(domains) {
      const message =
        'Click OK to confirm submit action. You will not be able to modify responses once you submit'

      if (window.confirm(message)) {
        const answerIds = []
        domains.forEach((response) => {
          answerIds.push(response.id)
        })
        const param = { answer_ids: answerIds, value: 1 }
        const submitAnswersResource = new Resource('due-diligence/answers/submit')
        submitAnswersResource.store(param).then(() => {
          this.fetchQuestionsWithResponse()
          this.$emit('reloadAnalytics')
        })
      }
    },
    allowModification(domains) {
      const message = 'Click OK to confirm that you allow the modification of this response'

      if (window.confirm(message)) {
        const answerIds = []
        domains.forEach((question) => {
          answerIds.push(question.response.id)
        })
        const param = { answer_ids: answerIds, value: 0 }
        const submitAnswersResource = new Resource('due-diligence/answers/submit')
        submitAnswersResource.store(param).then(() => {
          this.$message('Modification Enabled')
          this.fetchQuestionsWithResponse()
          this.$emit('reloadAnalytics')
        })
      }
    },
    destroyDueDiligenceEvidence(id) {
      if (
        window.confirm('Are you sure you want to delete this document? This cannot be recovered')
      ) {
        this.loadDelete = true
        const destroyEvidenceResource = new Resource('due-diligence/answers/destroy-evidence')
        destroyEvidenceResource
          .destroy(id)
          .then(() => {
            this.fetchQuestionsWithResponse(false)
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
