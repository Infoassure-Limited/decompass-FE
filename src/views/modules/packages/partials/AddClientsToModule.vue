<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreatePackageModuleSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-package-module-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mel-0"> Assign Clients to {{ selectedPackage.name }} </h5>
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
              <el-form-group label="Select Clients" label-for="v-clients">
                <el-select v-model="form.client_ids" filterable multiple style="width: 100%">
                  <el-option
                    v-for="(client, index) in clients"
                    :key="index"
                    :label="client.name"
                    :value="client.id"
                  />
                </el-select>
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
    prop: 'isCreatePackageModuleSidebarActive',
    event: 'update:is-create-package-module-sidebar-active'
  },
  props: {
    isCreatePackageModuleSidebarActive: {
      type: Boolean,
      required: true
    },
    selectedPackage: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        module_id: '',
        client_ids: []
      },
      clients: [],
      loading: false,
      error: false,
      error_message: ''
    }
  },
  created() {
    this.fetchClients()
  },
  methods: {
    fetchClients() {
      const fetchModulesResource = new Resource('clients')
      fetchModulesResource.list({ option: 'all' }).then((response) => {
        this.clients = response.clients
      })
    },
    submit() {
      this.loading = true
      const savePackageModuleResource = new Resource('packages/activate-clients-module')
      const param = this.form
      savePackageModuleResource
        .update(this.selectedPackage.id, param)
        .then((response) => {
          this.loading = false
          this.$message('Successful')
          this.$emit('save', response)
          this.$emit('update:is-create-package-module-sidebar-active', false)
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
