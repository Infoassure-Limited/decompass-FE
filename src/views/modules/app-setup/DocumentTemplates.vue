<template>
  <el-container class="no-margin" style="height: 600px; border: 1px solid #eee">
    <el-aside
      v-loading="loading"
      element-loading-text="loading resources, please wait..."
      width="300px"
      style="padding: 0 !important"
    >
      <div style="padding: 10px !important">
        <el-row :gutter="10">
          <el-col :md="20">
            <strong>Document/Evidence Templates</strong>
          </el-col>
          <el-col :md="4">
            <span class="pull-right">
              <el-button type="primary" size="sm" @click="((showModal = true), (isEdit = false))">
                <icon icon="tabler:plus" />
                <span class="align-middle">Create</span>
              </el-button>
            </span>
          </el-col>
          <el-col :md="24">
            <hr />
            <el-input
              v-model="form.title"
              placeholder="Search document title"
              @input="fetchDocumentTemplates(false)"
            >
              <template v-slot:append>
                <el-button size="sm" @click="fetchDocumentTemplates(true)">
                  <icon icon="tabler:search" />
                </el-button>
              </template>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <div style="max-height: 500px; overflow: auto; padding: 10px !important">
        <el-collapse accordion>
          <el-collapse-item v-for="(documentTemplates, index) in templates" :key="index">
            <template #title>
              <h3><icon icon="tabler:folder-open" /> {{ index }}</h3>
            </template>
            <div v-for="(template, sub_index) in documentTemplates" :key="`${index}-${sub_index}`">
              <CardNavView :id="`doc-${index}-${sub_index}`" @clickToView="setView(template)">
                <template #description>
                  <div>
                    <div align="center">
                      <icon
                        v-if="
                          template.link.split('.').pop() === 'xlsx' ||
                          template.link.split('.').pop() === 'xls' ||
                          template.link.split('.').pop() === 'csv'
                        "
                        icon="tabler:file-spreadsheet"
                        size="30"
                      />
                      <icon v-else icon="tabler:file-word" size="30" />
                      <p>{{ template.title }}</p>
                    </div>
                  </div>
                </template>
              </CardNavView>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-aside>

    <el-container class="card">
      <el-main v-loading="loadView">
        <div v-if="viewType === 'welcome'" align="center" style="margin-top: 100px">
          <icon icon="tabler:folder-open" size="200" />
          <h4>Manage all expected document/evidence templates here</h4>
        </div>
        <div v-else>
          <div class="mb-5">
            <span class="pull-right">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="Edit" placement="top-start">
                  <el-button type="default" size="mini" @click="editFile(selectedDocument)">
                    <icon icon="tabler:edit" />
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Delete" placement="top-start">
                  <el-button type="default" size="mini" @click="deleteFile(selectedDocument.id)">
                    <icon icon="tabler:trash" />
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Close" placement="top-start">
                  <el-button
                    type="default"
                    size="mini"
                    @click="((showDocumentEditor = 'none'), (viewType = 'welcome'))"
                  >
                    <icon icon="tabler:x" />
                  </el-button>
                </el-tooltip>
              </el-button-group>
            </span>
            <h3>{{ selectedDocument.title }}</h3>
          </div>
          <div v-if="showDocumentEditor !== 'none'" style="background: #c0c0c0; padding: 10px">
            <div>
              <vue-document-editor
                v-if="showDocumentEditor === 'word'"
                :document-path="selectedDocument.link"
                :document-title="selectedDocument.title"
              />
              <vue-spreadsheet-editor
                v-if="showDocumentEditor === 'spreadsheet'"
                :document-path="selectedDocument.link"
                :document-title="selectedDocument.title"
              />
            </div>
          </div>
          <iframe
            v-if="showDocumentEditor === 'none' && docSrc !== ''"
            :id="type"
            style="display: none; border: 1px solid black"
            width="100%"
            height="550"
            :src="baseServerUrl + 'storage/' + docSrc"
          ></iframe>
          <div v-if="showDocumentEditor === 'none' && docSrc === null">
            <el-empty description="No template available">
              <el-button type="primary" @click="editFile(selectedDocument)">
                <icon icon="tabler:upload" />Click to upload
              </el-button>
            </el-empty>
          </div>
          <a
            :id="`${type}-download`"
            :href="baseServerUrl + 'storage/' + docSrc"
            target="_blank"
          ></a>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      v-if="showModal"
      v-model="showModal"
      title="Upload New Document/Evidence Template"
      centered
      size="lg"
      hide-footer
    >
      <div v-loading="loading">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Template File</th>
              <!-- <th>Applicable Modules</th> -->
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <el-input
                  v-model="templateForm.title"
                  type="text"
                  placeholder="Title of document"
                />
              </td>
              <td>
                <!-- <el-select
                  v-model="templateForm.type"
                  placeholder="Upload type"
                  style="width: 100%"
                >
                  <el-option value="upload" label="File upload from device" />
                  <el-option value="external_link" label="Provide External Link" />
                </el-select> -->
                <input
                  v-if="templateForm.type === 'upload'"
                  class="form-control"
                  type="file"
                  @change="onImageChange"
                />
                <el-input
                  v-if="templateForm.type === 'external_link'"
                  v-model="templateForm.external_link"
                  type="text"
                  placeholder="Provide External Link to file"
                />
              </td>
              <!-- <td>
                <el-select
                  v-model="templateForm.applicable_modules"
                  placeholder="Select applicable modules"
                  multiple
                  style="width: 100%"
                >
                  <el-option
                    v-for="(available_module, index) in modules"
                    :key="index"
                    :value="available_module.slug"
                    :label="available_module.name"
                  />
                </el-select>
              </td> -->
              <td>
                <el-tooltip content="Upload">
                  <el-button
                    v-if="isEdit"
                    type="success"
                    :disabled="
                      templateForm.title === '' ||
                      (templateForm.type === 'upload' && templateForm.uploadableFile === null) ||
                      (templateForm.type === 'external_link' && templateForm.external_link === '')
                    "
                    @click="updateTemplate()"
                  >
                    <icon icon="tabler:upload" />
                  </el-button>
                  <el-button
                    v-else
                    type="success"
                    :disabled="
                      templateForm.title === '' ||
                      (templateForm.type === 'upload' && templateForm.uploadableFile === null) ||
                      (templateForm.type === 'external_link' && templateForm.external_link === '')
                    "
                    @click="submitNewTemplate()"
                  >
                    <icon icon="tabler:upload" />
                  </el-button>
                </el-tooltip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import VueDocumentEditor from '@/views/Components/editors/VueDocumentEditor.vue'
