<template>
  <div v-loading="loading">
    <form-wizard
      color="#0b173d"
      :title="form.risk_id"
      :subtitle="null"
      :start-index="0"
      shape="tab"
      step-size="xs"
      finish-button-text="Submit"
      back-button-text="Previous"
      class="wizard-vertical mel-3"
      @on-complete="formSubmitted"
    >
      <tab-content title="Risk">
        <el-row v-if="form.business_unit_id === 0">
          <el-col md="6">
            <el-form-group label="Asset Type" label-for="asset_type">
              <el-select
                v-model="form.asset_type_id"
                placeholder="Select Asset Type"
                value-key="id"
                style="width: 100%"
                filterable
                @change="(fetchAssets($event), updateField($event, 'asset_type_id', form))"
              >
                <el-option
                  v-for="(asset_type, type_index) in asset_types"
                  :key="type_index"
                  :label="asset_type.name"
                  :value="asset_type.id"
                />
              </el-select>
              <!-- <a
                style="color: #409EFF"
                @click="createAssetTypeModal = true"
              > <i class="el-icon-plus" /> Click to add new Asset Type</a> -->
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Asset" label-for="asset">
              <el-select
                v-model="form.asset_id"
                placeholder="Select Asset"
                filterable
                style="width: 100%"
                :disabled="form.asset_type_id === ''"
                @change="updateField($event, 'asset_id', form)"
              >
                <el-option
                  v-for="(asset, asset_index) in assets"
                  :key="asset_index"
                  :label="asset.name"
                  :value="asset.id"
                />
              </el-select>
              <!-- <a
                v-if="selectedAssetType !== null"
                style="color: #409EFF"
                @click="createAssetModal = true"
              > <i class="el-icon-plus" /> Click to add new Asset</a> -->
            </el-form-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="form.module === 'ndpa'" md="6">
            <el-form-group label="Personal Data Item" label-for="asset_name">
              <input
                id="asset_name"
                v-model="form.asset_name"
                class="form-control"
                placeholder="Personal Data Item"
                disabled
                @blur="updateField($event.target.value, 'asset_name', form)"
              />
              <!-- <el-select
                v-model="form.business_process_id"
                placeholder="Select Business process"
                value-key="id"
                style="width: 100%;"
                filterable
                @change="updateField($event, 'business_process_id', form)"
              >
                <el-option
                  v-for="(business_process, index) in business_processes"
                  :key="index"
                  :value="business_process.id"
                  :label="business_process.name"
                />
              </el-select> -->
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Risk Category" label-for="risk_category">
              <el-select
                v-model="form.type"
                placeholder="Risk Category"
                style="width: 100%"
                :disabled="form.module === 'ndpa'"
                @change="(setRiskSubCategory($event), updateField($event, 'type', form))"
              >
                <el-option
                  v-for="(risk_type, type_index) in risk_types"
                  :key="type_index"
                  :value="risk_type.name"
                  :label="risk_type.name"
                />
              </el-select>
            </el-form-group>
          </el-col>
          <el-col v-if="form.module !== 'ndpa'" md="6">
            <el-form-group label="Risk Suel-Category" label-for="sub_category">
              <el-select
                v-model="form.sub_type"
                placeholder="Risk Sub Category"
                style="width: 100%"
                @change="updateField($event, 'sub_type', form)"
              >
                <el-option
                  v-for="(sub_type, subtype_index) in sub_categories"
                  :key="subtype_index"
                  :value="sub_type.name"
                  :label="sub_type.name"
                />
              </el-select>
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Threat (Search Applicable Threat)" label-for="threat">
              <el-select
                v-model="form.threat"
                filterable
                allow-create
                default-first-option
                placeholder="Enter a keyword"
                style="width: 100%"
                @change="updateField($event, 'threat', form)"
              >
                <el-option
                  v-for="(threat, threat_index) in threats"
                  :key="threat_index"
                  :value="threat.threats"
                  :label="threat.threats"
                />
              </el-select>
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Risk Owner" label-for="risk_owner">
              <input
                v-model="form.risk_owner"
                placeholder="Risk Owner"
                class="form-control"
                @blur="updateField($event.target.value, 'risk_owner', form)"
              />
            </el-form-group>
          </el-col>
          <el-col md="12">
            <el-form-group label="Vulnerability/Risk Description" label-for="risk_description">
              <textarea
                id="risk_description"
                v-model="form.vulnerability_description"
                class="form-control"
                placeholder="Describe Risk"
                @blur="updateField($event.target.value, 'vulnerability_description', form)"
              ></textarea>
              <!-- <ckeditor
                id="vulnerability_description"
                v-model="form.vulnerability_description"
                :editor="editor"
                :config="editorConfig"
                placeholder="Describe Risk"
                @blur="updateField(form.vulnerability_description, 'vulnerability_description', form)"
              /> -->
            </el-form-group>
          </el-col>
          <!-- <el-col md="6">
            <el-form-group
              label="Impact/Outcome"
              label-for="impact"
            >
              <ckeditor
                id="outcome"
                v-model="form.outcome"
                :editor="editor"
                :config="editorConfig"
                placeholder="State the outcome of the risk"
                @blur="updateField(form.outcome, 'outcome', form)"
              />
            </el-form-group>
          </el-col> -->
        </el-row>
      </tab-content>
      <tab-content title="Control">
        <el-row>
          <el-col md="6">
            <el-form-group label="Nature of Control" label-for="nature_of_control">
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
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group
              label="Name the application system used for execution of the control."
              label-for="application_used_for_control"
            >
              <input
                id="application_used_for_control"
                v-model="form.application_used_for_control"
                class="form-control"
                placeholder="Enter application name"
                :disabled="
                  form.nature_of_control !== 'Automated' && form.nature_of_control !== 'Hybrid'
                "
                @blur="updateField($event.target.value, 'application_used_for_control', form)"
              />
            </el-form-group>
          </el-col>
          <el-col md="12">
            <el-form-group label="Control Description" label-for="control_description">
              <ckeditor
                id="control_description"
                v-model="form.control_description"
                :editor="editor"
                :config="editorConfig"
                placeholder="Describe Control"
                @blur="updateField(form.control_description, 'control_description', form)"
              />
              <!-- <textarea
                id="control_description"
                v-model="form.control_description"
                class="form-control"
                placeholder="Describe Control"
                @blur="updateField($event.target.value, 'control_description', form)"
              /> -->
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Where is the control performed" label-for="control_location">
              <el-select
                v-model="form.control_location"
                placeholder="Select Location"
                style="width: 100%"
                @change="updateField($event, 'control_location', form)"
              >
                <el-option label="Business Unit" value="Business Unit" />
                <el-option label="Centralised" value="Centralised" />
                <el-option label="N/A" value="N/A" />
              </el-select>
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Control Frequency" label-for="frequency">
              <el-select
                v-model="form.control_frequency"
                placeholder="Select Frequency"
                style="width: 100%"
                @change="updateField($event, 'control_frequency', form)"
              >
                <el-option
                  v-for="(frequency, index) in control_frequencies"
                  :key="index"
                  :value="frequency"
                  :label="frequency"
                />
              </el-select>
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Control Owner" label-for="control_owner">
              <input
                id="email"
                v-model="form.control_owner"
                placeholder="Control Owner"
                class="form-control"
                @blur="updateField($event.target.value, 'control_owner', form)"
              />
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Control Type" label-for="control_type">
              <el-select
                v-model="form.control_type"
                placeholder="Select Type"
                style="width: 100%"
                @change="updateField($event, 'control_type', form)"
              >
                <el-option label="Preventive" value="Preventive" />
                <el-option label="Detective" value="Detective" />
                <el-option label="N/A" value="N/A" />
              </el-select>
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Any Compensating control?" label-for="compensating_control">
              <textarea
                v-model="form.compensating_control"
                class="form-control"
                placeholder="Enter Compensating control"
                @blur="updateField($event.target.value, 'compensating_control', form)"
              ></textarea>
            </el-form-group>
          </el-col>
        </el-row>
      </tab-content>
      <tab-content title="Testing Strategy">
        <el-row>
          <el-col md="6">
            <el-form-group label="Test Procedure" label-for="test_procedures">
              <textarea
                v-model="form.test_procedures"
                class="form-control"
                placeholder="Test Procedure"
                @blur="updateField($event.target.value, 'test_procedures', form)"
              ></textarea>
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Sample Size" label-for="sample_size">
              <input
                id="sample_size"
                v-model="form.sample_size"
                type="number"
                class="form-control"
                :min="1"
                placeholder="Sample Size"
                @blur="updateField($event, 'sample_size', form)"
              />
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Data Required" label-for="data_required">
              <ckeditor
                id="data_required"
                v-model="form.data_required"
                :editor="editor"
                :config="editorConfig"
                placeholder="Data Required"
                @blur="updateField(form.data_required, 'data_required', form)"
              />
              <!-- <textarea
                v-model="form.data_required"
                class="form-control"
                placeholder="Data Required"
                @blur="updateField($event.target.value, 'data_required', form)"
              /> -->
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Link to Evidence & Report" label-for="link_to_evidence">
              <a
                :href="baseServerUrl + 'storage/' + form.link_to_evidence"
                target="_blank"
                style="color: #409eff"
                >Click link to evidence</a
              >
              <input
                class="form-control"
                type="file"
                placeholder="Change Link to Evidence"
                @change="onImageChange"
              />
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Conclusion" label-for="test_conclusion">
              <el-select
                v-model="form.test_conclusion"
                placeholder="Select"
                style="width: 100%"
                @change="updateField($event, 'test_conclusion', form)"
              >
                <el-option label="Adequate" value="Adequate" />
                <el-option label="Inadequate" value="Inadequate" />
                <el-option label="Suel-optimal" value="Suel-optimal" />
              </el-select>
            </el-form-group>
          </el-col>
        </el-row>
      </tab-content>
      <tab-content title="Gap">
        <el-row>
          <el-col md="6">
            <el-form-group label="Gap Description" label-for="gap_description">
              <textarea
                id="gap_description"
                v-model="form.gap_description"
                class="form-control"
                placeholder="This is to document if there is any gap or deficiency in internal control based on the procedures performed"
                @blur="updateField($event.target.value, 'gap_description', form)"
              ></textarea>
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group
              label="TOD Improvement Opportunity (if any)"
              label-for="tod_improvement_opportunity"
            >
              <textarea
                id="tod_improvement_opportunity"
                v-model="form.tod_improvement_opportunity"
                class="form-control"
                placeholder="TOD Improvement Opportunity"
                @blur="updateField($event.target.value, 'tod_improvement_opportunity', form)"
              ></textarea>
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Recommendation" label-for="recommendation">
              <textarea
                id="recommendation"
                v-model="form.recommendation"
                class="form-control"
                placeholder="Recommendation"
                @blur="updateField($event.target.value, 'recommendation', form)"
              ></textarea>
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Responsibility" label-for="responsibility">
              <input
                id="responsibility"
                v-model="form.responsibility"
                placeholder="Responsibility"
                class="form-control"
                @blur="updateField($event.target.value, 'responsibility', form)"
              />
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="Timeline" label-for="timeline">
              <input
                id="timeline"
                v-model="form.timeline"
                placeholder="Timeline"
                class="form-control"
                @blur="updateField($event.target.value, 'timeline', form)"
              />
            </el-form-group>
          </el-col>
          <el-col md="6">
            <el-form-group label="TOD Gap Status" label-for="tod_gap_status">
              <input
                id="tod_gap_status"
                v-model="form.tod_gap_status"
                placeholder="TOD Gap Status"
                class="form-control"
                @blur="updateField($event.target.value, 'tod_gap_status', form)"
              />
            </el-form-group>
          </el-col>
        </el-row>
      </tab-content>
    </form-wizard>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    clientId: {
      type: Number,
      default: null
    },
    selectedRiskRegister: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      activeName: '1',
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      clients: [],
      business_processes: [],
      business_units: [],
      sub_categories: [],
      unitTeams: [],
      team_members: [],
      risk_types: [],
      threats: [],
      required,
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
        threat: '',
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
        threat: '',
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
      assets: []
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.form = this.selectedRiskRegister
    this.fetchRiskCategories()
    this.fetchBusinessProcesses()
    this.fetchThreats()
    this.fetchAssetTypes()
    this.fetchAssets(this.form.asset_type_id)
  },
  methods: {
    setRiskSubCategory() {
      const { risk_types } = app
      const value = this.form.type
      this.sub_categories = []
      risk_types.forEach((riskType) => {
        if (riskType.name === value) {
          this.sub_categories = riskType.sub_categories
        }
      })
    },
    fetchAssetTypes() {
      const fetchEntryResource = new Resource('risk-assessment/fetch-asset-types')
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
      const fetchAssetsResource = new Resource('risk-assessment/fetch-assets')
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
          // console.log(error.response)
          this.$message.error(error.response.data.error)
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
    updateField(value, field, assessment) {
      const params = { field, value }
      const updateResource = new Resource('update-risk-register')
      updateResource.update(assessment.id, params).then(() => {
        this.$emit('reload')
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
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
