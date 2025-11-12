<template>
  <div v-loading="loading">
    <!-- <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
      <h3 class="mel-0">
        RISK AND CONTROL MATRIX
      </h3>
    </div> -->

    <el-row v-if="form.business_unit_id !== 0">
      <el-col :md="12">
        <el-form-group label="Select Business Process" label-for="business_process">
          <validation-provider #default="{ errors }" name="business_process" rules="required">
            <el-select
              v-model="selectedBusinessProcess"
              placeholder="Select Business process"
              value-key="id"
              style="width: 100%"
              filterable
              @input="setTeams()"
            >
              <el-option
                v-for="(business_process, index) in business_processes"
                :key="index"
                :value="business_process"
                :label="business_process.name"
              />
            </el-select>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </el-form-group>
      </el-col>
      <el-col :md="12">
        <el-form-group label="Sub Unit (L3)" label-for="sub_unit">
          <validation-provider #default="{ errors }" name="sub_unit">
            <select v-model="form.sub_unit" placeholder="Select Sub Unit" class="form-control">
              <option
                v-for="(team, team_index) in teams"
                :key="team_index"
                :value="team"
                :label="team"
              ></option>
            </select>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </el-form-group>
      </el-col>
    </el-row>
    <form-wizard
      v-if="
        (form.business_unit_id !== 0 && form.business_process_id !== null) ||
        form.business_unit_id === 0
      "
      color="#0b173d"
      title="CREATE NEW ENTRY"
      :subtitle="null"
      shape="tab"
      step-size="xs"
      finish-button-text="Done"
      back-button-text="Previous"
      next-button-text="Save and Continue"
      class="wizard-vertical mel-3"
      @on-complete="formSubmitted"
    >
      <tael-content title="Risk" :before-change="validateRisk">
        <validation-observer ref="riskRule" tag="form">
          <el-row v-if="form.business_unit_id === 0">
            <el-col :md="12">
              <el-form-group label="Asset Type" label-for="asset_type">
                <el-select
                  v-model="selectedAssetType"
                  placeholder="Select Asset Type"
                  value-key="id"
                  style="width: 100%"
                  filterable
                  @change="setAssets()"
                >
                  <el-option
                    v-for="(asset_type, type_index) in asset_types"
                    :key="type_index"
                    :label="asset_type.name"
                    :value="asset_type"
                  />
                </el-select>
                <a style="color: #409eff" @click="createAssetTypeModal = true">
                  <i class="el-icon-plus"></i> Click to add new Asset Type</a
                >
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Asset" label-for="asset">
                <el-select
                  v-model="form.asset_id"
                  placeholder="Select Asset"
                  filterable
                  style="width: 100%"
                  :disabled="selectedAssetType === null"
                >
                  <el-option
                    v-for="(asset, asset_index) in assets"
                    :key="asset_index"
                    :label="asset.name"
                    :value="asset.id"
                  />
                </el-select>
                <a
                  v-if="selectedAssetType !== null"
                  style="color: #409eff"
                  @click="createAssetModal = true"
                >
                  <i class="el-icon-plus"></i> Click to add new Asset</a
                >
              </el-form-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12">
              <el-form-group label="Risk Category" label-for="risk_category">
                <validation-provider #default="{ errors }" name="risk_category" rules="required">
                  <el-select
                    v-model="selectedRiskCategory"
                    value-key="id"
                    placeholder="Risk Category"
                    style="width: 100%"
                    @input="setRiskSubCategory()"
                  >
                    <el-option
                      v-for="(risk_type, type_index) in risk_types"
                      :key="type_index"
                      :value="risk_type"
                      :label="risk_type.name"
                    />
                  </el-select>
                  <a
                    style="color: #409eff"
                    @click="((showRiskCategoryForm = true), (isEdit = false))"
                  >
                    <i class="el-icon-plus"></i> Click to add new Risk Category</a
                  >
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Risk Suel-Category" label-for="sub_category">
                <select
                  v-model="form.sub_type"
                  placeholder="Risk Sub Category"
                  class="form-control"
                  :disabled="selectedRiskCategory.name === ''"
                >
                  <option
                    v-for="(sub_type, subtype_index) in selectedRiskCategory.sub_categories"
                    :key="subtype_index"
                    :value="sub_type.name"
                    :label="sub_type.name"
                  ></option>
                </select>
                <a
                  v-if="selectedRiskCategory.name !== ''"
                  style="color: #409eff"
                  @click="((isEdit = true), (showRiskCategoryForm = true))"
                >
                  <i class="el-icon-plus"></i> Add suel-categories</a
                >
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Threat (Search Applicable Threat)" label-for="threat">
                <validation-provider #default="{ errors }" name="threat">
                  <el-select
                    v-model="form.threat"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="Enter a keyword"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(threat, threat_index) in threats"
                      :key="threat_index"
                      :value="threat.threats"
                      :label="threat.threats"
                    />
                  </el-select>
                  <!-- <select
                    v-model="form.threat"
                    placeholder="Select Threat"
                    filterable
                    class="form-control"
                  >
                    <option
                      v-for="(threat, threat_index) in threats"
                      :key="threat_index"
                      :value="threat.threats"
                      :label="threat.threats"
                    />
                  </select> -->
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Risk Owner" label-for="risk_owner">
                <validation-provider #default="{ errors }" name="risk_owner" rules="required">
                  <el-form-input
                    v-model="form.risk_owner"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Risk Owner"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col md="12">
              <el-form-group label="Vulnerability/Risk Description" label-for="risk_description">
                <validation-provider #default="{ errors }" name="risk_description" rules="required">
                  <textarea
                    id="risk_description"
                    v-model="form.vulnerability_description"
                    class="form-control"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Describe Risk"
                  ></textarea>
                  <!-- <ckeditor
                    id="vulnerability_description"
                    v-model="form.vulnerability_description"
                    :editor="editor"
                    :config="editorConfig"
                    placeholder="Describe the risk/vulnerability"
                  /> -->
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <!-- <el-col :md="12">
              <el-form-group
                label="Impact/Outcome"
                label-for="impact"
              >
                <validation-provider
                  #default="{ errors }"
                  name="outcome"
                  rules="required"
                >
                  <ckeditor
                    id="outcome"
                    v-model="form.outcome"
                    :editor="editor"
                    :config="editorConfig"
                    placeholder="State the outcome of the risk"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col> -->
          </el-row>
        </validation-observer>
      </tael-content>
      <tael-content title="Control" :before-change="validateControl">
        <validation-observer ref="controlRule" tag="form">
          <el-row>
            <el-col :md="12">
              <el-form-group label="Nature of Control" label-for="nature_of_control">
                <validation-provider #default="{ errors }" name="nature_of_control">
                  <el-select
                    v-model="form.nature_of_control"
                    placeholder="Select"
                    style="width: 100%"
                  >
                    <el-option label="Automated" value="Automated" />
                    <el-option label="Hybrid" value="Hybrid" />
                    <el-option label="Manual" value="Manual" />
                    <el-option label="N/A" value="N/A" />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group
                label="Name the application system used for execution of the control."
                label-for="application_used_for_control"
              >
                <validation-provider #default="{ errors }" name="application_used_for_control">
                  <el-form-input
                    id="email"
                    v-model="form.application_used_for_control"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Enter application name"
                    :disabled="
                      form.nature_of_control !== 'Automated' && form.nature_of_control !== 'Hybrid'
                    "
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col md="12">
              <el-form-group label="Describe Existing Control" label-for="control_description">
                <validation-provider
                  #default="{ errors }"
                  name="control_description"
                  rules="required"
                >
                  <ckeditor
                    id="control_description"
                    v-model="form.control_description"
                    :editor="editor"
                    :config="editorConfig"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Describe Control"
                  />
                  <!-- <textarea
                    id="control_description"
                    v-model="form.control_description"
                    class="form-control"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Describe Control"
                  /> -->
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Where is the control performed" label-for="control_location">
                <validation-provider #default="{ errors }" name="Control Location">
                  <el-select
                    v-model="form.control_location"
                    placeholder="Select Location"
                    style="width: 100%"
                  >
                    <el-option label="Business Unit" value="Business Unit" />
                    <el-option label="Centralised" value="Centralised" />
                    <el-option label="N/A" value="N/A" />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Control Frequency" label-for="frequency">
                <validation-provider #default="{ errors }" name="frequency">
                  <el-select
                    v-model="form.control_frequency"
                    placeholder="Select Frequency"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(frequency, index) in control_frequencies"
                      :key="index"
                      :value="frequency"
                      :label="frequency"
                    />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Control Owner" label-for="control_owner">
                <validation-provider #default="{ errors }" name="control_owner">
                  <el-form-input
                    id="email"
                    v-model="form.control_owner"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Control Owner"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Control Type" label-for="control_type">
                <validation-provider #default="{ errors }" name="control_type">
                  <el-select
                    v-model="form.control_type"
                    placeholder="Select Type"
                    style="width: 100%"
                  >
                    <el-option label="Preventive" value="Preventive" />
                    <el-option label="Detective" value="Detective" />
                    <el-option label="N/A" value="N/A" />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Any Compensating control?" label-for="compensating_control">
                <textarea
                  v-model="form.compensating_control"
                  class="form-control"
                  placeholder="Enter Compensating control"
                ></textarea>
              </el-form-group>
            </el-col>
          </el-row>
        </validation-observer>
      </tael-content>
      <tael-content title="Testing Strategy" :before-change="validateTesting">
        <validation-observer ref="testRules" tag="form">
          <el-row>
            <el-col :md="12">
              <el-form-group label="Test Procedure" label-for="test_procedures">
                <validation-provider #default="{ errors }" name="test_procedures">
                  <textarea
                    v-model="form.test_procedures"
                    class="form-control"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Test Procedure"
                  ></textarea>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Sample Size" label-for="sample_size">
                <validation-provider #default="{ errors }" name="sample_size">
                  <el-form-input
                    id="sample_size"
                    v-model="form.sample_size"
                    type="number"
                    :min="1"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Sample Size"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Data Required" label-for="data_required">
                <validation-provider #default="{ errors }" name="Data Required">
                  <textarea
                    v-model="form.data_required"
                    class="form-control"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Data Required"
                  ></textarea>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Link to Evidence & Report" label-for="link_to_evidence">
                <input
                  class="form-control"
                  type="file"
                  placeholder="Link to Evidence & Report"
                  @change="onImageChange"
                />
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Conclusion" label-for="test_conclusion">
                <validation-provider #default="{ errors }" name="test_conclusion">
                  <el-select
                    v-model="form.test_conclusion"
                    placeholder="Select"
                    style="width: 100%"
                  >
                    <el-option label="Adequate" value="Adequate" />
                    <el-option label="Inadequate" value="Inadequate" />
                    <el-option label="Suel-optimal" value="Suel-optimal" />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </el-form-group>
            </el-col>
          </el-row>
        </validation-observer>
      </tael-content>
      <tael-content title="Gap" :before-change="validationGap">
        <validation-observer ref="gapRules" tag="form">
          <el-row>
            <el-col :md="12">
              <el-form-group label="Gap Description" label-for="gap_description">
                <textarea
                  id="gap_description"
                  v-model="form.gap_description"
                  class="form-control"
                  placeholder="This is to document if there is any gap or deficiency in internal control based on the procedures performed"
                ></textarea>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group
                label="TOD Improvement Opportunity (if any)"
                label-for="tod_improvement_opportunity"
              >
                <textarea
                  id="tod_improvement_opportunity"
                  v-model="form.tod_improvement_opportunity"
                  class="form-control"
                  placeholder="TOD Improvement Opportunity"
                ></textarea>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Recommendation" label-for="recommendation">
                <textarea
                  id="recommendation"
                  v-model="form.recommendation"
                  class="form-control"
                  placeholder="Recommendation"
                ></textarea>
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Responsibility" label-for="responsibility">
                <el-form-input
                  id="responsibility"
                  v-model="form.responsibility"
                  placeholder="Responsibility"
                />
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="Timeline" label-for="timeline">
                <el-form-input id="timeline" v-model="form.timeline" placeholder="Timeline" />
              </el-form-group>
            </el-col>
            <el-col :md="12">
              <el-form-group label="TOD Gap Status" label-for="tod_gap_status">
                <el-form-input
                  id="tod_gap_status"
                  v-model="form.tod_gap_status"
                  placeholder="TOD Gap Status"
                />
              </el-form-group>
            </el-col>
          </el-row>
        </validation-observer>
      </tael-content>
    </form-wizard>
    <el-modal v-model="showRiskCategoryForm" title="Risk Category" centered size="md" hide-footer>
      <create-risk-category
        :client-id="clientId"
        :selected-data="selectedRiskCategory"
        :is-edit="isEdit"
        @saved="refreshCategorySelection()"
      />
    </el-modal>
    <!-- CREATE ASSET TYPES BEGINS-->
    <el-modal v-model="createAssetTypeModal" title="Asset Type" centered size="lg" hide-footer>
      <create-asset-type :client-id="clientId" @save="fetchAssetTypes" />
    </el-modal>
    <!-- CREATE ASSET TYPES ENDS-->
    <el-modal v-model="createAssetModal" title="Asset" centered size="lg" hide-footer>
      <create-asset
        :asset-type-id="form.asset_type_id"
        :client-id="clientId"
        @save="fetchAssets(form.asset_type_id)"
      />
    </el-modal>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import CreateRiskCategory from './CreateRiskCategory.vue'
