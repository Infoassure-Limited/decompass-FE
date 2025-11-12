<template>
  <div class="justify-content-between align-items-center px-2 py-1">
    <el-row>
      <el-col :md="24">
        <el-form-group label-for="v-business-unit">
          <el-select
            v-model="form.business_unit_id"
            placeholder="Select Business Unit"
            style="width: 100%"
          >
            <el-option
              v-for="(business_unit, index) in businessUnits"
              :key="index"
              :value="business_unit.id"
              :label="business_unit.unit_name"
            />
          </el-select>
        </el-form-group>
      </el-col>
      <el-col v-if="form.business_unit_id !== ''" :md="24">
        <el-form-group label="Full Name" label-for="v-name">
          <el-input v-model="form.name" placeholder="Full Name" style="width: 100%" />
        </el-form-group>
      </el-col>
      <el-col v-if="form.business_unit_id !== ''" :md="24">
        <el-form-group label="Email" label-for="v-email">
          <el-input v-model="form.email" placeholder="email" style="width: 100%" />
        </el-form-group>
        <br />
      </el-col>
      <!-- submit and reset -->
      <el-col :md="24">
        <el-button
          type="primary"
          style="width: 100%"
          :disabled="form.name === '' || form.email === ''"
          :loading="loading"
          @click="submit()"
        >
          Submit
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  model: {
    prop: 'isCreateActive',
    event: 'update:is-create-business-unit-sidebar-active'
  },
  props: {
    isCreateActive: {
      type: Boolean,
      required: true
    },
    selectedClient: {
      type: Object,
      required: true
    },
    businessUnits: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        client_id: '',
        business_unit_id: '',
        name: '',
        email: ''
      },
      loading: false,
      consultings: [],
      business_units: [],
      selectedConsulting: {}
    }
  },
  created() {
    this.form.client_id = this.selectedClient.id
  },
  methods: {
    submit() {
      this.loading = true
      const saveBusinessUnitsResource = new Resource('business-units/save-other-users')
      const param = this.form
      saveBusinessUnitsResource
        .store(param)
        .then(() => {
          this.loading = false
          // this.$message('Action Successful')
          this.$notify({
            title: 'Action Successful'
          })
          this.form = {
            client_id: '',
            business_unit_id: '',
            name: '',
            email: ''
          }
          this.$emit('save')
          // this.$emit('update:is-create-business-unit-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
    }
  }
}
</script>
