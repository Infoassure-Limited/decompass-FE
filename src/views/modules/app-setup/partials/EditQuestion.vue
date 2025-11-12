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
              <el-form-group label="Select Standard" label-for="v-standard">
                <el-select
                  v-model="selectedStandard"
                  value-key="id"
                  style="width: 100%"
                  @input="setQuestion()"
                >
                  <el-option
                    v-for="(standard, index) in standards"
                    :key="index"
                    :value="standard"
                    :label="standard.name"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Select Clause" label-for="v-clause">
                <el-select v-model="form.clause_id" style="width: 100%">
                  <el-option
                    v-for="(clause, index) in clauses"
                    :key="index"
                    :value="clause.id"
                    :label="clause.name"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <!-- <el-col cols="12">
              <el-form-group
                label="Consulting Type"
              >
                <el-select
                  v-model="form.question_type"
                  style="width: 100%"
                >
                  <el-option
                    value="process_consulting"
                    label="Process Consulting"
                  />
                  <el-option
                    value="technical_consulting"
                    label="Technical Consulting"
                  />
                </el-select>
              </el-form-group>
            </el-col> -->
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
            </el-col>
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
    },
    standards: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        standard_id: '',
        clause_id: '',
        question: '',
        question_type: '',
        answer_type: '',
        upload_evidence: 0,
        can_have_exception: 1
      },
      selectedStandard: {},
      clauses: [],
      loading: false,
      error: false,
      error_message: '',
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      }
    }
  },
  created() {
    this.form = this.selectedQuestion
    const index = this.standards.map((object) => object.id).indexOf(this.form.standard_id)
    this.selectedStandard = this.standards[index]
    this.setQuestion()
  },
  methods: {
    setQuestion() {
      this.form.standard_id = this.selectedStandard.id
      this.clauses = this.selectedStandard.clauses
    },
    update() {
      this.loading = true
      const updateCurriculumSetupResource = new Resource('questions/update')
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
