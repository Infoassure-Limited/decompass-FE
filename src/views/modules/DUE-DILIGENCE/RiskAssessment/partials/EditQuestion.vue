<template>
  <div class="justify-content-between align-items-center px-2 py-1">
    <el-row v-loading="loading">
      <el-col :md="24">
        <v-text-field
          v-model="form.domain"
          :readonly="loading"
          class="mb-2"
          label="Domain/Category"
          placeholder="Input domain"
          variant="outlined"
        />
      </el-col>
      <el-col :md="24">
        <v-textarea
          v-model="form.question"
          :readonly="loading"
          label="Type Question"
          placeholder="Type questions here..."
          variant="outlined"
          rows="2"
        />
      </el-col>
      <el-col :md="24">
        <v-textarea
          v-model="form.key"
          :readonly="loading"
          label="Key/Hint to question for clarity"
          placeholder="Input question key/insight"
          variant="outlined"
          rows="2"
        />
      </el-col>
      <el-col :md="24">
        <el-select v-model="form.answer_type" style="width: 100%">
          <el-option value="open_ended" label="Open Ended" />
          <el-option value="yes-no" label="Yes/No Response" />
          <el-option value="both" label="Both" />
        </el-select>
      </el-col>
      <el-col :md="24">
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
      </el-col>
      <!-- submit and reset -->
      <el-col :md="24">
        <el-button type="primary" @click="submit()"> Submit </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  props: {
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
  mounted() {
    this.form = this.selectedQuestion
  },
  methods: {
    update() {
      this.loading = true
      const updateQuestionResource = new Resource('vdd/questions/update')
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
