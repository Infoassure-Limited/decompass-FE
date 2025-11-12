<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreatePackageSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-package-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mb-0"> Create Package </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <!-- Package Name -->
            <el-col cols="12">
              <el-form-group label="Package Name" label-for="v-package_name">
                <el-form-input v-model="form.name" placeholder="Enter package name..." />
              </el-form-group>
            </el-col>
            <!-- Abbrev -->
            <el-col cols="12">
              <el-form-group label="Package Description" label-for="v-package_group">
                <el-input
                  v-model="form.description"
                  type="textarea"
                  placeholder="Describe package..."
                />
              </el-form-group>
            </el-col>
            <!-- submit and reset -->
            <el-col cols="12">
              <el-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
              </el-button>
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
    </el-sidebar>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  model: {
    prop: 'isCreatePackageSidebarActive',
    event: 'update:is-create-package-sidebar-active'
  },
  props: {
    isCreatePackageSidebarActive: {
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
      selected_curriculum: '',
      curriculumPackageGroups: [],
      selectedCurriculumPackageGroups: '',
      curricula: [],
      loading: false,
      error: false,
      error_message: ''
    }
  },
  methods: {
    submit() {
      this.loading = true
      const savePackageResource = new Resource('packages/store')
      const param = this.form
      savePackageResource
        .store(param)
        .then((response) => {
          this.loading = false
          this.$emit('save', response)
          this.$emit('update:is-create-package-sidebar-active', false)
        })
        .catch((error) => {
          this.error = true
          this.error_message = error
          this.loading = false
        })
    }
  }
}
</script>
