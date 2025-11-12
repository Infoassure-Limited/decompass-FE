<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <el-container style="height: 100%">
      <el-aside
        v-loading="loading"
        element-loading-text="loading assessment, please wait..."
        width="350px"
        style="width: 350px; background-color: #fcfcfc"
      >
        <!-- <aside>
          <el-input
            v-model="filterText"
            placeholder="Filter keyword"
          />
        </aside> -->
        <h4>Identified Risks</h4>
        <el-button type="primary" @click="viewType = 'tabular'"
          ><icon icon="tabler:table" />&nbsp;Summary</el-button
        >
        <el-tabs stretch>
          <el-tab-pane
            v-if="activatedModules.includes('isms') && (viewOnly === 'isms' || viewOnly === 'all')"
            label="By Assets"
          >
            <label for="">Pick an Asset</label>
            <el-select
              v-model="form.asset_id"
              style="width: 100%"
              filterable
              @change="fetchAllRiskAssessments(true, 'asset')"
            >
              <el-option-group
                v-for="(asset_type, asset_key) in asset_types"
                :key="asset_key"
                :label="asset_type.name"
              >
                <el-option
                  v-for="asset in asset_type.assets"
                  :key="asset.id"
                  :label="asset.name"
                  :value="asset.id"
                />
              </el-option-group>
            </el-select>
            <div style="max-height: 550px; overflow: auto">
              <div
                v-for="(risk_assessment, assessments_index) in asset_risk_assessments"
                :key="assessments_index"
              >
                <CardNavView
                  :id="`asset-${risk_assessment.id}`"
                  :title="`${risk_assessment.risk_id}`"
                  @clickToView="viewDetails(risk_assessment)"
                >
                  <template #description>
                    <br />
                    <small>
                      <em>
                        <icon icon="tabler:arrow-badge-right" />
                        {{ risk_assessment.threat }}
                      </em>
                    </small>
                  </template>
                </CardNavView>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-if="
              (viewOnly !== 'isms' || viewOnly === 'all') &&
              (activatedModules.includes('rcsa') ||
                activatedModules.includes('bcms') ||
                activatedModules.includes('ndpa'))
            "
            label="By Business Process"
          >
            <label for="">Pick a Business Process</label>
            <el-select
              v-model="form.business_process_id"
              filterable
              style="width: 100%"
              @change="fetchAllRiskAssessments(true, 'process')"
            >
              <el-option-group
                v-for="(business_unit, business_unit_key) in business_units"
                :key="business_unit_key"
                :label="business_unit.unit_name"
              >
                <el-option
                  v-for="business_process in business_unit.business_processes"
                  :key="business_process.id"
                  :label="business_process.name"
                  :value="business_process.id"
                />
              </el-option-group>
            </el-select>
            <div style="max-height: 550px; overflow: auto">
              <div
                v-for="(risk_assessment, assessments_index) in business_risk_assessments"
                :key="assessments_index"
              >
                <CardNavView
                  :id="`process-${risk_assessment.id}`"
                  :title="`${risk_assessment.risk_id}`"
                  @clickToView="viewDetails(risk_assessment)"
                >
                  <template #description>
                    <br />
                    <small>
                      <em>
                        <icon icon="tabler:arrow-badge-right" />
                        {{ risk_assessment.threat }}
                      </em>
                    </small>
                  </template>
                </CardNavView>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-aside>

      <el-container>
        <!-- <h1>
          <el-tooltip effect="dark" content="Toggle Menu" placement="right">
            <a v-if="showMenu" style="cursor: pointer" @click="toggleMenu">
              <icon icon="tabler:menu-2" />
            </a>
            <a v-else style="cursor: pointer" @click="toggleMenu">
              <icon icon="tabler:menu-2" />
            </a>
          </el-tooltip>
        </h1> -->

        <el-main v-loading="loadView">
          <div v-if="viewType === 'edit'">
            <edit-risk-assessment
              :impacts="impacts"
              :assessment-module="module"
              :likelihoods="likelihoods"
              :selected-data="selectedData"
              :risk-appetite="risk_appetite"
              @updated="renderViewAgain"
            />
          </div>
          <div v-if="viewType === 'tabular'">
            <ISMSRiskAssessmentTable
              v-if="module === 'isms'"
              :selected-client="selectedClient"
              :assessment-module="module"
              :impacts="impacts"
              :likelihoods="likelihoods"
            />
            <NDPARiskAssessmentTable
              v-if="module === 'ndpa'"
              :selected-client="selectedClient"
              :assessment-module="module"
              :impacts="impacts"
              :likelihoods="likelihoods"
            />
            <RCSARiskAssessmentTable
              v-if="module === 'rcsa'"
              :selected-client="selectedClient"
              :assessment-module="module"
              :impacts="impacts"
              :likelihoods="likelihoods"
            />
            <BCMSRiskAssessmentTable
              v-if="module === 'bcms'"
              :selected-client="selectedClient"
              :assessment-module="module"
              :impacts="impacts"
              :likelihoods="likelihoods"
            />
          </div>
          <div v-if="viewType === 'welcome'" align="center">
            <!-- <img src="/images/project-icons/assessment.png" width="250" /> -->
            <icon icon="tabler:shield-search" size="200" />
            <h3>Perform your Risk Assessment Here</h3>
            <span align="center">
              <p>Use the Identified Risk Library Navigation to perform your assessment </p>
            </span>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import EditRiskAssessment from './partials/EditRiskAssessment.vue'
