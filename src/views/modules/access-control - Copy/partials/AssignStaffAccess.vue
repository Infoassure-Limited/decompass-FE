<template>
  <div>
    <div>
      <b-row>
        <b-col cols="7">
          <h3> List of Staff </h3>
        </b-col>
      </b-row>
      <hr />
    </div>
    <aside>
      <el-row :gutter="5">
        <el-col :lg="8" :md="8" :sm="24" :xs="24">
          <el-select
            v-model="selected_user_index"
            filterable
            style="width: 100%"
            placeholder="Select Staff"
            @input="setRolesAndPermissions()"
          >
            <!-- <el-option
              v-for="(each_staff, index) in staff"
              :key="index"
              :value="index"
              :label="each_staff.user.first_name + ' ' + each_staff.user.last_name"
              :disabled="disableAdmin(each_staff.user.roles)"
            /> -->
            <el-option
              v-for="(each_staff, index) in staff"
              :key="index"
              :value="index"
              :label="each_staff.name"
            />
          </el-select>
        </el-col>
        <el-col :lg="8" :md="8" :sm="24" :xs="24">
          <el-select
            v-model="new_roles"
            multiple
            filterable
            collapse-tags
            style="width: 100%"
            placeholder="Select Roles"
            @change="assignRoles()"
          >
            <el-option
              v-for="(role, index) in staff_roles"
              :key="index"
              :value="role.id"
              :label="role.display_name"
            />
          </el-select>
        </el-col>
        <el-col :lg="8" :md="8" :sm="24" :xs="24">
          <el-select
            v-model="new_permissions"
            multiple
            filterable
            collapse-tags
            style="width: 100%"
            placeholder="Select Permissions"
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
    <div>
      <v-client-table v-model="staff" v-loading="loading" :columns="columns" :options="options">
        <template v-slot:name="props">
          {{ props.row.user.first_name + ' ' + props.row.user.last_name }}
        </template>
        <template v-slot:assigned_roles="props">
          <div>
            <span v-for="(role, role_index) in props.row.user.roles" :key="role_index">
              <small>{{ role_index + 1 + ') ' + role.display_name }}<br /></small>
            </span>
          </div>
        </template>
        <template v-slot:assigned_permissions="props">
          <div>
            <span v-for="(permission, perm_index) in props.row.user.permissions" :key="perm_index">
              <small>{{ perm_index + 1 + ') ' + permission.display_name }}<br /></small>
            </span>
          </div>
        </template>
        <!-- Removed deprecated slot and slot-scope, use v-slot above if needed -->
      </v-client-table>
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    return {
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: ['user.username', 'name', 'assigned_roles', 'assigned_permissions'],

      options: {
        headings: {
          'user.username': 'ID',
          name: 'Name',
          assigned_roles: 'Assigned Roles',
          assigned_permissions: 'Assigned Permissions'

          // id: 'S/N',
        },
        sortable: ['user.username', 'user.last_name', 'user.first_name'],
        // filterable: false,
        filterable: ['user.username', 'user.last_name', 'user.first_name']
      },
      staff: [],
      staff_roles: [],
      permissions: [],
      new_roles: [],
      new_permissions: [],
      selected_user_index: '',
      loading: false
    }
  },
  created() {
    this.fetchPermissions()
    this.fetchRoles()
    this.fetchStaff()
  },
  methods: {
    disableAdmin(roles) {
      let response = false
      roles.forEach((role) => {
        if (role.name === 'admin') {
          response = true
        }
      })
      return response
    },
    fetchStaff() {
      this.loading = true
      const fetchStaffResource = new Resource('users/fetch-staff')
      fetchStaffResource.list().then((response) => {
        this.staff = response.staff
        this.loading = false
      })
    },
    fetchPermissions() {
      const fetchCurriculumSetupResource = new Resource('acl/permissions/index')
      fetchCurriculumSetupResource.list().then((response) => {
        this.permissions = response.permissions
      })
    },
    fetchRoles() {
      const fetchCurriculumSetupResource = new Resource('acl/roles/index')
      fetchCurriculumSetupResource.list({ option: 'staff' }).then((response) => {
        this.staff_roles = response.roles
      })
    },
    setRolesAndPermissions() {
      const userIndex = this.selected_user_index
      this.new_permissions = []
      this.new_roles = []
      // console.log(this.staff[userIndex].user)
      const userRoles = this.staff[userIndex].user.roles
      userRoles.forEach((role) => {
        this.new_roles.push(role.id)
      })
      const userPermissions = this.staff[userIndex].user.permissions
      userPermissions.forEach((permission) => {
        this.new_permissions.push(permission.id)
      })
    },
    assignRoles() {
      const userId = this.staff[this.selected_user_index].user.id
      const fetchCurriculumSetupResource = new Resource('acl/roles/assign')
      const param = { user_id: userId, roles: this.new_roles }
      fetchCurriculumSetupResource.store(param).then((response) => {
        this.staff[this.selected_user_index].user.roles = response.roles
        this.staff[this.selected_user_index].user.permissions = response.permissions
      })
    },
    assignPermissions() {
      const userId = this.staff[this.selected_user_index].user.id
      const fetchCurriculumSetupResource = new Resource('acl/permissions/assign-user')
      const param = { user_id: userId, permissions: this.new_permissions }
      fetchCurriculumSetupResource.store(param).then((response) => {
        this.staff[this.selected_user_index].user.permissions = response.permissions
      })
    }
  }
}
</script>