import VueSpreadsheetEditor from '@/views/Components/editors/VueSpreadsheetEditor.vue'
// import { VueGoodTable } from 'vue-good-table'
import Resource from '@/api/resource'
// import CreateEvidence from './partials/CreateEvidence.vue'
// import EditEvidence from './partials/EditEvidence.vue'
import checkPermission from '@/utils/permission'
import CardNavView from '@/views/Components/CardNavView.vue'

export default {
  components: {
    VueDocumentEditor,
    VueSpreadsheetEditor,
    CardNavView
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: false,
      showModal: false,
      pageLength: 10,
      dir: false,
      evidence: [],
      consultings: [],
      editable_row: '',
      selected_row_index: '',
      selectedConsulting: '',
      templates: [],
      loadView: false,
      viewType: 'welcome',
      showDocumentEditor: '',
      selectedDocument: null,
      type: '',
      form: {
        title: ''
      },
      templateForm: {
        id: '',
        title: '',
        applicable_modules: [],
        uploadableFile: null,
        external_link: '',
        type: 'upload'
      },
      docSrc: '',
      modules: []
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.fetchAvailableModules()
    this.fetchDocumentTemplates(true)
  },
  methods: {
    checkPermission,
    setView(template, viewId) {
      this.viewType = 'documentViews'
      this.selectedDocument = template
      this.showDocumentEditor = ''
      this.docSrc = template.link
      this.type = template.link !== null ? template.link.split('.').pop() : '' // this returns the file extension

      setTimeout(() => {
        if (this.type === 'pdf') {
          document.getElementById(this.type).style.display = 'block'
        } else if (this.type === 'doc' || this.type === 'docx') {
          this.showDocumentEditor = 'word'
        } else if (this.type === 'csv' || this.type === 'xlsx' || this.type === 'xls') {
          this.showDocumentEditor = 'spreadsheet'
          // document.getElementById(`${this.type}-download`).click()
        } else {
          this.showDocumentEditor = 'none'
        }
      }, 100)
    },
    onImageChange(e) {
      this.templateForm.uploadableFile = e.target.files[0]
    },
    fetchAvailableModules() {
      const fetchModuleResource = new Resource('packages/fetch-modules')
      fetchModuleResource.list().then((response) => {
        this.modules = response.modules
      })
    },
    fetchDocumentTemplates(load) {
      this.loading = load
      const fetchTemplateResource = new Resource('document-templates/fetch')
      fetchTemplateResource.list(this.form).then((response) => {
        this.templates = response.document_templates
        this.loading = false
      })
    },
    submitNewTemplate() {
      this.loading = true
      const formData = new FormData()
      formData.append('title', this.templateForm.title)
      formData.append('file_uploaded', this.templateForm.uploadableFile)
      formData.append('external_link', this.templateForm.external_link)
      const updatePhotoResource = new Resource('document-templates/upload')
      updatePhotoResource
        .store(formData)
        .then(() => {
          this.fetchDocumentTemplates(false)
          this.loading = false
          this.uploadableFile = null
          this.templateForm = {
            id: '',
            title: '',
            uploadableFile: null,
            external_link: '',
            type: 'upload'
          }
          this.$message('File upload successful')
          this.showModal = false
        })
        .catch((e) => {
          this.load = false
          this.$message(e.response.message)
        })
    },
    updateTemplate() {
      this.loading = true
      const formData = new FormData()
      formData.append('id', this.templateForm.id)
      formData.append('title', this.templateForm.title)
      formData.append('file_uploaded', this.templateForm.uploadableFile)
      formData.append('external_link', this.templateForm.external_link)
      const updatePhotoResource = new Resource('document-templates/update')
      updatePhotoResource
        .store(formData)
        .then(() => {
          this.fetchDocumentTemplates(false)
          this.loading = false
          this.uploadableFile = null
          this.templateForm = {
            id: '',
            title: '',
            uploadableFile: null,
            external_link: '',
            type: 'upload'
          }
          this.$message('Document updated succcessfully')
          this.showModal = false
        })
        .catch((e) => {
          this.load = false
          this.$message(e.response.message)
        })
    },
    editFile(selectedDocument) {
      this.templateForm = selectedDocument
      this.templateForm.type = 'upload'
      this.showModal = true
      this.isEdit = true
    },
    deleteFile(id) {
      this.$confirm('This will permanently delete the document. Continue?', 'Warning', {
        confirmButtonText: 'Yes, Please',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          const deleteResource = new Resource(`document-templates/delete`)
          deleteResource
            .destroy(id)
            .then((response) => {
              this.fetchDocumentTemplates(false)
              this.loading = false
              this.$message('Document deleted successfully')
              this.viewType = 'welcome'
            })
            .catch((e) => {
              this.loading = false
              this.$message(e.response.data.message)
            })
        })
        .catch(() => {})
    }
  }
}
</script>
