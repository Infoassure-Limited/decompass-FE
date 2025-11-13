<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div v-loading="loading">
    <v-stepper
      non-linear
      editable
      hide-actions
      :items="['Associated Risk' /*, 'Risk Control', 'Testing Strategy', 'Gap', 'Submit'*/]"
    >
      <template v-slot:item.1>
        <el-row :gutter="20">
          <el-col :md="12">
            <small>
              Asset Type
              <a
                style="float: right; color: #409eff; cursor: pointer"
                @click="createAssetTypeModal = true"
              >
                <icon icon="tabler:plus" /> Click to add new Asset Type
              </a>
            </small>
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
          </el-col>
          <el-col :md="12">
            <small>
              Asset
              <a
                v-if="selectedAssetType !== null"
                style="float: right; color: #409eff; cursor: pointer"
                @click="createAssetModal = true"
              >
                <icon icon="tabler:plus" /> Click to add new Asset
              </a>
            </small>
            <el-select
              v-model="selectedAsset"
              placeholder="Select Asset"
              value-key="id"
              filterable
              style="width: 100%"
              :disabled="selectedAssetType === null"
              @change="((form.asset_id = selectedAsset.id), (form.asset_name = selectedAsset.name))"
            >
              <el-option
                v-for="(asset, asset_index) in assets"
                :key="asset_index"
                :label="asset.name"
                :value="asset"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <small>
              Risk Category
              <a
                style="float: right; color: #409eff; cursor: pointer"
                @click="((showRiskCategoryForm = true), (isEdit = false))"
              >
                <icon icon="tabler:plus" /> Click to add new Risk Category
              </a>
            </small>
            <el-select
              v-model="selectedRiskCategory"
              value-key="id"
              placeholder="Risk Category"
              style="width: 100%"
              @change="setRiskSubCategory()"
            >
              <el-option
                v-for="(risk_type, type_index) in risk_types"
                :key="type_index"
                :value="risk_type"
                :label="risk_type.name"
              />
            </el-select>
          </el-col>
          <el-col :md="12">
            <small>
              Risk Sub-Category
              <!-- <a
                v-if="selectedRiskCategory.name !== ''"
                style="float: right; color: #409eff; cursor: pointer"
                @click="((isEdit = true), (showRiskCategoryForm = true))"
              >
                <icon icon="tabler:plus" /> Click to add sub-categories
              </a> -->
            </small>
            <el-select
              v-model="form.sub_type"
              placeholder="Risk Sub Category"
              :disabled="selectedRiskCategory.name === ''"
            >
              <el-option
                v-for="(sub_type, subtype_index) in selectedRiskCategory.sub_categories"
                :key="subtype_index"
                :value="sub_type"
                :label="sub_type"
              />
            </el-select>
          </el-col>
          <el-col :md="24">
            <small>Risk Owner</small>
            <el-select
              v-model="form.risk_owner"
              placeholder="Select Risk Owner"
              filterable
              style="width: 100%"
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
            <!-- <el-input
              v-model="form.risk_owner"
              placeholder="Risk Owner"
              @blur="updateField($event.target.value, 'risk_owner', form)"
            /> -->
          </el-col>
          <el-col v-if="selectedAssetType !== null" :md="24">
            <el-button type="text" @click="showApplicableThreatModal = true">
              <icon icon="tabler:plus" /> Click to Add Applicable Threats
            </el-button>
          </el-col>
          <el-col v-if="selectedAssetType !== null" :md="24">
            <div v-if="form.threats.length > 0">
              <h4>Applicable Threats</h4>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th></th>
                    <th>Threat</th>
                    <th>Vulnerabilities</th>
                    <!-- <th>Existing Controls</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(detail, index) in form.threats" :key="index">
                    <td>
                      <el-button @click="removeItem(form.threats, index)">
                        <icon icon="tabler:trash" color="red" />
                      </el-button>
                    </td>
                    <td>
                      {{ detail.threat }}
                    </td>
                    <td>
                      <div
                        v-for="(vulnerability, v_index) in detail.vulnerabilities"
                        :key="v_index"
                        style="margin-top: 5px"
                      >
                        <el-tag
                          type="info"
                          effect="dark"
                          closable
                          :disable-transitions="false"
                          @close="removeItem(detail.vulnerabilities, v_index)"
                        >
                          <icon icon="tabler:point" /> {{ vulnerability }}
                        </el-tag>
                      </div>
                    </td>
                    <!-- <td>
                      <div
                        v-for="(control_description, c_index) in detail.control_descriptions"
                        :key="c_index"
                        style="margin-top: 5px"
                      >
                        <el-tag
                          closable
                          type="success"
                          effect="dark"
                          :disable-transitions="false"
                          @close="removeItem(detail.control_descriptions, c_index)"
                        >
                          {{ control_description }}
                        </el-tag>
                        <br />
                      </div>
                      <el-input
                        v-if="detail.showNewInput"
                        v-model="control_description"
                        class="input-new-tag"
                        placeholder="Type existing control"
                        style="width: 90%"
                        @blur="
                          ($event.target.value
                            ? detail.control_descriptions.push($event.target.value)
                            : (inputValue = ''),
                          (inputValue = ''),
                          (detail.showNewInput = false))
                        "
                      />
                      <a
                        v-else
                        style="color: #409eff; cursor: pointer"
                        @click="detail.showNewInput = true"
                      >
                        + Add New
                      </a>
                    </td> -->
                  </tr>
                </tbody>
              </table>
            </div>
          </el-col>
          <el-col :md="24">
            <v-btn
              :disabled="form.threats.length < 1"
              :loading="loading"
              class="text-none mb-4"
              color="success"
              size="x-large"
              variant="flat"
              block
              @click="formSubmitted()"
            >
              Submit
            </v-btn>
          </el-col>
        </el-row>
      </template>

      <!-- <template v-slot:item.2>
        <el-row :gutter="20">
          <el-col :md="12">
            <small>Nature of Control</small>
            <el-select v-model="form.nature_of_control" placeholder="Select" style="width: 100%">
              <el-option label="Automated" value="Automated" />
              <el-option label="Hybrid" value="Hybrid" />
              <el-option label="Manual" value="Manual" />
              <el-option label="N/A" value="N/A" />
            </el-select>
          </el-col>
          <el-col :md="12">
            <small>Name the application system used for executing the control</small>
            <el-input
              id="application_used_for_control"
              v-model="form.application_used_for_control"
              placeholder="Enter application name"
              :disabled="
                form.nature_of_control !== 'Automated' && form.nature_of_control !== 'Hybrid'
              "
            />
          </el-col>
          <el-col :md="24">
            <small>Control Description</small>
            <Editor
              id="control_description"
              v-model="form.control_description"
              placeholder="Describe Control"
            />
          </el-col>
          <el-col :md="12">
            <small>Where is the control performed?</small>
            <el-select
              v-model="form.control_location"
              placeholder="Select Location"
              style="width: 100%"
            >
              <el-option label="Business Unit" value="Business Unit" />
              <el-option label="Centralised" value="Centralised" />
              <el-option label="N/A" value="N/A" />
            </el-select>
          </el-col>
          <el-col :md="12">
            <small>How often do you perform the control?</small>
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
          </el-col>
          <el-col :md="12">
            <small>Control Owner</small>
            <el-select
              v-model="form.control_owner"
              placeholder="Select Control Owner"
              filterable
              style="width: 100%"
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
            <el-select v-model="form.control_type" placeholder="Select Type" style="width: 100%">
              <el-option label="Preventive" value="Preventive" />
              <el-option label="Detective" value="Detective" />
              <el-option label="N/A" value="N/A" />
            </el-select>
          </el-col>
          <el-col :md="24">
            <small>State any compensating control</small>
            <Editor
              id="compensating_control"
              v-model="form.compensating_control"
              placeholder="Enter Compensating control"
            />
          </el-col>
        </el-row>
      </template>

      <template v-slot:item.3>
        <el-row :gutter="20">
          <el-col :md="12">
            <small>Test Procedure</small>
            <textarea
              v-model="form.test_procedures"
              class="form-control"
              placeholder="Provide Test Procedure"
            ></textarea>
          </el-col>
          <el-col :md="12">
            <small>Sample Size</small>
            <el-input
              id="sample_size"
              v-model="form.sample_size"
              type="number"
              :min="1"
              placeholder="Sample Size"
            />
          </el-col>
          <el-col :md="24">
            <small>Data Required for test</small>
            <Editor v-model="form.data_required" placeholder="Data Required" />
          </el-col>
          <el-col :md="12">
            <small>Link to Evidence & Report</small><br />
            <a
              v-if="form.link_to_evidence !== null"
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
          </el-col>
          <el-col :md="12">
            <small>Test Conclusion</small>
            <el-select v-model="form.test_conclusion" placeholder="Select" style="width: 100%">
              <el-option label="Adequate" value="Adequate" />
              <el-option label="Inadequate" value="Inadequate" />
              <el-option label="Sub-optimal" value="Sub-optimal" />
            </el-select>
          </el-col>
        </el-row>
      </template>
      <template v-slot:item.4>
        <el-row :gutter="20">
          <el-col :md="12">
            <small>Gap Description</small>
            <textarea
              id="gap_description"
              v-model="form.gap_description"
              class="form-control"
              :row="6"
              placeholder="This is to document if there is any gap or deficiency in internal control based on the procedures performed"
            ></textarea>
          </el-col>
          <el-col :md="12">
            <small>TOD Improvement Opportunity (if any)</small>
            <textarea
              id="tod_improvement_opportunity"
              v-model="form.tod_improvement_opportunity"
              :row="6"
              class="form-control"
              placeholder="TOD Improvement Opportunity"
            ></textarea>
          </el-col>
          <el-col :md="12">
            <small>Recommendation</small>
            <textarea
              id="recommendation"
              v-model="form.recommendation"
              class="form-control"
              placeholder="Recommendation"
            ></textarea>
          </el-col>
          <el-col :md="12">
            <small>Responsibility</small>
            <el-input
              id="responsibility"
              v-model="form.responsibility"
              placeholder="Responsibility"
            />
          </el-col>
          <el-col :md="12">
            <small>Timeline</small>
            <input
              id="timeline"
              v-model="form.timeline"
              placeholder="Timeline"
              class="form-control"
            />
          </el-col>
          <el-col :md="12">
            <small>TOD Gap Status</small>
            <el-input
              id="tod_gap_status"
              v-model="form.tod_gap_status"
              placeholder="TOD Gap Status"
            />
          </el-col>
        </el-row>
      </template>
      <template v-slot:item.5>
        <el-row :gutter="20">
          <el-col :md="24">
            <v-btn
              :disabled="loading"
              :loading="loading"
              class="text-none mb-4"
              color="black"
              size="x-large"
              variant="flat"
              block
              @click="formSubmitted()"
            >
              Submit
            </v-btn>
          </el-col>
        </el-row>
      </template> -->
    </v-stepper>

    <el-dialog
      v-model="showApplicableThreatModal"
      v-if="selectedAssetType !== null"
      :title="`Select Applicable Threats for: ${selectedAssetType.name}`"
      centered
      width="80%"
      hide-footer
    >
      <ApplicableThreats
        v-if="selectedAssetType !== null"
        :selected-asset-type="selectedAssetType"
        @done="appendThreatsToForm"
      />
    </el-dialog>
    <el-dialog
      v-model="showRiskCategoryForm"
      title="Risk Category"
      centered
      width="50%"
      hide-footer
    >
      <create-risk-category
        :client-id="clientId"
        :selected-data="selectedRiskCategory"
        :is-edit="isEdit"
        @saved="refreshCategorySelection()"
      />
    </el-dialog>
    <!-- CREATE ASSET TYPES BEGINS-->
    <el-dialog v-model="createAssetTypeModal" title="Asset Type" centered width="40%" hide-footer>
      <create-asset-type :client-id="clientId" @save="fetchAssetTypes" />
    </el-dialog>
    <!-- CREATE ASSET TYPES ENDS-->
    <el-dialog v-model="createAssetModal" title="Asset" centered width="60%" hide-footer>
      <create-asset
        :asset-type-id="form.asset_type_id"
        :client-id="clientId"
        @save="fetchAssets(form.asset_type_id)"
      />
    </el-dialog>
  </div>
