<template>
  <div>
    <div>
      <!-- <span class="pull-right">
          <el-button type="secondary" @click="viewType = 'tabular'">
            <icon icon="tabler:table" /> Tabular View
          </el-button>
        </span> -->
      <h3>Manage Risk Library & Control Matrix</h3>
    </div>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside v-if="showMenu" v-loading="loading" style="width: 350px; background-color: #fcfcfc">
        <el-tabs stretch>
          <el-tab-pane
            v-if="activatedModules.includes('isms') && (viewOnly === 'isms' || viewOnly === 'all')"
            label="By Assets"
            lazy
          >
            <el-button type="text" width="100%" class="mb-2" @click="createNewRiskRegister('isms')">
              <icon icon="tabler:plus" /> Create New Asset Risk Library
            </el-button>
            <br />
            <label for="">Pick an Asset</label>
            <el-select
              v-model="form.asset_id"
              style="width: 100%"
              filterable
              @change="fetchRisks('asset')"
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
              <div v-if="asset_risk_registers.length > 0">
                <div
                  v-for="(risk_assessment, assessments_index) in asset_risk_registers"
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
              <div v-else>
                <el-empty description="No data found">
                  <el-button
                    v-if="form.asset_id !== null"
                    type="primary"
                    @click="loadAutoRiskRegisters(form.asset_id, 'asset')"
                  >
                    Generate Auto Risk Registers
                  </el-button>
                </el-empty>
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
            lazy
          >
            <el-button type="text" width="100%" class="mb-2" @click="createNewRiskRegister('bcms')">
              <icon icon="tabler:plus" /> Create New Process Risk Library
            </el-button>
            <el-select
              v-model="form.business_process_id"
              style="width: 100%"
              filterable
              @change="fetchRisks('process')"
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
              <div v-if="business_risk_registers.length > 0">
                <div
                  v-for="(risk_assessment, assessments_index) in business_risk_registers"
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
              <div v-else>
                <el-empty description="No data found">
                  <el-button
                    v-if="form.business_process_id !== null"
                    type="primary"
                    @click="loadAutoRiskRegisters(form.business_process_id, 'business_process')"
                  >
                    Generate Auto Risk Registers
                  </el-button>
                </el-empty>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-aside>

      <el-container v-loading="loadNew">
        <h1>
          <el-tooltip effect="dark" content="Toggle Menu" placement="right">
            <a v-if="showMenu" style="cursor: pointer" @click="toggleMenu"
              ><i class="el-icon-s-fold"></i
            ></a>
            <a v-else style="cursor: pointer" @click="toggleMenu"
              ><i class="el-icon-s-unfold"></i
            ></a>
          </el-tooltip>
        </h1>
        <el-main>
          <div>
            <div v-if="viewType === 'welcome'" align="center">
              <img src="/images/project-icons/risk_library-large.png" width="200" />
              <h3>Manage your Risk Library</h3>
              <span align="center">
                <p>Use the left navigation to perform your tasks </p>
              </span>
            </div>
            <TabularRCM
              v-if="viewType === 'tabular'"
              :client-id="selectedClient.id"
              :assessment-module="module"
            />
            <EditRCM
              v-if="viewType === 'edit'"
              :client-id="selectedClient.id"
              :selected-risk-register="selectedRiskRegister"
              @done="((viewType = 'tabular'), loadData())"
              @deleted="((viewType = 'welcome'), loadData())"
            />
            <div v-if="viewType === 'create'">
              <div v-if="selectedModule !== 'isms'">
                <label>Select Business Unit</label>
                <el-select
                  v-model="form.business_unit_id"
                  placeholder="Select Business Unit"
                  style="width: 100%"
                  filterable
                >
                  <el-option
                    v-for="(business_unit, index) in business_units"
                    :key="index"
                    :value="business_unit.id"
                    :label="business_unit.unit_name"
                  />
                </el-select>
                <p></p>
                <CreateBusinessProcessRiskControlMatrix
                  v-if="form.business_unit_id !== null"
                  :client-id="selectedClient.id"
                  :business-unit-id="form.business_unit_id"
                  @submitted="loadData"
                />
              </div>
              <CreateAssetRiskControlMatrix
                v-else
                :client-id="selectedClient.id"
                @submitted="loadData"
              />
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import { VueGoodTable } from 'vue-good-table'
import CreateAssetRiskControlMatrix from './partials/CreateAssetRiskControlMatrix.vue'
import CreateBusinessProcessRiskControlMatrix from './partials/CreateBusinessProcessRiskControlMatrix.vue'
import TabularRCM from './partials/TabularRiskControlMatrix.vue'
import EditRCM from './partials/EditRiskControlMatrix.vue'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CardNavView from '@/views/Components/CardNavView.vue'

