<template>
  <el-card>
    <div v-if="uploadBulk">
      <el-button
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="gradient-danger"
        @click="uploadBulk = false"
      >
        <icon icon="ArrowBackIcon" class="mr-50" />
        <span class="align-middle">Back</span>
      </el-button>
      <create-bulk-question :clauses="clauses" @save="updateTable" />
    </div>
    <div v-else>
      <div>
        <el-row>
          <el-col :md="12">
            <h4>Manage Questions</h4>
          </el-col>
          <el-col :md="12">
            <span class="pull-right">
              <el-button
                v-if="checkPermission(['create-gap assessment'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="outline-primary"
                @click="isCreateQuestionSidebarActive = true"
              >
                <icon icon="PlusIcon" class="mr-50" />
                <span class="align-middle">Create</span>
              </el-button>
              &nbsp;
              <el-button
                v-if="checkPermission(['create-gap assessment'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="outline-secondary"
                @click="uploadBulk = true"
              >
                <icon icon="UploadIcon" class="mr-50" />
                <span class="align-middle">Upload Bulk Questions</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
      <hr />
      <!-- table -->
      <aside>
        <el-row :gutter="10">
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
                :label="`${clause.name} - ${clause.description}`"
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
      <v-client-table v-model="questions" v-loading="loading" :columns="columns" :options="options">
        <template v-slot:question="{ row }">
          <div>
            <strong>{{
              row.section ? `${row.section.name} - ${row.section.description}` : ''
            }}</strong>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="row.question"></span>
            <!-- <ckeditor
            v-model="row.question"
            :editor="editor"
            :config="editorConfig"
            disabled
          /> -->
            <em>{{ row.hint !== null ? `Hint: ${row.hint}` : '' }}</em>
          </div>
        </template>
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
      <!-- <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="fetchQuestions"
        />
      </el-row> -->
      <create-question
        v-if="isCreateQuestionSidebarActive"
        v-model="isCreateQuestionSidebarActive"
        @save="updateTable"
      />
      <edit-question
        v-if="isEditQuestionSidebarActive"
        v-model="isEditQuestionSidebarActive"
        :selected-question="editable_row"
        @update="updateEditedTableRow"
      />
    </div>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import CreateQuestion from './partials/CreateQuestion.vue'
import EditQuestion from './partials/EditQuestion.vue'
import CreateBulkQuestion from './partials/CreateBulkQuestion.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    CreateQuestion,
    CreateBulkQuestion,
    EditQuestion
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
        'action',
        'question',
        // 'clause.name',
        // 'question_type',
        'answer_type',
        'upload_evidence',
        'can_have_exception'
      ],

      options: {
        headings: {
          'clause.name': 'Clause',
          upload_evidence: 'Can Upload Evidence'
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
        sortable: ['question'],
        // filterable: false,
        filterable: ['question']
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
    this.fetchClauses()
  },
  methods: {
    checkPermission,
    // fetchStandards() {
    //
    //   const fetchStandardsResource = new Resource('standards/with-clauses')
    //   fetchStandardsResource.list()
    //     .then(response => {
    //       this.standards = response.standards
    //     })
    // },
    fetchClauses() {
      this.loading = true
      const fetchClausesResource = new Resource('ndpa/clauses')
      fetchClausesResource.list(this.query).then((response) => {
        this.clauses = response.clauses
        this.loading = false
      })
    },
    fetchQuestions() {
      this.loading = true
      const fetchQuestionsResource = new Resource('ndpa/questions')
      fetchQuestionsResource.list(this.query).then((response) => {
        this.questions = response.questions
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
        const destroyQuestionsResource = new Resource('ndpa/questions/destroy')
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
