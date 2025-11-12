<template>
  <el-card>
    <template v-slot:header>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>Manage Clauses</h4>
          </el-col>
          <el-col cols="6">
            <span class="pull-right">
              <el-button
                v-if="checkPermission(['create-clauses'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                @click="isCreateClauseSidebarActive = true"
              >
                <feather-icon icon="PlusIcon" class="mr-50" />
                <span class="align-middle">Create</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-row :gutter="10">
      <el-col :lg="12">
        <el-select
          v-model="query.standard_id"
          style="width: 100%"
          placeholder="Select Standard"
          filterable
          @input="fetchClauses()"
        >
          <el-option
            v-for="(standard, index) in standards"
            :key="index"
            :value="standard.id"
            :label="standard.name"
          />
        </el-select>
      </el-col>
    </el-row>
    <br />
    <!-- table -->
    <el-alert v-if="clauses.length > 0"> Click on the + sign to view document templates </el-alert>
    <v-client-table v-model="clauses" v-loading="loading" :columns="columns" :options="options">
      <template v-slot:child_row="props">
        <strong>Document Templates for {{ props.row.name }}</strong>
        <aside>
          <v-client-table
            v-model="props.row.templates"
            :columns="['title', 'action']"
            :options="{}"
          >
            <template v-slot:action="{ row }">
              <div>
                <a :href="baseServerUrl + 'storage/' + row.link" target="_blank">
                  <el-button variant="gradient-warning" class="btn-icon rounded-circle">
                    <feather-icon icon="DownloadIcon" />
                  </el-button>
                </a>
                <el-button
                  variant="gradient-danger"
                  class="btn-icon rounded-circle"
                  @click="destroyTemplate(row)"
                >
                  <feather-icon icon="XIcon" />
                </el-button>
              </div>
            </template>
          </v-client-table>
        </aside>
      </template>
      <template v-slot:sort_by="{ row }">
        <div>
          <input
            v-model="row.sort_by"
            placeholder="Enter Sort Value"
            type="number"
            class="form-control"
            @change="setSortValue($event, row.id)"
          />
        </div>
      </template>
      <template v-slot:will_have_audit_questions="props">
        <div>
          {{ props.row.will_have_audit_questions === 1 ? 'YES' : 'NO' }}
        </div>
      </template>
      <template v-slot:requires_document_upload="props">
        <div>
          {{ props.row.requires_document_upload === 1 ? 'YES' : 'NO' }}
        </div>
      </template>
      <template v-slot:action="props">
        <div>
          <el-tooltip
            class="item"
            effect="dark"
            content="Add document template"
            placement="top-start"
          >
            <el-button
              variant="gradient-primary"
              class="btn-icon rounded-circle"
              @click="addDocumentTemplate(props.row)"
            >
              <feather-icon icon="UploadIcon" />
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Edit Clause" placement="top-start">
            <el-button
              v-if="checkPermission(['update-clauses'])"
              variant="gradient-warning"
              class="btn-icon rounded-circle"
              @click="editThisRow(props.row)"
            >
              <feather-icon icon="EditIcon" />
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Remove Clause" placement="top-start">
            <el-button
              v-if="checkPermission(['delete-clauses'])"
              variant="gradient-danger"
              class="btn-icon rounded-circle"
              @click="destroyRow(props.row)"
            >
              <feather-icon icon="TrashIcon" />
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
        @pagination="fetchClauses"
      />
    </el-row>
    <el-modal v-model="showModal" title="Add Document Template" centered size="lg" hide-footer>
      <add-document-template :clause="selectedClause" @reload="fetchClauses" />
    </el-modal>
    <create-clauses
      v-if="isCreateClauseSidebarActive"
      v-model="isCreateClauseSidebarActive"
      :standards="standards"
      @save="updateTable"
    />
    <edit-clause
      v-if="isEditClauseSidebarActive"
      v-model="isEditClauseSidebarActive"
      :standards="standards"
      :selected-clause="editable_row"
      @update="updateEditedTableRow"
    />
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import CreateClauses from './partials/CreateClauses.vue'
import EditClause from './partials/EditClause.vue'
import Pagination from '@/views/Components/Pagination-main/index.vue'
import AddDocumentTemplate from './partials/AddDocumentTemplate.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    AddDocumentTemplate,
    CreateClauses,
    EditClause,
    Pagination
  },
  data() {
    return {
      sortValue: 1,
      showModal: false,
      selectedClause: null,
      loading: false,
      loadEntry: false,
      isCreateClauseSidebarActive: false,
      isEditClauseSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'sort_by',
        'name',
        'standard.name',
        'will_have_audit_questions',
        'requires_document_upload',
        'action'
      ],

      options: {
        headings: {
          'standard.name': 'Standard',
          requires_document_upload: 'Requires Document Upload',
          will_have_audit_questions: 'Has Audit Question'
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
        sortable: ['name'],
        // filterable: false,
        filterable: ['name']
      },
      clauses: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      standards: [],
      query: {
        page: 1,
        limit: 10,
        standard_id: ''
      },
      total: 0
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    // this.fetchClauses()
    this.fetchStandards()
  },
  methods: {
    checkPermission,
    setSortValue(event, id) {
      const { value } = event.target
      if (value > 0) {
        const sortResource = new Resource('clauses/set-sort-value')
        sortResource
          .update(id, { value })
          .then(() => {})
          .catch((e) => {
            this.$message(e.response.data.message)
          })
      }
    },
    fetchStandards() {
      const fetchStandardsResource = new Resource('standards')
      fetchStandardsResource.list().then((response) => {
        this.standards = response.standards
      })
    },
    fetchClauses() {
      const { limit, page } = this.query
      this.loading = true
      const fetchClausesResource = new Resource('clauses')
      fetchClausesResource.list(this.query).then((response) => {
        this.clauses = response.clauses.data
        this.clauses.forEach((element, index) => {
          element['index'] = (page - 1) * limit + index + 1
        })
        this.total = response.clauses.total
        this.loading = false
      })
    },
    updateTable() {
      this.fetchClauses()
    },
    addDocumentTemplate(selectedRow) {
      this.selectedClause = selectedRow
      this.showModal = true
    },
    editThisRow(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.editable_row = selectedRow
      this.isEditClauseSidebarActive = true
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyClausesResource = new Resource('clauses/destroy')
        destroyClausesResource
          .destroy(row.id)
          .then(() => {
            this.fetchClauses()
            this.loading = false
          })
          .catch((e) => {
            this.load = false
            this.$message(e.response.message)
          })
      }
    },
    destroyTemplate(row) {
      if (window.confirm('Are you sure you want to delete this template?')) {
        this.loading = true
        const destroyTemplateResource = new Resource('clauses/destroy-template')
        destroyTemplateResource
          .destroy(row.id)
          .then(() => {
            this.fetchClauses()
            this.loading = false
          })
          .catch((e) => {
            this.load = false
            this.$message(e.response.message)
          })
      }
    },
    updateEditedTableRow() {
      this.fetchClauses()
    }
  }
}
</script>
