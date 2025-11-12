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
          <h5 class="mel-0"> Create Questions </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <el-col cols="12">
              <el-form-group label="Domain/Category" label-for="v-domain">
                <el-input v-model="form.domain" style="width: 100%" placeholder="Input domain" />
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Type Question" label-for="v-question">
                <ckeditor
                  id="question"
                  v-model="form.question"
                  :editor="editor"
                  placeholder="Type questions here..."
                  :config="editorConfig"
                />
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Key/Hint to question for clarity" label-for="v-key">
                <el-input
                  v-model="form.key"
                  style="width: 100%"
                  placeholder="Input question key/insight"
                />
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Answer Type" label-for="v-answer_type">
                <el-select v-model="form.answer_type" style="width: 100%">
                  <el-option value="open_ended" label="Open Ended" />
                  <el-option value="yes-no" label="Yes/No Response" />
                  <el-option value="both" label="Both" />
                </el-select>
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group
                label="Does question need evidence/reference document upload?"
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
            <!-- submit and reset -->
            <el-col cols="12">
              <el-button type="primary" class="mr-1" @click="submit()"> Submit </el-button>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-sidebar>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  model: {
    prop: 'isCreateQuestionSidebarActive',
    event: 'update:is-create-question-sidebar-active'
  },
  props: {
    isCreateQuestionSidebarActive: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        domain: '',
        question: '',
        key: '',
        answer_type: 'yes-no',
        upload_evidence: 0
      },
      selectedStandard: {},
      clauses: [],
      loading: false,
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      }
    }
  },
  methods: {
    setQuestion() {
      this.form.standard_id = this.selectedStandard.id
      this.clauses = this.selectedStandard.clauses
    },
    submit() {
      this.loading = true
      const saveQuestionSetupResource = new Resource('vdd/questions/save-default-question')
      const param = this.form
      saveQuestionSetupResource.store(param).then((response) => {
        this.loading = false
        this.$message('Action Successful')
        this.$emit('save', response)
        this.$emit('update:is-create-question-sidebar-active', false)
      })
    }
  }
}
</script>
