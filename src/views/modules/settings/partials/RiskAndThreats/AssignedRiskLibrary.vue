<template>
  <div>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside v-if="showMenu" v-loading="loading" style="width: 350px; background-color: #fcfcfc">
        <el-tabs stretch>
          <el-tab-pane
            v-if="activatedModules.includes('isms') && (viewOnly === 'isms' || viewOnly === 'all')"
            label="By Assets"
            lazy
          >
            <div style="max-height: 650px; overflow: auto">
              <div v-if="asset_types !== null">
                <el-collapse>
                  <el-collapse-item
                    v-for="(risk_registers, asset_type) in asset_types"
                    :key="asset_type"
                    :title="asset_type"
                  >
                    <div
                      v-for="(risk_register, register_index) in risk_registers"
                      :key="register_index"
                    >
                      <CardNavView
                        :id="`asset-${risk_register.id}`"
                        :title="`${risk_register.risk_id}`"
                        @clickToView="viewDetails(risk_register)"
                      >
                        <template #description>
                          <br />
                          <em>
                            <icon icon="tabler:arrow-badge-right" />
                            {{ risk_register.threat }}
                          </em>
                        </template>
                      </CardNavView>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-else>
                <el-empty description="No data found" />
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
            <div style="max-height: 650px; overflow: auto">
              <div v-if="business_units !== null">
                <el-collapse>
                  <el-collapse-item
                    v-for="(business_risk_registers, business_unit) in business_units"
                    :key="business_unit"
                    :title="business_unit"
                  >
                    <div
                      v-for="(business_risk_register, assessments_index) in business_risk_registers"
                      :key="assessments_index"
                    >
                      <CardNavView
                        :id="`process-${business_risk_register.id}`"
                        :title="`${business_risk_register.risk_id}`"
                        @clickToView="viewDetails(business_risk_register)"
                      >
                        <template #description>
                          <br />
                          <small>{{ business_risk_register.business_process }}</small>
                          <br />
                          <em>
                            <icon icon="tabler:arrow-badge-right" />
                            {{ business_risk_register.threat }}
                          </em>
                        </template>
                      </CardNavView>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-else>
                <el-empty description="No data found" />
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
import EditRCM from './partials/EditAssignedRiskControlMatrix.vue'
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
      business_units: null,
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
      asset_types: null,
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
    fetchAssetTypes() {
      this.loading = true
      const fetchAssetTypesResource = new Resource('fetch-assigned-asset-risk-registers')
      fetchAssetTypesResource
        .list()
        .then((response) => {
          this.asset_types = response.asset_types
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchBusinessUnits() {
      this.loading = true
      const fetchBusinessUnitsResource = new Resource(
        'fetch-assigned-business-units-risk-registers'
      )
      fetchBusinessUnitsResource
        .list({ client_id: this.selectedClient.id, module: this.module })
        .then((response) => {
          this.business_units = response.business_units
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
