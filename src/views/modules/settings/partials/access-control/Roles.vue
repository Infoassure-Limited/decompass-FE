<template>
  <el-card v-loading="loading">
    <template v-slot:header>
      <div>
        <el-row>
          <el-col :md="12">
            <h3>Available Roles</h3>
          </el-col>
          <el-col :md="12">
            <span class="pull-right">
              <el-button type="primary" @click="isCreateRoleSidebarActive = true">
                <icon icon="tabler:plus" />
                <span class="align-middle">Create Role</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
    </template>
    <v-client-table :data="roles" :columns="columns" :options="options">
      <!-- <template v-slot:assigned_permissions="props">
        <div>
          <span v-for="(permission, perm_index) in props.row.permissions" :key="perm_index">
            <el-tag>{{ perm_index + 1 + ') ' + permission.display_name }}</el-tag
            >&nbsp;
          </span>
        </div>
      </template> -->
      <template v-slot:action="props">
        <el-button-group>
          <el-button @click="editThisRow(props.row)"> <icon icon="tabler:edit" /> Edit </el-button>
          <el-button type="success" @click="grantPermissionToRole(props.row)">
            <icon icon="tabler:key" /> Grant Permission
          </el-button>
        </el-button-group>
      </template>
    </v-client-table>
    <el-dialog
      :title="`Grant Permissions to ${selectedRole.display_name}`"
      width="80%"
      v-if="showGrantPermissionModal"
      v-model="showGrantPermissionModal"
    >
      <AssignAccess
        v-if="showGrantPermissionModal"
        :role="selectedRole"
        :permissions="permissions"
        @assigned="updateTable"
      />
    </el-dialog>
    <el-dialog
      title="Create Role"
      v-if="isCreateRoleSidebarActive"
      v-model="isCreateRoleSidebarActive"
    >
      <create-role @save="updateTable" />
    </el-dialog>
    <el-dialog title="Edit Role" v-if="isEditRoleSidebarActive" v-model="isEditRoleSidebarActive">
      <edit-role
        v-if="isEditRoleSidebarActive"
        :selected-role="editable_row"
        @update="updateTable"
      />
    </el-dialog>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import CreateRole from './partials/AddRole.vue'
import EditRole from './partials/EditRole.vue'
import AssignAccess from './partials/AssignAccess.vue'

export default {
  components: {
    // VueGoodTable,
    CreateRole,
    EditRole,
    AssignAccess
  },
  data() {
    return {
      loading: false,
      showGrantPermissionModal: false,
      selectedRole: null,
      isCreateRoleSidebarActive: false,
      isEditRoleSidebarActive: false,
      pageLength: 10,

      columns: [
        // 'name',
        'display_name',
        'description',
        // 'assigned_permissions',
        'action'
      ],

      options: {
        headings: {
          display_name: 'Role',
          assigned_permissions: 'Assigned Permissions',
          action: ''

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        perPage: 10,
        // filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: [
          // 'name',
          'display_name',
          'description'
        ],
        // filterable: false,
        filterable: [
          // 'name',
          'display_name',
          'description'
        ]
      },
      roles: [],
      permissions: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      school: '',
      selected_role_index: '',
      new_permissions: []
    }
  },
  created() {
    this.fetchPermissions()
    this.fetchRoles()
  },
  methods: {
    fetchRoles(load = true) {
      this.loading = load
      const fetchRoleResource = new Resource('acl/roles/index')
      fetchRoleResource.list().then((response) => {
        this.roles = response.roles.filter((role) => role.client_id !== null)
        // this.roles = response.roles
        this.loading = false
      })
    },
    fetchPermissions() {
      const fetchPermissionResource = new Resource('acl/permissions/index')
      fetchPermissionResource.list().then((response) => {
        this.permissions = response.permissions
      })
    },
    updateTable(roles) {
      this.isCreateRoleSidebarActive = false
      this.isEditRoleSidebarActive = false
      this.showGrantPermissionModal = false
      this.fetchRoles(false)
    },
    grantPermissionToRole(role) {
      this.selectedRole = role
      this.showGrantPermissionModal = true
    },
    editThisRow(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.editable_row = selectedRow
      this.isEditRoleSidebarActive = true
    },
    setPermissions() {
      const roleIndex = this.selected_role_index
      const rolePermissions = this.roles[roleIndex].permissions
      rolePermissions.forEach((permission) => {
        this.new_permissions.push(permission.id)
      })
    },
    assignPermissions() {
      const roleId = this.roles[this.selected_role_index].id
      const fetchCurriculumSetupResource = new Resource('acl/permissions/assign-role')
      const param = { role_id: roleId, permissions: this.new_permissions }
      fetchCurriculumSetupResource.store(param).then((response) => {
        this.roles[this.selected_role_index].permissions = response.permissions
      })
    }
  }
}
</script>
