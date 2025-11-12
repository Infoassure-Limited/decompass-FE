<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditQuestionSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-question-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mel-0"> Edit Question </h5>
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
                  placeholder="Give question for the selected clause here..."
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
                label="Hint"
                label-for="v-hint"
              >
                <el-input
                  v-model="form.hint"
                  type="textarea"
                  placeholder="Give hint for further insight to questions"
                />
              </el-form-group>
            </el-col> -->
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
                @click="update()"
              >
                Update
              </el-button>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-sidebar>
  </div>
</template>

<script>
import { Editor } from '@/components/Editor'
import Resource from '@/api/resource'

export default {
  components: {
    Editor
  },
  model: {
    prop: 'isEditQuestionSidebarActive',
    event: 'update:is-edit-question-sidebar-active'
  },
  props: {
    isEditQuestionSidebarActive: {
      type: Boolean,
      required: true
    },
    selectedQuestion: {
      type: Object,
      default: () => null
    }
    // clauses: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
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
      templates: [],
      selectedClause: {},
      sections: [],
      loading: false,
      error: false,
      error_message: '',
      editor: ClassicEditor,
      editorConfig: {}
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

        this.form = this.selectedQuestion
        const index = this.clauses.map((object) => object.id).indexOf(this.form.clause_id)
        this.selectedClause = this.clauses[index]
        this.setSection()
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
    update() {
      this.loading = true
      const updateCurriculumSetupResource = new Resource('ndpa/questions/update')
      const param = this.form
      updateCurriculumSetupResource.update(param.id, param).then((response) => {
        this.loading = false
        this.$emit('update', response)
        this.$emit('update:is-edit-question-sidebar-active', false)
      })
    }
  }
}
</script>
