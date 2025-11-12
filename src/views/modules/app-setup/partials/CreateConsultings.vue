<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateConsultingSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-consulting-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mb-0"> Create Units </h5>
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
              <el-form-group label="Enter Name(s) of Unit" label-for="v-level_group">
                <el-form-input
                  v-model="form.names"
                  placeholder="example: Process Consulting"
                /> </el-form-group
              ><br />
              <small
                >You can enter multiple units, just separate them with a vertical bar
                <code>|</code></small
              >
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
    prop: 'isCreateConsultingSidebarActive',
    event: 'update:is-create-consulting-sidebar-active'
  },
  props: {
    isCreateConsultingSidebarActive: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        names: ''
      },
      selected_curriculum: '',
      curricula: [],
      loading: false
    }
  },
  methods: {
    submit() {
      this.loading = true
      const saveCurriculumSetupResource = new Resource('consultings/save')
      const param = this.form
      saveCurriculumSetupResource
        .store(param)
        .then((response) => {
          this.loading = false
          this.$emit('save', response)
          this.$emit('update:is-create-consulting-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
    }
  }
}
</script>
