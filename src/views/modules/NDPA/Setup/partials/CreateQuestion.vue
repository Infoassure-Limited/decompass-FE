<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateQuestionSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-question-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mb-0"> Create Questions </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <el-col cols="12">
              <el-form-group label="Select Requirement" label-for="v-clause">
                <el-select
                  v-model="selectedClause"
                  value-key="id"
                  style="width: 100%"
                  @input="setSection()"
                >
                  <el-option
                    v-for="(clause, index) in clauses"
                    :key="index"
                    :value="clause"
                    :label="`${clause.name} - ${clause.description}`"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Select Section" label-for="v-section">
                <el-select v-model="form.section_id" style="width: 100%">
                  <el-option
                    v-for="(section, index) in sections"
                    :key="index"
                    :value="section.id"
                    :label="`${section.name} - ${section.description}`"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Answer Type">
                <el-select v-model="form.answer_type" style="width: 100%">
                  <el-option value="open_ended" label="Open Ended" />
                  <el-option value="yes-no" label="Yes/No Response" />
                  <el-option value="both" label="Both" />
                </el-select>
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Type Question" label-for="v-question">
                <!-- <el-form-textarea
                  v-model="form.question"
                  placeholder="Type questions for the selected clause here..."
                /> -->
                <Editor
                  id="question"
                  v-model="form.question"
                  placeholder="Type questions for the selected clause here..."
                />
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Give extra hint to question" label-for="v-hint">
                <el-form-textarea v-model="form.hint" placeholder="Type hint here..." />
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Expected Evidence for upload" label-for="v-hint">
                <el-select
                  v-model="form.expected_document_template_ids"
                  placeholder="Select Applicable Evidences"
                  filterable
                  multiple
                  collapse-tags
                  style="width: 100%"
                >
                  <el-option
                    v-for="(template, index) in templates"
                    :key="index"
                    :value="template.id"
                    :label="template.title"
                  />
                </el-select>
                <!-- <a
                  href="#"
                  @click="showDocumentTemplateModal = true"
                >
                  <feather-icon
                    icon="UploadIcon"
                  />
                  Click to select expected evidences
                </a> -->
              </el-form-group>
            </el-col>
            <!-- <el-col cols="12">
              <el-form-group
                label="Needs evidence/reference document upload?"
                label-for="v-upload_evidence"
              >

                <el-switch
                  v-model="form.upload_evidence"
                  style="display: block"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="Yes"
                  inactive-text="No"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-group>
            </el-col> -->
            <el-col cols="12">
              <el-form-group label="Can have exceptions?" label-for="v-upload_evidence">
                <el-switch
                  v-model="form.can_have_exception"
                  style="display: block"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="Yes"
                  inactive-text="No"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-group>
            </el-col>
            <!-- submit and reset -->
            <el-col cols="12">
              <el-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
              </el-button>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-sidebar>
    <el-modal
      v-if="showDocumentTemplateModal"
      v-model="showDocumentTemplateModal"
      title="Select the Relevant Evidence"
      centered
      size="lg"
      ok-only
      ok-title="Done"
    >
      <v-client-table :data="templates" :columns="columns" :options="options">
        <template v-slot:select="{ row }">
          <div>
            <el-checkbox v-model="form.expected_document_template_ids" :label="row.id" border />
          </div>
        </template>
        <template v-slot:title="{ row }">
          <div>
            <strong>{{ row.title }}</strong>
          </div>
        </template>
        <template v-slot:link="{ row }">
          <div>
            <a :href="`${baseServerUrl}storage/${row.link}`" target="_blank"> Download Template </a>
          </div>
        </template>
      </v-client-table>
    </el-modal>
  </div>
</template>

<script>
import { Editor } from '@/components/Editor'
import Resource from '@/api/resource'

// ClassicEditor.create(document.querySelector('#question'), {
//   link: {
//     addTargetToExternalLinks: true,
//     defaultProtocol: 'http:s//'
//   }
// })
//   .then(/* ... */)
//   .catch(/* ... */)
export default {
  components: {
    Editor
  },
  model: {
    prop: 'isCreateQuestionSidebarActive',
    event: 'update:is-create-question-sidebar-active'
  },
  props: {
    isCreateQuestionSidebarActive: {
      type: Boolean,
      required: true
    }
    // clauses: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      showDocumentTemplateModal: false,
      columns: ['select', 'title', 'link'],
      options: {
        headings: {
          link: 'Link to Sample'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: ['title'],
        // filterable: false,
        filterable: ['title']
      },
      form: {
        name: '',
        section_id: '',
        clause_id: '',
        question: '',
        hint: '',
        question_type: '',
        answer_type: '',
        upload_evidence: 1,
        can_have_exception: 1,
        expected_document_template_ids: []
      },
      clauses: [],
      sections: [],
      selectedClause: {},
      loading: false,
      templates: []
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.fetchClauses()
    this.fetchDocumentTemplates()
  },
  methods: {
    fetchClauses() {
      this.loading = true
      const fetchClausesResource = new Resource('ndpa/clauses')
      fetchClausesResource.list(this.query).then((response) => {
        this.clauses = response.clauses
        this.loading = false
      })
    },
    fetchDocumentTemplates() {
      this.loading = true
      const fetchTemplateResource = new Resource('document-templates/fetch')
      fetchTemplateResource.list(this.query).then((response) => {
        this.templates = response.document_templates
        this.loading = false
      })
    },
    setSection() {
      this.form.clause_id = this.selectedClause.id
      this.sections = this.selectedClause.sections
    },
    submit() {
      this.loading = true
      const saveQuestionSetupResource = new Resource('ndpa/questions/save')
      const param = this.form
      saveQuestionSetupResource.store(param).then((response) => {
        this.loading = false
        this.$emit('save', response)
        this.$emit('update:is-create-question-sidebar-active', false)
      })
    }
  }
}
</script>
