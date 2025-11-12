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
        <el-button type="primary" class="mr-1" @click="update()"> Update </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    isEditRoleSidebarActive: {
      type: Boolean,
      required: true
    },
    selectedRole: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        description: '',
        level_groups: []
      },
      loading: false
    }
  },
  created() {
    this.form.id = this.selectedRole.id
    this.form.name = this.selectedRole.name
    this.form.description = this.selectedRole.description
  },
  methods: {
    update() {
      this.loading = true
      const updateCurriculumSetupResource = new Resource('acl/roles/update')
      const param = this.form
      updateCurriculumSetupResource.update(param.id, param).then((response) => {
        this.loading = false
        this.$emit('update', response.roles)
        this.$emit('update:is-edit-level-sidebar-active', false)
      })
    }
  }
}
</script>
