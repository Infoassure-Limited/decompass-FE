<template>
  <el-card>
    <template v-slot:header>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>Manage Units</h4>
          </el-col>
          <el-col cols="6">
            <span class="pull-right">
              <el-button
                v-if="checkPermission(['create-unit'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                @click="isCreateConsultingSidebarActive = true"
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

    <v-client-table :data="consultings" v-loading="loading" :columns="columns" :options="options">
      <template v-slot:action="props">
        <div>
          <el-button
            v-if="checkPermission(['update-unit'])"
            variant="gradient-warning"
            class="btn-icon rounded-circle"
            @click="editThisRow(props.row)"
          >
            <feather-icon icon="EditIcon" />
          </el-button>
          <el-button
            v-if="checkPermission(['delete-unit'])"
            variant="gradient-danger"
            class="btn-icon rounded-circle"
            @click="destroyRow(props.row)"
          >
            <feather-icon icon="TrashIcon" />
          </el-button>
        </div>
      </template>
    </v-client-table>
    <create-consultings
      v-if="isCreateConsultingSidebarActive"
      v-model="isCreateConsultingSidebarActive"
      @save="updateTable"
    />
    <edit-consulting
      v-if="isEditConsultingSidebarActive"
      v-model="isEditConsultingSidebarActive"
      :selected-consulting="editable_row"
      @update="updateEditedTableRow"
    />
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import CreateConsultings from './partials/CreateConsultings.vue'
import EditConsulting from './partials/EditConsulting.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    CreateConsultings,
    EditConsulting
  },
  data() {
    return {
      loading: false,
      isCreateConsultingSidebarActive: false,
      isEditConsultingSidebarActive: false,
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
        // 'description',
        'action'
      ],

      options: {
        headings: {},
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
      consultings: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: ''
    }
  },
  created() {
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
    updateTable() {
      this.fetchConsultings()
    },
    editThisRow(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.editable_row = selectedRow
      this.isEditConsultingSidebarActive = true
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyConsultingsResource = new Resource('consultings/destroy')
        destroyConsultingsResource.destroy(row.id).then(() => {
          this.fetchConsultings()
          this.loading = false
        })
      }
    },
    updateEditedTableRow() {
      this.fetchConsultings()
    }
  }
}
</script>
