<template>
  <div>
    <el-row v-loading="loading">
      <!-- first name -->
      <el-col cols="12">
        <el-form-group label="Select Partners" label-for="v-partners">
          <el-select v-model="form.partner_ids" filterable multiple style="width: 100%">
            <el-option
              v-for="(each_partner, index) in partners"
              :key="index"
              :label="each_partner.name"
              :value="each_partner.id"
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
        partner_ids: []
      },
      partners: [],
      loading: false,
      error: false,
      error_message: ''
    }
  },
  created() {
    this.fetchPartners()
  },
  methods: {
    fetchPartners() {
      const fetchModulesResource = new Resource('partners')
      fetchModulesResource.list({ option: 'all' }).then((response) => {
        this.partners = response.partners
      })
    },
    submit() {
      this.loading = true
      const savePackageModuleResource = new Resource('packages/activate-partners-module')
      const param = this.form
      param.module_id = this.selectedPackage.id
      savePackageModuleResource
        .store(param)
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
