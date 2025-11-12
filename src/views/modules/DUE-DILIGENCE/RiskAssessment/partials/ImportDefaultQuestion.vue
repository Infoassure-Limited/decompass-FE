<template>
  <div style="padding: 20px">
    <el-collapse accordion @change="handleCollapseChange">
      <el-collapse-item
        v-for="(questions, index) in categorized_questions"
        :key="index"
        :name="index"
      >
        <template v-slot:title>
          <h3>{{ index }}</h3>
        </template>
        <el-row :gutter="20">
          <el-col v-loading="loading" :md="16">
            <em
              >Note: You are required to make your selection from a particular category and SAVE
              before going to the next category</em
            >
            <p></p>
            <aside>
              <el-table
                ref="multipleTable"
                :data="questions"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" style="background: #000000" />
                <el-table-column label="Question" prop="question">
                  <template v-slot="scope">
                    <div>
                      <div
                        style="
                          background: #333333;
                          color: #ffffff;
                          padding: 10px;
                          border-radius: 5px;
                        "
                      >
                        <p>Question: {{ scope.row.question }}</p>
                      </div>

                      <p v-if="scope.row.key !== null"> Key/Hint: {{ scope.row.key }} </p>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </aside>
          </el-col>
          <el-col :md="8">
            <div style="margin-bottom: 40px">
              <el-button
                :disabled="multipleSelection.length < 1"
                type="primary"
                class="pull-right"
                @click="submit"
              >
                Save
              </el-button>
              <h4>Selected Requirements</h4>
            </div>
            <div v-if="multipleSelection.length > 0" v-loading="saving">
              <div v-for="(selection, select_index) in multipleSelection" :key="select_index">
                <div
                  style="
                    background: #f0f0f0;
                    padding: 10px;
                    margin-bottom: 10px;
                    border-radius: 5px;
                  "
                >
                  <span>{{ selection.question }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  data() {
    return {
      form: {
        questions: []
      },
      categorized_questions: [],
      multipleSelection: [],
      selected_questions: [],
      search: '',
      loading: false,
      saving: false
    }
  },
  mounted() {
    this.fetchQuestions()
  },
  methods: {
    fetchQuestions() {
      this.loading = true
      const fetchQuestionsResource = new Resource('vdd/questions/fetch-default-questions')
      fetchQuestionsResource.list().then((response) => {
        this.loading = false
        this.categorized_questions = response.questions
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCollapseChange() {
      this.multipleSelection = []
    },
    performSearch() {
      const { search } = app
      this.questions.filter(
        (data) => !search || data.question.toLowerCase().includes(search.toLowerCase())
      )
    },
    submit() {
      this.saving = true
      const saveQuestionSetupResource = new Resource('vdd/questions/save-imported-questions')
      const param = this.form
      param.questions = this.multipleSelection
      saveQuestionSetupResource.store(param).then(() => {
        this.saving = false
        this.$notify({ title: 'Questions Imported Successfully', type: 'success' })
        this.multipleSelection = []
      })
    }
  }
}
</script>