</template>
<script>
// import { FormWizard, TabContent } from 'vue3-form-wizard'
// import { Editor } from '@/components/Editor'
import Resource from '@/api/resource'
import CreateRiskCategory from './CreateRiskCategory.vue'
import CreateAssetType from '@/views/modules/settings/partials/ManageAssetTypes/CreateAssetType.vue'
import CreateAsset from '@/views/modules/settings/partials/ManageAssets/CreateAsset.vue'
import ApplicableThreats from './ApplicableThreats.vue'
// import 'vue3-form-wizard/dist/style.css'

export default {
  components: {
    // Editor,
    CreateRiskCategory,
    CreateAssetType,
    CreateAsset,
    ApplicableThreats
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
    },
    staff: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      inputValue: '',
      showRiskCategoryForm: false,
      createAssetModal: false,
      createAssetTypeModal: false,
      showApplicableThreatModal: false,
      isEdit: false,
      activeName: '1',
      clients: [],
      business_processes: [],
      business_units: [],
      selectedBusinessUnit: null,
      unitTeams: [],
      team_members: [],
      risk_types: [],
      threats: [],
      required: true,
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
        asset_type_name: '',
        asset_name: '',
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
        asset_type_name: '',
        asset_name: '',
        threats: [],
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
      asset_types: [],
      selectedAssetType: null,
      selectedAsset: null,
      assets: [],
      inputVisible: false
    }
  },
  watch: {
    clientId() {
      this.form.client_id = this.clientId
      this.fetchRiskCategories()
      this.fetchAssetTypes()
    }
  },
  created() {
    this.form.client_id = this.clientId
    // this.fetchThreats()
    this.fetchAssetTypes()
    this.fetchRiskCategories()
  },
  methods: {
    removeItem(data, index) {
      data.splice(index, 1)
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
        .list()
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
      this.form.asset_type_name = ''
      if (this.selectedAssetType !== null) {
        this.form.asset_type_id = this.selectedAssetType.id
        this.form.asset_type_name = this.selectedAssetType.name
        this.fetchAssets(this.form.asset_type_id)
      }
    },
    appendThreatsToForm(threats) {
      this.form.threats = []
      setTimeout(() => {
        this.form.threats = threats
        this.showApplicableThreatModal = false
      }, 1)
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
      formData.append('module', this.module)
      formData.append('business_unit_id', this.form.business_unit_id)
      formData.append('business_process_id', this.form.business_process_id)
      formData.append('risk_unique_id', this.form.risk_unique_id)
      formData.append('type', this.form.type)
      formData.append('sub_type', this.form.sub_type)
      formData.append('asset_type_id', this.form.asset_type_id)
      formData.append('asset_id', this.form.asset_id)
      formData.append('asset_type_name', this.form.asset_type_name)
      formData.append('asset_name', this.form.asset_name)
      formData.append('threats', JSON.stringify(this.form.threats))
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
          this.$message({
            message: 'Submitted Successfully',
            type: 'success',
            duration: 5000
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
