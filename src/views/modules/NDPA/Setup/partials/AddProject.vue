<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateStandardSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-standard-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mel-0"> Create Projects for {{ selectedClient.name }} </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <el-col v-if="form.client_id !== ''" cols="12">
              <el-form-group label-for="v-standard">
                <el-select
                  v-model="selectedModule"
                  placeholder="Select Activated Module"
                  filterable
                  value-key="id"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(module, index) in clientActivatedModules"
                    :key="index"
                    :value="module"
                    :label="module.name"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <el-col v-if="selectedModule.standards.length > 0" cols="12">
              <el-form-group label-for="v-standard">
                <el-select
                  v-model="form.standards"
                  placeholder="Select Project Standard"
                  filterable
                  multiple
                  style="width: 100%"
                >
                  <el-option
                    v-for="(standard, index) in selectedModule.standards"
                    :key="index"
                    :value="standard.id"
                    :label="standard.name"
                  />
                </el-select>
              </el-form-group>
              <el-alert type="error" :closable="false"> Multiple selections enabled </el-alert>
              <br />
            </el-col>
            <!-- submit and reset -->
            <el-col cols="12">
              <el-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                :disabled="
                  selectedModule.id === '' ||
                  (selectedModule.standards.length > 0 &&
                    form.standards.length < 1 &&
                    selectedModule.id !== '')
                "
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
    prop: 'isCreateStandardSidebarActive',
    event: 'update:is-create-standard-sidebar-active'
  },
  props: {
    isCreateStandardSidebarActive: {
      type: Boolean,
      required: true
    }
    // registeredStandards: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      form: {
        standards: [],
        available_module_id: '',
        client_id: ''
      },
      loading: false,
      consultings: [],
      selectedModule: {
        id: '',
        standards: []
      }
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedModules() {
      return this.$store.getters.clientActivatedModules
    }
  },
  created() {
    this.form.client_id = this.selectedClient.id
  },
  methods: {
    // fetchConsulting() {
    //
    //   this.loading = true
    //   const fetchConsultingsResource = new Resource('consultings')
    //   fetchConsultingsResource.list()
    //     .then(response => {
    //       this.consultings = response.consultings
    //       this.loading = false
    //     })
    // },
    submit() {
      this.loading = true
      const saveCurriculumSetupResource = new Resource('projects/save')
      const param = this.form
      param.available_module_id = this.selectedModule.id
      saveCurriculumSetupResource
        .store(param)
        .then(() => {
          this.loading = false
          // this.$message('Action Successful')
          this.$notify({
            title: 'Action Successful',
            message: 'The specified project have been created for the client'
          })
          this.form = {
            standards: [],
            available_module_id: '',
            client_id: ''
          }
          this.$emit('save')
          // this.$emit('update:is-create-standard-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
    }
  }
}
</script>