export default {
  components: {
    CreateAssetRiskControlMatrix,
    CreateBusinessProcessRiskControlMatrix,
    EditRCM,
    TabularRCM,
    CardNavView
  },
  props: {
    module: {
      type: String,
      default: () => 'all'
    },
    viewOnly: {
      type: String,
      default: () => 'all'
    }
  },
  data() {
    return {
      open: '',
      viewType: 'welcome',
      loading: false,
      loadNew: false,
      downloading: false,
      risk_registers: [],
      asset_risk_registers: [],
      business_risk_registers: [],
      grouped_risk_registers: {},
      unsubmitted_risk_registers: {},
      selectedRiskRegister: null,
      clients: [],
      business_units: [],
      showManageProject: false,
      showAssignModal: false,
      showAssignConsultantModal: false,
      showMenu: true,
      form: {
        client_id: '',
        business_unit_id: null,
        business_process_id: null,
        asset_id: null
      },
      ndpa_risk_registers: null,
      filterText: '',
      asset_types: [],
      activatedModules: [],
      selectedModule: 'isms'
    }
  },
  computed: {
    userData() {
      return this.$store.getters.userData
    },
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
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
      this.loadData()
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    checkPermission,
    loadData() {
      this.form.client_id = this.selectedClient.id
      this.setModuleSlug()
      this.fetchBusinessUnits()
      this.fetchAssetTypes()
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
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    filterNode(value) {
      if (!value) return true
      const data = this.grouped_risk_registers
      console.log(data)
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.vulnerability_description.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    createNewRiskRegister(mod) {
      this.selectedModule = mod
      this.viewType = 'create'
    },
    viewDetails(riskRegister) {
      // if (riskRegister.id) {

      this.viewType = ''
      setTimeout(() => {
        this.selectedRiskRegister = riskRegister
        this.viewType = 'edit'
      }, 10)

      // }
    },
    loadAutoRiskRegisters(id, type = 'asset') {
      this.loading = true
      const param = { client_id: this.selectedClient.id, id }

      let fetchAssetResource = new Resource('generate-asset-auto-risk-registers')
      if (type === 'business_process') {
        fetchAssetResource = new Resource('generate-process-auto-risk-registers')
      }
      fetchAssetResource
        .store(param)
        .then((response) => {
          this.loadData()
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          // console.log(error.response)
          this.$message.error(error.response.data.message)
        })
    },
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
    fetchRisks(type = 'asset') {
      // this.loading = true
      const fetchRisksResource = new Resource('fetch-risk-registers')
      fetchRisksResource
        .list({
          client_id: this.form.client_id,
          business_process_id: this.form.business_process_id,
          asset_id: this.form.asset_id,
          module: this.module,
          type
        })
        .then((response) => {
          this.asset_risk_registers = response.asset_risk_registers
          this.business_risk_registers = response.business_risk_registers
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    exportToExcel(id) {
      this.downloading = true
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: 'RCM-Report.xlsx',
          sheet: {
            name: 'Sheet 1'
          }
        })
      }, 1000)

      setTimeout(() => {
        this.downloading = false
      }, 30000)
    }
  }
}
</script>
