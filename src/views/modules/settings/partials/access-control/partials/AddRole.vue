<template>
  <div class="justify-content-between align-items-center px-2 py-1">
    <el-row v-loading="loading">
      <!-- Role Name -->
      <el-col cols="12">
        <v-text-field
          v-model="form.name"
          variant="outlined"
          label="Role Name"
          placeholder="ISMS Manager"
        />
      </el-col>
      <!-- Abbrev -->
      <el-col cols="12">
        <v-textarea
          v-model="form.description"
          variant="outlined"
          label="Role Description"
          placeholder="Briefly describe role..."
        />
      </el-col>
      <!-- submit and reset -->
      <el-col cols="12">
        <el-button type="primary" class="mr-1" @click="submit()"> Submit </el-button>
      </el-col>
      <el-col v-if="error" cols="12">
        <el-alert variant="danger" show>
          <div class="alert-body">
            <span
              ><strong>{{ error_message }}</strong></span
            >
          </div>
        </el-alert>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    isCreateRoleSidebarActive: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        description: ''
      },
      loading: false,
      error: false,
      error_message: ''
    }
  },
  methods: {
    submit() {
      this.loading = true
      const saveRoleResource = new Resource('acl/roles/save')
      const param = this.form
      saveRoleResource
        .store(param)
        .then((response) => {
          this.loading = false
          this.$emit('save', response.roles)
        })
        .catch((error) => {
          this.error = true
          this.$message(error.response.data.message)
          this.loading = false
        })
    }
  }
}
</script>
