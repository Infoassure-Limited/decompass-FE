<template>
  <el-card>
    <v-client-table :data="exceptions" v-loading="loading" :columns="columns" :options="options">
      <template v-slot:detail="{ row }">
        <div>
          <div v-if="row.answer_id !== null">
            <!--eslint-disable-next-line vue/no-v-html-->
            <span v-html="row.answer.question.question"></span>
          </div>
          <div v-if="row.upload_id !== null">
            {{ row.upload.template_title }}
          </div>
        </div>
      </template>
      <template v-slot:type="{ row }">
        <div>
          <div v-if="row.answer_id !== null"> Audit Question </div>
          <div v-if="row.upload_id !== null"> Document </div>
        </div>
      </template>
      <template v-slot:action="props">
        <div>
          <el-tooltip
            v-if="!isAdmin && selectedProject.is_completed === 0"
            content="Reverse"
            placement="bottom-start"
          >
            <el-button
              variant="gradient-warning"
              class="btn-icon rounded-circle"
              @click="reverseException(props.row)"
            >
              <feather-icon icon="CornerUpLeftIcon" />
            </el-button>
          </el-tooltip>
        </div>
      </template>
    </v-client-table>
    <el-row :gutter="20">
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="query.page"
        v-model:limit="query.limit"
        @pagination="fetchExceptions"
      />
    </el-row>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import Pagination from '@/views/Components/Pagination-main/index.vue'

export default {
  components: {
    // VueGoodTable,
    Pagination
  },
  directives: {
    Ripple
  },
  props: {
    selectedProject: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      loading: false,
      isCreateQuestionSidebarActive: false,
      isEditQuestionSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: ['clause.name', 'type', 'detail', 'reason', 'action'],

      options: {
        headings: {
          'clause.name': 'Clause'
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
        sortable: ['clause.name'],
        // filterable: false,
        filterable: ['clause.name']
      },
      exceptions: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      standards: [],
      query: {
        page: 1,
        limit: 50
      },
      total: 0
    }
  },
  created() {
    this.fetchExceptions()
  },
  methods: {
    fetchExceptions() {
      const { limit, page } = this.query
      const param = this.query
      param.client_id = this.selectedProject.client_id
      param.project_id = this.selectedProject.id
      this.loading = true
      const fetchQuestionsResource = new Resource('exceptions/fetch')
      fetchQuestionsResource.list(param).then((response) => {
        this.exceptions = response.exceptions.data
        this.exceptions.forEach((element, index) => {
          element['index'] = (page - 1) * limit + index + 1
        })
        this.total = response.exceptions.total
        this.loading = false
      })
    },
    reverseException(row) {
      if (window.confirm('Are you sure you want to reverse this entry?')) {
        this.loading = true
        const destroyQuestionsResource = new Resource('exceptions/reverse')
        destroyQuestionsResource.destroy(row.id).then(() => {
          this.fetchExceptions()
          this.$emit('reloadAnalytics')
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
