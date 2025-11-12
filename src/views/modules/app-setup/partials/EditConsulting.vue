<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditConsultingSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-consulting-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mel-0"> Edit Unit </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <!-- first name -->
            <el-col cols="12">
              <el-form-group label="Update Unit" label-for="v-level_group">
                <el-form-input v-model="form.name" placeholder="example: Process Consulting" />
              </el-form-group>
            </el-col>
            <!-- Level Name -->
            <!-- <el-col cols="12">
              <el-form-group
                label="Consulting Description"
                label-for="v-level_group"
              >
                <el-form-textarea
                  v-model="form.description"
                  placeholder="Briefly describe this consulting"
                />
              </el-form-group>
            </el-col> -->
            <!-- submit and reset -->
            <el-col cols="12">
              <el-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="warning"
                class="mr-1"
                @click="update()"
              >
                Update
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
    prop: 'isEditConsultingSidebarActive',
    event: 'update:is-edit-consulting-sidebar-active'
  },
  props: {
    isEditConsultingSidebarActive: {
      type: Boolean,
      required: true
    },
    selectedConsulting: {
      type: Object,
      default: () => null
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
  created() {
    this.form = this.selectedConsulting
  },
  methods: {
    update() {
      this.loading = true
      const updateCurriculumSetupResource = new Resource('consultings/update')
      const param = this.form
      updateCurriculumSetupResource
        .update(param.id, param)
        .then((response) => {
          this.loading = false
          this.$emit('update', response)
          this.$emit('update:is-edit-consulting-sidebar-active', false)
        })
        .catch(() => {
          this.$alert('An error occured. A duplicate entry is probably detected.')
          this.loading = false
        })
    }
  }
}
</script>
