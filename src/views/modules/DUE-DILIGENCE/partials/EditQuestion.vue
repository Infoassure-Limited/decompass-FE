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
          <h5 class="mb-0"> Edit Question </h5>
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
                <!-- <el-form-textarea
                  v-model="form.question"
                  placeholder="Give question for the selected clause here..."
                /> -->
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
              <el-form-group label="Key/Hint to question for clarity" label-for="v-upload_evidence">
                <el-input
                  v-model="form.key"
                  style="width: 100%"
                  placeholder="Input question key/insight"
                />
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
              <el-button type="submit" variant="primary" class="mr-1" @click="update()">
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
import Resource from '@/api/resource'

export default {
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
  },
  data() {
    return {
      form: {
        question: '',
        key: ''
      },
      clauses: [],
      loading: false,
      error: false,
      error_message: ''
    }
  },
  created() {
    this.form = this.selectedQuestion
  },
  methods: {
    update() {
      this.loading = true
      const updateQuestionResource = new Resource('vdd/questions/update-default-question')
      const param = this.form
      updateQuestionResource.update(param.id, param).then((response) => {
        this.loading = false
        this.$message('Update Successful')
        this.$emit('update', response)
        this.$emit('update:is-edit-question-sidebar-active', false)
      })
    }
  }
}
</script>
