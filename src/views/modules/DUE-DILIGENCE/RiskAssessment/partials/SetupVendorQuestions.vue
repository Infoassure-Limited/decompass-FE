<template>
  <div style="margin-top: 20px">
    <label for="">Select Vendor</label>
    <br />
    <el-select v-model="form.vendor_id" placeholder="Select Vendor" style="width: 50%">
      <el-option
        v-for="(client, index) in vendors"
        :key="index"
        :value="client.id"
        :label="client.name"
      />
    </el-select>
    <br /><br />
    <el-collapse v-if="form.vendor_id !== ''" accordion @change="handleCollapseChange">
      <el-collapse-item
        v-for="(questions, index) in categorized_questions"
        :key="index"
        :name="index"
      >
        <template v-slot:title>
          <strong>{{ index }}</strong>
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
                <el-table-column label="Audit Question" prop="question">
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
            <div v-if="multipleSelection.length > 0">
              <el-button type="primary" class="pull-right" @click="submit"> Submit </el-button>
              <h4>Selected Requirements</h4>
            </div>
            <div
              v-if="multipleSelection.length > 0"
              v-loading="saving"
              style="background: #f0f0f0; padding: 10px; margin-top: 30px"
            >
              <el-list-group>
                <el-list-group-item
                  v-for="(selection, select_index) in multipleSelection"
                  :key="select_index"
                >
                  <div>
                    <small style="font-weight: 900">{{ selection.question }}</small>
                  </div>
                </el-list-group-item>
              </el-list-group>
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
  props: {
    vendors: {
      type: Array,
      default: () => []
    },
    selectedVendorId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      form: {
        vendor_id: '',
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
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  mounted() {
    this.form.vendor_id = this.selectedVendorId
    this.fetchQuestions()
  },
  methods: {
    fetchQuestions() {
      this.loading = true
      const fetchQuestionsResource = new Resource('vdd/questions')
      fetchQuestionsResource.list({ client_id: this.selectedClient.id }).then((response) => {
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
    submit() {
      this.saving = true
      const saveQuestionSetupResource = new Resource('vdd/responses/store')
      const param = this.form
      param.questions = this.multipleSelection
      param.client_id = this.selectedClient.id
      saveQuestionSetupResource.store(param).then(() => {
        this.saving = false
        this.$notify({ title: 'Questions Setup Successful', type: 'success' })
        this.multipleSelection = []
      })
    }
  }
}
</script>
