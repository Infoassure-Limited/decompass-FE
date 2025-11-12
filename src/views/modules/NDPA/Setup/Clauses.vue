<template>
  <el-card>
    <template v-slot:header>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>List of Requirements</h4>
          </el-col>
          <el-col cols="6">
            <span class="pull-right">
              <el-button
                v-if="checkPermission(['create-clauses'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="outline-primary"
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
    <!-- <el-row :gutter="10">
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
    </el-row> -->
    <br />
    <!-- table -->
    <el-alert v-if="clauses.length > 0" type="success">
      Click on the + sign to view Sections
    </el-alert>
    <v-client-table :data="clauses" v-loading="loading" :columns="columns" :options="options">
      <template v-slot:child_row="props">
        <strong>Sections for {{ `${props.row.name} - ${props.row.description}` }}</strong>
        <aside>
          <v-client-table :data="props.row.sections" :columns="['name', 'action']" :options="{}">
            <template v-slot:name="{ row }">
              <div>
                {{ `${row.name} - ${row.description}` }}
              </div>
            </template>
            <template v-slot:action="{ row }">
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
                    @click="addDocumentTemplate(row)"
                  >
                    <feather-icon icon="UploadIcon" />
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Edit Section" placement="top-start">
                  <el-button
                    variant="gradient-secondary"
                    class="btn-icon rounded-circle"
                    @click="editSection(row)"
                  >
                    <feather-icon icon="EditIcon" />
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Delete Section"
                  placement="top-start"
                >
                  <el-button
                    variant="gradient-danger"
                    class="btn-icon rounded-circle"
                    @click="destroySection(row)"
                  >
                    <feather-icon icon="XIcon" />
                  </el-button>
                </el-tooltip>
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
          <el-dropdown v-ripple.400="'rgba(255, 255, 255, 0.15)'" class="mx-1" right text="Action">
            <el-dropdown-item @click="addSections(props.row)">
              <span><feather-icon icon="LayersIcon" /> Add Sections</span>
            </el-dropdown-item>

            <el-dropdown-item @click="editThisRow(props.row)">
              <span><feather-icon icon="EditIcon" /> Edit</span>
            </el-dropdown-item>
            <el-dropdown-item @click="destroyRow(props.row)">
              <span><feather-icon icon="TrashIcon" /> Delete</span>
            </el-dropdown-item>
          </el-dropdown>
        </div>
      </template>
    </v-client-table>
    <el-modal v-model="showSectionModal" title="Add Sections" centered size="lg" hide-footer>
      <add-sections :clause="selectedClause" @reload="fetchClauses" />
    </el-modal>
    <el-modal v-model="showEditSectionModal" title="Edit Sections" centered size="lg" hide-footer>
      <edit-section :section="selectedSection" @reload="fetchClauses" />
    </el-modal>
    <el-modal v-model="showModal" title="Add Document Template" centered size="lg" hide-footer>
      <add-document-template :section="selectedSection" @reload="fetchClauses" />
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
import AddDocumentTemplate from './partials/AddDocumentTemplate.vue'
import AddSections from './partials/AddSections.vue'
import EditSection from './partials/EditSection.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    AddDocumentTemplate,
    AddSections,
    EditSection,
    CreateClauses,
    EditClause
  },
  data() {
    return {
      sortValue: 1,
      showModal: false,
      showSectionModal: false,
      showEditSectionModal: false,
      selectedClause: null,
      selectedSection: null,
      loading: false,
      loadEntry: false,
      isCreateClauseSidebarActive: false,
      isEditClauseSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'sort_by',
        'name',
        'description',
        // 'standard.name',
        // 'will_have_audit_questions',
        // 'requires_document_upload',
        'action'
      ],

      options: {
        headings: {
          // 'standard.name': 'Standard',
          requires_document_upload: 'Requires Document Upload',
          will_have_audit_questions: 'Has Audit Question',
          action: ''
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
    this.fetchClauses()
    // this.fetchStandards()
  },
  methods: {
    checkPermission,
    setSortValue(event, id) {
      const { value } = event.target
      if (value > 0) {
        const sortResource = new Resource('ndpa/clauses/set-sort-value')
        sortResource
          .update(id, { value })
          .then(() => {})
          .catch((e) => {
            this.$message(e.response.data.message)
          })
      }
    },
    // fetchStandards() {
    //
    //   const fetchStandardsResource = new Resource('standards')
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
    updateTable() {
      this.fetchClauses()
    },
    addDocumentTemplate(selectedRow) {
      this.selectedSection = selectedRow
      this.showModal = true
    },
    addSections(selectedRow) {
      this.selectedClause = selectedRow
      this.showSectionModal = true
    },
    editSection(row) {
      this.selectedSection = row
      this.showEditSectionModal = true
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
        const destroyClausesResource = new Resource('ndpa/clauses/destroy')
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
        const destroyTemplateResource = new Resource('ndpa/clauses/destroy-template')
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
    destroySection(row) {
      if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
        this.loading = true
        const destroySectionResource = new Resource('ndpa/clauses/destroy-section')
        destroySectionResource
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
