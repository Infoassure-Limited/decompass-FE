<template>
  <el-card>
    <div v-if="uploadBulk">
      <el-button variant="gradient-danger" @click="uploadBulk = false">
        <icon icon="ArrowBackIcon" class="mr-50" />
        <span class="align-middle">Back</span>
      </el-button>
      <create-bulk-question :standards="standards" @save="updateTable" />
    </div>
    <div v-else>
      <el-row>
        <el-col cols="6">
          <h4>Manage Questions</h4>
        </el-col>
        <el-col cols="6">
          <span class="pull-right">
            <el-button
              v-if="checkPermission(['create-gap assessment'])"
              variant="gradient-primary"
              @click="isCreateQuestionSidebarActive = true"
            >
              <icon icon="PlusIcon" class="mr-50" />
              <span class="align-middle">Create</span>
            </el-button>
            &nbsp;
            <el-button
              v-if="checkPermission(['create-gap assessment'])"
              variant="gradient-dark"
              @click="uploadBulk = true"
            >
              <icon icon="UploadIcon" class="mr-50" />
              <span class="align-middle">Upload Bulk Questions</span>
            </el-button>
          </span>
        </el-col>
      </el-row>
      <hr />
      <!-- table -->
      <aside>
        <el-row :gutter="10">
          <el-col :lg="8">
            <el-select
              v-model="selectedStandard"
              value-key="id"
              style="width: 100%"
              filterable
              placeholder="Select Standard"
              @input="setClause()"
            >
              <el-option
                v-for="(standard, index) in standards"
                :key="index"
                :value="standard"
                :label="standard.name"
              />
            </el-select>
          </el-col>
          <el-col :lg="8">
            <el-select
              v-model="query.clause_id"
              style="width: 100%"
              filterable
              placeholder="Select Clause"
              @input="fetchQuestions()"
            >
              <el-option
                v-for="(clause, index) in clauses"
                :key="index"
                :value="clause.id"
                :label="clause.name"
              />
            </el-select>
          </el-col>
          <!-- <el-col :lg="6">
          <el-button
            type="primary"
            :disabled="query.clause_id === ''"
            @click="fetchQuestions()"
          >
            Fetch
          </el-button>
        </el-col> -->
        </el-row>
      </aside>
      <!-- <span>Click on the <icon
        icon="PlusIcon"
        class="mr-50"
      /> sign to view questions</span> -->
      <v-client-table :data="questions" v-loading="loading" :columns="columns" :options="options">
        <!-- Removed duplicate question slot: using textarea below -->
        <template v-slot:upload_evidence="{ row }">
          <div>
            {{ row.upload_evidence === 1 ? 'Yes' : 'No' }}
          </div>
        </template>
        <template v-slot:can_have_exception="{ row }">
          <div>
            {{ row.can_have_exception === 1 ? 'Yes' : 'No' }}
          </div>
        </template>
        <template v-slot:question="{ row }">
          <el-input v-model="row.question" type="textarea" :autosize="{ minRows: 10 }" readonly />
        </template>
        <template v-slot:action="props">
          <div>
            <el-button
              v-if="checkPermission(['update-gap assessment'])"
              variant="gradient-warning"
              class="btn-icon rounded-circle"
              @click="editThisRow(props.row)"
            >
              <icon icon="EditIcon" />
            </el-button>
            <el-button
              v-if="checkPermission(['delete-gap assessment'])"
              variant="gradient-danger"
              class="btn-icon rounded-circle"
              @click="destroyRow(props.row)"
            >
              <icon icon="TrashIcon" />
            </el-button>
          </div>
        </template>
      </v-client-table>
      <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="query.page"
          v-model:limit="query.limit"
          @pagination="fetchQuestions"
        />
      </el-row>
      <create-question
        v-if="isCreateQuestionSidebarActive"
        v-model="isCreateQuestionSidebarActive"
        :standards="standards"
        @save="updateTable"
      />
      <edit-question
        v-if="isEditQuestionSidebarActive"
        v-model="isEditQuestionSidebarActive"
        :standards="standards"
        :selected-question="editable_row"
        @update="updateEditedTableRow"
      />
    </div>
  </el-card>
</template>

<script>
// import { Editor } from '@/components/Editor'
import Resource from '@/api/resource'
import CreateQuestion from './partials/CreateQuestion.vue'
import EditQuestion from './partials/EditQuestion.vue'
import CreateBulkQuestion from './partials/CreateBulkQuestion.vue'
import Pagination from '@/views/Components/Pagination-main/index.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    Pagination,
    CreateQuestion,
    CreateBulkQuestion,
    EditQuestion
    // Editor
  },
  data() {
    return {
      uploadBulk: false,
      loading: false,
      isCreateQuestionSidebarActive: false,
      isEditQuestionSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'question',
        // 'standard.name',
        // 'clause.name',
        // 'question_type',
        'answer_type',
        'upload_evidence',
        'can_have_exception',
        'action'
      ],

      options: {
        headings: {
          'standard.name': 'Standard',
          'clause.name': 'Clause',
          upload_evidence: 'Can Upload Evidence'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: false,
        texts: {
          filter: 'Search:'
        },
        sortable: ['name', 'standard.name', 'clause.name'],
        // filterable: false,
        filterable: ['name', 'standard.name', 'clause.name']
      },
      questions: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      standards: [],
      selectedStandard: '',
      clauses: [],
      query: {
        page: 1,
        limit: 10,
        clause_id: ''
      },
      total: 0,
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      }
    }
  },
  created() {
    // this.fetchQuestions()
    this.fetchStandards()
  },
  methods: {
    checkPermission,
    fetchStandards() {
      const fetchStandardsResource = new Resource('standards/with-clauses')
      fetchStandardsResource.list().then((response) => {
        this.standards = response.standards
      })
    },
    setClause() {
      this.query.clause_id = ''
      this.clauses = this.selectedStandard.clauses
    },
    fetchQuestions() {
      const { limit, page } = this.query
      this.loading = true
      const fetchQuestionsResource = new Resource('questions')
      fetchQuestionsResource.list(this.query).then((response) => {
        this.questions = response.questions.data
        this.questions.forEach((element, index) => {
          element['index'] = (page - 1) * limit + index + 1
        })
        this.total = response.questions.total
        this.loading = false
      })
    },
    updateTable() {
      this.fetchQuestions()
    },
    editThisRow(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.editable_row = selectedRow
      this.isEditQuestionSidebarActive = true
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyQuestionsResource = new Resource('questions/destroy')
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
