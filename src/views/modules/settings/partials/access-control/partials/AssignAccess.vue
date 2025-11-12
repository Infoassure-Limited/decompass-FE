<template>
  <div v-loading="loading">
    <aside>
      <el-row :gutter="20">
        <el-col :md="20">
          <h3>List of available permissions</h3>
          <em>Check the permission you wish to assign and then click on the SUBMIT button</em>
        </el-col>
        <el-col :md="4">
          <span class="pull-right">
            <el-button type="success" @click="assignPermissions()">Submit</el-button>
          </span>
        </el-col>
      </el-row>
    </aside>
    <div style="height: 450px; overflow: auto">
      <el-collapse accordion>
        <el-collapse-item v-for="(permissions_array, index) in permissions" :key="index">
          <template #title>
            <h4>{{ index }}</h4>
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
    role: {
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
    this.setPermissions()
  },
  methods: {
    setPermissions() {
      const rolePermissions = this.role.permissions
      rolePermissions.forEach((permission) => {
        this.new_permissions.push(permission.id)
      })
    },
    assignPermissions() {
      const roleId = this.role.id
      const assignPermissionResource = new Resource('acl/permissions/assign-role')
      const param = { role_id: roleId, permissions: this.new_permissions }
      this.loading = true
      assignPermissionResource
        .store(param)
        .then((response) => {
          this.$emit('assigned')
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