import CreateAssetType from '@/views/modules/settings/partials/ManageAssetTypes/CreateAssetType.vue'
import CreateAsset from '@/views/modules/settings/partials/ManageAssets/CreateAsset.vue'

export default {
  components: {
    CreateRiskCategory,
    CreateAssetType,
    CreateAsset
    // BButton,
  },
  props: {
    clientId: {
      type: Number,
      default: null
    },
    businessUnitId: {
      type: Number,
      default: null
    },
    module: {
      type: String,
      default: 'isms'
    }
  },
  data() {
    return {
      showRiskCategoryForm: false,
      createAssetModal: false,
      createAssetTypeModal: false,
      isEdit: false,
      activeName: '1',
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      clients: [],
      business_processes: [],
      business_units: [],
      selectedBusinessUnit: null,
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
        sub_type: '',
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
      loadSearch: false,
      selectedBusinessProcess: {},
      uploadableFile: null,
      selectedRiskCategory: { name: '', sub_categories: [] },
      selectedCategoryIndex: null,
      teams: [],
      asset_types: [],
      selectedAssetType: null,
      assets: []
    }
  },
  watch: {
    clientId() {
      this.form.client_id = this.clientId
      this.fetchRiskCategories()
      this.fetchBusinessProcesses()
      this.this.fetchAssetTypes()
    },
    businessUnitId() {
      this.form.business_unit_id = this.businessUnitId
      this.fetchBusinessProcesses()
    }
  },
  created() {
    this.fetchThreats()
    this.fetchAssetTypes()
    this.form.client_id = this.clientId
    this.form.business_unit_id = this.businessUnitId
    this.form.module = this.module
    this.fetchRiskCategories()
    this.fetchBusinessProcesses()
  },
  methods: {
    setTeams() {
      this.form.business_process_id = this.selectedBusinessProcess.id
      this.teams = this.selectedBusinessProcess.teams
    },
    refreshCategorySelection() {
      this.showRiskCategoryForm = false
      this.fetchRiskCategories()
      this.setRiskSubCategory()
    },
    setRiskSubCategory() {
      this.selectedCategoryIndex = this.risk_types.indexOf(this.selectedRiskCategory)
      this.form.type = this.selectedRiskCategory.name
      this.form.sub_type = ''
    },
    onImageChange(e) {
      this.uploadableFile = e.target.files[0]
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
    setAssets() {
      this.form.asset_id = ''
      if (this.selectedAssetType !== null) {
        this.form.asset_type_id = this.selectedAssetType.id
        this.assets = this.selectedAssetType.assets
      }
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
    fetchRiskCategories() {
      const fetchEntryResource = new Resource('risk-assessment/fetch-categories')
      fetchEntryResource
        .list({ client_id: this.form.client_id })
        .then((response) => {
          this.risk_types = response.categories
          if (this.selectedRiskCategory.name !== '') {
            this.selectedRiskCategory = this.risk_types[this.selectedCategoryIndex]
          }
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
        .list({ client_id: this.form.client_id })
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
        .list({ business_unit_id: this.form.business_unit_id })
        .then((response) => {
          this.business_processes = response.business_processes
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    validateSelection() {
      return new Promise((resolve, reject) => {
        this.$refs.selectionRule.validate().then((success) => {
          if (success) {
            this.saveAndContinue()
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validateRisk() {
      return new Promise((resolve, reject) => {
        this.$refs.riskRule.validate().then((success) => {
          if (success) {
            this.saveAndContinue()
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validateControl() {
      return new Promise((resolve, reject) => {
        this.$refs.controlRule.validate().then((success) => {
          if (success) {
            this.saveAndContinue()
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validateTesting() {
      return new Promise((resolve, reject) => {
        this.$refs.testRules.validate().then((success) => {
          if (success) {
            this.saveAndContinue()
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationGap() {
      return new Promise((resolve, reject) => {
        this.$refs.gapRules.validate().then((success) => {
          if (success) {
            // we dont ned to save and continue here since this is the last part. Just submit outrightly
            resolve(true)
          } else {
            reject()
          }
        })
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
    saveAndContinue() {
      const formData = this.setFormVariables()
      formData.append('submit_mode', 'temporal')
      const saveRisksResource = new Resource('store-risk-registers')
      saveRisksResource
        .store(formData)
        .then((response) => {
          this.form.id = response.id
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
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
            title: 'Submitted Successfully'
          })
          this.form = this.empty_form
          this.$emit('submitted')
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
