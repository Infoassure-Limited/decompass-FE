<template>
  <el-collapse v-loading="loading" accordion type="border">
    <template v-for="(clause, index) in clauses" :key="index">
      <el-collapse-item :title="clause.name">
        <div style="padding: 5px; border: 5px double #c0c0c0; border-radius: 8px">
          <strong>Click on the + sign to view remarks</strong>
          <v-client-table
            v-model="clause.uploads"
            v-loading="loading"
            :columns="['template_title', 'template_link', 'upload_link', 'exception']"
            :options="options"
          >
            <template v-slot:child_row="{ row }">
              <div>
                <div v-if="row.remark !== null">
                  <strong>Remark on this document: </strong>
                  <div
                    style="padding: 5px; border: 2px solid #409eff; border-radius: 8px; margin: 5px"
                  >
                    {{ row.remark }}
                  </div>
                </div>
                <div v-else>
                  <el-alert :closable="false" type="error"> No remark has been made </el-alert>
                </div>
              </div>
            </template>
            <template v-slot:template_title="{ row }">
              {{ row.template_title }}
            </template>
            <template v-slot:template_link="{ row }">
              <div v-if="row.is_exception === 0">
                <a :href="baseServerUrl + 'storage/' + row.template_link" target="_blank">
                  <el-button circle type="warning">
                    <feather-icon icon="DownloadIcon" />
                  </el-button>
                </a>
              </div>
            </template>
            <template v-slot:upload_link="props">
              <div v-if="!isAdmin">
                <div v-if="props.row.is_exception === 0">
                  <input
                    v-if="selectedProject.is_completed === 0"
                    type="file"
                    class="form-control"
                    @change="onImageChange($event, props.row.id, props.index, index)"
                  />
                  <br />
                  <small :id="'progress_' + props.row.id" style="display: none">
                    <el-progress :percentage="progress" :status="status" />
                  </small>
                  <div v-if="props.row.link !== null">
                    <el-alert :closable="false" type="success">
                      Uploaded
                      <a :href="baseServerUrl + 'storage/' + props.row.link" target="_blank">
                        <el-button circle type="primary">
                          <feather-icon icon="DownloadIcon" />
                        </el-button>
                      </a>
                    </el-alert>
                  </div>
                  <el-popover
                    v-if="
                      !isAdmin && props.row.is_exception === 0 && selectedProject.is_completed === 0
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
                      <el-button
                        :loading="loadButton"
                        size="mini"
                        type="success"
                        :disabled="exceptionReason === ''"
                        @click="createException(clause.id, props.row.id, index, props.index)"
                      >
                        Done
                      </el-button>
                    </div>
                    <template v-slot:reference>
                      <el-button size="mini" type="danger" round>
                        Click if Not Applicable
                      </el-button>
                    </template>
                  </el-popover>
                </div>
                <div v-else>
                  <el-alert type="error" :closable="false">
                    <strong>Not Applicable</strong>. To undo, click on the
                    <code>EXCLUSIONS</code> tab and reverse it
                  </el-alert>
                </div>
              </div>
              <div v-else>
                <div v-if="props.row.is_exception === 0">
                  <div v-if="props.row.link !== null">
                    <el-alert :closable="false" type="success">
                      Uploaded
                      <a :href="baseServerUrl + 'storage/' + props.row.link" target="_blank">
                        <el-button circle type="primary">
                          <feather-icon icon="DownloadIcon" />
                        </el-button>
                      </a>
                    </el-alert>
                  </div>
                </div>
                <div v-else>
                  <el-alert type="error" :closable="false">
                    <strong>Not Applicable</strong>
                  </el-alert>
                </div>
              </div>
            </template>
            <template v-slot:exception="props">
              <!-- <el-popover
                v-if="isAdmin"
                placement="right"
                width="400"
                trigger="click"
              >
                <div>
                  <el-input
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
                    @click="saveRemark(props.row.id, index, props.index)"
                  >
                    Submit
                  </el-button>
                </div>
                <el-button
                  slot="reference"
                  size="mini"
                  type="primary"
                >
                  Give Remark
                </el-button>
              </el-popover> -->
              <el-button size="mini" type="primary" round @click="openRemarkModal(props.row)">
                <feather-icon icon="MessageSquareIcon" />
                Consultant Remark
              </el-button>
            </template>
          </v-client-table>
        </div>
        <give-document-remarks
          v-if="showRemarkModal"
          v-model="showRemarkModal"
          :document="selectedDocumentForRemark"
          :is-admin="isAdmin"
          @reload="fetchClausesWithDocuments"
        />
      </el-collapse-item>
    </template>
    <el-collapse-item title="EVIDENCE">
      <evidence :selected-project="selectedProject" :is-admin="isAdmin" />
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import Resource from '@/api/resource'
import Evidence from './Evidence.vue'
import GiveDocumentRemarks from './GiveDocumentRemarks.vue'

