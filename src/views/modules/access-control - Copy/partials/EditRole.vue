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
      loading: false,
      curriculum_level_groups: []
    }
  },
  created() {
    this.form.id = this.selectedRole.id
    this.form.name = this.selectedRole.name
    this.form.description = this.selectedRole.description
    this.fetchCurriculumLevels()
  },
  methods: {
    fetchCurriculumLevels() {
      const fetchCurriculumSetupResource = new Resource(
        'school-setup/fetch-specific-curriculum-level-groups'
      )
      fetchCurriculumSetupResource.list().then((response) => {
        this.curriculum_level_groups = response.curriculum_level_groups

        this.form.level_groups = this.selectedRole.curriculum_level_group_ids
          ? this.selectedRole.curriculum_level_group_ids
              .split('~')
              .map((item) => parseInt(item, 10))
          : []
      })
    },
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
