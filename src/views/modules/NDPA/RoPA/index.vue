<template>
  <el-card>
    <template v-slot:header>
      <div>
        <span class="pull-right">
          <el-button type="info" @click="viewType = 'tabular'">
            <icon icon="tabler:table" /> Tabular View
          </el-button>
        </span>
        <h3>Records of Processing Activities</h3>
      </div>
    </template>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside v-if="showMenu" v-loading="loading" width="400px">
        <el-button type="primary" width="100%" @click="createNewEntry()">
          <icon icon="tabler:plus" /> Create New Entry
        </el-button>
        <el-collapse>
          <!-- <div>
            Grouped by Business Unit/Process
            <el-tooltip class="item" effect="dark" content="Create New Entry" placement="right">
              <el-button type="secondary" size="sm" class="pull-right" @click="createNewEntry()">
                <icon icon="tabler:plus" />
              </el-button>
            </el-tooltip>
          </div> -->
          <el-collapse-item
            v-for="(ropa_data, index) in grouped_ropas"
            :key="index"
            :index="`${index}`"
          >
            <template v-slot:title>
              <strong>{{ index }}</strong>
            </template>
            <div v-for="(data, data_index) in ropa_data" :key="data_index">
              <CardNavView
                :id="`ropa-${data.id}`"
                :title="`${data.controller_name}`"
                title-icon="tabler:arrow-badge-right"
                @clickToView="viewDetails(data)"
              >
                <template #description>
                  <div>
                    <em>
                      <!-- <icon icon="tabler:arrow-badge-right" /> -->
                      {{ data.description }}
                    </em>
                  </div>
                </template>
              </CardNavView>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-aside>

      <el-container v-loading="loadNew">
        <!-- <h1>
          <el-tooltip effect="dark" content="Toggle Menu" placement="right">
            <a v-if="showMenu" style="cursor: pointer" @click="toggleMenu"
              ><i class="el-icon-s-fold"></i
            ></a>
            <a v-else style="cursor: pointer" @click="toggleMenu"
              ><i class="el-icon-s-unfold"></i
            ></a>
          </el-tooltip>
        </h1> -->
        <el-main>
          <div>
            <div v-if="viewType === 'welcome'" align="center">
              <!-- <img src="/images/project-icons/pda.png" width="200" /> -->
              <icon icon="tabler:file-text-shield" size="200" />
              <h3>Manage your Records of Processing Activities Here</h3>
              <span align="center">
                <el-button variant="outline-secondary" @click="createNewEntry()"
                  ><icon icon="tabler:plus" /> Create New Entry</el-button
                >
              </span>
            </div>
            <RoPATable v-if="viewType === 'tabular'" id="RoPASheet" :table-data="ropas" />
            <div v-if="viewType === 'edit'">
              <h3>Update Record</h3>
              <EditRoPA
                :selected-data="selectedData"
                :countries="countries"
                @updated="($notify({ title: 'Data Updated' }), fetchRoPA())"
              />
            </div>
            <div v-if="viewType === 'create'">
              <h3>Fill the form below to create a record</h3>
              <CreateRoPA
                :client-id="clientId"
                :standard-id="standardId"
                :countries="countries"
                @submitted="fetchRoPA"
              />
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</template>

<script>
import CreateRoPA from './partials/CreateRoPA.vue'
import EditRoPA from './partials/EditRoPA.vue'
import RoPATable from './RoPATable.vue'
import checkPermission from '@/utils/permission'
import CardNavView from '@/views/Components/CardNavView.vue'
import Resource from '@/api/resource'

export default {
  components: {
    CreateRoPA,
    EditRoPA,
    RoPATable,
    CardNavView
  },
  props: {
    riskGroup: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      viewType: 'welcome',
      loading: false,
      loadNew: false,
      downloading: false,
      selectedData: null,
      display: 'details',
      ropas: [],
      grouped_ropas: [],
      countries: [],
      showManageProject: false,
      selectedClient: null,
      showAssignModal: false,
      showAssignConsultantModal: false,
      showMenu: true,
      form: {
        client_id: '',
        business_unit_id: null
      },
      selectedRisk: null,
      filterText: '',
      risk_group: ''
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    clientId() {
      return this.$store.getters.selectedClient.id
    }
  },
  watch: {
    clientId() {
      this.loadData()
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    checkPermission,
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
    loadData() {
      this.form.client_id = this.clientId
      this.fetchCountries()
      this.fetchRoPA()
    },
    fetchCountries() {
      const countriesResources = new Resource('countries')
      countriesResources
        .list()
        .then((response) => {
          this.countries = response.countries
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchRoPA(load = true) {
      this.loading = load
      const clientId = this.clientId
      const ropaResource = new Resource('ndpa/ropa')
      ropaResource
        .list({
          client_id: clientId
        })
        .then((response) => {
          this.ropas = response.ropas
          this.grouped_ropas = response.grouped_ropas
          this.loading = false
        })
    },
    createNewEntry() {
      this.viewType = 'create'
    },
    viewDetails(data) {
      // if (riskRegister.id) {

      this.selectedData = data
      this.viewType = 'edit'

      // }
    }
  }
}
</script>
