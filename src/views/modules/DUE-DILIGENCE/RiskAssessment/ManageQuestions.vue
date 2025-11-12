<template>
  <el-card>
    <div v-if="uploadBulk">
      <el-button type="danger" @click="uploadBulk = false">
        <icon icon="tabler-arrow-left" />
        <span class="align-middle">Back</span>
      </el-button>
      <create-bulk-question @save="updateTable" />
    </div>
    <div v-else v-loading="loading">
      <div v:slot="header">
        <el-row>
          <el-col :md="12">
            <h4>Manage Requirements</h4>
            <span>Setup and manage requirements/audit questions for your vendors here</span>
          </el-col>
          <el-col :md="12">
            <span class="pull-right">
              <el-button-group>
                <el-tooltip content="Import and customize preset requirements from our databank">
                  <el-button type="secondary" @click="showImportQuestionModal = true">
                    <icon icon="tabler:cloud-down" />
                    <span class="align-middle">Load Sample Questions</span>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="Create your own requirement">
                  <el-button type="primary" @click="isCreateQuestionSidebarActive = true">
                    <icon icon="tabler:plus" />
                    <span class="align-middle">Upload your Requirements</span>
                  </el-button>
                </el-tooltip>
              </el-button-group>
              <!-- <el-button
                v-if="checkPermission(['create-gap assessment'])"
                type="dark"
                @click="uploadBulk = true"
              >
                <feather-icon
                  icon="UploadIcon"
                  class="mr-50"
                />
                <span class="align-middle">Upload Bulk Questions</span>
              </el-button> -->
            </span>
          </el-col>
        </el-row>
      </div>
      <hr />
      <!-- table -->
      <!-- <span>Click on the <feather-icon
        icon="PlusIcon"
        class="mr-50"
      /> sign to view questions</span> -->
      <el-collapse accordion>
        <el-collapse-item
          v-for="(questions, index) in categorized_questions"
          :key="index"
          :name="index"
        >
          <template v-slot:title>
            <strong>{{ index }}</strong>
          </template>
          <aside>
            <el-table :data="questions" style="width: 100%">
              <el-table-column label="Action" width="300">
                <template v-slot="scope">
                  <el-button-group>
                    <el-button @click="handleEdit(scope.$index, scope.row)"
                      ><icon icon="tabler-edit" /> Edit
                    </el-button>
                    <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">
                      <icon icon="tabler-trash" /> Delete
                    </el-button>
                  </el-button-group>
                </template>
              </el-table-column>
              <el-table-column label="Audit Question" prop="question">
                <template v-slot="scope">
                  <div>
                    <div
                      style="background: #333333; color: #ffffff; padding: 10px; border-radius: 5px"
                    >
                      <p>Question: {{ scope.row.question }}</p>
                    </div>

                    <p v-if="scope.row.key !== null"> Key/Hint: {{ scope.row.key }} </p>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </aside>
        </el-collapse-item>
      </el-collapse>
      <el-drawer
        title="Create Requirements"
        v-model="isCreateQuestionSidebarActive"
        size="87%"
        direction="rtl"
        :destroy-on-close="true"
        :before-close="updateTable"
      >
        <UploadBulkQuestion @save="updateTable" />
      </el-drawer>
      <el-drawer
        title="Edit Requirements"
        v-model="isEditQuestionSidebarActive"
        direction="rtl"
        :destroy-on-close="true"
        :before-close="updateTable"
      >
        <edit-question :selected-question="editable_row" @update="updateEditedTableRow" />
      </el-drawer>
      <el-drawer
        title="Import Requirements"
        v-model="showImportQuestionModal"
        direction="ttb"
        size="100%"
        :destroy-on-close="true"
        :before-close="updateTable"
      >
        <template v-slot:title>
          <h3>Load Sample Relevant Questions</h3>
        </template>

        <import-default-question />
      </el-drawer>
    </div>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
// import CreateQuestion from './partials/CreateQuestion.vue'
import UploadBulkQuestion from './partials/UploadBulkQuestion.vue'
import EditQuestion from './partials/EditQuestion.vue'
import CreateBulkQuestion from './partials/CreateBulkQuestion.vue'
import ImportDefaultQuestion from './partials/ImportDefaultQuestion.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    // CreateQuestion,
    UploadBulkQuestion,
    CreateBulkQuestion,
    EditQuestion,
    ImportDefaultQuestion
  },
  data() {
    return {
      uploadBulk: false,
      loading: false,
      isCreateQuestionSidebarActive: false,
      isEditQuestionSidebarActive: false,
      showImportQuestionModal: false,
      pageLength: 10,
      dir: false,
      columns: ['domain', 'question', 'key', 'action'],

      options: {
        headings: {},
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: false,
        texts: {
          filter: 'Search:'
        },
        sortable: ['domain'],
        // filterable: false,
        filterable: ['domain', 'question']
      },
      categorized_questions: [],
      savedCategories: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      standards: [],
      selectedStandard: '',
      clauses: [],
      query: {
        client_id: ''
      },
      total: 0
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  created() {
    setTimeout(() => {
      this.fetchQuestions()
    }, 500)
    // this.fetchQuestions()
  },
  methods: {
    checkPermission,
    fetchQuestions() {
      this.showImportQuestionModal = false
      this.loading = true
      const fetchQuestionsResource = new Resource('vdd/questions')
      fetchQuestionsResource.list({ client_id: this.selectedClient.id }).then((response) => {
        this.categorized_questions = response.questions

        for (const key in this.categorized_questions) {
          if (Object.prototype.hasOwnProperty.call(this.categorized_questions, key)) {
            this.savedCategories.push(key)
          }
        }
        // this.total = response.questions.total
        this.loading = false
      })
    },
    updateTable() {
      this.isEditQuestionSidebarActive = false
      this.isCreateQuestionSidebarActive = false
      this.showImportQuestionModal = false
      this.fetchQuestions()
    },
    editThisRow(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.editable_row = selectedRow
      this.isEditQuestionSidebarActive = true
    },
    handleEdit(index, row) {
      // const editableRow = selected_row;
      this.editable_row = row
      this.isEditQuestionSidebarActive = true
      // console.log(index, row)
    },
    handleDelete(index, row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyQuestionsResource = new Resource('vdd/questions/destroy')
        destroyQuestionsResource.destroy(row.id).then(() => {
          this.fetchQuestions()
          this.loading = false
        })
      }
    },
    updateEditedTableRow() {
      this.fetchQuestions()
    }
  }
}
</script>
