<template>
  <el-card>
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
    <aside>
      <el-row :gutter="5">
        <el-col :lg="12" :md="12" :sm="12" :xs="12">
          <small>Select Role</small>
          <el-select
            v-model="selected_role_index"
            filterable
            style="width: 100%"
            @input="setPermissions()"
          >
            <!-- <el-option
              v-for="(role, index) in roles"
              :key="index"
              :value="index"
              :disabled="role.name === 'admin'"
              :label="role.display_name"
            /> -->
            <el-option
              v-for="(role, index) in roles"
              :key="index"
              :value="index"
              :label="role.display_name"
              :disabled="role.name === 'super'"
            />
          </el-select>
        </el-col>
        <el-col :lg="12" :md="12" :sm="12" :xs="12">
          <small>Select relevant permissions to assign to selected role</small>
          <el-select
            v-model="new_permissions"
            multiple
            filterable
            collapse-tags
            style="width: 100%"
            @change="assignPermissions()"
          >
            <el-option
              v-for="(permission, index) in permissions"
              :key="index"
              :value="permission.id"
              :label="permission.display_name"
            />
          </el-select>
        </el-col>
      </el-row>
    </aside>
    <!-- table -->

    <v-client-table :data="roles" v-loading="loading" :columns="columns" :options="options">
      <template v-slot:assigned_permissions="props">
        <div>
          <span v-for="(permission, perm_index) in props.row.permissions" :key="perm_index">
            <el-tag>{{ perm_index + 1 + ') ' + permission.display_name }}</el-tag
            >&nbsp;
          </span>
        </div>
      </template>
      <template v-slot:action="props">
        <div>
          <template v-if="school">
            <el-button
              v-if="school.id === props.row.school_id"
              variant="gradient-warning"
              class="btn-icon rounded-circle"
              @click="editThisRow(props.row)"
            >
              <feather-icon icon="EditIcon" />
            </el-button>
          </template>
          <template v-else>
            <el-button
              variant="gradient-warning"
              class="btn-icon rounded-circle"
              @click="editThisRow(props.row)"
            >
              <feather-icon icon="EditIcon" />
            </el-button>
          </template>
        </div>
      </template>
    </v-client-table>
    <el-dialog
      title="Create Role"
      v-if="isCreateRoleSidebarActive"
      v-model="isCreateRoleSidebarActive"
    >
      <create-role @save="updateTable" />
    </el-dialog>
    <el-dialog title="Edit Role" v-if="isEditRoleSidebarActive" v-model="isEditRoleSidebarActive">
      <edit-role :selected-role="editable_row" @update="updateEditedTableRow" />
    </el-dialog>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import CreateRole from './partials/AddRole.vue'
import EditRole from './partials/EditRole.vue'

export default {
  components: {
    // VueGoodTable,
    CreateRole,
    EditRole
  },
  data() {
    return {
      loading: false,
      isCreateRoleSidebarActive: false,
      isEditRoleSidebarActive: false,
      pageLength: 10,

      columns: [
        // 'name',
        'display_name',
        'description',
        'assigned_permissions',
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
    fetchRoles() {
      this.loading = true
      const fetchCurriculumSetupResource = new Resource('acl/roles/index')
      fetchCurriculumSetupResource.list().then((response) => {
        this.roles = response.roles
        this.school = response.school
        this.loading = false
      })
    },
    fetchPermissions() {
      const fetchCurriculumSetupResource = new Resource('acl/permissions/index')
      fetchCurriculumSetupResource.list().then((response) => {
        this.permissions = response.permissions
      })
    },
    updateTable(roles) {
      this.roles = roles
    },
    editThisRow(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.editable_row = selectedRow
      this.isEditRoleSidebarActive = true
    },
    updateEditedTableRow() {
      this.fetchRoles()
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
