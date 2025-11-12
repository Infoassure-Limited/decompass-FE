<template>
  <el-row :gutter="20" v-loading="loading">
    <el-col :md="12">
      <el-form-group label="Risk Type">
        <!-- <el-input
                  v-model="form.risk_type"
                  type="text"
                  outline
                  placeholder="Risk Type"
                /> -->
        <el-select v-model="form.risk_type" placeholder="Risk Type" style="width: 100%">
          <el-option
            v-for="(risk_type, type_index) in risk_types"
            :key="type_index"
            :value="risk_type"
            :label="risk_type"
          />
        </el-select>
      </el-form-group>
    </el-col>
    <el-col :md="12">
      <el-form-group label="Vulnerability Description">
        <el-input
          v-model="form.vunerability_description"
          type="textarea"
          outline
          placeholder="Describe Risk/Threat"
        />
      </el-form-group>
    </el-col>
    <el-col :md="12">
      <el-form-group label="Impact/Outcome Description">
        <el-input
          v-model="form.threat_impact_description"
          type="textarea"
          placeholder="State impact outcome"
          style="width: 100%"
        />
      </el-form-group>
    </el-col>
    <el-col :md="12">
      <el-form-group label="Existing Control">
        <el-input
          v-model="form.existing_controls"
          placeholder="What controls are in place"
          type="textarea"
          style="width: 100%"
        />
      </el-form-group>
    </el-col>
    <el-col :md="12">
      <el-form-group label="Risk Owner">
        <el-input
          v-model="form.risk_owner"
          placeholder="State the Risk owner"
          type="text"
          style="width: 100%"
        />
      </el-form-group>
    </el-col>
    <!-- submit and reset -->
    <el-col :md="12">
      <el-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        type="submit"
        variant="primary"
        class="mr-1"
        @click="update()"
      >
        Update
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  model: {
    prop: 'isCreateRiskSidebarActive',
    event: 'update:is-create-risk-sidebar-active'
  },
  props: {
    isCreateRiskSidebarActive: {
      type: Boolean,
      required: true
    },
    selectedRisk: {
      type: Object,
      required: true
    }
    // registeredRisks: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      form: {
        client_id: '',
        business_unit_id: '',
        risk_id: '',
        risk_type: '',
        vunerability_description: '',
        threat_impact_description: '',
        existing_controls: '',
        risk_owner: ''
      },
      business_units: [],
      loading: false,
      risk_types: ['Financial', 'Legal, Compliance & Regulatory', 'Operational', 'Strategic']
    }
  },
  created() {
    this.form = this.selectedRisk
  },
  methods: {
    update() {
      this.loading = true
      const saveRisksResource = new Resource('update-risk-register')
      saveRisksResource
        .update(this.form.id, this.form)
        .then(() => {
          this.loading = false
          // this.$message('Action Successful')
          this.$notify({
            title: 'Action Successful'
          })
          this.$emit('update')
          // this.$emit('update:is-create-risk-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
    }
  }
}
</script>
