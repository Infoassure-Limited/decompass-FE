<template>
  <el-card>
    <template v-slot:header>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>Available Permissions</h4>
          </el-col>
          <el-col cols="6">
            <span class="pull-right">
              <el-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                @click="isCreatePermissionSidebarActive = true"
              >
                <feather-icon icon="FilePlusIcon" class="mr-50" />
                <span class="align-middle">Create</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
    </template>
    <!-- table -->

    <v-client-table :data="permissions" v-loading="loading" :columns="columns" :options="options">
      <!-- <div
        slot="action"
        slot-scope="props"
      >
        <el-button
          variant="gradient-warning"
          class="btn-icon rounded-circle"
          @click="editThisRow(props.row)"
        >
          <feather-icon icon="EditIcon" />
        </el-button>
      </div> -->
    </v-client-table>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    return {
      loading: false,
      isCreatePermissionSidebarActive: false,
      isEditPermissionSidebarActive: false,
      pageLength: 10,
      dir: false,

      columns: [
        // 'name',
        'display_name'
        // 'description',
        // 'action',
      ],

      options: {
        headings: {
          display_name: 'Permission',
          action: ''

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: [
          // 'name',
          'display_name'
          // 'description',
        ],
        // filterable: false,
        filterable: [
          // 'name',
          'display_name'
          // 'description',
        ]
      },
      permissions: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: ''
    }
  },
  created() {
    this.fetchPermissions()
  },
  methods: {
    fetchPermissions() {
      this.loading = true
      const fetchCurriculumSetupResource = new Resource('acl/permissions/index')
      fetchCurriculumSetupResource.list().then((response) => {
        this.permissions = response.permissions
        this.loading = false
      })
    },
    updateTable(permissions) {
      this.permissions = permissions
    },
    editThisRow(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.editable_row = selectedRow
      this.isEditPermissionSidebarActive = true
    },
    updateEditedTableRow() {
      this.fetchPermissions()
    }
  }
}
</script>
