<template>
  <el-container class="no-margin" style="min-height: 650px; border: 1px solid #eee">
    <el-aside
      v-loading="loading"
      element-loading-text="loading resources, please wait..."
      width="300px"
      style="padding: 0 !important"
    >
      <div style="padding: 10px !important">
        <el-row :gutter="10">
          <el-col :md="24">
            <strong>Document/Evidence Templates</strong>
          </el-col>
          <el-col :md="24">
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
      <div style="max-height: 500px; overflow: auto; padding: 0 !important">
        <el-collapse>
          <el-collapse-item v-for="(documentTemplates, index) in templates" :key="index">
            <template #title>
              <h3><icon icon="tabler:folder-open" /> {{ index }}</h3>
            </template>
            <div v-for="(template, sub_index) in documentTemplates" :key="`${index}-${sub_index}`">
              <CardNavView
                :id="`doc-${index}-${sub_index}`"
                :title="template.title"
                title-icon="tabler:file-text"
                @clickToView="setView(template)"
              />
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-aside>

    <el-container class="card">
      <el-main v-loading="loadView">
        <div v-if="viewType === 'welcome'" align="center" style="margin-top: 100px">
          <icon icon="tabler:folder-open" size="200" />
          <h4>Manage all required documents here</h4>
        </div>
        <div v-else>
          <div class="mb-5">
            <span class="pull-right">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="Close" placement="top-start">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="((showDocumentEditor = 'none'), (viewType = 'welcome'))"
                  >
                    <icon icon="tabler:x" />
                  </el-button>
                </el-tooltip>
              </el-button-group>
            </span>
            <h3>{{ selectedDocument.title }}</h3>
            <hr />
          </div>
          <div v-if="showDocumentEditor !== 'none'">
            <div>
              <vue-document-editor
                v-if="showDocumentEditor === 'word'"
                :document-data="selectedDocument"
                @refresh="fetchDocumentTemplates(false)"
              />
              <vue-spreadsheet-editor
                v-if="showDocumentEditor === 'spreadsheet'"
                :document-data="selectedDocument"
                @refresh="fetchDocumentTemplates(false)"
              />
            </div>
          </div>
          <!-- <iframe
            v-if="showDocumentEditor === 'none' && docSrc !== ''"
            :id="type"
            style="display: none; border: 1px solid black"
            width="100%"
            height="550"
            :src="baseServerUrl + 'storage/' + docSrc"
          ></iframe>
          <a
            :id="`${type}-download`"
            :href="baseServerUrl + 'storage/' + docSrc"
            target="_blank"
          ></a> -->
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import VueDocumentEditor from '@/views/Components/editors/VueDocumentEditorForClients.vue'
import VueSpreadsheetEditor from '@/views/Components/editors/VueSpreadsheetEditorForClients.vue'
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
      docSrc: ''
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.fetchDocumentTemplates(true)
  },
  methods: {
    checkPermission,
    setView(template) {
      this.viewType = 'welcome'
      this.selectedDocument = null
      this.showDocumentEditor = ''
      this.docSrc = ''
      this.type = '' // this returns the file extension

      setTimeout(() => {
        this.selectedDocument = template
        this.type = template.template_link.split('.').pop()
        this.docSrc = template.link
        this.viewType = 'documentViews'
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
      }, 10)
    },
    fetchDocumentTemplates(load) {
      this.loading = load
      const fetchTemplateResource = new Resource('uploads/fetch-uploads')
      fetchTemplateResource.list(this.form).then((response) => {
        this.templates = response.uploads
        this.loading = false
      })
    }
  }
}
</script>
