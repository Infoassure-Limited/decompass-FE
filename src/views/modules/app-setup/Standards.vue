<template>
  <el-card>
    <template>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>Manage Standards</h4>
          </el-col>
          <el-col cols="6">
            <span class="pull-right">
              <el-button
                v-if="checkPermission(['create-standards'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                @click="isCreateStandardSidebarActive = true"
              >
                <feather-icon icon="PlusIcon" class="mr-50" />
                <span class="align-middle">Create</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
    </template>
    <!-- table -->

    <v-client-table :data="standards" v-loading="loading" :columns="columns" :options="options">
      <template v-slot:action="props">
        <div>
          <el-button
            v-if="checkPermission(['update-standards'])"
            variant="gradient-warning"
            class="btn-icon rounded-circle"
            @click="editThisRow(props.row)"
          >
            <feather-icon icon="EditIcon" />
          </el-button>
          <el-button
            v-if="checkPermission(['delete-standards'])"
            variant="gradient-danger"
            class="btn-icon rounded-circle"
            @click="destroyRow(props.row)"
          >
            <feather-icon icon="TrashIcon" />
          </el-button>
        </div>
      </template>
    </v-client-table>
    <create-standards
      v-if="isCreateStandardSidebarActive"
      v-model="isCreateStandardSidebarActive"
      :consultings="consultings"
      @save="updateTable"
    />
    <edit-standard
      v-if="isEditStandardSidebarActive"
      v-model="isEditStandardSidebarActive"
      :selected-standard="editable_row"
      :consultings="consultings"
      @update="updateEditedTableRow"
    />
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import CreateStandards from './partials/CreateStandards.vue'
import EditStandard from './partials/EditStandard.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    CreateStandards,
    EditStandard
  },
  data() {
    return {
      loading: false,
      isCreateStandardSidebarActive: false,
      isEditStandardSidebarActive: false,
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
        'name',
        'consulting.name',
        'assessment_activities',
        // 'description',
        'action'
      ],

      options: {
        headings: {
          'consulting.name': 'Unit'
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
        sortable: ['name', 'consulting.name'],
        // filterable: false,
        filterable: ['name', 'consulting.name']
      },
      standards: [],
      consultings: [],
      editable_row: '',
      selected_row_index: ''
    }
  },
  created() {
    this.fetchStandards()
    this.fetchConsultings()
  },
  methods: {
    checkPermission,
    fetchConsultings() {
      this.loading = true
      const fetchConsultingsResource = new Resource('consultings')
      fetchConsultingsResource.list().then((response) => {
        this.consultings = response.consultings
        this.loading = false
      })
    },
    fetchStandards() {
      this.loading = true
      const fetchStandardsResource = new Resource('standards')
      fetchStandardsResource.list().then((response) => {
        this.standards = response.standards
        this.loading = false
      })
    },
    updateTable() {
      this.fetchStandards()
    },
    editThisRow(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.editable_row = selectedRow
      this.isEditStandardSidebarActive = true
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyStandardsResource = new Resource('standards/destroy')
        destroyStandardsResource.destroy(row.id).then(() => {
          this.fetchStandards()
          this.loading = false
        })
      }
    },
    updateEditedTableRow() {
      this.fetchStandards()
    }
  }
}
</script>
