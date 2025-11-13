<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div v-loading="loading">
    <el-row v-if="form.business_unit_id !== ''" :gutter="20">
      <el-col :md="24">
        <label for="">Select Business Process</label>
        <span class="pull-right">
          <el-button type="text" @click="isCreateBusinessProcessActive = true">
            <Icon icon="tabler-plus" />
            <span class="align-middle">Create New Process</span>
          </el-button>
        </span>
        <el-select
          v-model="selectedBusinessProcess"
          placeholder="Select Business process"
          value-key="id"
          style="width: 100%"
          filterable
          @change="setTeams()"
        >
          <el-option
            v-for="(business_process, index) in business_processes"
            :key="index"
            :value="business_process"
            :label="business_process.name"
          />
        </el-select>
      </el-col>
      <!-- <el-col :md="12">
        <label for="">Sub Unit (L3)</label>
        <el-select v-model="form.sub_unit" placeholder="Select Sub Unit">
          <el-option
            v-for="(team, team_index) in teams"
            :key="team_index"
            :value="team"
            :label="team"
          />
        </el-select>
      </el-col> -->
      <el-col v-if="form.module === 'ndpa'" :md="12">
        <label for="">Personal Data Item</label>
        <input
          id="asset_name"
          v-model="form.asset_name"
          class="form-control"
          placeholder="Personal Data Item"
          disabled
        />
      </el-col>
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
      <!-- <el-col :md="12">
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
            </el-col> -->
      <!-- <el-col :md="24">
        <small>Risk Owner</small>
        <el-input
          v-model="form.risk_owner"
          placeholder="Risk Owner"
          @blur="updateField($event.target.value, 'risk_owner', form)"
        />
      </el-col>
      <el-col :md="24">
        <small>Vulnerability Description</small>
        <v-textarea
          v-model="form.vulnerability_description"
          variant="outlined"
          placeholder="Describe Risk"
          @blur="updateField(form.vulnerability_description, 'vulnerability_description', form)"
        />
      </el-col> -->
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
      <el-col v-if="selectedBusinessProcess !== null" :md="24">
        <el-button type="text" @click="showApplicableThreatModal = true">
          <icon icon="tabler:plus" /> Click to Add Applicable Threats
        </el-button>
      </el-col>
      <el-col v-if="selectedBusinessProcess !== null" :md="24">
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
    <el-drawer
      v-model="isCreateBusinessProcessActive"
      title="Create Business Process"
      direction="rtl"
      size="87%"
      destroy-on-close
    >
      <CreateBusinessProcess
        :business-unit-id="businessUnitId"
        :client-id="clientId"
        @save="fetchBusinessProcesses"
      />
    </el-drawer>
    <el-dialog
      v-model="showApplicableThreatModal"
      v-if="selectedBusinessProcess !== null"
      :title="`Select Applicable Threats for: ${selectedBusinessProcess.name}`"
      centered
      width="80%"
      hide-footer
    >
      <ApplicableThreats
        v-if="selectedBusinessProcess !== null"
        :selected-asset-type="selectedBusinessProcess"
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
import CreateBusinessProcess from '@/views/modules/settings/partials/business-units/partials/CreateBusinessProcess.vue'
// import 'vue3-form-wizard/dist/style.css'

export default {
  components: {
    CreateRiskCategory,
    CreateAssetType,
    CreateAsset,
    ApplicableThreats,
    CreateBusinessProcess
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
      default: 'bcms'
    },
    staff: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showRiskCategoryForm: false,
      createAssetModal: false,
      createAssetTypeModal: false,
      isCreateBusinessProcessActive: false,
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
        threat: '',
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
        threat: '',
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
      selectedBusinessProcess: null,
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
    },
    businessUnitId() {
      this.form.business_unit_id = this.businessUnitId
      this.fetchBusinessProcesses()
    }
  },
  created() {
    this.fetchThreats()
    this.form.client_id = this.clientId
    this.form.business_unit_id = this.businessUnitId
    this.form.module = this.module
    this.fetchRiskCategories()
    this.fetchBusinessProcesses()
  },
  methods: {
    setTeams() {
      this.form.business_process_id = this.selectedBusinessProcess.id
      // this.teams = this.selectedBusinessProcess.teams
    },
    appendThreatsToForm(threats) {
      this.form.threats = []
      setTimeout(() => {
        this.form.threats = threats
        this.showApplicableThreatModal = false
      }, 1)
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