export default {
  components: {
    Evidence,
    GiveDocumentRemarks
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
      options: {
        headings: {
          template_title: 'Title',
          template_link: 'Download Template',
          upload_link: 'Uploads',
          exception: ''
        },
        texts: {
          filter: 'Search:'
        },
        sortable: [],
        filterable: false
        // filterable: [],
      },
      clauses: [],
      uploadableFile: null,
      selectedDocumentForRemark: null,
      showRemarkModal: false,
      showRemark: 0,
      loading: false,
      load: false,
      loadButton: false,
      progress: 10,
      interval: '',
      status: 'warning',
      exceptionReason: '',
      adminRemark: ''
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.fetchClausesWithDocuments()
  },
  methods: {
    openRemarkModal(selectedDocument) {
      this.selectedDocumentForRemark = selectedDocument
      this.showRemarkModal = true
    },
    setProgress() {
      this.progress = 10
      this.interval = setInterval(() => {
        if (this.progress < 100) {
          this.progress += 10
        } else {
          clearInterval(this.interval)
          this.status = 'success'
        }
      }, 100)
    },
    showOrHideRemark(id) {
      if (this.showRemark === id) {
        this.showRemark = 0
      } else {
        this.showRemark = id
      }
    },
    fetchClausesWithDocuments() {
      this.loading = true
      const { client_id } = this.selectedProject
      const { standard_id } = this.selectedProject
      const { id } = this.selectedProject
      const fetchConsultingsResource = new Resource('clauses/fetch-clauses-with-documents')
      fetchConsultingsResource.list({ client_id, standard_id, project_id: id }).then((response) => {
        this.clauses = response.clauses
        this.loading = false
      })
    },
    createException(clauseId, uploadId, clauseIndex, uploadIndex) {
      this.loadButton = true
      const param = {
        project_id: this.selectedProject.id,
        clause_id: clauseId,
        type: 'upload',
        upload_id: uploadId,
        reason: this.exceptionReason
      }
      const createExceptionResource = new Resource('exceptions/create')
      createExceptionResource.store(param).then(() => {
        this.clauses[clauseIndex].uploads[uploadIndex - 1].is_exception = 1
        this.loadButton = false
        this.exceptionReason = ''
        this.$emit('reloadAnalytics')
      })
    },
    onImageChange(e, uploadId, uploadIndex, clauseIndex) {
      this.uploadableFile = e.target.files[0]
      // console.log(this.uploadableFile)
      this.submitUpload(uploadId, uploadIndex, clauseIndex)
    },
    submitUpload(uploadId, uploadIndex, clauseIndex) {
      document.getElementById(`progress_${uploadId}`).style.display = 'block'
      this.setProgress()
      const formData = new FormData()
      formData.append('file_uploaded', this.uploadableFile)
      formData.append('upload_id', uploadId)
      const updatePhotoResource = new Resource('clauses/upload-file')
      updatePhotoResource
        .store(formData)
        .then((response) => {
          // clearInterval(this.interval)
          setTimeout(() => {
            document.getElementById(`progress_${uploadId}`).style.display = 'none'
            this.progress = 10
          }, 2000)
          this.uploadableFile = null
          this.clauses[clauseIndex].uploads[uploadIndex - 1].link = response
          // this.$message('File upload successful')
          this.$emit('reloadAnalytics')
        })
        .catch((e) => {
          this.load = false
          this.$message(e.response.message)
        })
    },
    saveRemark(uploadId, clauseIndex, uploadIndex) {
      this.loadButton = true
      const remark = this.adminRemark
      const param = { remark }
      const saveRemarkResource = new Resource('clauses/remark-on-upload')
      saveRemarkResource.update(uploadId, param).then(() => {
        this.clauses[clauseIndex].uploads[uploadIndex - 1].remark = remark
        this.loadButton = false
        this.adminRemark = ''
      })
    }
  }
}
</script>
