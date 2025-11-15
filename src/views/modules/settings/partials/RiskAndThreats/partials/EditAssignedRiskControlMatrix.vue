<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :md="20">
        <div v-if="form.asset_id !== 0 && form.asset_id !== null">
          <h4>
            <v-breadcrumbs
              :items="[form.asset_type_name, form.asset_name, `${form.risk_id} - ${form.threat}`]"
            />
          </h4>
        </div>
        <div v-if="form.business_unit_id !== 0 && form.business_unit_id !== null">
          <h4>
            <v-breadcrumbs :items="[`${form.risk_id} - ${form.threat}`]" />
          </h4>
        </div>
      </el-col>
    </el-row>

    <v-stepper non-linear editable hide-actions :items="['Define Existing Control']">
      <template v-slot:item.1>
        <el-row :gutter="20">
          <el-col :md="24">
            <label for="">Vulnerability Description</label>
            <p>{{ form.vulnerability_description }}</p>
            <!-- <v-textarea
              v-model="form.vulnerability_description"
              variant="outlined"
              label="Vulnerability Description"
              placeholder="Describe Vulnerabilities to the applicable threat"
              disabled
            /> -->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <small>Nature of Control</small>
            <el-select
              v-model="form.nature_of_control"
              placeholder="Select"
              style="width: 100%"
              @change="updateField($event, 'nature_of_control', form)"
            >
              <el-option label="Automated" value="Automated" />
              <el-option label="Hybrid" value="Hybrid" />
              <el-option label="Manual" value="Manual" />
              <el-option label="N/A" value="N/A" />
            </el-select>
          </el-col>
          <el-col
            v-if="form.nature_of_control == 'Automated' || form.nature_of_control == 'Hybrid'"
            :md="12"
          >
            <small>Name the application system used for executing the control</small>
            <el-input
              id="application_used_for_control"
              v-model="form.application_used_for_control"
              placeholder="Enter application name"
              :disabled="
                form.nature_of_control !== 'Automated' && form.nature_of_control !== 'Hybrid'
              "
              @blur="
                updateField(form.application_used_for_control, 'application_used_for_control', form)
              "
            />
          </el-col>
          <el-col :md="24">
            <small>Control Description</small>
            <v-textarea
              v-model="form.control_description"
              variant="outlined"
              placeholder="Describe Control"
              @blur="updateField(form.control_description, 'control_description', form)"
            />
          </el-col>
          <el-col :md="12">
            <small>Control Owner</small>
            <el-select
              v-model="form.control_owner"
              placeholder="Select Control Owner"
              filterable
              style="width: 100%"
              @change="updateField($event, 'control_owner', form)"
            >
              <el-option
                v-for="(user, user_index) in staff"
                :key="user_index"
                :value="user.name"
                :label="user.name"
              >
                <span style="float: left">{{ user.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  user.designation ? user.designation : ''
                }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :md="12">
            <small>Control Type</small>
            <el-select
              v-model="form.control_type"
              placeholder="Select Type"
              style="width: 100%"
              @change="updateField($event, 'control_type', form)"
            >
              <el-option label="Preventive" value="Preventive" />
              <el-option label="Detective" value="Detective" />
              <el-option label="Corrective" value="Corrective" />
              <el-option label="N/A" value="N/A" />
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="24">
            <v-btn
              :disabled="loading"
              :loading="loading"
              class="text-none mb-4"
              color="black"
              size="x-large"
              variant="flat"
              @click="updateField('final', 'submit_mode', form, true)"
            >
              Submit Entries
            </v-btn>
          </el-col>
        </el-row>
      </template>
    </v-stepper>
  </div>
</template>
<script>
import checkRole from '@/utils/role'
// import { FormWizard, TabContent } from 'vue3-form-wizard'
// import { Editor } from '@/components/Editor'
import Resource from '@/api/resource'
// import 'vue3-form-wizard/dist/style.css'

export default {
  components: {
    // Editor
    // FormWizard,
    // TabContent
    // BButton,
  },
  props: {
    clientId: {
      type: Number,
      default: null
    },
    canDelete: {
      type: Boolean,
      default: true
    },
    selectedRiskRegister: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeName: '1',
      clients: [],
      business_processes: [],
      business_units: [],
      sub_categories: [],
      unitTeams: [],
      team_members: [],
      risk_types: [],
      threats: [],
      form: {
        id: '',
        client_id: '',
        risk_group: '',
        business_unit_id: '',
        business_process_id: '',
        sub_unit: '',
        risk_unique_id: '',
        asset_type_id: '',
        asset_id: '',
        threats: [],
        type: '',
        vulnerability_description: '',
        outcome: '',
        risk_owner: '',
        control_no: '',
        control_location: '',
        control_description: '',
        control_frequency: '',
        control_owner: '',
        control_type: '',
        nature_of_control: '',
        application_used_for_control: '',
        compensating_control: '',
        test_procedures: '',
        sample_size: '',
        data_required: '',
        link_to_evidence: '',
        test_conclusion: '',
        gap_description: '',
        tod_improvement_opportunity: '',
        recommendation: '',
        responsibility: '',
        timeline: '',
        tod_gap_status: ''
      },
      empty_form: {
        id: '',
        client_id: '',
        risk_group: '',
        business_unit_id: '',
        business_process_id: '',
        sub_unit: '',
        risk_unique_id: '',
        asset_type_id: '',
        asset_id: '',
        threats: [],
        type: '',
        vulnerability_description: '',
        outcome: '',
        risk_owner: '',
        control_no: '',
        control_location: '',
        control_description: '',
        control_frequency: '',
        control_owner: '',
        control_type: '',
        nature_of_control: '',
        application_used_for_control: '',
        compensating_control: '',
        test_procedures: '',
        sample_size: '',
        data_required: '',
        link_to_evidence: '',
        test_conclusion: '',
        gap_description: '',
        tod_improvement_opportunity: '',
        recommendation: '',
        responsibility: '',
        timeline: '',
        tod_gap_status: ''
      },
      control_frequencies: [
        'Per Transaction',
        'Daily',
        'Weekly',
        'Monthly',
        'Quarterly',
        'Biannually',
        'Annually',
        'N/A',
        'Per Merchant',
        'Per Terminal Request'
      ],
      loading: false,
      uploadableFile: null,
      teams: [],
      asset_types: [],
      selectedAssetType: null,
      assets: [],
      staff: []
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  mounted() {
    this.form = this.selectedRiskRegister
    this.fetchRiskCategories()
    this.fetchThreats()
    this.fetchStaff()
    // this.fetchBusinessProcesses()
    // this.fetchAssetTypes()
    // this.fetchAssets(this.form.asset_type_id)
  },
  methods: {
    checkRole,
    setRiskSubCategory() {
      const { risk_types } = this
      const value = this.form.type
      this.sub_categories = []
      risk_types.forEach((riskType) => {
        if (riskType.name === value) {
          this.sub_categories = riskType.sub_categories
        }
      })
    },
    fetchStaff() {
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list().then((response) => {
        this.staff = response.staff
      })
    },
    fetchAssetTypes() {
      const fetchEntryResource = new Resource('assets/fetch-asset-types')
      this.loading = true
      fetchEntryResource
        .list({ client_id: this.clientId })
        .then((response) => {
          this.asset_types = response.asset_types
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    fetchAssets(assetTypeId) {
      // const assetTypeId = event.target.value
      const fetchAssetsResource = new Resource('assets/fetch-assets')
      fetchAssetsResource
        .list({ client_id: this.clientId, asset_type_id: assetTypeId })
        .then((response) => {
          this.assets = response.assets
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchThreats() {
      this.loadSearch = true
      const fetchEntryResource = new Resource('risk-library/fetch-threats')
      fetchEntryResource
        .list()
        .then((response) => {
          this.threats = response.threats
          this.loadSearch = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.console.log(error.response.data.error)
          this.loadSearch = false
        })
    },
    onImageChange(e) {
      this.uploadableFile = e.target.files[0]
    },
    fetchRiskCategories() {
      const fetchEntryResource = new Resource('risk-assessment/fetch-categories')
      fetchEntryResource
        .list({ client_id: this.clientId })
        .then((response) => {
          this.risk_types = response.categories
          this.setRiskSubCategory()
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
          this.$message.error(error.data)
          this.loading = false
        })
    },
    fetchBusinessUnits() {
      this.business_units = []
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource
        .list({ client_id: this.clientId })
        .then((response) => {
          this.business_units = response.business_units
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchBusinessProcesses() {
      this.business_processes = []
      const fetchBusinessProcesssResource = new Resource('business-units/fetch-business-processes')
      fetchBusinessProcesssResource
        .list({ business_unit_id: this.businessUnitId })
        .then((response) => {
          this.business_processes = response.business_processes
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    updateField(value, field, assessment, alert = false) {
      const params = { field, value }
      const updateResource = new Resource('update-risk-register')
      updateResource.update(assessment.id, params).then(() => {
        this.$emit('reload')
        if (alert) {
          this.$message('Field Updated')
        }
      })
    },
    setFormVariables() {
      const formData = new FormData()
      formData.append('id', this.form.id)
      formData.append('client_id', this.form.client_id)
      formData.append('module', this.form.module)
      formData.append('business_unit_id', this.form.business_unit_id)
      formData.append('business_process_id', this.form.business_process_id)
      formData.append('risk_unique_id', this.form.risk_unique_id)
      formData.append('type', this.form.type)
      formData.append('sub_type', this.form.sub_type)
      formData.append('asset_type_id', this.form.asset_type_id)
      formData.append('asset_id', this.form.asset_id)
      formData.append('threat', this.form.threat)
      formData.append('vulnerability_description', this.form.vulnerability_description)
      formData.append('outcome', this.form.outcome)
      formData.append('risk_owner', this.form.risk_owner)
      formData.append('control_no', this.form.control_no)
      formData.append('control_location', this.form.control_location)
      formData.append('control_description', this.form.control_description)
      formData.append('control_frequency', this.form.control_frequency)
      formData.append('control_owner', this.form.control_owner)
      formData.append('control_type', this.form.control_type)
      formData.append('nature_of_control', this.form.nature_of_control)
      formData.append('application_used_for_control', this.form.application_used_for_control)
      formData.append('compensating_control', this.form.compensating_control)
      formData.append('test_procedures', this.form.test_procedures)
      formData.append('sample_size', this.form.sample_size)
      formData.append('data_required', this.form.data_required)
      formData.append('test_conclusion', this.form.test_conclusion)
      formData.append('gap_description', this.form.gap_description)
      formData.append('tod_improvement_opportunity', this.form.tod_improvement_opportunity)
      formData.append('recommendation', this.form.recommendation)
      formData.append('responsibility', this.form.responsibility)
      formData.append('timeline', this.form.timeline)
      formData.append('tod_gap_status', this.form.tod_gap_status)
      formData.append('link_to_evidence', this.uploadableFile)
      return formData
    },
    formSubmitted() {
      this.loading = true
      const formData = this.setFormVariables()
      formData.append('submit_mode', 'final')
      const saveRisksResource = new Resource('store-risk-registers')
      saveRisksResource
        .store(formData)
        .then(() => {
          this.loading = false
          // this.$message('Action Successful')
          this.$notify({
            title: 'Updated Successfully',
            type: 'success'
          })
          this.$emit('done')
          // this.$emit('update:is-create-business-process-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
    },
    deleteRiskRegister() {
      if (window.confirm('Click OK to confirm delete action')) {
        const deleteEntryResource = new Resource('delete-risk-registers')
        this.loading = true
        deleteEntryResource
          .destroy(this.selectedRiskRegister.id)
          .then(() => {
            this.$message('Action Successful')
            this.$emit('deleted')
            this.loading = false
          })
          .catch((error) => {
            // console.log(error.response)
            this.$message.error('An error occured.')
            this.loading = false
          })
      }
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
