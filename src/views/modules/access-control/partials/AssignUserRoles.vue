<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :md="24" :xs="24">
        <div>
          <el-button class="pull-right" type="text" @click="isCreateRoleSidebarActive = true">
            <icon icon="tabler:plus" /> Click to add new role
          </el-button>
          <label for="">Select Roles</label>
        </div>
        <hr />
        <el-row :gutter="20">
          <el-col :md="6" v-for="(role, index) in roles" :key="index">
            <el-checkbox-group v-model="new_roles">
              <el-checkbox
                :disabled="role.client_id === null"
                :value="role.id"
                :label="role.display_name"
                size="large"
                border
              />
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <aside>
      <el-row :gutter="20">
        <el-col :md="20">
          <strong> Check the roles you wish to assign and then click on the SUBMIT button </strong>
          <br />
          <em>{{ user.name }} will inherit the permissions already assigned to the roles</em>
        </el-col>
        <el-col :md="4">
          <span class="pull-right">
            <el-button type="success" @click="assignRoles()">Submit</el-button>
          </span>
        </el-col>
      </el-row>
    </aside>
    <el-dialog
      title="Create Role"
      v-if="isCreateRoleSidebarActive"
      v-model="isCreateRoleSidebarActive"
    >
      <AddRole @save="fetchRoles" />
    </el-dialog>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import AddRole from './AddRole.vue'

export default {
  components: {
    AddRole
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    permissions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isCreateRoleSidebarActive: false,
      user_roles: [],
      roles: [],
      permissions_array: [],
      role_permissions: [],
      new_roles: [],
      new_permissions: [],
      selected_user_index: '',
      loading: false
    }
  },
  mounted() {
    this.fetchRoles()
    this.fetchUserDetails()
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
    fetchRoles() {
      this.isCreateRoleSidebarActive = false
      const fetchRoleResource = new Resource('acl/roles/index')
      fetchRoleResource.list().then((response) => {
        this.roles = response.roles
      })
    },
    fetchUserDetails() {
      this.loading = true
      const fetchStaffResource = new Resource('users/show')
      fetchStaffResource
        .get(this.user.id)
        .then((response) => {
          this.user_roles = response.user.roles
          // this.new_permissions = response.user.permissions
          this.loading = false
          this.setUserRoles()
        })
        .catch(() => {
          this.loading = false
        })
    },
    setUserRoles() {
      this.new_roles = []
      this.user_roles.forEach((role) => {
        this.new_roles.push(role.id)
      })
    },
    assignRoles() {
      const userId = this.user.id
      const assignRolesResource = new Resource('acl/roles/assign')
      const param = { user_id: userId, roles: this.new_roles }
      this.loading = true
      assignRolesResource
        .store(param)
        .then((response) => {
          this.$message('Action Successful')
          this.loading = false
          // this.$emit('assigned')
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
