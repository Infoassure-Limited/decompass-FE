<template>
  <el-card>
    <template v-slot:header>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>Manage Evidence</h4>
          </el-col>
          <el-col cols="6">
            <span class="pull-right">
              <el-button
                v-if="checkPermission(['create-evidence'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                @click="isCreateEvidenceSidebarActive = true"
              >
                <icon icon="PlusIcon" class="mr-50" />
                <span class="align-middle">Create</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
    </template>
    <!-- table -->
    <el-row :gutter="10">
      <el-col :lg="8">
        <el-select
          v-model="selectedConsulting"
          value-key="id"
          style="width: 100%"
          placeholder="Select Unit"
          @input="setStandards()"
        >
          <el-option
            v-for="(consulting, index) in consultings"
            :key="index"
            :value="consulting"
            :label="consulting.name"
          />
        </el-select>
      </el-col>
      <el-col :lg="8">
        <el-select
          v-model="form.standard_id"
          style="width: 100%"
          placeholder="Select Standard"
          filterable
          @input="fetchEvidence()"
        >
          <el-option
            v-for="(standard, index) in standards"
            :key="index"
            :value="standard.id"
            :label="standard.name"
          />
        </el-select>
      </el-col>
      <!-- <el-col :lg="6">
        <el-button
          type="primary"
          :disabled="form.standard_id === ''"
          @click="fetchEvidence()"
        >
          Fetch
        </el-button>
      </el-col> -->
    </el-row>
    <v-client-table v-model="evidence" v-loading="loading" :columns="columns" :options="options">
      <template v-slot:sub_document_titles="{ row }">
        <div>
          <ol v-if="row.sub_document_titles !== null">
            <li
              v-for="(sub_document_title, title_index) in splitStringToArray(
                row.sub_document_titles
              )"
              :key="title_index"
            >
              {{ sub_document_title }}
            </li>
          </ol>
        </div>
      </template>
      <template v-slot:action="props">
        <div>
          <el-button
            v-if="checkPermission(['update-evidence'])"
            variant="gradient-warning"
            class="btn-icon rounded-circle"
            @click="editThisRow(props.row)"
          >
            <icon icon="EditIcon" />
          </el-button>
          <el-button
            v-if="checkPermission(['delete-evidence'])"
            variant="gradient-danger"
            class="btn-icon rounded-circle"
            @click="destroyRow(props.row)"
          >
            <icon icon="TrashIcon" />
          </el-button>
        </div>
      </template>
    </v-client-table>
    <create-evidence
      v-if="isCreateEvidenceSidebarActive"
      v-model="isCreateEvidenceSidebarActive"
      :consultings="consultings"
      @save="updateTable"
    />
    <edit-evidence
      v-if="isEditEvidenceSidebarActive"
      v-model="isEditEvidenceSidebarActive"
      :selected-evidence="editable_row"
      :consultings="consultings"
      @update="updateEditedTableRow"
    />
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import CreateEvidence from './partials/CreateEvidence.vue'
import EditEvidence from './partials/EditEvidence.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    CreateEvidence,
    EditEvidence
  },
  directives: {
    Ripple
  },
  data() {
    return {
      loading: false,
      isCreateEvidenceSidebarActive: false,
      isEditEvidenceSidebarActive: false,
      pageLength: 10,
      dir: false,
      // columns: [
      //   {
      //     label: '#',
      //     field: 'id',
      //   },
      //   {
      //     label: 'Name',
      //     field: 'name',
      //   },
      //   {
      //     label: 'Curriculum',
      //     field: 'curriculum_category',
      //   },
      //   {
      //     label: 'Action',
      //     field: 'action',
      //   },
      // ],
      columns: [
        'title',
        'standard.name',
        'upload_type',
        'sub_document_titles',
        // 'description',
        'action'
      ],

      options: {
        headings: {
          'standard.name': 'Standard'
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
        sortable: ['title', 'standard.name'],
        // filterable: false,
        filterable: ['title', 'standard.name']
      },
      evidence: [],
      consultings: [],
      editable_row: '',
      selected_row_index: '',
      selectedConsulting: '',
      standards: [],
      form: {
        standard_id: ''
      }
    }
  },
  created() {
    // this.fetchEvidence()
    this.fetchConsultings()
  },
  methods: {
    checkPermission,
    splitStringToArray(str) {
      return str.split('|')
    },
    setStandards() {
      this.form.standard_id = ''
      this.standards = this.selectedConsulting.standards
    },
    fetchConsultings() {
      this.loading = true
      const fetchConsultingsResource = new Resource('consultings')
      fetchConsultingsResource.list().then((response) => {
        this.consultings = response.consultings
        this.loading = false
      })
    },
    fetchEvidence() {
      this.loading = true
      const fetchEvidenceResource = new Resource('evidence')
      fetchEvidenceResource.list(this.form).then((response) => {
        this.evidence = response.evidence
        this.loading = false
      })
    },
    updateTable() {
      this.fetchEvidence()
    },
    editThisRow(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.editable_row = selectedRow
      this.isEditEvidenceSidebarActive = true
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyEvidenceResource = new Resource('evidence/destroy')
        destroyEvidenceResource.destroy(row.id).then(() => {
          this.fetchEvidence()
          this.loading = false
        })
      }
    },
    updateEditedTableRow() {
      this.fetchEvidence()
    }
  }
}
</script>
