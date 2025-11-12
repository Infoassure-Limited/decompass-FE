<template>
  <div v-loading="loading">
    <aside>
      <el-row :gutter="20">
        <el-col :md="20">
          <h3>List of available permissions</h3>
          <em
            >Check the specific permissions you wish to assign and then click on the SUBMIT
            button</em
          >
        </el-col>
        <el-col :md="4">
          <span class="pull-right">
            <el-button type="success" @click="assignPermissions()">Submit</el-button>
          </span>
        </el-col>
      </el-row>
    </aside>
    <div style="height: 350px; overflow: auto">
      <el-collapse accordion>
        <el-collapse-item v-for="(permissions_array, index) in permissions" :key="index">
          <template #title>
            <h4>{{ index }} Permissions</h4>
          </template>
          <el-row :gutter="20">
            <el-col :md="6" v-for="(permission, perm_index) in permissions_array" :key="perm_index">
              <el-checkbox-group v-model="new_permissions">
                <el-checkbox
                  :value="permission.id"
                  :label="permission.display_name"
                  size="large"
                  border
                />
              </el-checkbox-group>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
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
      new_permissions: [],
      loading: false
    }
  },
  beforeMount() {
    this.fetchUserDetails()
  },
  methods: {
    fetchUserDetails() {
      this.loading = true
      const fetchStaffResource = new Resource('users/show')
      fetchStaffResource
        .get(this.user.id)
        .then((response) => {
          this.new_permissions = role.permissions.map((permission) => permission.id)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    assignPermissions() {
      const userId = this.user.id
      const assignPermissionResource = new Resource('acl/permissions/assign-user')
      const param = { user_id: userId, permissions: this.new_permissions }
      this.loading = true
      assignPermissionResource
        .store(param)
        .then((response) => {
          this.$message('Action Successful')
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