import ISMSRiskAssessmentTable from './partials/ISMS-RA-Table.vue'
import NDPARiskAssessmentTable from './partials/NDPA-RA-Table.vue'
import BCMSRiskAssessmentTable from './partials/BCMS-RA-Table.vue'
import RCSARiskAssessmentTable from './partials/RCSA-RA-Table.vue'
import RiskSetup from '@/views/modules/settings/partials/RiskAndThreats/index.vue'
import checkRole from '@/utils/role'
import CardNavView from '@/views/Components/CardNavView.vue'

export default {
  components: {
    EditRiskAssessment,
    ISMSRiskAssessmentTable,
    NDPARiskAssessmentTable,
    RCSARiskAssessmentTable,
    BCMSRiskAssessmentTable,
    CardNavView
  },
  props: {
    module: {
      type: String,
      default: () => 'all' // this is the general risk assessment
    },
    viewOnly: {
      type: String,
      default: () => 'all'
    }
  },
  data() {
    return {
      showMenu: true,
      asset_types: [],
      business_units: [],
      selectedData: null,
      loading: false,
      inputVisible: false,
      inputValue: '',
      filterText: '',
      isEdit: false,
      isCreateNew: false,
      impacts: [],
      likelihoods: [],
      risk_appetite: null,
      asset_risk_assessments: [],
      business_risk_assessments: [],
      risk_assessments: [],
      loadView: false,
      viewType: 'welcome',
      response: {},
      activatedModules: [],
      form: {
        asset_id: '',
        business_process_id: ''
      }
    }
  },
  computed: {
    userData() {
      return this.$store.getters.userData
    },
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    }
  },
  watch: {
    selectedClient() {
      this.viewType = 'welcome'
      this.setMatrix()
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    setTimeout(() => {
      this.setMatrix()
    }, 1000)
    this.fetchAssetTypes()
    this.fetchBusinessUnits()
    // if (this.selectedClient.id !== null) {
    //   this.setMatrix()
    // } else {
    //   this.$alert('Please select a client to continue')
    // }
  },
  methods: {
    checkRole,
    fetchAssetTypes() {
      const fetchAssetTypesResource = new Resource('risk-assessment/fetch-asset-types')
      fetchAssetTypesResource
        .list({ client_id: this.selectedClient.id, module: this.module })
        .then((response) => {
          this.asset_types = response.asset_types
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchBusinessUnits() {
      const fetchBusinessUnitsResource = new Resource('risk-assessment/fetch-business-units')
      fetchBusinessUnitsResource
        .list({ client_id: this.selectedClient.id, module: this.module })
        .then((response) => {
          this.business_units = response.business_units
        })
        .catch(() => {
          this.loading = false
        })
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    setMatrix() {
      this.setModuleSlug()
      this.fetchImpacts()
      this.fetchLikelihoods()
      // this.fetchAllRiskAssessments(true)
    },
    setModuleSlug() {
      this.activatedModules = this.userData.modules
    },
    // async setModuleSlug() {
    //   await this.$store.dispatch('navItems/fetchActivatedModules', this.selectedClient)
    //   const moduleSlug = []
    //   this.clientActivatedProjects.forEach((project) => {
    //     if (project.available_module) {
    //       moduleSlug.push(project.available_module.slug)
    //     }
    //   })
    //   this.activatedModules = moduleSlug
    // },
    filterNode(value, data) {
      if (!value) return true
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.label.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    handleClose(tag) {
      this.sub_dpias.splice(this.sub_dpias.indexOf(tag), 1)
    },
    viewDetails(data, viewId) {
      if (data.id) {
        this.viewType = ''
        setTimeout(() => {
          this.selectedData = data
          this.viewType = 'edit'
          this.showMenu = false
        }, 10)
      }
    },
    fetchAllRiskAssessments(load, type = 'asset') {
      this.loading = load
      const fetchCriteriaResource = new Resource('risk-assessment/fetch-risk-assessments')
      fetchCriteriaResource
        .list({
          client_id: this.selectedClient.id,
          module: this.module,
          asset_id: this.form.asset_id,
          business_process_id: this.form.business_process_id,
          type
        })
        .then((response) => {
          this.risk_assessments = response.risk_assessments
          this.business_risk_assessments = response.business_risk_assessments
          this.asset_risk_assessments = response.asset_risk_assessments
          this.risk_appetite = response.risk_appetite
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchImpacts() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.impacts = response.impacts
        })
        .catch((error) => {
          this.loading = false
          // console.log(error.response)
          // this.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.likelihoods = response.likelihoods
        })
        .catch((error) => {
          console.log(error.response)
          // this.$message.error(error.response.data.error)
        })
    },
    renderViewAgain() {
      this.viewType = 'tabular'
      this.fetchAllRiskAssessments(false)
      this.$notify({ title: 'Entry Saved', type: 'success' })
    }
  }
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
